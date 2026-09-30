import { apiClient } from "../api/adminClient";
import type {
  Habitat,
  HabitatRequest,
  Species,
  SpeciesCreate,
  User,
  UserRequest,
} from "@birdman/shared-types";

export const getHabitats = () => apiClient.get<Habitat[]>("/habitats");
export const getHabitat = (habitatId: string) =>
  apiClient.get<Habitat>(`/habitats/${encodeURIComponent(habitatId)}`);
export const createHabitat = (data: HabitatRequest) =>
  apiClient.post<Habitat, HabitatRequest>("/habitats", data);
export const updateHabitat = (data: HabitatRequest, habitatId: string) =>
  apiClient.put<Habitat, HabitatRequest>(
    `/habitats/${encodeURIComponent(habitatId)}`,
    data,
  );
export async function deleteHabitat(habitatId: string): Promise<string> {
  await apiClient.delete(`/habitats/${encodeURIComponent(habitatId)}`);
  return `Successfully deleted habitat with id: ${habitatId}`;
}

export const getSpecies = () => apiClient.get<Species[]>("/species");
export const getSpeciesById = (speciesId: string) =>
  apiClient.get<Species>(`/species/${encodeURIComponent(speciesId)}`);
export const createSpecies = (data: SpeciesCreate) =>
  apiClient.post<Species, SpeciesCreate>("/species", data);
export const updateSpecies = (data: SpeciesCreate, speciesId: string) =>
  apiClient.put<Species, SpeciesCreate>(
    `/species/${encodeURIComponent(speciesId)}`,
    data,
  );
export async function deleteSpecies(speciesId: string): Promise<string> {
  await apiClient.delete(`/species/${encodeURIComponent(speciesId)}`);
  return `Successfully deleted species with id: ${speciesId}`;
}

export const getUsers = () => apiClient.get<User[]>("/users");
export const getUser = (userId: string) =>
  apiClient.get<User>(`/users/${encodeURIComponent(userId)}`);
export const createUser = (data: UserRequest) =>
  apiClient.post<User, UserRequest>("/users", data);
export const updateUser = (data: UserRequest, userId: string) =>
  apiClient.put<User, UserRequest>(
    `/users/${encodeURIComponent(userId)}`,
    data,
  );
export async function deleteUser(userId: string): Promise<string> {
  await apiClient.delete(`/users/${encodeURIComponent(userId)}`);
  return `Successfully deleted user with id: ${userId}`;
}
