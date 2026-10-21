import type {
  Bird,
  Habitat,
  Journal,
  JournalRequest,
  JournalSummary,
  Observation,
  ObservationRequest,
  HabitatRequest,
  Species,
  SpeciesCreate,
  SpeciesSummary,
  User,
  UserRequest,
} from "@birdman/shared-types";
import type { ApiClient } from "./client";

export interface BirdFilters {
  habitatId?: string;
}

export interface HabitatFilters {
  level?: number;
  parentId?: string;
}

export function createBirdApi(apiClient: ApiClient) {
  return {
    getBird: (filters: BirdFilters = {}) => {
      const params = new URLSearchParams();
      if (filters.habitatId !== undefined) {
        params.set("habitatId", filters.habitatId);
      }
      const query = params.toString();
      return apiClient.get<Bird>(`/bird${query ? `?${query}` : ""}`);
    },
    getHabitats: (filters: HabitatFilters = {}) => {
      const params = new URLSearchParams();
      if (filters.level !== undefined) {
        params.set("level", String(filters.level));
      }
      if (filters.parentId !== undefined) {
        params.set("parentId", filters.parentId);
      }
      const query = params.toString();
      return apiClient.get<Habitat[]>(`/habitats${query ? `?${query}` : ""}`);
    },
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
    getSpecies: () => apiClient.get<SpeciesSummary[]>("/species"),
    getSpeciesById: (speciesId: string) =>
      apiClient.get<SpeciesSummary>(`/species/${encodeURIComponent(speciesId)}`),
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
    getJournals: () => apiClient.get<JournalSummary[]>("/journals"),
    getJournalsByUserId: (userId: string) =>
      apiClient.get<Journal[]>(`/journals?userId=${encodeURIComponent(userId)}`),
    createJournal(data: JournalRequest) {
      return apiClient.post<Journal, JournalRequest>("/journals", data);
    },
    getJournal: (journalId: string) =>
      apiClient.get<JournalSummary>(`/journals/${encodeURIComponent(journalId)}`),
    async deleteJournal(journalId: string): Promise<string> {
      await apiClient.delete(`/journals/${encodeURIComponent(journalId)}`);
      return `Successfully deleted journal with id: ${journalId}`;
    },
    createObservation: (data: ObservationRequest) =>
      apiClient.post<Observation, ObservationRequest>("/observations", data),
    getObservationsByJournalId: (journalId: string) =>
      apiClient.get<Observation[]>(`/observations?journalId=${encodeURIComponent(journalId)}`),
  };
}
