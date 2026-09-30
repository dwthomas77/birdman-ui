import SpeciesTable from "../components/SpeciesTable";
import { useAdminModal } from "../shell/AdminModalContext";
import { Card } from "@birdman/shared-ui";

export default function AdminSpeciesPage() {
  const { openModal, closeModal } = useAdminModal();

  return (
    <main className="h-full p-4">
      <Card className="border-slate-700 bg-gray-900/40 p-4">
        <SpeciesTable
          addSpeciesClickHandler={() =>
            openModal("addSpecies", { mode: "add", onSuccess: closeModal })
          }
          updateSpeciesClickHandler={(speciesId) =>
            openModal("updateSpecies", {
              updateSpeciesId: speciesId,
              mode: "update",
              onSuccess: closeModal,
            })
          }
        />
      </Card>
    </main>
  );
}
