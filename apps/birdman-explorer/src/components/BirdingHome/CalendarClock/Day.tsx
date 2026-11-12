import type { WeekDay, DayId } from "@birdman/shared-types";
import { daysData } from "@birdman/shared-data";
import { SquareArrowLeft, SquareArrowRight } from "lucide-react";

interface DayProps {
  currentDate: Date;
  setDate: (date: Date) => void;
}

const Day = ({ currentDate, setDate }: DayProps) => {
  const daysOfWeek = daysData as WeekDay[];
  const baseDayStyles = `
    flex-1
    flex
    items-center
    justify-center
    h-full
    text-center
    border border-slate-600
  `;
  const dayStyles = `${baseDayStyles} cursor-pointer hover:bg-slate-800`;

  const activeDayStyles = `
    ${baseDayStyles}
    bg-slate-700
    hover:bg-slate-700
    cursor-default
  `;

  const secondaryToolStyles = `
    text-slate-400
    hover:text-slate-300
  `;

  const activeDayOfWeek: WeekDay = daysOfWeek[currentDate.getDay()];

  const activeDayId: DayId = activeDayOfWeek.id;

  const weekStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - currentDate.getDay(),
  );
  const weekEnd = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + 6,
  );
  const calendarWeekOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex justify-between">
        <button
          className="h-full"
          onClick={() =>
            setDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() - 7,
                currentDate.getHours(),
                currentDate.getMinutes(),
              ),
            )
          }
        >
          <SquareArrowLeft className={secondaryToolStyles} />
        </button>
        <span className={`h-full text-[13px] text-slate-400`} id="calendarWeek">
          {`${weekStart.toLocaleDateString(undefined, calendarWeekOptions)} - ${weekEnd.toLocaleDateString(undefined, calendarWeekOptions)}`}
        </span>
        <button
          className="h-full text-[10px]"
          onClick={() =>
            setDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 7,
                currentDate.getHours(),
                currentDate.getMinutes(),
              ),
            )
          }
        ><SquareArrowRight className={secondaryToolStyles} /></button>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {daysOfWeek.map((d, i) => {
          const dayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + (i - currentDate.getDay()),
            currentDate.getHours(),
            currentDate.getMinutes(),
          );
          return (
            <span
              key={d.id}
              className={`relative ${d.id === activeDayId ? activeDayStyles : dayStyles}`}
              onClick={
                d.id === activeDayId ? undefined : () => setDate(dayDate)
              }
            >
              <span className="absolute top-0.5 left-1 text-[8px] leading-none opacity-70">
                {dayDate.getDate()}
              </span>
              {d.shortName}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Day;
