import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Habitat, Location } from "@birdman/shared-types";
import { getHabitats } from "../../api/birdApi";

interface ChangeLocationContentProps {
  currentLocation: Location;
  onConfirm: (location: Location) => void;
  onCancel: () => void;
}

const inputClass =
  "rounded border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100";

const ChangeLocationContent = ({
  currentLocation,
  onConfirm,
  onCancel,
}: ChangeLocationContentProps) => {
  const {
    data: habitats = [],
    isPending,
    error,
  } = useQuery<Habitat[]>({
    queryKey: ["habitats", { level: 1 }],
    queryFn: () => getHabitats({ level: 1 }),
  });
  const [habitatId, setHabitatId] = useState(currentLocation.habitatId);
  const [name, setName] = useState(currentLocation.name);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onConfirm({ habitatId, name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      <h2 className="text-xl font-bold">Change Location</h2>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">Habitat</legend>
        {isPending ? (
          <p className="text-slate-400">Loading habitats...</p>
        ) : error ? (
          <p role="alert" className="text-red-300">
            Unable to load habitats: {error.message}
          </p>
        ) : (
          habitats.map((habitat) => (
            <label
              key={habitat.habitatId}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="radio"
                name="habitat"
                value={habitat.habitatId}
                checked={habitat.habitatId === habitatId}
                onChange={() => setHabitatId(habitat.habitatId)}
              />
              {habitat.name}
            </label>
          ))
        )}
      </fieldset>
      <div className="flex flex-col gap-1">
        <label htmlFor="location-name" className="text-sm font-semibold">
          Location name
        </label>
        <input
          id="location-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className={inputClass}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-slate-700 px-3 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!habitatId || !name.trim()}
          className="rounded bg-emerald-600 px-3 py-2 font-semibold text-white disabled:opacity-50"
        >
          Confirm
        </button>
      </div>
    </form>
  );
};

export default ChangeLocationContent;
