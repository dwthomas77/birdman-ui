import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { Habitat } from "@birdman/shared-types";
import { LoadingSpinner } from "@birdman/shared-ui";
import { getHabitat } from "../api/birdApi";

export default function HabitatDetailPage() {
  const { habitatId } = useParams({ from: "/habitats/$habitatId" });
  const { data: habitat, isPending, error } = useQuery<Habitat>({
    queryKey: ["habitat", habitatId],
    queryFn: () => getHabitat(habitatId),
  });

  if (isPending) {
    return <LoadingSpinner label="Loading habitat" className="text-slate-400" />;
  }
  if (error) {
    return (
      <p role="alert" className="text-red-300">
        Unable to load habitat: {error.message}
      </p>
    );
  }
  if (!habitat) {
    return <p role="alert">Habitat was not found.</p>;
  }

  return (
    <article>
      <Link
        to="/habitats"
        className="text-sm text-emerald-300 hover:text-emerald-200"
      >
        &larr; All habitats
      </Link>
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Habitat {habitat.code}
      </p>
      <h1 className="mt-2 text-4xl font-bold">{habitat.name}</h1>
      {habitat.description ? (
        <p className="mt-5 max-w-3xl whitespace-pre-wrap leading-7 text-slate-300">
          {habitat.description}
        </p>
      ) : (
        <p className="mt-5 text-slate-400">
          More information about this habitat is not available yet.
        </p>
      )}
    </article>
  );
}
