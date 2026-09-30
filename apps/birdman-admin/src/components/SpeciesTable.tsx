import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Species } from "../types";
import { Button } from "./atomic";
import { deleteSpecies, getSpecies } from "../services";
import { useToast } from "./ToastProvider";
import { tableStyles } from "../styles";

interface SpeciesListProps {
  addSpeciesClickHandler: () => void;
  updateSpeciesClickHandler: (speciesId: string) => void;
}

export default function SpeciesTable({
  addSpeciesClickHandler,
  updateSpeciesClickHandler,
}: SpeciesListProps) {
  const { data: speciesData, refetch } = useQuery<Species[]>({
    queryKey: ["species"],
    queryFn: getSpecies,
  });

  const deleteSpeciesMutation = useMutation<string, Error, string>({
    mutationFn: deleteSpecies,
  });

  const { addToast } = useToast();

  const deleteClickHandler = (speciesId: string) => {
    deleteSpeciesMutation.mutate(speciesId, {
      onSuccess: (message) => {
        console.log(message);
        addToast(`Species deleted successfully.`, {
          type: "success",
          duration: 3500,
        });
        refetch();
      },
      onError: (error: Error) => {
        console.error("Error deleting species:", error);
        addToast("Failed to delete species.", {
          type: "error",
          duration: 3500,
        });
      },
    });
  };

  // 3. New in v9: declare which features this table uses (none yet)
  const features = tableFeatures({});

  // 4. Define your columns
  const columns: Array<ColumnDef<typeof features, Species>> = [
    {
      accessorKey: "localeName",
      header: () => "Name",
    },
    {
      accessorFn: (row) => row.speciesName, // accessorFn alternative with a custom id
      id: "speciesName",
      header: () => <span>Species</span>,
      cell: (info) => <i>{info.getValue<string>()}</i>,
    },

    {
      accessorKey: "genus",
      header: () => "Genus",
    },
    {
      accessorKey: "family", // accessorFn alternative with a custom id
      header: () => "Family",
    },
    {
      id: "update",
      header: () => "Update",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          onClick={() => updateSpeciesClickHandler(info.row.original.speciesId)}
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
          onClick={() => deleteClickHandler(info.row.original.speciesId)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // 5. Create the table instance
  const table = useTable({
    key: "species-table", // needed for devtools, omit if you don't want to use the devtools
    features,
    columns,
    data: speciesData ?? [],
  });

  // 6. Render markup from the table instance APIs
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-lg font-semibold">SPECIES</h3>
        <div>
          <Button buttonSize="small" onClick={addSpeciesClickHandler}>
            Add Species
          </Button>
        </div>
      </div>
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
            <tr key={row.id} className={tableStyles.row} >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className={tableStyles.tdFirst}>
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
