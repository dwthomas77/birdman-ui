import { createFileRoute } from "@tanstack/react-router";
import GoBirdingPage from "../pages/GoBirdingPage";

export const Route = createFileRoute("/go-birding")({
  component: GoBirdingPage,
});
