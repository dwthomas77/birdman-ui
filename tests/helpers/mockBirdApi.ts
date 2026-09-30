import type { Page, Route } from "@playwright/test";

export interface TestHabitat {
  habitatId: string;
  code: string;
  name: string;
  description?: string;
}

export interface TestSpecies {
  speciesId: string;
  speciesName: string;
  family: string;
  genus: string;
  localeName: string;
  lengthMin: number;
  lengthMax: number;
  weightMin: number;
  weightMax: number;
  wingspanMin: number;
  wingspanMax: number;
  habitats: Array<{ habitatId: string }>;
}

export interface ApiRequest {
  method: string;
  pathname: string;
  body?: Record<string, unknown>;
}

interface MockBirdApiOptions {
  habitats?: TestHabitat[];
  species?: TestSpecies[];
}

export async function mockBirdApi(
  page: Page,
  { habitats = [], species = [] }: MockBirdApiOptions = {},
) {
  const state = { habitats: [...habitats], species: [...species] };
  const requests: ApiRequest[] = [];

  await page.route("http://localhost:3000/**", async (route) => {
    await handleApiRequest(route, state, requests);
  });

  return { state, requests };
}

async function handleApiRequest(
  route: Route,
  state: { habitats: TestHabitat[]; species: TestSpecies[] },
  requests: ApiRequest[],
) {
  const request = route.request();
  const { pathname } = new URL(request.url());
  const method = request.method();
  const body = request.postData()
    ? (JSON.parse(request.postData()!) as Record<string, unknown>)
    : undefined;

  requests.push({ method, pathname, body });

  if (method === "GET" && pathname === "/habitats") {
    return route.fulfill({ json: state.habitats });
  }
  if (method === "GET" && pathname === "/species") {
    return route.fulfill({ json: state.species });
  }
  if (method === "GET" && pathname.startsWith("/habitats/")) {
    const habitat = state.habitats.find(
      (entry) => entry.habitatId === pathname.split("/")[2],
    );
    return habitat
      ? route.fulfill({ json: habitat })
      : route.fulfill({ status: 404, json: { detail: "Habitat not found" } });
  }
  if (method === "GET" && pathname.startsWith("/species/")) {
    const bird = state.species.find(
      (entry) => entry.speciesId === pathname.split("/")[2],
    );
    return bird
      ? route.fulfill({ json: bird })
      : route.fulfill({ status: 404, json: { detail: "Species not found" } });
  }
  if (method === "POST" && pathname === "/habitats" && body) {
    const habitat: TestHabitat = {
      ...(body as Omit<TestHabitat, "habitatId">),
      habitatId: "created-habitat",
    };
    state.habitats.push(habitat);
    return route.fulfill({ status: 201, json: habitat });
  }
  if (method === "PUT" && pathname.startsWith("/habitats/") && body) {
    const habitatId = pathname.split("/")[2];
    const index = state.habitats.findIndex(
      (entry) => entry.habitatId === habitatId,
    );
    if (index < 0) {
      return route.fulfill({
        status: 404,
        json: { detail: "Habitat not found" },
      });
    }
    state.habitats[index] = {
      ...state.habitats[index],
      ...body,
    } as TestHabitat;
    return route.fulfill({ json: state.habitats[index] });
  }
  if (method === "DELETE" && pathname.startsWith("/habitats/")) {
    const habitatId = pathname.split("/")[2];
    state.habitats = state.habitats.filter(
      (entry) => entry.habitatId !== habitatId,
    );
    return route.fulfill({ status: 204 });
  }
  if (method === "POST" && pathname === "/species" && body) {
    const bird: TestSpecies = {
      ...(body as Omit<TestSpecies, "speciesId">),
      speciesId: "created-species",
      habitats: [],
    };
    state.species.push(bird);
    return route.fulfill({ status: 201, json: bird });
  }
  if (method === "PUT" && pathname.startsWith("/species/") && body) {
    const speciesId = pathname.split("/")[2];
    const index = state.species.findIndex(
      (entry) => entry.speciesId === speciesId,
    );
    if (index < 0) {
      return route.fulfill({
        status: 404,
        json: { detail: "Species not found" },
      });
    }
    state.species[index] = {
      ...state.species[index],
      ...body,
    } as TestSpecies;
    return route.fulfill({ json: state.species[index] });
  }
  if (method === "DELETE" && pathname.startsWith("/species/")) {
    const speciesId = pathname.split("/")[2];
    state.species = state.species.filter(
      (entry) => entry.speciesId !== speciesId,
    );
    return route.fulfill({ status: 204 });
  }
  if (method === "GET" && pathname === "/users") {
    return route.fulfill({ json: [] });
  }

  return route.fulfill({
    status: 404,
    json: { detail: `Unhandled test API request: ${method} ${pathname}` },
  });
}
