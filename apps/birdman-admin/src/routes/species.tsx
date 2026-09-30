import { createFileRoute } from "@tanstack/react-router";
import AdminSpeciesPage from "../pages/AdminSpeciesPage";

export const Route = createFileRoute("/species")({
  component: AdminSpeciesPage,
});
