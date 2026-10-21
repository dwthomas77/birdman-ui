import { useQuery } from "@tanstack/react-query";
import { getJournalsByUserId } from "../../api/birdApi";

interface JournalsProps {
  userId: string;
}

export const Journals = ({ userId }: JournalsProps) => {
  const { data: journals = [] } = useQuery({
    queryKey: ["journals", userId],
    queryFn: () => getJournalsByUserId(userId),
    enabled: !!userId,
  });

  const liStyles = "border border-gray-600 py-1 px-3"; 
  return (
    <div className="min-h-0 flex-1 flex">
      <div className="flex-1">
        {`Journals`}
        <ul className="mt-4">
          {journals.map((journal) => (
            <li key={journal.journalId} className={liStyles}>{journal.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Journals;