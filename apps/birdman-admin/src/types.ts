import type { AddHabitatFormProps } from "./components/AddHabitatForm";
import type { AddUpdateHabitatFormProps } from "./components/AddUpdateHabitatForm";
import type { AddSpeciesFormProps } from "./components/CreateUpdateSpeciesForm";
import type { JournalViewModalProps } from "./components/JournalViewModal";
import type { UsersCreateUpdateFormProps } from "./components/UsersCreateUpdateForm";
import type { ObservationGroupsCreateUpdateFormProps } from "./components/ObservationGroupsCreateUpdateForm";

export type ModalContentType =
    | "addHabitat"
    | "updateHabitat"
    | "addSpecies"
    | "updateSpecies"
    | "addUser"
    | "updateUser"
    | "viewJournal"
    | "addObservationGroup"
    | "updateObservationGroup";

export type ModalFormOptions =
    | AddHabitatFormProps
    | AddUpdateHabitatFormProps
    | AddSpeciesFormProps
    | UsersCreateUpdateFormProps
    | ObservationGroupsCreateUpdateFormProps
    | JournalViewModalProps;

export type ModalOptions = {
    content: ModalContentType | undefined;
} & ModalFormOptions;
