import { useQuery } from "@tanstack/react-query";
import type { Journal } from "@birdman/shared-types";
import { LoadingSpinner } from "@birdman/shared-ui";
import { Button } from "./atomic";
import { getJournal } from "../services";

export interface JournalViewModalProps {
  onSuccess?: () => void;
  journalId?: string;
}

export default function JournalViewModal({
  onSuccess,
  journalId,
}: JournalViewModalProps) {
  const { data: journal, isPending, error } = useQuery<Journal>({
    queryKey: ["journals", journalId],
    queryFn: () => getJournal(journalId as string),
    enabled: !!journalId,
  });

  if (isPending) return <LoadingSpinner />;
  if (error || !journal) {
    return (
      <p className="text-red-400">
        Failed to load journal{error ? `: ${error.message}` : "."}
      </p>
    );
  }

  const fields: Array<[string, string]> = [
    ["Journal ID", journal.journalId],
    ["User ID", journal.userId],
    ["Name", journal.name],
    ["Description", journal.description ?? ""],
    ["Created", new Date(journal.createdAt).toLocaleString()],
    ["Updated", new Date(journal.updatedAt).toLocaleString()],
  ];

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">Journal</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        {fields.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-gray-400">{label}</dt>
            <dd>{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end">
        <Button buttonSize="small" onClick={onSuccess}>
          Close
        </Button>
      </div>
    </div>
  );
}
