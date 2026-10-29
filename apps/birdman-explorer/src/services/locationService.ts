import type { Location } from "@birdman/shared-types";
import { getHabitats } from "../api/birdApi";

export interface RandomLocationsOptions {
  count?: number;
  level?: number;
  parentId?: string;
}

const adjectives = [
  "ancient",
  "blooming",
  "bright",
  "calm",
  "crystal",
  "dappled",
  "echoing",
  "emerald",
  "golden",
  "hidden",
  "lively",
  "misty",
  "peaceful",
  "quiet",
  "silver",
  "sunlit",
  "tranquil",
  "vibrant",
  "wild",
  "windswept",
];

export function getHomeLocation(userName: string): Location {
  const hardcodedHomeLocation: Location = {
    habitatId: "b0041a8c-8f8d-497d-bf33-35ff67dae5a9",
    name: `${userName}'s Backyard`,
  };
  return hardcodedHomeLocation;
}

export async function getRandomLocations({
  count = 10,
  level,
  parentId,
}: RandomLocationsOptions = {}): Promise<Location[]> {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("count must be a non-negative integer.");
  }
  if (level !== undefined && (!Number.isInteger(level) || level < 1)) {
    throw new RangeError("level must be a positive integer.");
  }

  const eligibleHabitats = await getHabitats({ level, parentId });

  if (count > 0 && eligibleHabitats.length === 0) {
    throw new Error("No habitats match the requested filters.");
  }

  return Array.from({ length: count }, () => {
    const habitat =
      eligibleHabitats[Math.floor(Math.random() * eligibleHabitats.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];

    return {
      habitatId: habitat.habitatId,
      name: `${adjective} ${habitat.name}`,
    };
  });
}
