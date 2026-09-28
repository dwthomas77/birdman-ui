import type { FromSchema } from "json-schema-to-ts";
import type { AddHabitatFormProps } from "./components/AddHabitatForm";
import { CreateSpeciesSchema, ReadSpeciesSchema } from './schema/species.schema.js';

export interface Habitat {
    habitatId: string;
    habitatName: string;
    habitatDescription: string;
}

export interface HabitatRequest {
    habitatName: string;
    habitatDescription: string;
}

export type Species = FromSchema<typeof ReadSpeciesSchema>;
export type SpeciesCreate = FromSchema<typeof CreateSpeciesSchema>;
export interface ProblemDetailsResponse {
    type: string;
    title: string;
    status: number;
    detail: string;
    errors: Record<string, string>;
}

export type ModalContentType = "addHabitat" | "updateHabitat" | "addSpecies" | "updateSpecies" | undefined;

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
};

export type FetchJsonType = Habitat | Species | ProblemDetailsResponse | undefined;