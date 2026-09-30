import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, LoadingSpinner } from "@birdman/shared-ui";
import type { Species } from "@birdman/shared-types";
import { getSpecies } from "../api/birdApi";

export default function SpeciesPage() {
  const { data: species = [], isPending, error } = useQuery<Species[]>({
    queryKey: ["species"],
    queryFn: getSpecies,
  });

  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Meet your neighbors
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Bird species</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Get to know the birds that share our world.
        </p>
      </div>
      {isPending ? (
        <LoadingSpinner label="Loading species" className="text-slate-400" />
      ) : error ? (
        <p role="alert" className="text-red-300">
          Unable to load species: {error.message}
        </p>
      ) : species.length === 0 ? (
        <p className="text-slate-400">No species are available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {species.map((bird) => (
            <Card
              key={bird.speciesId}
              className="border-slate-800 bg-slate-900 p-5 transition hover:border-emerald-500/70 hover:bg-slate-900/80"
            >
              <Link
                to="/species/$speciesId"
                params={{ speciesId: bird.speciesId }}
                className="block"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {bird.family}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {bird.localeName}
                </h2>
                <p className="mt-1 italic text-slate-300">{bird.speciesName}</p>
                <p className="mt-3 text-sm text-slate-400">Genus {bird.genus}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
