import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@birdman/shared-ui";
import { getJournalsByUserId } from "../../api/birdApi";
import CreateJournalContent from "../CreateJournalContent";

interface JournalsProps {
  userId: string;
  activeJournalId: string | null;
  setActiveJournalId: (id: string | null) => void;
}

export const Journals = ({ userId, activeJournalId, setActiveJournalId }: JournalsProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: journals = [] } = useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournalsByUserId(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (journals.length > 0 && (!activeJournalId || !journals.some(j => j.journalId === activeJournalId))) {
      setActiveJournalId(journals[0].journalId);
    }
  }, [journals, activeJournalId, setActiveJournalId]);
  
  const liClickHandler = (journalId: string) => {
    if (activeJournalId !== journalId) {
      setActiveJournalId(journalId);
    }
  };

  const liStyles = "border border-gray-600 py-1 px-3";
  return (
    <div className="min-h-0 flex-1 flex">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-300">{`Journals`}</h3>
        <div>
          <button
            type="button"
            className="text-[12px] text-slate-300 hover:underline"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Journal
          </button>
        </div>
        <ul className="mt-4">
          {journals.map((journal) => (
            <li
              key={journal.journalId}
              className={`${liStyles} cursor-pointer ${activeJournalId === journal.journalId ? "bg-slate-700" : ""}`}
              onClick={() => liClickHandler(journal.journalId)}
            >
              {journal.name}
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        contentLabel="Create Journal"
        className="fixed left-1/2 top-1/2 max-h-[80vh] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-100 shadow-xl"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(false)}
            className="rounded px-2 py-1 text-sm hover:bg-slate-600/40"
          >
            Close
          </button>
        </div>
        <CreateJournalContent
          userId={userId}
          onCreated={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Journals;
