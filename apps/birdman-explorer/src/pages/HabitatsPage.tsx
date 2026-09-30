import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, LoadingSpinner } from "@birdman/shared-ui";
import type { Habitat } from "@birdman/shared-types";
import { getHabitats } from "../api/birdApi";

export default function HabitatsPage() {
  const { data: habitats = [], isPending, error } = useQuery<Habitat[]>({
    queryKey: ["habitats"],
    queryFn: getHabitats,
  });

  return (
    <section>
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Explore the wild
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">Habitats</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Discover the landscapes birds call home.
        </p>
      </div>
      {isPending ? (
        <LoadingSpinner label="Loading habitats" className="text-slate-400" />
      ) : error ? (
        <p role="alert" className="text-red-300">
          Unable to load habitats: {error.message}
        </p>
      ) : habitats.length === 0 ? (
        <p className="text-slate-400">No habitats are available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habitats.map((habitat) => (
            <Card
              key={habitat.habitatId}
              className="border-slate-800 bg-slate-900 p-5 transition hover:border-emerald-500/70 hover:bg-slate-900/80"
            >
              <Link
                to="/habitats/$habitatId"
                params={{ habitatId: habitat.habitatId }}
                className="block"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  {habitat.code}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {habitat.name}
                </h2>
                {habitat.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-slate-400">
                    {habitat.description}
                  </p>
                )}
              </Link>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
