import type { AddHabitatFormProps } from "./components/AddHabitatForm";

export type ModalContentType =
    | "addHabitat"
    | "updateHabitat"
    | "addSpecies"
    | "updateSpecies"
    | "addUser"
    | "updateUser"
    | undefined;

export type ModalOptions = {
    content: ModalContentType;
    options?: AddHabitatFormProps | undefined;
    onSuccess?: () => void;
    mode?: "add" | "update";
    userId?: string;
};
