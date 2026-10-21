import { useQuery, useMutation } from "@tanstack/react-query";
import { LoadingSpinner, useToast } from "@birdman/shared-ui";
import type { Bird, ObservationRequest } from "@birdman/shared-types";
import { getBird, createObservation } from "../api/birdApi";

const formatMeasure = (value?: number) =>
  value === undefined ? "Unknown" : value.toFixed(1);

interface ObserveBirdContentProps {
  journalId: string;
  habitatId: string;
  locationName: string;
  onClose: () => void;
}

export default function ObserveBirdContent({
  journalId,
  habitatId,
  locationName,
  onClose,
}: ObserveBirdContentProps) {
  const { addToast } = useToast();
  const {
    data: bird,
    isPending,
    error,
  } = useQuery<Bird>({
    queryKey: ["observed-bird", { habitatId }],
    queryFn: () => getBird({ habitatId }),
    gcTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const mutation = useMutation({
    mutationFn: (observation: ObservationRequest) =>
      createObservation(observation),
    onSuccess: () => {
      onClose();
      addToast("Observation recorded successfully.", {
        type: "success",
        duration: 3500,
      });
    },
  });

  const handleRecordObservation = (bird: Bird) => {
    const observation: ObservationRequest = {
      journalId,
      bird,
      observedAt: new Date().toISOString(),
      quantity: 1,
      notes: "",
      location: {
        name: locationName,
        habitatId,
      },
    };
    mutation.mutate(observation);
  };

  const hasRequestError = Boolean(error) || mutation.isError;

  return (
    <div className="flex flex-col gap-4 py-2">
      <h2 className="text-xl font-bold">Observe a Bird</h2>
      {!bird || isPending ? (
        <LoadingSpinner label="Loading bird" className="py-4" />
      ) : hasRequestError ? (
        <>
          <p role="alert" className="text-red-300">
            Didn&apos;t find any birds here
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-700 px-3 py-2 text-slate-100 hover:border-emerald-500"
            >
              Return to Birding
            </button>
          </div>
        </>
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
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-slate-700 px-3 py-2 text-slate-100 hover:border-emerald-500"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => handleRecordObservation(bird)}
              disabled={mutation.isPending}
              className="rounded bg-emerald-500 px-3 py-2 font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Record Observation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
