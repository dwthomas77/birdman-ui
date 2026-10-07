import { Modal as SharedModal } from "@birdman/shared-ui";
import AddHabitatForm from "./AddHabitatForm";
import AddUpdateHabitatForm from "./AddUpdateHabitatForm";
import CreateAddSpeciesForm from "./CreateUpdateSpeciesForm";
import UsersCreateUpdateForm from "./UsersCreateUpdateForm";
import JournalViewModal from "./JournalViewModal";
import type { ModalOptions } from "../types";
import type { AddHabitatFormProps } from "./AddHabitatForm";
import type { AddUpdateHabitatFormProps } from "./AddUpdateHabitatForm";
import type { AddSpeciesFormProps } from "./CreateUpdateSpeciesForm";
import type { UsersCreateUpdateFormProps } from "./UsersCreateUpdateForm";
import type { JournalViewModalProps } from "./JournalViewModal";
import { modalBaseStyles } from "../styles/modalStyles";
import { combineClassNames } from "../util";

type ModalFormProps =
  | AddHabitatFormProps
  | AddUpdateHabitatFormProps
  | AddSpeciesFormProps
  | UsersCreateUpdateFormProps
  | JournalViewModalProps
  | undefined;

function ModalComponent({ content, ...modalProps }: ModalOptions) {
  const overlayStyles = `
        fixed
        inset-0
        dark:bg-gray-900/50
        backdrop-blur-sm
    `;

  const modalStyles = combineClassNames(
    modalBaseStyles,
    `
        fixed
        top-20
        left-1/2
        -translate-x-1/2
        p-4
        m-4
        rounded-lg
        bg-surface
        dark:bg-gray-700
        dark:text-white
        border
        border-slate-400
    `,
  );

  const modalLabels: Record<string, string> = {
    addHabitat: "Add Habitat",
    updateHabitat: "Update Habitat",
    addSpecies: "Add Species",
    updateSpecies: "Update Species",
    addUser: "Add User",
    updateUser: "Update User",
    viewJournal: "Journal",
  };

  const contentLabel = content ? modalLabels[content] : "Modal";

  const ContentComponent = (modalProps: ModalFormProps) => {
    switch (content) {
      case "addHabitat":
        return <AddHabitatForm {...modalProps} />;
      case "updateHabitat":
        return <AddUpdateHabitatForm {...modalProps} />;
      case "addSpecies":
      case "updateSpecies":
        return <div><CreateAddSpeciesForm {...modalProps} /></div>;
      case "addUser":
      case "updateUser":
        return <UsersCreateUpdateForm {...modalProps} />;
      case "viewJournal":
        return <JournalViewModal {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <SharedModal
      isOpen={!!content}
      onRequestClose={modalProps.onSuccess}
      contentLabel={contentLabel}
      className={modalStyles}
      overlayClassName={overlayStyles}
    >
      {ContentComponent(modalProps as ModalFormProps)}
    </SharedModal>
  );
}

export default ModalComponent;
