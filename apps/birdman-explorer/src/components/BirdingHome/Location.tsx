import type { Location } from "@birdman/shared-types";
interface LocationProps {
  currentLocation: Location;
  currentDate: Date;
}

const BirdingLocation = ({ currentLocation, currentDate }: LocationProps) => {
  console.log("Location component rendered");
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
      </div>
    </div>
  );
};

export default BirdingLocation;
