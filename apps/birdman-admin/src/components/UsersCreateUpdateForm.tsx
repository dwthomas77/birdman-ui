import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User, UserRequest } from "../types";
import { createUser, updateUser } from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "../classes";
import { fetchJson } from "../util";
import { useToast } from "./ToastProvider";
import { Button, LoadingSpinner, TextInput } from "./atomic";
import { formErrorMessage } from "../styles/formStyles";

const initialFormValues: UserRequest = {
  displayName: "",
};

export interface UsersCreateUpdateFormProps {
  onSuccess?: () => void;
  mode?: "add" | "update";
  userId?: string;
}

export default function UsersCreateUpdateForm({
  onSuccess,
  mode = "add",
  userId,
}: UsersCreateUpdateFormProps) {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const createUserMutation = useMutation<User, Error, UserRequest>({
    mutationFn: createUser,
  });
  const updateUserMutation = useMutation<
    User,
    Error,
    { data: UserRequest; userId: string }
  >({
    mutationFn: ({ data, userId: id }) => updateUser(data, id),
  });
  const userQuery = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchJson<User>(`http://localhost:3000/users/${userId}`),
    enabled: mode === "update" && !!userId,
  });

  if (mode === "update" && !userId) {
    return <div className={formErrorMessage}>User ID is required to update a user.</div>;
  }
  if (userQuery.isLoading) {
    return <LoadingSpinner />;
  }
  if (userQuery.error) {
    return (
      <div className={formErrorMessage}>
        Failed to load user: {userQuery.error.message}
      </div>
    );
  }

  const defaultFormValues: UserRequest =
    mode === "update" && userQuery.data
      ? { displayName: userQuery.data.displayName }
      : initialFormValues;

  const handleSubmit = async (
    values: UserRequest,
    formApi: FormApi<UserRequest>,
  ) => {
    try {
      const user =
        mode === "update" && userId
          ? await updateUserMutation.mutateAsync({ data: values, userId })
          : await createUserMutation.mutateAsync(values);

      addToast(
        `User ${user.displayName} ${mode === "update" ? "updated" : "added"} successfully.`,
        { type: "success", duration: 3500 },
      );
      formApi.clearAllErrors();
      formApi.resetValues();
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        formApi.setErrors({ form: error.detail, ...error.errors });
      } else {
        const message =
          error instanceof Error ? error.message : "An unexpected error occurred.";
        formApi.setError("form", message);
        addToast(`Failed to ${mode === "update" ? "update" : "add"} user.`, {
          type: "error",
          duration: 3500,
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 min-w-[400px] mb-4">
      <h2 className="text-lg font-semibold uppercase tracking-wide">
        {mode === "update" ? "UPDATE USER" : "ADD USER"}
      </h2>
      <Form<UserRequest>
        initialValues={defaultFormValues}
        onSubmit={handleSubmit}
      >
        {({ values, errors, setValue, isSubmitting }) => (
          <div className="flex flex-col gap-2">
            {errors.form && (
              <div className={formErrorMessage}>{errors.form}</div>
            )}
            <TextInput
              inputId="displayName"
              label="Display Name"
              required
              value={values.displayName}
              onChangeHandler={(value) => setValue("displayName", value)}
              errorMessage={errors.displayName || undefined}
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
}
