import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ObservationGroup } from "@birdman/shared-types";
import { Button } from "@birdman/shared-ui";
import { deleteObservationGroup, getObservationGroups } from "../../services";
import { useToast } from "../ToastProvider";
import { tableStyles } from "../../styles";

interface ObservationGroupTableProps {
  addGroupClickHandler: () => void;
  updateGroupClickHandler: (groupId: string) => void;
}

export default function ObservationGroupTable({
  addGroupClickHandler,
  updateGroupClickHandler,
}: ObservationGroupTableProps) {
  const { data: groups = [], isPending, error } = useQuery<ObservationGroup[]>({
    queryKey: ["observationGroups"],
    queryFn: getObservationGroups,
  });
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const deleteGroupMutation = useMutation<string, Error, string>({
    mutationFn: deleteObservationGroup,
    onSuccess: () => {
      addToast("Observation Group deleted successfully.", {
        type: "success",
        duration: 3500,
      });
      queryClient.invalidateQueries({ queryKey: ["observationGroups"] });
    },
    onError: (deleteError) => {
      console.error("Error deleting observation group:", deleteError);
      addToast("Failed to delete observation group.", {
        type: "error",
        duration: 3500,
      });
    },
  });
  const features = tableFeatures({});
  const columns: Array<ColumnDef<typeof features, ObservationGroup>> = [
    {
      accessorKey: "observationGroupId",
      header: () => "Group ID",
    },
    {
      accessorKey: "name",
      header: () => "Name",
    },
    {
      accessorKey: "parentId",
      header: () => "Parent Group ID",
    },
    {
      id: "update",
      header: () => "Update",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          onClick={() => updateGroupClickHandler(info.row.original.observationGroupId)}
        >
          Update
        </Button>
      ),
    },
    {
      id: "delete",
      header: () => "Delete",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          disabled={deleteGroupMutation.isPending}
          onClick={() => deleteGroupMutation.mutate(info.row.original.observationGroupId)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const table = useTable({
    key: "observation-groups-table",
    features,
    columns,
    data: groups,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-lg font-semibold">OBSERVATION GROUPS</h3>
        <Button buttonSize="small" onClick={addGroupClickHandler}>
          Add Group
        </Button>
      </div>
      {isPending ? (
        <p>Loading observation groups...</p>
      ) : error ? (
        <p className="text-red-400">Failed to load observation groups: {error.message}</p>
      ) : (
        <table className="border-separate border-spacing-y-1">
          <thead className={tableStyles.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={tableStyles.headerCell}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={tableStyles.tbody}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={tableStyles.row}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className={tableStyles.tdFirst}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}