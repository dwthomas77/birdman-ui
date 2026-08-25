import { TextInput, Button } from "./atomic";
import type { Habitat } from "../types";
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
  const updateHabitatMutation = useMutation<Habitat, Error, { data: Habitat; habitatId: string }>({
    mutationFn: ({ data, habitatId }) => putHabitat(data, habitatId),
  });
  const queryClient = useQueryClient();
  if (!habitatId) {
    throw new Error("habitatId is required for AddHabitatForm");
    return null;
  }
  const habitatQuery = useQuery({
    queryKey: ["habitat", habitatId],
    queryFn: async () => {
      try {
        const response = await fetchJson<Habitat>(`http://localhost:3000/habitats/${habitatId}`);
        return response as Habitat;
      } catch (error) {
        throw new Error("Habitat not found", { cause: error });
        return null;
      }
    },
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

  const defaultFormValues: Habitat = {
    habitatId: habitat?.habitatId || "",
    habitatName: habitat?.habitatName || "",
    habitatDescription: habitat?.habitatDescription || "",
  };

  const handleSubmit = async (values: Habitat, formApi: FormApi<Habitat>) => {
    try {
      const newHabitat = await updateHabitatMutation.mutateAsync({
        data: values,
        habitatId,
      });
      if (newHabitat) {
        addToast(`Habitat ${newHabitat.habitatName} updated successfully.`, {
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
        <Form<Habitat>
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
                  inputId="habitatId"
                  label="Habitat ID"
                  required={true}
                  value={values.habitatId}
                  onChangeHandler={(e) => setValue("habitatId", e.target.value)}
                  errorMessage={errors.habitatId || undefined}
                  disabled={true}
                />
                <TextInput
                  inputId="habitatName"
                  label="Habitat Name"
                  required={true}
                  value={values.habitatName}
                  onChangeHandler={(e) =>
                    setValue("habitatName", e.target.value)
                  }
                  errorMessage={errors.habitatName || undefined}
                />
                <TextInput
                  inputId="habitatDescription"
                  label="Habitat Description"
                  required={true}
                  value={values.habitatDescription}
                  onChangeHandler={(e) =>
                    setValue("habitatDescription", e.target.value)
                  }
                  errorMessage={errors.habitatDescription || undefined}
                />
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
