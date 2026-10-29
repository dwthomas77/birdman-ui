import { useState } from "react";

type Unit = "hours" | "minutes";

const MAX: Record<Unit, number> = { hours: 23, minutes: 59 };

const Clock = ({
  currentDate,
  setDate,
}: {
  currentDate: Date;
  setDate: (date: Date) => void;
}) => {
  const [editing, setEditing] = useState<Unit | null>(null);
  const [draft, setDraft] = useState("");

  const values: Record<Unit, number> = {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
  };
  const pad = (n: number) => n.toString().padStart(2, "0");

  const startEdit = (unit: Unit) => {
    setDraft(pad(values[unit]));
    setEditing(unit);
  };

  const commit = (unit: Unit) => {
    setEditing(null);
    if (draft === "") return;
    const value = Math.min(parseInt(draft, 10), MAX[unit]);
    const next = new Date(currentDate);
    if (unit === "hours") next.setHours(value);
    else next.setMinutes(value);
    setDate(next);
  };

  const renderBlock = (unit: Unit) =>
    editing === unit ? (
      <input
        autoFocus
        className="w-10"
        //style={{ width: "25px" }}
        inputMode="numeric"
        maxLength={2}
        value={draft}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, "").slice(0, 2))}
        onBlur={() => commit(unit)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") setEditing(null);
        }}
      />
    ) : (
      <div className="cursor-pointer" onClick={() => startEdit(unit)}>
        {pad(values[unit])}
      </div>
    );

  return (
    <div className="flex-1 flex items-center justify-center h-full">
      <div className="w-7 text-right">{renderBlock("hours")}</div>
      <div className="w-[8px] text-center">:</div>
      <div className="w-7 text-left">{renderBlock("minutes")}</div>
    </div>
  );
};

export default Clock;
