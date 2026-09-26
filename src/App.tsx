import "./App.css";
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HabitatList from "./components/HabitatsList";
import SpeciesList from "./components/SpeciesList";
import { Card } from "./components/atomic";
import { ToastProvider } from "./components/ToastProvider";
import Modal from "./components/Modal";
import type { ModalContentType, ModalOptions } from "./types";

const queryClient = new QueryClient();

function App() {
  const [modalContentType, setModalContentType] = useState<ModalContentType>(undefined);
  const [modalOptions, setModalOptions] = useState<ModalOptions>({content: undefined, options: undefined});

  const openModal = ({
    contentType,
    options = {content: undefined, options: undefined},
  }: {
    contentType: ModalContentType;
    options?: ModalOptions;
  }) => {
    setModalContentType(contentType);
    setModalOptions(options);
  };

  const closeModal = () => {
    setModalContentType(undefined);
    setModalOptions({content: undefined, options: undefined});
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex">
          {/* <Card>
            <AddHabitatForm />
          </Card> */}
          <Card>
            <HabitatList
              addHabitatClickHandler={() => openModal({contentType: "addHabitat", options: {
                onSuccess: closeModal,
                content: undefined
              }})}
              updateHabitatClickHandler={(habitatId) => openModal({
                contentType: "updateHabitat",
                options: { habitatId, onSuccess: closeModal, content: undefined } as ModalOptions,
              })}
            />
          </Card>
          <Card>
            {/* <SpeciesList
              addSpeciesClickHandler={() => openModal({contentType: "addSpecies", options: {
                onSuccess: closeModal,
                content: undefined
              }})}
              updateSpeciesClickHandler={(speciesId) => openModal({
                contentType: "updateSpecies",
                options: { updateSpeciesId: speciesId, mode: "update", onSuccess: closeModal, content: undefined } as ModalOptions,
              })}
            /> */}
          </Card>
        </div>
        <Modal
          content={modalContentType}
          options={modalOptions}
        />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
