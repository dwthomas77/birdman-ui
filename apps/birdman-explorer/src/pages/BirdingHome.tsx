import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUsers } from "../api/birdApi";
import { Modal, DropdownSelect } from "@birdman/shared-ui";
import { useUser } from "../context/user.context";
import type { User } from "@birdman/shared-types";
import { getHomeLocation } from "../services/locationService";
import {
  HomeWindow,
  Journals,
  BirdingLocation,
  CalendarClock,
} from "../components/BirdingHome";

const BirdingHome = () => {
  const [activeJournalId, setActiveJournalId] = useState<string | null>(null);
  const [currentTimestamp, setCurrentTimestamp] = useState<string>(new Date().toISOString()); // ISO8601
  const { user, setUser } = useUser();
  console.log(user);
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const [currentLocation, setCurrentLocation] = useState(getHomeLocation(user?.displayName || "User"));

  useEffect(() => {
    if (!users) return;
    const preferredUserId =
      "4926842444d149e0291b23531b5886ec269009c6dca04dfe435e50ca41cc27ed";
    setUser(users.find((u) => u.userId === preferredUserId) ?? null);
    setCurrentLocation(getHomeLocation(user?.displayName || "User")); // eslint-disable-line react-hooks/set-state-in-effect
  }, [users, setUser, user?.displayName]);

  if (!user) {
    return (
      <Modal
        isOpen
        contentLabel="Select a birder"
        className="fixed left-1/2 top-1/2 w-[min(90vw,24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-xl"
      >
        <h2 className="mb-4 text-lg font-semibold">
          Select a birder to continue
        </h2>
        <DropdownSelect<User>
          data={users}
          dataId="userId"
          inputId="birding-home-user-select"
          getOptionLabel={(u) => u.displayName}
          placeholder="Select a birder"
          onSelect={(userId) =>
            setUser(users.find((u) => u.userId === userId) ?? null)
          }
        />
      </Modal>
    );
  }

  return (
    <div className="flex h-[calc(100vh-50px)] gap-2 p-2 bg-slate-800">
      {/* Left Panel */}
      <div className="h-full w-[20%] min-w-[100px] max-w-[200px]">
        <div className="pt-[75px]">
          <Journals
            userId={user.userId}
            activeJournalId={activeJournalId}
            setActiveJournalId={setActiveJournalId}
          />
        </div>
      </div>

      {/* Center Panel */}
      <div className="flex h-full flex-1 flex-col">
        <div className="h-[75px] shrink-0">
          <CalendarClock currentTimestamp={currentTimestamp} setTimestamp={setCurrentTimestamp} />
        </div>

        <div className="min-h-0 flex-1 flex">
          <div className="flex-1 rounded-3xl border border-gray-700 h-full mt-2 p-2 bg-slate-950">
            <HomeWindow user={user} />
          </div>
        </div>

        <div className="h-[100px] shrink-0">
          
        </div>
      </div>

      {/* Right Panel */}
      <div className="h-full w-[20%] min-w-[150px] max-w-[300px]">
        <BirdingLocation currentLocation={currentLocation} currentDate={new Date(currentTimestamp)} />
      </div>
    </div>
  );
};

export default BirdingHome;
