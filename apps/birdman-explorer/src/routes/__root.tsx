import { createRootRoute } from "@tanstack/react-router";
import ExplorerShell from "../shell/ExplorerShell";

export const Route = createRootRoute({
  component: ExplorerShell,
});
