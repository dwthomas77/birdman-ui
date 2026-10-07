import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner, Modal } from "@birdman/shared-ui";
import type { Location, Journal, User } from "@birdman/shared-types";
import { getJournalsByUserId, getUsers } from "../api/birdApi";
import CreateJournalContent from "../components/CreateJournalContent";
import ObserveBirdContent from "../components/ObserveBirdContent";
import RandomLocations from "../components/RandomLocations";

export default function GoBirdingPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const [selectedJournalId, setSelectedJournalId] = useState<
    string | undefined
  >(undefined);
  const [activeLocation, setActiveLocation] = useState<Location | undefined>(
    undefined,
  );
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const [isCreateJournalModalOpen, setIsCreateJournalModalOpen] =
    useState(false);
  const { data: users = [], isPending, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const {
    data: journals = [],
    isPending: isJournalsPending,
    error: journalsError,
  } = useQuery<Journal[]>({
    queryKey: ["journals", selectedUserId],
    queryFn: () => getJournalsByUserId(selectedUserId!),
    enabled: !!selectedUserId,
  });

  const hasNoJournals =
    !!selectedUserId && !isJournalsPending && !journalsError && journals.length === 0;
  const canGoBirding = !!selectedUserId && !!selectedJournalId;

  return (
    <section>
      <p className="mb-3 text-slate-400">Choose your Birder</p>
      {isPending ? (
        <LoadingSpinner label="Loading birders" className="text-slate-400" />
      ) : error ? (
        <p role="alert" className="text-red-300">
          Unable to load birders: {error.message}
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="birder-select" className="text-sm font-semibold">
              Birder
            </label>
            <select
              id="birder-select"
              value={selectedUserId ?? ""}
              onChange={(event) => {
                setSelectedUserId(event.target.value || undefined);
                setSelectedJournalId(undefined);
                setActiveLocation(undefined);
              }}
              className="w-64 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
            >
              <option value="">Select a birder</option>
              {users.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="journal-select" className="text-sm font-semibold">
                Journal
              </label>
              <select
                id="journal-select"
                value={selectedJournalId ?? ""}
                disabled={!selectedUserId || isJournalsPending || journals.length === 0}
                aria-invalid={hasNoJournals || !!journalsError}
                aria-describedby="journal-select-error"
                onChange={(event) => {
                  setSelectedJournalId(event.target.value || undefined);
                  setActiveLocation(undefined);
                }}
                className={`w-64 rounded border bg-slate-900 px-3 py-2 text-slate-100 disabled:opacity-50 ${
                  hasNoJournals || journalsError
                    ? "border-red-400"
                    : "border-slate-700"
                }`}
              >
                <option value="">Select a journal</option>
                {journals.map((journal) => (
                  <option key={journal.journalId} value={journal.journalId}>
                    {journal.name}
                  </option>
                ))}
              </select>
              {(hasNoJournals || journalsError) && (
                <p id="journal-select-error" role="alert" className="text-sm text-red-300">
                  {journalsError
                    ? `Unable to load journals: ${journalsError.message}`
                    : "No journals found"}
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={!selectedUserId}
              onClick={() => setIsCreateJournalModalOpen(true)}
              className="mt-6 rounded border border-slate-700 px-3 py-2 text-slate-100 hover:border-emerald-500 disabled:opacity-50"
            >
              Create new Journal
            </button>
          </div>
        </div>
      )}
      {canGoBirding && (
        <RandomLocations
          userId={selectedUserId}
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
        />
      )}
      {activeLocation && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setIsObserveModalOpen(true)}
            className="rounded-lg bg-emerald-500 px-12 py-6 text-3xl font-bold text-slate-950 hover:bg-emerald-400"
          >
            Go Birding!
          </button>
        </div>
      )}
      <Modal
        isOpen={isCreateJournalModalOpen}
        onRequestClose={() => setIsCreateJournalModalOpen(false)}
        contentLabel="Create Journal"
        className="fixed left-1/2 top-1/2 max-h-[80vh] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-100 shadow-xl"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsCreateJournalModalOpen(false)}
            className="rounded px-2 py-1 text-sm hover:bg-slate-600/40"
          >
            Close
          </button>
        </div>
        {selectedUserId && (
          <CreateJournalContent
            userId={selectedUserId}
            onCreated={(journal) => {
              setSelectedJournalId(journal.journalId);
              setIsCreateJournalModalOpen(false);
            }}
          />
        )}
      </Modal>
      <Modal
        isOpen={isObserveModalOpen}
        onRequestClose={() => setIsObserveModalOpen(false)}
        contentLabel="Observe a Bird"
        className="fixed left-1/2 top-1/2 max-h-[80vh] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-100 shadow-xl"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsObserveModalOpen(false)}
            className="rounded px-2 py-1 text-sm hover:bg-slate-600/40"
          >
            Close
          </button>
        </div>
        <ObserveBirdContent />
      </Modal>
    </section>
  );
}
