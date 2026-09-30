import { useMemo } from "react";
import type { Habitat } from "../types";
import { checkboxStyles } from "../styles/formStyles";

export interface HabitatsChecklistProps {
  habitats: Habitat[];
  associatedHabitats: Habitat[];
  onChange: (habitatIds: string[]) => void;
}

export interface NestedHabitat extends Habitat {
  children: NestedHabitat[];
}

// Builds a 3-level tree (top-level -> children -> grandchildren) from a flat, parent-referencing list.
function nestHabitats(habitats: Habitat[]): NestedHabitat[] {
  const byParentId = new Map<string | undefined, Habitat[]>();
  for (const habitat of habitats) {
    const key = habitat.parentHabitatId;
    byParentId.set(key, [...(byParentId.get(key) ?? []), habitat]);
  }

  const toNested = (habitat: Habitat, depth: number): NestedHabitat => ({
    ...habitat,
    children:
      depth >= 2
        ? []
        : (byParentId.get(habitat.habitatId) ?? []).map((child) =>
            toNested(child, depth + 1),
          ),
  });

  return (byParentId.get(undefined) ?? []).map((habitat) => toNested(habitat, 0));
}

export default function HabitatsChecklist({
  habitats,
  associatedHabitats,
  onChange,
}: HabitatsChecklistProps) {
  const nestedHabitats = useMemo(() => nestHabitats(habitats), [habitats]);

  const renderHabitat = (habitat: NestedHabitat): React.ReactNode => (
    <div key={habitat.habitatId}>
      <label className={checkboxStyles.label}>
        <input
          className={checkboxStyles.checkbox}
          type="checkbox"
          checked={associatedHabitats.some(
            (associatedHabitat) =>
              associatedHabitat.habitatId === habitat.habitatId,
          )}
          onChange={(event) =>
            onChange(
              event.target.checked
                ? [...associatedHabitats.map((h) => h.habitatId), habitat.habitatId]
                : associatedHabitats
                    .map((h) => h.habitatId)
                    .filter((id) => id !== habitat.habitatId)
            )
          }
        />
        <span className={checkboxStyles.labelContent}>{habitat.name}</span>
      </label>
      {habitat.children.length > 0 && (
        <div className="ml-4">
          {habitat.children.map((child) => renderHabitat(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-col">
      {nestedHabitats.map((habitat) => renderHabitat(habitat))}
    </div>
  );
}
