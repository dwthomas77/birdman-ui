import type { FromSchema } from "json-schema-to-ts";
import type { AddHabitatFormProps } from "./components/AddHabitatForm";
import { CreateSpeciesSchema, ReadSpeciesSchema } from './schema/species.schema.js';
import { UserRequestSchema, UserSchema } from "./schema/user.schema.js";
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
export interface ProblemDetailsResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    errors: Record<string, string>;
}

export type ModalContentType =
    | "addHabitat"
    | "updateHabitat"
    | "addSpecies"
    | "updateSpecies"
    | "addUser"
    | "updateUser"
    | undefined;

interface ModalFormProps {
    onSuccess?: () => void;
    onRequestClose?: () => void;
}

interface UpdateHabitatFormProps extends ModalFormProps {
    habitatId: string;
}
interface UpdateSpeciesFormProps extends ModalFormProps {
    speciesId: string;
}
export type ModalOptions = {
    content: ModalContentType;
    options?: UpdateHabitatFormProps | UpdateSpeciesFormProps | AddHabitatFormProps | undefined;
    onSuccess?: () => void;
    mode?: "add" | "update";
    userId?: string;
};

export type FetchJsonType = Habitat | Species | ProblemDetailsResponse | undefined;