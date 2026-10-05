import { useQuery } from "@tanstack/react-query";
import { Card, LoadingSpinner } from "@birdman/shared-ui";
import type { Location } from "@birdman/shared-types";
import { getRandomLocations } from "../services/locationService";

interface RandomLocationsProps {
  userId: string;
}

export default function RandomLocations({ userId }: RandomLocationsProps) {
  const { data, isFetching, error, refetch } = useQuery<Location[]>({
    queryKey: ["random-locations", userId],
    queryFn: () => getRandomLocations({ count: 3 }),
    staleTime: Infinity,
  });

  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Suggested locations</h2>
        {/* Temporary: remove once locations are chosen by other means */}
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded border border-slate-700 px-3 py-1 text-sm text-slate-100 hover:border-emerald-500 disabled:opacity-50"
        >
          Refresh locations
        </button>
      </div>
      {isFetching && !data ? (
        <LoadingSpinner label="Loading locations" className="text-slate-400" />
      ) : error ? (
        <p role="alert" className="text-red-300">
          Unable to load locations: {error.message}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((location, index) => (
            <Card
              key={`${location.habitatId}-${index}`}
              className="border-slate-800 bg-slate-900 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Location
              </p>
              <h3 className="mt-2 text-xl font-semibold capitalize text-white">
                {location.name}
              </h3>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
