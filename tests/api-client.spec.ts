import { expect, test } from "@playwright/test";

test("API client uses the configured base URL and app auth headers", async ({
  page,
}) => {
  await page.goto("/");

  let authorizationHeader: string | undefined;
  await page.route("http://127.0.0.1:3001/api/**", async (route) => {
    authorizationHeader = route.request().headers().authorization;
    await route.fulfill({ json: { ok: true } });
  });

  const response = await page.evaluate(async () => {
    const { createApiClient } = await import(
      "/@fs/Users/davidthomas/dev/training/birdman-ui/packages/api-client/src/client.ts"
    );
    const client = createApiClient({
      baseUrl: "http://127.0.0.1:3001/api",
      getAuthHeaders: () => ({ Authorization: "Bearer test-token" }),
    });
    return client.get<{ ok: boolean }>("/health");
  });

  expect(response).toEqual({ ok: true });
  expect(authorizationHeader).toBe("Bearer test-token");
});

test("admin API client reads the Vite API base URL", async ({ page }) => {
  await page.goto("/");

  let requestUrl: string | undefined;
  await page.route("**/admin-client-probe", async (route) => {
    requestUrl = route.request().url();
    await route.fulfill({ json: { ok: true } });
  });

  const response = await page.evaluate(async () => {
    const { apiClient } = await import("/src/api/adminClient.ts");
    return apiClient.get<{ ok: boolean }>("/admin-client-probe");
  });

  const baseUrl = (
    process.env.VITE_API_BASE_URL?.trim() || "http://localhost:3000"
  ).replace(/\/+$/, "");
  expect(response).toEqual({ ok: true });
  expect(requestUrl).toBe(`${baseUrl}/admin-client-probe`);
});
