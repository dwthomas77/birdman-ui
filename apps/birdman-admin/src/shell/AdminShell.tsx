import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import Header from "../components/Header";
import Modal from "../components/Modal";
import { AdminModalContext } from "./AdminModalContext";
import type { ModalContentType, ModalFormOptions, ModalOptions } from "../types";

export default function AdminShell() {
  const [modal, setModal] = useState<ModalOptions>({ content: undefined });

  const closeModal = () => {
    setModal({ content: undefined });
  };

  const openModal = (
    contentType: ModalContentType,
    options?: ModalFormOptions,
  ) => {
    setModal({ content: contentType, ...options });
  };

  const footerHeight = 25;
  const headerHeight = 49;

  return (
    <>
      <Header />
      <div
        className="overflow-y-auto"
        style={{
          height: `calc(100vh - ${footerHeight}px - ${headerHeight}px)`,
        }}
      >
        <AdminModalContext.Provider value={{ openModal, closeModal }}>
          <Outlet />
        </AdminModalContext.Provider>
      </div>
      <div id="footer" style={{ height: `${footerHeight}px` }} />
      <Modal {...modal} />
    </>
  );
}
