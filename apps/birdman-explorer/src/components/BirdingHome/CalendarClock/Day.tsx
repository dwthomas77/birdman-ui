import type { WeekDay, DayId } from "@birdman/shared-types";
import { daysData } from "@birdman/shared-data";

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
console.log('current date day', currentDate.getDay())
  const activeDayOfWeek: WeekDay = daysOfWeek[currentDate.getDay()];
  console.log('active day of week', activeDayOfWeek, daysOfWeek)
  const activeDayId: DayId = activeDayOfWeek.id;

  const weekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6);
  const calendarWeekOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };


  return (
    <div className="flex flex-col h-full flex-1">
      <div className="h-[20px] flex justify-between">
        <button className="h-full text-[10px] mb-1 pl-2" onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7, currentDate.getHours(), currentDate.getMinutes()))}>{`<--`}</button>
        <span className="h-full text-[10px] mb-1" id="calendarWeek">
          {`${weekStart.toLocaleDateString(undefined, calendarWeekOptions)} - ${weekEnd.toLocaleDateString(undefined, calendarWeekOptions)}`}
        </span>
        <button className="h-full text-[10px] mb-1 pl-2" onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7, currentDate.getHours(), currentDate.getMinutes()))}>{`-->`}</button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-1 p-1">
        {daysOfWeek.map((d, i) => {
          const dayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + (i - currentDate.getDay()),
            currentDate.getHours(),
            currentDate.getMinutes()
          );
          return (
            <span
              key={d.id}
              className={`relative ${d.id === activeDayId ? activeDayStyles : dayStyles}`}
              onClick={d.id === activeDayId ? undefined : () => setDate(dayDate)}
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