import type { Habitat } from "../types";
import { checkboxStyles } from "../styles/formStyles";

export interface HabitatsChecklistProps {
  habitats: Habitat[];
  associatedHabitats: Habitat[];
  onChange: (habitatIds: string[]) => void;
}

export default function HabitatsChecklist({
  habitats,
  associatedHabitats,
  onChange,
}: HabitatsChecklistProps) {

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {habitats.map((habitat) => (

        <label
          className={checkboxStyles.label}
          key={habitat.habitatId}
        >
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

      ))}
    </div>
  );
}
