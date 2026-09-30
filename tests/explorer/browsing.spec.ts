import { expect, test } from "@playwright/test";

const habitats = [
  {
    habitatId: "woodland",
    code: "wood",
    name: "Woodland",
    description: "Forests and wooded places.",
  },
];

const species = [
  {
    speciesId: "robin",
    speciesName: "Turdus migratorius",
    family: "Turdidae",
    genus: "Turdus",
    localeName: "American Robin",
    lengthMin: 20,
    lengthMax: 25,
    weightMin: 70,
    weightMax: 80,
    wingspanMin: 30,
    wingspanMax: 40,
    habitats: [],
  },
];

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:3000/**", async (route) => {
    const { pathname } = new URL(route.request().url());
    if (pathname === "/habitats") {
      await route.fulfill({ json: habitats });
    } else if (pathname === "/habitats/woodland") {
      await route.fulfill({ json: habitats[0] });
    } else if (pathname === "/species") {
      await route.fulfill({ json: species });
    } else if (pathname === "/species/robin") {
      await route.fulfill({ json: species[0] });
    } else {
      await route.fulfill({
        status: 404,
        json: { detail: `Not found: ${pathname}` },
      });
    }
  });
});

test("explorer has an independent shell and browses habitats and species", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/habitats$/);
  await expect(
    page.getByRole("heading", { name: "Habitats", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Admin navigation" })).toHaveCount(0);
  await expect(
    page.getByRole("navigation", { name: "Explorer navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Woodland", exact: false }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Species" }).click();
  await expect(page).toHaveURL(/\/species$/);
  await expect(
    page.getByRole("heading", { name: "Bird species" }),
  ).toBeVisible();
  await expect(page.getByText("American Robin")).toBeVisible();
});

test("explorer provides habitat and species detail pages", async ({ page }) => {
  await page.goto("/habitats/woodland");
  await expect(page.getByRole("heading", { name: "Woodland" })).toBeVisible();
  await expect(page.getByText("Forests and wooded places.")).toBeVisible();

  await page.goto("/species/robin");
  await expect(page.getByRole("heading", { name: "American Robin" })).toBeVisible();
  await expect(page.getByText("Turdus migratorius")).toBeVisible();
});
