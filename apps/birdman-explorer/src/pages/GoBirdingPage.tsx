import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@birdman/shared-ui";
import type { User } from "@birdman/shared-types";
import { getUsers } from "../api/birdApi";
import RandomLocations from "../components/RandomLocations";

export default function GoBirdingPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );
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
            onChange={(event) =>
              setSelectedUserId(event.target.value || undefined)
            }
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
      {selectedUserId && <RandomLocations userId={selectedUserId} />}
    </section>
  );
}
