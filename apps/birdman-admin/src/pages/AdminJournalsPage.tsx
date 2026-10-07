import JournalTable from "../components/JournalTable";
import { useAdminModal } from "../shell/AdminModalContext";
import { Card } from "@birdman/shared-ui";

export default function AdminJournalsPage() {
  const { openModal, closeModal } = useAdminModal();

  return (
    <main className="h-full p-4">
      <Card className="border-slate-700 bg-gray-900/40 p-4">
        <JournalTable
          viewJournalClickHandler={(journalId) =>
            openModal("viewJournal", { journalId, onSuccess: closeModal })
          }
        />
      </Card>
    </main>
  );
}
