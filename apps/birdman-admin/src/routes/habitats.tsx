import { createFileRoute } from "@tanstack/react-router";
import AdminHabitatsPage from "../pages/AdminHabitatsPage";

export const Route = createFileRoute("/habitats")({
  component: AdminHabitatsPage,
});
