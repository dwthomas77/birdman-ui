import { createFileRoute } from '@tanstack/react-router';
import AdminObservationGroupsPage from "../pages/AdminObservationGroupsPage";

export const Route = createFileRoute('/observationGroups')({
  component: AdminObservationGroupsPage,
});