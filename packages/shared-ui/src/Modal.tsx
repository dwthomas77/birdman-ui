import type { ReactNode } from "react";
import ReactModal from "react-modal";

export interface ModalProps {
  isOpen: boolean;
  onRequestClose?: ReactModal.Props["onRequestClose"];
  contentLabel: string;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
}

ReactModal.setAppElement("#root");

export default function Modal({
  isOpen,
  onRequestClose,
  contentLabel,
  children,
  className = "",
  overlayClassName = "",
}: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      className={
        className ||
        "fixed left-1/2 top-1/2 max-h-[80vh] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-400 bg-surface p-4 text-slate-900 shadow-xl dark:bg-gray-700 dark:text-white"
      }
      overlayClassName={
        overlayClassName || "fixed inset-0 bg-black/50 backdrop-blur-sm"
      }
    >
      {children}
    </ReactModal>
  );
}
