import UserCards from "../components/UserCards";
import Journals from "../components/Journals";
import { useUser } from "../context/user.context";

export default function BirdersPage() {
  const { user, setUser } = useUser();

  return (
    <div>
      <h1>Birders</h1>
      <UserCards activeUser={user?.userId ?? null} onUserClick={setUser} />
      {user && <Journals userId={user.userId} />}
    </div>
  );
}