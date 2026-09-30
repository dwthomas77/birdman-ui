import UserTable from "../components/UserTable";
import { useAdminModal } from "../shell/AdminModalContext";
import { Card } from "@birdman/shared-ui";

export default function AdminUsersPage() {
  const { openModal, closeModal } = useAdminModal();

  return (
    <main className="h-full p-4">
      <Card className="border-slate-700 bg-gray-900/40 p-4">
        <UserTable
          addUserClickHandler={() =>
            openModal("addUser", { mode: "add", onSuccess: closeModal })
          }
          updateUserClickHandler={(userId) =>
            openModal("updateUser", {
              mode: "update",
              userId,
              onSuccess: closeModal,
            })
          }
        />
      </Card>
    </main>
  );
}
