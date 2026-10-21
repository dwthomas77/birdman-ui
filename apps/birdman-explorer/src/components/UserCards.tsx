import { useQuery } from "@tanstack/react-query";
import type { User } from "@birdman/shared-types";
import { getUsers } from "../api/birdApi";
import { Card, LoadingSpinner } from "@birdman/shared-ui";

const userCardStyles = "w-[200px] h-[150px] bg-slate-900 p-5 transition hover:border-blue-500/70 hover:bg-slate-900/80 cursor-pointer";
const inactiveUserCardStyles = "border-slate-800";
const activeUserCardStyles = "border-blue-500/70";


interface UserCardsProps {
  activeUser: string | null;
  onUserClick?: (user: User) => void;
}

const UserCards = ({ activeUser, onUserClick }: UserCardsProps) => {
  const { data: users, isPending, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p role="alert">Failed to load users: {error.message}</p>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {users?.map((user: User) => (
        <Card
          key={user.userId}
          className={`${userCardStyles} ${activeUser === user.userId ? activeUserCardStyles : inactiveUserCardStyles}`}
          onClick={() => onUserClick?.(user)}
        >
          <p>{user.displayName}</p>
        </Card>
      ))}
    </div>
  );
};

export default UserCards;