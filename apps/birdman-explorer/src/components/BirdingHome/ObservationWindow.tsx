import type { User, Location } from "@birdman/shared-types";
import { Stepper } from "@birdman/shared-ui";

interface ObservationWindowProps {
  currentLocation: Location;
  currentDate: Date;
  activeJournalId: string;
  user: User;
}

const ObservationWindow = ({
  currentLocation,
  currentDate,
  activeJournalId,
  user,
}: ObservationWindowProps) => {
  const OBSERVE_STEPS = ["Pick location", "Choose species", "", "Add notes", "Save"];
  return (
    <div>
      <Stepper activeStep={2} steps={OBSERVE_STEPS} className="mb-2" />
      <div>
        Observation Window for {user.displayName} in journal {activeJournalId}{" "}
        at {currentLocation.name} on {currentDate.toLocaleDateString()}
      </div>{" "}
    </div>
  );
};

export default ObservationWindow;
