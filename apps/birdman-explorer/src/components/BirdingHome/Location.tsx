import { useState } from "react";
import { Modal } from "@birdman/shared-ui";
import type { Location } from "@birdman/shared-types";
import ChangeLocationContent from "./ChangeLocationContent";

interface LocationProps {
  currentLocation: Location;
  currentDate: Date;
  onLocationChange: (location: Location) => void;
}

const BirdingLocation = ({ currentLocation, currentDate, onLocationChange }: LocationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="min-h-0 flex-1 flex">
      <div className="flex-1 rounded-lg border border-gray-800 p-2 bg-slate-900">
        <div>Location</div>
        <div className="text-sm">
          {currentLocation.name}
        </div>
        <div className="text-sm">
          {`${currentDate.toDateString()} ${currentDate.getHours()}:${currentDate.getMinutes()}`}
        </div>
        <button
          type="button"
          className="mt-2 text-[12px] text-slate-300 hover:underline"
          onClick={() => setIsModalOpen(true)}
        >
          Change location
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Change Location"
        className="fixed left-1/2 top-1/2 max-h-[80vh] w-[min(90vw,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800 p-4 text-slate-100 shadow-xl"
      >
        <ChangeLocationContent
          currentLocation={currentLocation}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={(location) => {
            onLocationChange(location);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default BirdingLocation;
