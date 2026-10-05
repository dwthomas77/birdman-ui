import type { FromSchema } from "json-schema-to-ts";
import { CreateSpeciesSchema, ReadSpeciesSchema } from "./schemas/species.schema";
import { UserRequestSchema, UserSchema } from "./schemas/user.schema";
import { LocationSchema } from "./schemas/location.schema";

export type { FromSchema } from "json-schema-to-ts";
export { CreateSpeciesSchema, ReadSpeciesSchema } from "./schemas/species.schema";
export { UserRequestSchema, UserSchema } from "./schemas/user.schema";
export { LocationSchema } from "./schemas/location.schema";

export interface HabitatRequest {
  code: string;
  name: string;
  description?: string;
  parentHabitatId?: string;
}

export interface Habitat extends HabitatRequest {
  habitatId: string;
}

export type Species = FromSchema<typeof ReadSpeciesSchema>;
export type SpeciesCreate = FromSchema<typeof CreateSpeciesSchema>;
export type User = FromSchema<typeof UserSchema>;
export type UserRequest = FromSchema<typeof UserRequestSchema>;
export type Location = FromSchema<typeof LocationSchema>;

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
