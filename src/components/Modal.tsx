import Modal from "react-modal";
import AddHabitatForm from "./AddHabitatForm";
import AddUpdateHabitatForm from "./AddUpdateHabitatForm";
import CreateAddSpeciesForm from "./CreateUpdateSpeciesForm";
import type { ModalOptions } from "../types";
import type { AddHabitatFormProps } from "./AddHabitatForm";
import type { AddUpdateHabitatFormProps } from "./AddUpdateHabitatForm";
import type { AddSpeciesFormProps } from "./CreateUpdateSpeciesForm";
import { modalBaseStyles } from "../styles/modalStyles";
import { combineClassNames } from "../util";

type ModalProps =
  | (AddHabitatFormProps & { onRequestClose?: () => void })
  | (AddUpdateHabitatFormProps & { onRequestClose?: () => void })
  | (AddSpeciesFormProps & { onRequestClose?: () => void })
  | undefined;

Modal.setAppElement("#root");

function ModalComponent({ content, options }: ModalOptions) {
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
  };

  const contentLabel = content ? modalLabels[content] : "Modal";

  const ContentComponent = (modalProps: ModalProps) => {
    switch (content) {
      case "addHabitat":
        return <AddHabitatForm {...modalProps} />;
      case "updateHabitat":
        return <AddUpdateHabitatForm {...modalProps} />;
      case "addSpecies":
      case "updateSpecies":
        return <CreateAddSpeciesForm {...modalProps} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={!!content}
      onRequestClose={options?.onSuccess}
      contentLabel={contentLabel}
      className={modalStyles}
      overlayClassName={overlayStyles}
    >
      {ContentComponent(options as ModalProps)}
    </Modal>
  );
}

export default ModalComponent;
