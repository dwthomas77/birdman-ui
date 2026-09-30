import { createFileRoute } from "@tanstack/react-router";
import HabitatsPage from "../../pages/HabitatsPage";

export const Route = createFileRoute("/habitats/")({
  component: HabitatsPage,
});
