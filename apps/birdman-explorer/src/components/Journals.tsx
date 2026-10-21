import type { Journal } from "@birdman/shared-types";
import { useQuery } from "@tanstack/react-query";
import { getJournalsByUserId } from "../api/birdApi";

interface JournalsProps {
  userId: string;
}

const Journals = ({ userId }: JournalsProps) => {
  const { data: journals, isPending, error } = useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournalsByUserId(userId),
  });

  if (isPending) {
    return <p>Loading journals...</p>;
  }

  if (error) {
    return <p role="alert">Failed to load journals: {error.message}</p>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {journals?.map((journal: Journal) => (
        <div key={journal.journalId} className="w-[200px] h-[150px] bg-slate-900 p-5">
          <p>{journal.name}</p>
        </div>
      ))}
    </div>
  );
};

export default Journals;