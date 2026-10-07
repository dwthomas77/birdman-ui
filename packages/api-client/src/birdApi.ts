import type {
  Bird,
  Habitat,
  Journal,
  JournalCreate,
  JournalRequest,
  HabitatRequest,
  Species,
  SpeciesCreate,
  User,
  UserRequest,
} from "@birdman/shared-types";
import type { ApiClient } from "./client";

export function createBirdApi(apiClient: ApiClient) {
  return {
    getBird: () => apiClient.get<Bird>("/bird"),
    getHabitats: () => apiClient.get<Habitat[]>("/habitats"),
    getHabitat: (habitatId: string) =>
      apiClient.get<Habitat>(`/habitats/${encodeURIComponent(habitatId)}`),
    createHabitat: (data: HabitatRequest) =>
      apiClient.post<Habitat, HabitatRequest>("/habitats", data),
    updateHabitat: (data: HabitatRequest, habitatId: string) =>
      apiClient.put<Habitat, HabitatRequest>(
        `/habitats/${encodeURIComponent(habitatId)}`,
        data,
      ),
    async deleteHabitat(habitatId: string): Promise<string> {
      await apiClient.delete(`/habitats/${encodeURIComponent(habitatId)}`);
      return `Successfully deleted habitat with id: ${habitatId}`;
    },
    getSpecies: () => apiClient.get<Species[]>("/species"),
    getSpeciesById: (speciesId: string) =>
      apiClient.get<Species>(`/species/${encodeURIComponent(speciesId)}`),
    createSpecies: (data: SpeciesCreate) =>
      apiClient.post<Species, SpeciesCreate>("/species", data),
    updateSpecies: (data: SpeciesCreate, speciesId: string) =>
      apiClient.put<Species, SpeciesCreate>(
        `/species/${encodeURIComponent(speciesId)}`,
        data,
      ),
    async deleteSpecies(speciesId: string): Promise<string> {
      await apiClient.delete(`/species/${encodeURIComponent(speciesId)}`);
      return `Successfully deleted species with id: ${speciesId}`;
    },
    getUsers: () => apiClient.get<User[]>("/users"),
    getUser: (userId: string) =>
      apiClient.get<User>(`/users/${encodeURIComponent(userId)}`),
    createUser: (data: UserRequest) =>
      apiClient.post<User, UserRequest>("/users", data),
    updateUser: (data: UserRequest, userId: string) =>
      apiClient.put<User, UserRequest>(
        `/users/${encodeURIComponent(userId)}`,
        data,
      ),
    async deleteUser(userId: string): Promise<string> {
      await apiClient.delete(`/users/${encodeURIComponent(userId)}`);
      return `Successfully deleted user with id: ${userId}`;
    },
    getJournals: () => apiClient.get<Journal[]>("/journals"),
    getJournalsByUserId: (userId: string) =>
      apiClient.get<Journal[]>(`/journals?userId=${encodeURIComponent(userId)}`),
    createJournal(data: JournalCreate) {
      const now = new Date().toISOString();
      return apiClient.post<Journal, JournalRequest>("/journals", {
        ...data,
        createdAt: now,
        updatedAt: now,
      });
    },
    getJournal: (journalId: string) =>
      apiClient.get<Journal>(`/journals/${encodeURIComponent(journalId)}`),
    async deleteJournal(journalId: string): Promise<string> {
      await apiClient.delete(`/journals/${encodeURIComponent(journalId)}`);
      return `Successfully deleted journal with id: ${journalId}`;
    },
  };
}
