import type { Habitat } from "../types";
import { checkboxStyles } from "../styles/formStyles";

export interface HabitatsChecklistProps {
  habitats: Habitat[];
  associatedHabitats: Habitat[];
  onHabitatChange: (habitatId: string, isChecked: boolean) => void;
}

export default function HabitatsChecklist({
  habitats,
  associatedHabitats,
  onHabitatChange,
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
            defaultChecked={associatedHabitats.some(
              (associatedHabitat) =>
                associatedHabitat.habitatId === habitat.habitatId,
            )}
            onChange={(event) =>
              onHabitatChange(habitat.habitatId, event.target.checked)
            }
          />
          <span className={checkboxStyles.labelContent}>{habitat.habitatName}</span>
        </label>

      ))}
    </div>
  );
}

