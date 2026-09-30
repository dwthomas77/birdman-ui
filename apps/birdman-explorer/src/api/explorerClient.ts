import { createApiClient } from "@birdman/api-client";

export const apiClient = createApiClient({
  baseUrl:
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000",
});
