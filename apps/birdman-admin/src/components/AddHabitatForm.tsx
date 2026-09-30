import { TextInput, Button } from "./atomic";
import type { Habitat, HabitatRequest } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postHabitat } from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "../classes";
import { useToast } from "./ToastProvider";

const defaultFormValues: HabitatRequest = {
  code: "",
  name: "",
  description: "",
  parentHabitatId: undefined,
};
export interface AddHabitatFormProps {
  onSuccess?: () => void;
}

export default function AddHabitatForm({ onSuccess }: AddHabitatFormProps) {
  const { addToast } = useToast();
  const addHabitatMutation = useMutation<Habitat, Error, HabitatRequest>({
    mutationFn: postHabitat,
  });
  const queryClient = useQueryClient();
  const { data: habitats = [] } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: () =>
      fetch("http://localhost:3000/habitats").then((response) => response.json()),
  });

  const handleSubmit = async (values: HabitatRequest, formApi: FormApi<HabitatRequest>) => {
    try {
      const newHabitat = await addHabitatMutation.mutateAsync({
        ...values,
      });
      if (newHabitat) {
        addToast(`Habitat ${newHabitat.name} added successfully.`, {
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
      <div className="flex flex-col gap-1 min-w-[500px]">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          ADD HABITAT
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
                    <div className="text-red-400 text-center my-1">
                      {formError}
                    </div>
                  )}
                  <TextInput
                    inputId="code"
                    label="Habitat Code"
                    required={true}
                    value={values.code}
                    onChangeHandler={(value) =>
                      setValue("code", value)
                    }
                    errorMessage={errors.code || undefined}
                  />
                  <TextInput
                    inputId="name"
                    label="Habitat Name"
                    required={true}
                    value={values.name}
                    onChangeHandler={(value) =>
                      setValue("name", value)
                    }
                    errorMessage={errors.name || undefined}
                  />
                  <TextInput
                    inputId="description"
                    label="Habitat Description"
                    value={values.description}
                    onChangeHandler={(value) =>
                      setValue("description", value)
                    }
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
                      {habitats.map((habitat) => (
                        <option key={habitat.habitatId} value={habitat.habitatId}>
                          {habitat.code} - {habitat.name}
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
