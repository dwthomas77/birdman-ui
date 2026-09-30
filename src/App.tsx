import "./App.css";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HabitatTable from "./components/HabitatsTable";
import SpeciesTable  from "./components/SpeciesTable";
import Header from "./components/Header";
import type { HeaderTab } from "./components/Header";
import { ToastProvider } from "./components/ToastProvider";
import Modal from "./components/Modal";
import type { ModalContentType, ModalOptions } from "./types";

const queryClient = new QueryClient();

function App() {
  const [activeTab, setActiveTab] = useState<HeaderTab>("habitats");
  const [modalContentType, setModalContentType] =
    useState<ModalContentType>(undefined);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({
    content: undefined,
    options: undefined,
  });

  const openModal = ({
    contentType,
    options = { content: undefined, options: undefined },
  }: {
    contentType: ModalContentType;
    options?: ModalOptions;
  }) => {
    setModalContentType(contentType);
    setModalOptions(options);
  };

  const closeModal = () => {
    setModalContentType(undefined);
    setModalOptions({ content: undefined, options: undefined });
  };

  const footerHeight = 25;
  const headerHeight = 49;

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <div
          className="overflow-y-auto"
          style={{
            height: `calc(100vh - ${footerHeight}px - ${headerHeight}px)`,
          }}
        >
          <div
            className={
              activeTab === "habitats" ? "block h-full p-4" : "hidden"
            }
          >
            <HabitatTable
              addHabitatClickHandler={() =>
                openModal({
                  contentType: "addHabitat",
                  options: {
                    onSuccess: closeModal,
                    content: undefined,
                  },
                })
              }
              updateHabitatClickHandler={(habitatId) =>
                openModal({
                  contentType: "updateHabitat",
                  options: {
                    habitatId,
                    onSuccess: closeModal,
                    content: undefined,
                  } as ModalOptions,
                })
              }
            />
          </div>

          <div
            className={activeTab === "species" ? "block h-full p-4" : "hidden"}
          >
            <SpeciesTable
              addSpeciesClickHandler={() =>
                openModal({
                  contentType: "addSpecies",
                  options: {
                    onSuccess: closeModal,
                    content: undefined,
                  },
                })
              }
              updateSpeciesClickHandler={(speciesId) =>
                openModal({
                  contentType: "updateSpecies",
                  options: {
                    updateSpeciesId: speciesId,
                    mode: "update",
                    onSuccess: closeModal,
                    content: undefined,
                  } as ModalOptions,
                })
              }
            />
          </div>
        </div>
        <div id="footer" style={{ height: `${footerHeight}px` }}></div>
        <Modal content={modalContentType} options={modalOptions} />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
