import { createFileRoute } from "@tanstack/react-router";
import SpeciesDetailPage from "../../pages/SpeciesDetailPage";

export const Route = createFileRoute("/species/$speciesId")({
  component: SpeciesDetailPage,
});
