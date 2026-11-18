import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ObservationGroup,
  ObservationGroupRequest,
} from "@birdman/shared-types";
import {
  createObservationGroup,
  getObservationGroup,
  updateObservationGroup,
  getObservationGroups,
} from "../services";
import { Form } from "./controllers/FormController";
import type { FormApi } from "./controllers/FormController";
import { ApiError } from "@birdman/shared-types";
import { useToast } from "./ToastProvider";
import { Button, LoadingSpinner, TextInput } from "@birdman/shared-ui";
import { formErrorMessage } from "../styles/formStyles";
import { tabStyles } from "../styles";
import ManageObvGroupRelationships from "./ManageObvGroupRelationships";

const initialFormValues: ObservationGroupRequest = {
  name: "",
  parentId: "",
};

export interface AddUpdateObservationGroupFormProps {
  onSuccess?: () => void;
  mode?: "add" | "update";
  observationGroupId?: string;
}

export default function AddUpdateObservationGroup({
  onSuccess,
  mode = "add",
  observationGroupId,
}: AddUpdateObservationGroupFormProps) {
  const [activeTab, setActiveTab] = useState<
    "observationGroupInfo" | "observationGroupRelationships"
  >("observationGroupInfo");
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useMutation<
    ObservationGroup,
    Error,
    ObservationGroupRequest
  >({
    mutationFn: createObservationGroup,
  });
  const updateMutation = useMutation<
    ObservationGroup,
    Error,
    { data: ObservationGroupRequest; observationGroupId: string }
  >({
    mutationFn: ({ data, observationGroupId: id }) =>
      updateObservationGroup(data, id),
  });
  const observationGroupQuery = useQuery<ObservationGroup>({
    queryKey: ["observationGroup", observationGroupId],
    queryFn: () => getObservationGroup(observationGroupId ?? ""),
    enabled: mode === "update" && !!observationGroupId,
  });

  const observationGroupsQuery = useQuery<ObservationGroup[]>({
    queryKey: ["observationGroups"],
    queryFn: getObservationGroups,
  });

  if (mode === "update" && !observationGroupId) {
    return (
      <div className={formErrorMessage}>
        Observation Group ID is required to update a group.
      </div>
    );
  }
  if (observationGroupQuery.isLoading) {
    return <LoadingSpinner />;
  }
  if (observationGroupQuery.error) {
    return (
      <div className={formErrorMessage}>
        Failed to load observation group: {observationGroupQuery.error.message}
      </div>
    );
  }

  const defaultFormValues: ObservationGroupRequest =
    mode === "update" && observationGroupQuery.data
      ? {
          name: observationGroupQuery.data.name,
          parentId: observationGroupQuery.data.parentId || "",
        }
      : initialFormValues;

  const handleSubmit = async (
    values: ObservationGroupRequest,
    formApi: FormApi<ObservationGroupRequest>,
  ) => {
    try {
      const group =
        mode === "update" && observationGroupId
          ? await updateMutation.mutateAsync({
              data: values,
              observationGroupId,
            })
          : await createMutation.mutateAsync(values);

      addToast(
        `Observation Group "${group.name}" ${mode === "update" ? "updated" : "added"} successfully.`,
        { type: "success", duration: 3500 },
      );
      formApi.clearAllErrors();
      formApi.resetValues();
      await queryClient.invalidateQueries({ queryKey: ["observationGroups"] });
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        formApi.setErrors({ form: error.detail, ...error.errors });
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";
        formApi.setError("form", message);
        addToast(
          `Failed to ${mode === "update" ? "update" : "add"} observation group.`,
          {
            type: "error",
            duration: 3500,
          },
        );
      }
    }
  };

  const parentGroups =
    observationGroupsQuery.data?.filter(
      (g) => g.observationGroupId !== observationGroupId,
    ) || [];

  return (
    <div className="flex flex-col gap-1 min-w-[700px] overflow-y-auto mb-4">
      <div className="justify-between items-center w-full flex">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          {mode === "update"
            ? "UPDATE OBSERVATION GROUP"
            : "ADD OBSERVATION GROUP"}
        </h2>
        <div className="flex justify-end gap-4 mb-2">
          <div
            className={
              activeTab === "observationGroupInfo"
                ? tabStyles.activeContainer
                : tabStyles.container
            }
          >
            <button
              onClick={() => setActiveTab("observationGroupInfo")}
              type="button"
              aria-pressed={activeTab === "observationGroupInfo"}
              className={
                activeTab === "observationGroupInfo"
                  ? tabStyles.activeTab
                  : tabStyles.tab
              }
            >
              Group Info
            </button>
          </div>
          <div
            className={
              activeTab === "observationGroupRelationships"
                ? tabStyles.activeContainer
                : tabStyles.container
            }
          >
            <button
              onClick={() => setActiveTab("observationGroupRelationships")}
              type="button"
              aria-pressed={activeTab === "observationGroupRelationships"}
              className={
                activeTab === "observationGroupRelationships"
                  ? tabStyles.activeTab
                  : tabStyles.tab
              }
            >
              Relationships
            </button>
          </div>
        </div>
      </div>
      <div>
        <Form<ObservationGroupRequest>
          initialValues={defaultFormValues}
          onSubmit={handleSubmit}
        >
          {({ values, errors, setValue, isSubmitting }) => (
            <div className="flex flex-col gap-2">
              {errors.form && (
                <div className={formErrorMessage}>{errors.form}</div>
              )}
              <div id="fields" hidden={activeTab !== "observationGroupInfo"}>
                <TextInput
                  inputId="name"
                  label="Name"
                  required
                  value={values.name}
                  onChangeHandler={(value) => setValue("name", value)}
                  errorMessage={errors.name || undefined}
                />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="parentId"
                    className="text-sm font-medium text-gray-300"
                  >
                    Parent Group (Optional)
                  </label>
                  <select
                    id="parentId"
                    value={values.parentId || ""}
                    onChange={(e) => setValue("parentId", e.target.value)}
                    className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None</option>
                    {parentGroups.map((group) => (
                      <option
                        key={group.observationGroupId}
                        value={group.observationGroupId}
                      >
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                id="relationships"
                hidden={activeTab !== "observationGroupRelationships"}
              >
                <ManageObvGroupRelationships />
              </div>
              <div className="mt-2 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
