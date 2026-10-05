import type { Habitat, Location } from "@birdman/shared-types";
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

function getHabitatLevel(
  habitat: Habitat,
  habitatsById: Map<string, Habitat>,
): number {
  let level = 1;
  let parentId = habitat.parentHabitatId;
  const visited = new Set([habitat.habitatId]);

  while (parentId) {
    if (visited.has(parentId)) {
      throw new Error(`Habitat hierarchy contains a cycle at ${parentId}.`);
    }

    visited.add(parentId);
    const parent = habitatsById.get(parentId);
    if (!parent) {
      break;
    }

    level += 1;
    parentId = parent.parentHabitatId;
  }

  return level;
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

  const habitats = await getHabitats();
  const habitatsById = new Map(
    habitats.map((habitat) => [habitat.habitatId, habitat]),
  );
  const eligibleHabitats = habitats.filter(
    (habitat) =>
      (parentId === undefined || habitat.parentHabitatId === parentId) &&
      (level === undefined ||
        getHabitatLevel(habitat, habitatsById) === level),
  );

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
