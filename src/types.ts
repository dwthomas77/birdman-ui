import type { FromSchema } from "json-schema-to-ts";
import type { AddHabitatFormProps } from "./components/AddHabitatForm";
import { CreateSpeciesSchema, ReadSpeciesSchema } from './schema/species.schema.js';

export interface Habitat {
    habitatId: string;
    habitatName: string;
    habitatDescription: string;
}

export type Species = FromSchema<typeof ReadSpeciesSchema>;
export type CreateSpecies = FromSchema<typeof CreateSpeciesSchema>;
export interface ProblemDetailsResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    errors: Record<string, string>;
}

export type ModalContentType = "addHabitat" | "updateHabitat" | undefined;

interface ModalFormProps {
    onSuccess?: () => void;
    onRequestClose?: () => void;
}

interface UpdateHabitatFormProps extends ModalFormProps {
    habitatId: string;
}

export type ModalOptions = {
    content: ModalContentType;
    options?: UpdateHabitatFormProps | AddHabitatFormProps | undefined;
    onSuccess?: () => void;
};

export type FetchJsonType = Habitat | Species | ProblemDetailsResponse | undefined;