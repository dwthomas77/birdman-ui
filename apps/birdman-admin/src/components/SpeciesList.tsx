import { useQuery, useMutation } from "@tanstack/react-query";
import type { Species } from "../types";
import { Button } from "./atomic";
import { deleteSpecies, getSpecies } from "../services";
import { useToast } from "./ToastProvider";

interface SpeciesListProps {
  addSpeciesClickHandler: () => void;
  updateSpeciesClickHandler: (speciesId: string) => void;
}

export default function SpeciesList({
  addSpeciesClickHandler,
  updateSpeciesClickHandler,
}: SpeciesListProps) {
  const { isPending, error, data, refetch } = useQuery<Species[]>({
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

  if (isPending || error) {
    return null;
  }

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
      <ul>
        <li className="flex text-sm text-gray-300 gap-3 mb-2">
          <div className="flex-1 overflow-hidden text-ellipsis border-b border-gray-300 pb-1">
            Species Name
          </div>
          <div className="w-[150px] shrink-0 border-b border-gray-300 pb-1">
            Locale Name
          </div>
          <div className="w-[120px] shrink-0 border-b border-gray-300 pb-1">
            Genus
          </div>
          <div className="w-[120px] shrink-0 border-b border-gray-300 pb-1">
            Family
          </div>
          <div className="w-[100px] shrink-0 border-b border-gray-300 pb-1">
            Update
          </div>
          <div className="w-[100px] shrink-0 border-b border-gray-300 pb-1">
            Remove
          </div>
        </li>
        {data.map((species: Species) => (
          <li
            key={`spec-${species.speciesId}`}
            className="flex py-1 gap-3 hover:bg-gray-900 transition-colors"
          >
            <div className="flex-1 overflow-hidden text-ellipsis">
              {species.speciesName}
            </div>
            <div className="w-[150px] shrink-0">{species.localeName}</div>
            <div className="w-[120px] shrink-0">{species.genus}</div>
            <div className="w-[120px] shrink-0">{species.family}</div>
            <div className="w-[100px] shrink-0">
              <Button
                buttonSize="small"
                variant="tertiary"
                onClick={() => updateSpeciesClickHandler(species.speciesId)}
              >
                Update
              </Button>
            </div>
            <div className="w-[100px] shrink-0">
              <Button
                buttonSize="small"
                variant="tertiary"
                onClick={() => deleteClickHandler(species.speciesId)}
              >
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
