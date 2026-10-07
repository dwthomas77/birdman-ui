import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Journal } from "@birdman/shared-types";
import { Button } from "./atomic";
import { deleteJournal, getJournals } from "../services";
import { useToast } from "./ToastProvider";
import { tableStyles } from "../styles";

interface JournalTableProps {
  viewJournalClickHandler: (journalId: string) => void;
}

export default function JournalTable({
  viewJournalClickHandler,
}: JournalTableProps) {
  const { data: journals = [], isPending, error } = useQuery<Journal[]>({
    queryKey: ["journals"],
    queryFn: getJournals,
  });
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const deleteJournalMutation = useMutation<string, Error, string>({
    mutationFn: deleteJournal,
    onSuccess: () => {
      addToast("Journal deleted successfully.", {
        type: "success",
        duration: 3500,
      });
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
    onError: (deleteError) => {
      console.error("Error deleting journal:", deleteError);
      addToast("Failed to delete journal.", {
        type: "error",
        duration: 3500,
      });
    },
  });
  const features = tableFeatures({});
  const columns: Array<ColumnDef<typeof features, Journal>> = [
    {
      accessorKey: "journalId",
      header: () => "Journal ID",
    },
    {
      accessorKey: "name",
      header: () => "Name",
    },
    {
      accessorKey: "userId",
      header: () => "User ID",
    },
    {
      id: "view",
      header: () => "View",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          onClick={() => viewJournalClickHandler(info.row.original.journalId)}
        >
          View
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
          disabled={deleteJournalMutation.isPending}
          onClick={() => deleteJournalMutation.mutate(info.row.original.journalId)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const table = useTable({
    key: "journals-table",
    features,
    columns,
    data: journals,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-lg font-semibold">JOURNALS</h3>
      </div>
      {isPending ? (
        <p>Loading journals...</p>
      ) : error ? (
        <p className="text-red-400">Failed to load journals: {error.message}</p>
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
