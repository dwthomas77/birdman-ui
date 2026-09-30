import { useMemo, useState } from "react";
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
  // Habitats with children start collapsed; this tracks ones the user has toggled open.
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    const collect = (list: NestedHabitat[]) => {
      for (const habitat of list) {
        if (habitat.children.length > 0) {
          ids.add(habitat.habitatId);
          collect(habitat.children);
        }
      }
    };
    collect(nestedHabitats);
    return ids;
  });

  const toggleCollapsed = (habitatId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(habitatId)) {
        next.delete(habitatId);
      } else {
        next.add(habitatId);
      }
      return next;
    });
  };

  const renderHabitat = (
    habitat: NestedHabitat,
    ancestorIds: string[] = [],
  ): React.ReactNode => {
    const hasChildren = habitat.children.length > 0;
    const isCollapsed = collapsedIds.has(habitat.habitatId);

    return (
      <div key={habitat.habitatId}>
        <div className="flex items-center gap-1">
          {hasChildren && (
            <button
              type="button"
              aria-label={isCollapsed ? "Expand" : "Collapse"}
              onClick={() => toggleCollapsed(habitat.habitatId)}
              className="cursor-pointer select-none"
            >
              {isCollapsed ? "▶" : "▼"}
            </button>
          )}
          {!hasChildren && (<span style={{ width: ".8em" }} />)}
          <label className={checkboxStyles.label}>
            <input
              className={checkboxStyles.checkbox}
              type="checkbox"
              checked={associatedHabitats.some(
                (associatedHabitat) =>
                  associatedHabitat.habitatId === habitat.habitatId,
              )}
              onChange={(event) => {
                const currentIds = associatedHabitats.map((h) => h.habitatId);
                if (event.target.checked) {
                  // Checking a child also checks its ancestors up to the top level.
                  const idsToAdd = [habitat.habitatId, ...ancestorIds];
                  onChange([...new Set([...currentIds, ...idsToAdd])]);
                } else {
                  onChange(currentIds.filter((id) => id !== habitat.habitatId));
                }
              }}
            />
            <span className={checkboxStyles.labelContent}>{habitat.name}</span>
          </label>
        </div>
        {hasChildren && !isCollapsed && (
          <div className="ml-4">
            {habitat.children.map((child) =>
              renderHabitat(child, [...ancestorIds, habitat.habitatId]),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-col">
      {nestedHabitats.map((habitat) => renderHabitat(habitat))}
    </div>
  );
}
