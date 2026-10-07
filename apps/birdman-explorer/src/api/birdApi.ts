import { createBirdApi } from "@birdman/api-client";
import { apiClient } from "./explorerClient";

export const { getBird, getHabitats, getHabitat, getSpecies, getSpeciesById, getUsers, getJournalsByUserId, createJournal } =
  createBirdApi(apiClient);
