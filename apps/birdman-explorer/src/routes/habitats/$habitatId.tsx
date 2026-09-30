import { createFileRoute } from "@tanstack/react-router";
import HabitatDetailPage from "../../pages/HabitatDetailPage";

export const Route = createFileRoute("/habitats/$habitatId")({
  component: HabitatDetailPage,
});
