import ObservationGroupTable from "../components/dataTables/ObservationGroupTable";
import { useAdminModal } from "../shell/AdminModalContext";
import { Card } from "@birdman/shared-ui";

export default function AdminObservationGroupsPage() {
  const { openModal, closeModal } = useAdminModal();

  return (
    <main className="h-full p-4">
      <Card className="border-slate-700 bg-gray-900/40 p-4">
        <ObservationGroupTable
          addGroupClickHandler={() =>
            openModal("addObservationGroup", { mode: "add", onSuccess: closeModal })
          }
          updateGroupClickHandler={(observationGroupId) =>
            openModal("updateObservationGroup", {
              mode: "update",
              observationGroupId,
              onSuccess: closeModal,
            })
          }
        />
      </Card>
    </main>
  );
}
