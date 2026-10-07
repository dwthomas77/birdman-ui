import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner, Modal } from "@birdman/shared-ui";
import type { Location, User } from "@birdman/shared-types";
import { getUsers } from "../api/birdApi";
import ObserveBirdContent from "../components/ObserveBirdContent";
import RandomLocations from "../components/RandomLocations";

export default function GoBirdingPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
  const [activeLocation, setActiveLocation] = useState<Location | undefined>(
    undefined,
  );
  const [isObserveModalOpen, setIsObserveModalOpen] = useState(false);
  const { data: users = [], isPending, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

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
        <div className="flex flex-col gap-1">
          <label htmlFor="birder-select" className="text-sm font-semibold">
            Birder
          </label>
          <select
            id="birder-select"
            value={selectedUserId ?? ""}
            onChange={(event) => {
              setSelectedUserId(event.target.value || undefined);
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
      )}
      {selectedUserId && (
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
