import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@birdman/shared-ui";
import type { Bird } from "@birdman/shared-types";
import { getBird } from "../api/birdApi";

const formatMeasure = (value?: number) =>
  value === undefined ? "Unknown" : value.toFixed(1);

export default function ObserveBirdContent() {
  const { data: bird, isPending, error } = useQuery<Bird>({
    queryKey: ["observed-bird"],
    queryFn: getBird,
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col gap-4 py-2">
      <h2 className="text-xl font-bold">Observe a Bird</h2>
      {isPending ? (
        <LoadingSpinner label="Loading bird" className="py-4" />
      ) : error ? (
        <p role="alert" className="text-red-300">
          Unable to load bird: {error.message}
        </p>
      ) : (
        <div>
          <p className="text-2xl font-semibold text-emerald-300">
            {bird.localeName}
          </p>
          <p className="mb-4 italic text-slate-300">
            {bird.genus} {bird.speciesName}
          </p>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            <dt className="text-slate-400">Family</dt>
            <dd>{bird.family}</dd>
            <dt className="text-slate-400">Sex</dt>
            <dd className="capitalize">{bird.sex ?? "Unknown"}</dd>
            <dt className="text-slate-400">Length</dt>
            <dd>{formatMeasure(bird.length)}</dd>
            <dt className="text-slate-400">Wingspan</dt>
            <dd>{formatMeasure(bird.wingspan)}</dd>
            <dt className="text-slate-400">Weight</dt>
            <dd>{formatMeasure(bird.weight)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
