import { createFileRoute } from "@tanstack/react-router";
import BirdersPage from "../pages/BirdersPage";
export const Route = createFileRoute("/birders")({
  component: BirdersPage,
});
