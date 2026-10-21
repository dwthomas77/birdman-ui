import { useQuery } from "@tanstack/react-query";
import type { JournalSummary } from "@birdman/shared-types";
import { Button, LoadingSpinner } from "@birdman/shared-ui";
import { getJournal, getObservationsByJournalId } from "../services";
import { formatShortDate } from "../util";

export interface JournalViewModalProps {
  onSuccess?: () => void;
  journalId?: string;
}

export default function JournalViewModal({
  onSuccess,
  journalId,
}: JournalViewModalProps) {
  const { data: journal, isPending, error } = useQuery<JournalSummary>({
    queryKey: ["journals", journalId],
    queryFn: () => getJournal(journalId as string),
    enabled: !!journalId,
  });

  const { data: observations = [] } = useQuery({
    queryKey: ["observations", journalId],
    queryFn: () => getObservationsByJournalId(journalId as string),
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


  return (
    <div className="flex flex-col gap-3 w-[600px]">
      <h2 className="text-lg font-semibold">{journal.name}</h2>
      {journal.description && (
        <p className="text-sm text-slate-300">{journal.description}</p>
      )}
      <div>Owned by: {journal.owner.displayName}</div>
      <div>Last Updated: {formatShortDate(journal.updatedAt)}</div>
      <h3 className="text-md font-semibold">Observations</h3>
      <ul className="list-none flex-1">
        {observations.map((observation) => (
          <li key={observation.observationId} className="flex items-top justify-between w-full">
            <span className="flex-1">{observation.bird.localeName}</span>
            <span className="flex-1">{observation.bird.speciesName}</span>
            <span className="flex-1">{observation.location.name}</span>
            <span>{formatShortDate(observation.observedAt)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-end">
        <Button buttonSize="small" onClick={onSuccess}>
          Close
        </Button>
      </div>
    </div>
  );
}
