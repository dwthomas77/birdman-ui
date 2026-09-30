import { createBirdApi } from "@birdman/api-client";
import { apiClient } from "../api/adminClient";

const birdApi = createBirdApi(apiClient);

export const {
  getHabitats,
  getHabitat,
  createHabitat,
  updateHabitat,
  deleteHabitat,
  getSpecies,
  getSpeciesById,
  createSpecies,
  updateSpecies,
  deleteSpecies,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = birdApi;

export const postHabitat = birdApi.createHabitat;
export const putHabitat = birdApi.updateHabitat;
