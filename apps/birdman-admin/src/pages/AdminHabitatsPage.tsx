import HabitatTable from "../components/HabitatsTable";
import { useAdminModal } from "../shell/AdminModalContext";
import { Card } from "@birdman/shared-ui";

export default function AdminHabitatsPage() {
  const { openModal, closeModal } = useAdminModal();

  return (
    <main className="h-full p-4">
      <Card className="border-slate-700 bg-gray-900/40 p-4">
        <HabitatTable
          addHabitatClickHandler={() =>
            openModal("addHabitat", { onSuccess: closeModal })
          }
          updateHabitatClickHandler={(habitatId) =>
            openModal("updateHabitat", { habitatId, onSuccess: closeModal })
          }
        />
      </Card>
    </main>
  );
}
