import type { AddHabitatFormProps } from "./components/AddHabitatForm";
import type { AddUpdateHabitatFormProps } from "./components/AddUpdateHabitatForm";
import type { AddSpeciesFormProps } from "./components/CreateUpdateSpeciesForm";
import type { UsersCreateUpdateFormProps } from "./components/UsersCreateUpdateForm";

export type ModalContentType =
    | "addHabitat"
    | "updateHabitat"
    | "addSpecies"
    | "updateSpecies"
    | "addUser"
    | "updateUser";

export type ModalFormOptions =
    | AddHabitatFormProps
    | AddUpdateHabitatFormProps
    | AddSpeciesFormProps
    | UsersCreateUpdateFormProps;

export type ModalOptions = {
    content: ModalContentType | undefined;
} & ModalFormOptions;
