import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Species } from "@birdman/shared-types";
import { LoadingSpinner } from "@birdman/shared-ui";
import { getSpeciesById } from "../api/birdApi";

export default function SpeciesDetailPage() {
  const { speciesId } = useParams({ from: "/species/$speciesId" });
  const { data: bird, isPending, error } = useQuery<Species>({
    queryKey: ["species", speciesId],
    queryFn: () => getSpeciesById(speciesId),
  });

  if (isPending) {
    return <LoadingSpinner label="Loading species" className="text-slate-400" />;
  }
  if (error) {
    return (
      <p role="alert" className="text-red-300">
        Unable to load species: {error.message}
      </p>
    );
  }
  if (!bird) {
    return <p role="alert">Species was not found.</p>;
  }

  return (
    <article>
      <Link
        to="/species"
        className="text-sm text-emerald-300 hover:text-emerald-200"
      >
        &larr; All species
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
        {bird.family}
      </p>
      <h1 className="mt-2 text-4xl font-bold">{bird.localeName}</h1>
      <p className="mt-2 text-xl italic text-slate-300">{bird.speciesName}</p>
      <dl className="mt-8 grid max-w-xl grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-400">
            Genus
          </dt>
          <dd className="mt-1 font-medium">{bird.genus}</dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
          <dt className="text-xs uppercase tracking-wider text-slate-400">
            Family
          </dt>
          <dd className="mt-1 font-medium">{bird.family}</dd>
        </div>
      </dl>
    </article>
  );
}
