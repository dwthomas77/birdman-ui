import { TextInput, Button } from "./atomic";
import type { Habitat, HabitatRequest } from "../types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { putHabitat } from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "../classes";
import { useToast } from "./ToastProvider";
import { LoadingSpinner } from "./atomic";
import { fetchJson } from "../util";
import { formErrorMessage } from "../styles/formStyles";

export interface AddUpdateHabitatFormProps {
  onSuccess?: () => void;
  formMode?: "add" | "update";
  habitatId?: string;
}

export default function AddUpdateHabitatForm({
  habitatId,
  onSuccess,
}: AddUpdateHabitatFormProps) {
  const { addToast } = useToast();
  const updateHabitatMutation = useMutation<Habitat, Error, { data: HabitatRequest; habitatId: string }>({
    mutationFn: ({ data, habitatId }) => putHabitat(data, habitatId),
  });
  const queryClient = useQueryClient();
  if (!habitatId) {
    throw new Error("habitatId is required for AddHabitatForm");
    return null;
  }
  const habitatQuery = useQuery<Habitat>({
    queryKey: ["habitat", habitatId],
    queryFn: async () => {
      try {
        const response = await fetchJson<Habitat>(`http://localhost:3000/habitats/${habitatId}`);
        return response as Habitat;
      } catch (error) {
        throw new Error("Habitat not found", { cause: error });
      }
    },
  });
  const { data: habitats = [] } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: () =>
      fetch("http://localhost:3000/habitats").then((response) => response.json()),
  });

  const { isLoading, error, data: habitat } = habitatQuery;

  if (isLoading || error) {
    console.log("the error is", error);
    return (
      <div>
        {error && (
          <div className={formErrorMessage}>
            {error.message}
          </div>
        )}
        {isLoading && <LoadingSpinner />}
      </div>
    );
  }

  const defaultFormValues: HabitatRequest = {
    code: habitat?.code || "",
    name: habitat?.name || "",
    description: habitat?.description || "",
    parentHabitatId: habitat?.parentHabitatId,
  };

  const handleSubmit = async (values: HabitatRequest, formApi: FormApi<HabitatRequest>) => {
    try {
      const newHabitat = await updateHabitatMutation.mutateAsync({
        data: values,
        habitatId,
      });
      if (newHabitat) {
        addToast(`Habitat ${newHabitat.name} updated successfully.`, {
          type: "success",
          duration: 3500,
        });
        formApi.clearAllErrors();
        formApi.resetValues();
        queryClient.invalidateQueries({ queryKey: ["habitats"] });
        onSuccess?.();
      } else {
        console.log("no new habitat");
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

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        UPDATE HABITAT
      </h2>
      <div className="flex flex-col gap-1">
        <Form<HabitatRequest>
          initialValues={defaultFormValues}
          onSubmit={handleSubmit}
        >
          {(renderProps) => {
            const { values, errors, setValue, isSubmitting } = renderProps;
            const formError = errors.form || false;
            return (
              <div className="flex flex-col gap-2">
                {formError && (
                  <div className={formErrorMessage}>
                    {formError}
                  </div>
                )}
                <TextInput
                  inputId="code"
                  label="Habitat Code"
                  required={true}
                  value={values.code}
                  onChangeHandler={(value) => setValue("code", value)}
                  errorMessage={errors.code || undefined}
                />
                <TextInput
                  inputId="name"
                  label="Habitat Name"
                  required={true}
                  value={values.name}
                  onChangeHandler={(value) => setValue("name", value)}
                  errorMessage={errors.name || undefined}
                />
                <TextInput
                  inputId="description"
                  label="Habitat Description"
                  value={values.description}
                  onChangeHandler={(value) => setValue("description", value)}
                  errorMessage={errors.description || undefined}
                />
                <label
                  htmlFor="parentHabitatId"
                  className="uppercase text-sm text-gray-400"
                >
                  Parent Habitat:
                  <select
                    id="parentHabitatId"
                    name="parentHabitatId"
                    value={values.parentHabitatId ?? ""}
                    onChange={(event) =>
                      setValue(
                        "parentHabitatId",
                        event.target.value || undefined,
                      )
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                  >
                    <option value="">None</option>
                    {habitats
                      .filter((parent) => parent.habitatId !== habitatId)
                      .map((parent) => (
                        <option key={parent.habitatId} value={parent.habitatId}>
                          {parent.code} - {parent.name}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="mt-2 flex">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            );
          }}
        </Form>
      </div>
    </div>
  );
}
