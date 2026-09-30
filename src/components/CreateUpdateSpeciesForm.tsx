import { useState } from "react";
import { TextInput, Button } from "./atomic";
import type { Species, SpeciesCreate, Habitat } from "../types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createSpecies, updateSpecies } from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "../classes";
import { useToast } from "./ToastProvider";
import { fetchJson } from "../util";
import { LoadingSpinner } from "./atomic";
import { tabStyles } from "../styles";
import HabitatsChecklist from "./HabitatsChecklist";

const initialDefaultFormValues: SpeciesCreate = {
  speciesName: "",
  family: "",
  genus: "",
  localeName: "",
  lengthMin: 0,
  lengthMax: 0,
  weightMin: 0,
  weightMax: 0,
  wingspanMin: 0,
  wingspanMax: 0,
  habitats: [],
};

export interface AddSpeciesFormProps {
  onSuccess?: () => void;
  mode?: "add" | "update";
  updateSpeciesId?: string;
}

export default function CreateAddSpeciesForm({
  onSuccess,
  mode = "add",
  updateSpeciesId,
}: AddSpeciesFormProps) {
  const [activeTab, setActiveTab] = useState<"speciesInfo" | "habitats">(
    "speciesInfo",
  );
  const { addToast } = useToast();
  const addSpeciesMutation = useMutation<Species, Error, SpeciesCreate>({
    mutationFn: createSpecies,
  });
  const putSpeciesMutation = useMutation<
    Species,
    Error,
    { data: SpeciesCreate; speciesId: string }
  >({
    mutationFn: ({ data, speciesId }) => updateSpecies(data, speciesId),
  });
  const queryClient = useQueryClient();

  const speciesQuery = useQuery({
    queryKey: ["species", updateSpeciesId],
    queryFn: async () => {
      try {
        const response = await fetchJson<Species>(
          `http://localhost:3000/species/${updateSpeciesId}`,
        );
        return response as Species;
      } catch (error) {
        throw new Error("Species not found", { cause: error });
      }
    },
    enabled: !!updateSpeciesId,
  });

  const { data: allHabitats } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: async () => {
      try {
        const response = await fetchJson<Habitat[]>(
          `http://localhost:3000/habitats`,
        );
        return response as Habitat[];
      } catch (error) {
        throw new Error("Habitats not found", { cause: error });
      }
    },
  });

  const { isLoading, error, data: species } = speciesQuery;

  if (isLoading || error) {
    return (
      <div>
        {error && <div className={""}>{error.message}</div>}
        {isLoading && <LoadingSpinner />}
      </div>
    );
  }

  if (mode === "update" && !updateSpeciesId) {
    //throw new Error("updateSpeciesId is required when mode is 'update'");
    return <div>ERROR SPECIES ID NOT PROVIDED</div>;
  }

  const handleSubmit = async (values: SpeciesCreate, formApi: FormApi<SpeciesCreate>) => {
    try {
      if (mode === "update" && updateSpeciesId) {
        const updatedSpecies = await putSpeciesMutation.mutateAsync({
          data: values,
          speciesId: updateSpeciesId,
        });
        if (updatedSpecies) {
          addToast(
            `Species ${updatedSpecies.speciesName} updated successfully.`,
            {
              type: "success",
              duration: 3500,
            },
          );
          formApi.clearAllErrors();
          formApi.resetValues();
          queryClient.invalidateQueries({ queryKey: ["species"] });
          onSuccess?.();
        }
      } else if (mode === "update" && !updateSpeciesId) {
        addToast(`Error: updateSpeciesId is required when mode is 'update'`, {
          type: "error",
          duration: 3500,
        });
      } else {
        const newSpecies = await addSpeciesMutation.mutateAsync({
          ...values,
        });
        if (newSpecies) {
          addToast(`Species ${newSpecies.speciesName} added successfully.`, {
            type: "success",
            duration: 3500,
          });
          formApi.clearAllErrors();
          formApi.resetValues();
          queryClient.invalidateQueries({ queryKey: ["species"] });
          onSuccess?.();
        } else {
          console.log("no new species");
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const { detail, errors } = error;
        formApi.setErrors({ form: `${detail}`, ...errors });
      } else {
        formApi.clearAllErrors();
        console.log("error in handleSubmit not an ApiError");
      }
    }
  };

  const defaultFormValues: SpeciesCreate =
    mode === "update" && species
      ? {
          speciesName: species.speciesName,
          family: species.family,
          genus: species.genus,
          localeName: species.localeName,
          lengthMin: species.lengthMin,
          lengthMax: species.lengthMax,
          weightMin: species.weightMin,
          weightMax: species.weightMax,
          wingspanMin: species.wingspanMin,
          wingspanMax: species.wingspanMax,
          habitats:
            species.habitats?.map((habitat: Habitat) => habitat.habitatId) ??
            [],
        }
      : initialDefaultFormValues;

  return (
    <div className="flex flex-col gap-1 min-w-[500px] overflow-y-auto">
      <div className="justify-between items-center w-full flex">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          ADD SPECIES
        </h2>
        <div className="flex justify-end gap-4 mb-2">
          <div
            className={
              activeTab === "speciesInfo"
                ? tabStyles.activeContainer
                : tabStyles.container
            }
          >
            <button
              onClick={() => setActiveTab("speciesInfo")}
              type="button"
              className={
                activeTab === "speciesInfo"
                  ? tabStyles.activeTab
                  : tabStyles.tab
              }
            >
              Species Info
            </button>
          </div>
          <div
            className={
              activeTab === "habitats"
                ? tabStyles.activeContainer
                : tabStyles.container
            }
          >
            <button
              onClick={() => setActiveTab("habitats")}
              type="button"
              className={
                activeTab === "habitats" ? tabStyles.activeTab : tabStyles.tab
              }
            >
              <span
                className={
                  activeTab === "habitats" ? tabStyles.activeTab : tabStyles.tab
                }
              >
                Habitats
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Form<SpeciesCreate>
          initialValues={defaultFormValues}
          onSubmit={handleSubmit}
        >
          {(renderProps) => {
            const { values, errors, setValue, isSubmitting } = renderProps;
            const formError = errors.form || false;
            return (
              <>
                {formError && (
                  <div className="text-red-400 text-center my-1">
                    {formError}
                  </div>
                )}
                <div>
                  <div
                    className={
                      activeTab === "speciesInfo"
                        ? tabStyles.activeContent
                        : tabStyles.inactiveContent
                    }
                  >
                    <div className="flex flex-col gap-2 w-[600px]">

                      <TextInput
                        inputId="speciesName"
                        label="Species Name"
                        required={true}
                        value={values.speciesName}
                        onChangeHandler={(value) =>
                          setValue("speciesName", value)
                        }
                        errorMessage={errors.speciesName || undefined}
                      />
                      <TextInput
                        inputId="family"
                        label="Family"
                        required={true}
                        value={values.family}
                        onChangeHandler={(value) => setValue("family", value)}
                        errorMessage={errors.family || undefined}
                      />
                      <TextInput
                        inputId="genus"
                        label="Genus"
                        required={true}
                        value={values.genus}
                        onChangeHandler={(value) => setValue("genus", value)}
                        errorMessage={errors.genus || undefined}
                      />
                      <TextInput
                        inputId="localeName"
                        label="Locale Name"
                        required={true}
                        value={values.localeName}
                        onChangeHandler={(value) =>
                          setValue("localeName", value)
                        }
                        errorMessage={errors.localeName || undefined}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <TextInput
                          inputId="lengthMin"
                          label="Length Min"
                          required={true}
                          value={values.lengthMin.toString()}
                          onChangeHandler={(value) =>
                            setValue("lengthMin", value)
                          }
                          errorMessage={errors.lengthMin || undefined}
                          numericOnly={true}
                        />
                        <TextInput
                          inputId="lengthMax"
                          label="Length Max"
                          required={true}
                          value={values.lengthMax.toString()}
                          onChangeHandler={(value) =>
                            setValue("lengthMax", value)
                          }
                          errorMessage={errors.lengthMax || undefined}
                          numericOnly={true}
                        />
                      </div>
                      <div className="flex gap-2">
                        <TextInput
                          inputId="weightMin"
                          label="Weight Min"
                          required={true}
                          value={values.weightMin.toString()}
                          onChangeHandler={(value) =>
                            setValue("weightMin", value)
                          }
                          errorMessage={errors.weightMin || undefined}
                          numericOnly={true}
                        />
                        <TextInput
                          inputId="weightMax"
                          label="Weight Max"
                          required={true}
                          value={values.weightMax.toString()}
                          onChangeHandler={(value) =>
                            setValue("weightMax", value)
                          }
                          errorMessage={errors.weightMax || undefined}
                          numericOnly={true}
                        />
                      </div>
                      <div className="flex gap-2">
                        <TextInput
                          inputId="wingspanMin"
                          label="Wingspan Min"
                          required={true}
                          value={values.wingspanMin.toString()}
                          onChangeHandler={(value) =>
                            setValue("wingspanMin", value)
                          }
                          errorMessage={errors.wingspanMin || undefined}
                          numericOnly={true}
                        />
                        <TextInput
                          inputId="wingspanMax"
                          label="Wingspan Max"
                          required={true}
                          value={values.wingspanMax.toString()}
                          onChangeHandler={(value) =>
                            setValue("wingspanMax", value)
                          }
                          errorMessage={errors.wingspanMax || undefined}
                          numericOnly={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      activeTab === "habitats"
                        ? tabStyles.activeContent
                        : tabStyles.inactiveContent
                    }
                  >
                    <HabitatsChecklist
                      habitats={allHabitats || []}
                      associatedHabitats={allHabitats?.filter((habitat) =>
                        values.habitats?.some(
                          (habitatId) => habitatId === habitat.habitatId,
                        ),
                      ) || []}
                      onChange={(habitatIds) => setValue("habitats", habitatIds)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="ml-auto mt-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </>
            );
          }}
        </Form>
      </div>
    </div>
  );
}
