import { TextInput, Button } from "./atomic";
import type { Habitat } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHabitat } from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "../classes";
import { useToast } from "./ToastProvider";

const defaultFormValues: Habitat = {
  habitatId: "",
  habitatName: "",
  habitatDescription: "",
};

export interface AddHabitatFormProps {
  onSuccess?: () => void;
}

export default function AddHabitatForm({ onSuccess }: AddHabitatFormProps) {
  const { addToast } = useToast();
  const addHabitatMutation = useMutation<Habitat, Error, Habitat>({
    mutationFn: postHabitat,
  });
  const queryClient = useQueryClient();

  const handleSubmit = async (values: Habitat, formApi: FormApi<Habitat>) => {
    try {
      const newHabitat = await addHabitatMutation.mutateAsync({
        ...values,
      });
      if (newHabitat) {
        addToast(`Habitat ${newHabitat.habitatName} added successfully.`, {
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
                    <div className="text-red-400 text-center my-1">
                      {formError}
                    </div>
                  )}
                  <TextInput
                    inputId="habitatId"
                    label="Habitat ID"
                    required={true}
                    value={values.habitatId}
                    onChangeHandler={(e) =>
                      setValue("habitatId", e.target.value)
                    }
                    errorMessage={errors.habitatId || undefined}
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
