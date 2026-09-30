import { expect, test } from "@playwright/test";
import { mockBirdApi } from "./helpers/mockBirdApi";

test("admin navigation switches between management routes", async ({
  page,
}) => {
  await mockBirdApi(page);
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "HABITATS" })).toBeVisible();
  await expect(page).toHaveURL(/\/habitats$/);
  await page.getByRole("link", { name: "Species" }).click();
  await expect(page.getByRole("heading", { name: "SPECIES" })).toBeVisible();
  await expect(page).toHaveURL(/\/species$/);
  await page.getByRole("link", { name: "Users" }).click();
  await expect(page.getByRole("heading", { name: "USERS" })).toBeVisible();
  await expect(page).toHaveURL(/\/users$/);
  await page.getByRole("link", { name: "Habitats" }).click();
  await expect(page.getByRole("heading", { name: "HABITATS" })).toBeVisible();
});

test("management routes render when opened directly", async ({ page }) => {
  await mockBirdApi(page);

  await page.goto("/species");
  await expect(page.getByRole("heading", { name: "SPECIES" })).toBeVisible();
  await page.goto("/users");
  await expect(page.getByRole("heading", { name: "USERS" })).toBeVisible();
  await page.goto("/habitats");
  await expect(page.getByRole("heading", { name: "HABITATS" })).toBeVisible();
});

test("habitats can be created, updated, and deleted", async ({ page }) => {
  const { state, requests } = await mockBirdApi(page);
  await page.goto("/");

  await page.getByRole("button", { name: "Add Habitat" }).click();
  const addDialog = page.getByRole("dialog", { name: "Add Habitat" });
  await addDialog.getByLabel(/Habitat Code/).fill("forest");
  await addDialog.getByLabel(/Habitat Name/).fill("Forest");
  await addDialog.getByLabel(/Habitat Description/).fill("Woodland habitat");
  await addDialog.getByRole("button", { name: "Save" }).click();

  const createdRow = page.getByRole("row").filter({ hasText: "Forest" });
  await expect(createdRow).toBeVisible();
  expect(requests).toContainEqual({
    method: "POST",
    pathname: "/habitats",
    body: {
      code: "forest",
      name: "Forest",
      description: "Woodland habitat",
    },
  });

  await createdRow.getByRole("button", { name: "Update" }).click();
  const updateDialog = page.getByRole("dialog", { name: "Update Habitat" });
  await expect(updateDialog.getByLabel(/Habitat Name/)).toHaveValue("Forest");
  await updateDialog.getByLabel(/Habitat Name/).fill("Temperate Forest");
  await updateDialog.getByRole("button", { name: "Save" }).click();

  const updatedRow = page.getByRole("row").filter({
    hasText: "Temperate Forest",
  });
  await expect(updatedRow).toBeVisible();
  expect(requests).toContainEqual({
    method: "PUT",
    pathname: "/habitats/created-habitat",
    body: {
      code: "forest",
      name: "Temperate Forest",
      description: "Woodland habitat",
    },
  });

  await updatedRow.getByRole("button", { name: "Delete" }).click();
  await expect(updatedRow).toHaveCount(0);
  expect(requests).toContainEqual({
    method: "DELETE",
    pathname: "/habitats/created-habitat",
    body: undefined,
  });
  expect(state.habitats).toHaveLength(0);
});

test("species can be created, updated, and deleted", async ({ page }) => {
  const { state, requests } = await mockBirdApi(page);
  await page.goto("/");
  await page.getByRole("link", { name: "Species" }).click();
  await page.getByRole("button", { name: "Add Species" }).click();

  const dialog = page.getByRole("dialog", { name: "Add Species" });
  await dialog.getByLabel(/Species Name/).fill("American Robin");
  await dialog.getByLabel(/Family/).fill("Turdidae");
  await dialog.getByLabel(/Genus/).fill("Turdus");
  await dialog.getByLabel(/Locale Name/).fill("Robin");
  await dialog.getByLabel(/Length Min/).fill("20");
  await dialog.getByLabel(/Length Max/).fill("25");
  await dialog.getByLabel(/Weight Min/).fill("70");
  await dialog.getByLabel(/Weight Max/).fill("80");
  await dialog.getByLabel(/Wingspan Min/).fill("30");
  await dialog.getByLabel(/Wingspan Max/).fill("40");
  await dialog.getByRole("button", { name: "Save" }).click();

  const createdRow = page.getByRole("row").filter({
    hasText: "American Robin",
  });
  await expect(createdRow).toBeVisible();
  expect(
    requests.find(
      (request) =>
        request.method === "POST" && request.pathname === "/species",
    )?.body,
  ).toMatchObject({
    speciesName: "American Robin",
    family: "Turdidae",
    genus: "Turdus",
    localeName: "Robin",
  });

  await createdRow.getByRole("button", { name: "Update" }).click();
  const updateDialog = page.getByRole("dialog", { name: "Update Species" });
  await expect(updateDialog.getByLabel(/Species Name/)).toHaveValue(
    "American Robin",
  );
  await updateDialog.getByLabel(/Locale Name/).fill("North American Robin");
  await updateDialog.getByRole("button", { name: "Save" }).click();

  const updatedRow = page.getByRole("row").filter({
    hasText: "North American Robin",
  });
  await expect(updatedRow).toBeVisible();
  expect(
    requests.find(
      (request) =>
        request.method === "PUT" &&
        request.pathname === "/species/created-species",
    )?.body,
  ).toMatchObject({ localeName: "North American Robin" });

  await updatedRow.getByRole("button", { name: "Delete" }).click();
  await expect(updatedRow).toHaveCount(0);
  expect(requests).toContainEqual({
    method: "DELETE",
    pathname: "/species/created-species",
    body: undefined,
  });
  expect(state.species).toHaveLength(0);
});
