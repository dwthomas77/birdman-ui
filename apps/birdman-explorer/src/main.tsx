import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ToastProvider } from "@birdman/shared-ui";
import { router } from "./router";
import { UserProvider } from "./context/user.context";
import "./App.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>,
);
