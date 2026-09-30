import { createRootRoute } from "@tanstack/react-router";
import AdminShell from "../shell/AdminShell";

export const Route = createRootRoute({
  component: AdminShell,
});
