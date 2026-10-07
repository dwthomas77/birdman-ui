import { createFileRoute } from "@tanstack/react-router";
import AdminJournalsPage from "../pages/AdminJournalsPage";

export const Route = createFileRoute("/journals")({
  component: AdminJournalsPage,
});
