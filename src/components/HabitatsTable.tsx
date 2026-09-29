import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Habitat } from "../types";
import { Button } from "./atomic";
import { deleteHabitat } from "../services";
import { useToast } from "./ToastProvider";
import { tableStyles } from "../styles";

interface HabitatsListProps {
  addHabitatClickHandler?: () => void;
  updateHabitatClickHandler?: (habitatId: string) => void;
}

export default function HabitatsList({
  addHabitatClickHandler,
  updateHabitatClickHandler,
}: HabitatsListProps) {
  const { data, refetch } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: () =>
      fetch("http://localhost:3000/habitats").then((res) => res.json()),
  });

  const deleteHabitatMutation = useMutation<string, Error, string>({
    mutationFn: deleteHabitat,
  });

  const { addToast } = useToast();

  const deleteClickHandler = (habitatId: string) => {
    deleteHabitatMutation.mutate(habitatId, {
      onSuccess: (message) => {
        console.log(message);
        addToast(`Habitat deleted successfully.`, {
          type: "success",
          duration: 3500,
        });
        refetch();
      },
      onError: (error: Error) => {
        console.error("Error deleting habitat:", error);
        addToast("Failed to delete habitat.", {
          type: "error",
          duration: 3500,
        });
      },
    });
  };

  // 3. New in v9: declare which features this table uses (none yet)
  const features = tableFeatures({});

  // 4. Define your columns
  const columns: Array<ColumnDef<typeof features, Habitat>> = [
    {
      accessorKey: "code",
      header: () => "Code",
    },
    {
      accessorKey: "name",
      header: () => "Name",
    },
    {
      accessorKey: "description",
      header: () => "Description",
    },
    {
      id: "update",
      header: () => "Update",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          onClick={() => {
            if (info.row.original.habitatId && updateHabitatClickHandler) {
              updateHabitatClickHandler(info.row.original.habitatId);
            }
          }}
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
          onClick={() => deleteClickHandler(info.row.original.habitatId)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // 5. Create the table instance
  const table = useTable({
    key: "habitats-table", // needed for devtools, omit if you don't want to use the devtools
    features,
    columns,
    data: data ?? [],
  });

  // 6. Render markup from the table instance APIs
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-lg font-semibold">HABITATS</h3>
        <div>
          <Button buttonSize="small" onClick={addHabitatClickHandler}>
            Add Habitat 
          </Button>
        </div>
      </div>
      <table className="border-separate border-spacing-y-2">
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
