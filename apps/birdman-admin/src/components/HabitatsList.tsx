import { useQuery, useMutation } from "@tanstack/react-query";
import type { Habitat } from "@birdman/shared-types";
import { Button } from "./atomic";
import { deleteHabitat, getHabitats } from "../services";
import { useToast } from "./ToastProvider";

interface HabitatsListProps {
  addHabitatClickHandler?: () => void;
  updateHabitatClickHandler?: (habitatId: string) => void;
}

export default function HabitatsList({
  addHabitatClickHandler,
  updateHabitatClickHandler,
}: HabitatsListProps) {
  const { isPending, error, data, refetch } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: getHabitats,
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

  if (isPending || error) {
    return null;
  }

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
      <ul>
        <li className="flex text-sm text-gray-300 gap-3 mb-2">
          <div className="flex-1 overflow-hidden text-ellipsis border-b border-gray-300 pb-1">
            Habitat Name
          </div>
          <div className="w-[150px] shrink-0 border-b border-gray-300 pb-1">
            Habitat Description
          </div>
          <div className="w-[100px] shrink-0 border-b border-gray-300 pb-1">
            Update
          </div>
          <div className="w-[100px] shrink-0 border-b border-gray-300 pb-1">
            Remove
          </div>
        </li>
        {data.map((habitat: Habitat) => (
          <li
            key={`hab-${habitat.habitatId}`}
            className="flex py-1 gap-3 hover:bg-gray-900 transition-colors"
          >
            <div className="flex-1 overflow-hidden text-ellipsis">
              {habitat.name}
            </div>
            <div className="w-[150px] shrink-0">{habitat.description}</div>
            <div className="w-[100px] shrink-0">
              <Button
                buttonSize="small"
                variant="tertiary"
                onClick={() => updateHabitatClickHandler?.(habitat.habitatId)}
              >
                Update
              </Button>
            </div>
            <div className="w-[100px] shrink-0">
              <Button
                buttonSize="small"
                variant="tertiary"
                onClick={() => deleteClickHandler(habitat.habitatId)}
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
