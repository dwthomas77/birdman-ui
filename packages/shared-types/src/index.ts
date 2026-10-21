import type { FromSchema } from "json-schema-to-ts";
import { UserRequestSchema, UserSchema } from "./schemas/user.schema";
import { JournalSchema, JournalRequestSchema, JournalSummarySchema } from "./schemas/journal.schema";
import { ObservationSchema, ObservationRequestSchema } from "./schemas/observation.schema";
import { LocationSchema } from "./schemas/location.schema";
import { BirdSchema } from "./schemas/bird.schema";
import { HabitatSchema, HabitatRequestSchema } from "./schemas/habitat.schema";
import type { SpeciesRequestSchema, SpeciesReadSchema, SpeciesSummarySchema } from "./schemas/species.schema";

export { SpeciesRequestSchema, SpeciesReadSchema } from "./schemas/species.schema";
export { UserRequestSchema, UserSchema } from "./schemas/user.schema";
export { HabitatSchema, HabitatRequestSchema } from "./schemas/habitat.schema";
export { LocationSchema } from "./schemas/location.schema";
export { BirdSchema } from "./schemas/bird.schema";
export { JournalSchema, JournalRequestSchema, JournalSummarySchema } from "./schemas/journal.schema";
export { ObservationSchema, ObservationRequestSchema } from "./schemas/observation.schema";
export type { FromSchema } from "json-schema-to-ts";
export type Journal = FromSchema<typeof JournalSchema>;
export type JournalRequest = FromSchema<typeof JournalRequestSchema>;
export type JournalSummary = FromSchema<typeof JournalSummarySchema>;
export type Observation = FromSchema<typeof ObservationSchema, { references: [typeof BirdSchema, typeof LocationSchema] }>;
export type ObservationRequest = FromSchema<typeof ObservationRequestSchema, { references: [typeof BirdSchema, typeof LocationSchema] }>;
export type Habitat = FromSchema<typeof HabitatSchema>;
export type HabitatRequest = FromSchema<typeof HabitatRequestSchema>;
export type Species = FromSchema<typeof SpeciesReadSchema, { references: [typeof HabitatSchema] }>;
export type SpeciesCreate = FromSchema<typeof SpeciesRequestSchema>;
export type SpeciesSummary = FromSchema<typeof SpeciesSummarySchema>;
export type User = FromSchema<typeof UserSchema>;
export type UserRequest = FromSchema<typeof UserRequestSchema>;
export type Location = FromSchema<typeof LocationSchema>;
export type Bird = FromSchema<typeof BirdSchema>;

export interface ProblemDetailsResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors: Record<string, string>;
}
export class ApiError extends Error {
  public readonly problem: ProblemDetailsResponse;

  constructor(problem: ProblemDetailsResponse) {
    super(problem.detail);
    this.name = "ApiError";
    this.problem = problem;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get status(): number {
    return this.problem.status;
  }

  get title(): string {
    return this.problem.title;
  }

  get type(): string {
    return this.problem.type;
  }

  get detail(): string {
    return this.problem.detail;
  }

  get errors(): Record<string, string> {
    return this.problem.errors;
  }
}

export type TaxonRank = "family" | "genus" | "species";
export interface Taxon {
  taxonId: string;
  rank: TaxonRank;
  name: string;
}
export interface TaxonFamily extends Taxon {
  rank: "family";
}
export interface TaxonGenus extends Taxon {
  rank: "genus";
  familyId: string;
}
export interface TaxonSpecies extends Taxon {
  rank: "species";
  scientificName: string;
  genusId: string;
  familyId: string;
}
export interface TaxonData {
  families: TaxonFamily[];
  genera: TaxonGenus[];
  species: TaxonSpecies[];
}


