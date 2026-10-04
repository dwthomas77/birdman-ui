import { createBirdApi } from "@birdman/api-client";
import { apiClient } from "./explorerClient";

export const { getHabitats, getHabitat, getSpecies, getSpeciesById, getUsers } =
  createBirdApi(apiClient);
