import { createContext, useContext } from "react";
import type { ModalContentType, ModalFormOptions } from "../types";

export interface AdminModalContextValue {
  openModal: (contentType: ModalContentType, options?: ModalFormOptions) => void;
  closeModal: () => void;
}

export const AdminModalContext = createContext<AdminModalContextValue | null>(
  null,
);

export function useAdminModal(): AdminModalContextValue {
  const context = useContext(AdminModalContext);
  if (!context) {
    throw new Error("useAdminModal must be used inside the Admin shell.");
  }
  return context;
}
