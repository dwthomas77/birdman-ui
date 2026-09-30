import { tableFeatures, useTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types";
import { Button } from "./atomic";
import { deleteUser } from "../services";
import { useToast } from "./ToastProvider";
import { tableStyles } from "../styles";

interface UserTableProps {
  addUserClickHandler: () => void;
  updateUserClickHandler: (userId: string) => void;
}

export default function UserTable({
  addUserClickHandler,
  updateUserClickHandler,
}: UserTableProps) {
  const { data: users = [], isPending, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () =>
      fetch("http://localhost:3000/users").then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.statusText}`);
        }
        return response.json() as Promise<User[]>;
      }),
  });
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const deleteUserMutation = useMutation<string, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      addToast("User deleted successfully.", {
        type: "success",
        duration: 3500,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (deleteError) => {
      console.error("Error deleting user:", deleteError);
      addToast("Failed to delete user.", {
        type: "error",
        duration: 3500,
      });
    },
  });
  const features = tableFeatures({});
  const columns: Array<ColumnDef<typeof features, User>> = [
    {
      accessorKey: "userId",
      header: () => "User ID",
    },
    {
      accessorKey: "displayName",
      header: () => "Display Name",
    },
    {
      id: "update",
      header: () => "Update",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          onClick={() => updateUserClickHandler(info.row.original.userId)}
        >
          Update
        </Button>
      ),
    },
    {
      id: "delete",
      header: () => "Delete",
      cell: (info) => (
        <Button
          buttonSize="small"
          variant="tertiary"
          disabled={deleteUserMutation.isPending}
          onClick={() => deleteUserMutation.mutate(info.row.original.userId)}
        >
          Delete
        </Button>
      ),
    },
  ];
  const table = useTable({
    key: "users-table",
    features,
    columns,
    data: users,
  });

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-400 text-lg font-semibold">USERS</h3>
        <Button buttonSize="small" onClick={addUserClickHandler}>
          Add User
        </Button>
      </div>
      {isPending ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-400">Failed to load users: {error.message}</p>
      ) : (
        <table className="border-separate border-spacing-y-1">
          <thead className={tableStyles.header}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={tableStyles.headerCell}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={tableStyles.tbody}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={tableStyles.row}>
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className={tableStyles.tdFirst}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
