import { createFileRoute } from "@tanstack/react-router";
import AdminUsersPage from "../pages/AdminUsersPage";

export const Route = createFileRoute("/users")({
  component: AdminUsersPage,
});
