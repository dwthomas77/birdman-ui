import Month from "./Month";
import Day from "./Day";
import Clock from "./Clock";

type ISODateString = string; // ISO8601




interface CalendarClockProps {
  currentTimestamp: ISODateString; //ISO8601
  setTimestamp: (timestamp: ISODateString) => void;
}

const CalendarClock = ({ currentTimestamp, setTimestamp }: CalendarClockProps) => {
  const date = new Date(currentTimestamp);
  console.log('the active date is ', `${date.toDateString()}, ${date.getHours()}:${date.getMinutes()}`)

  const setDate = (newDate: Date) => {
    setTimestamp(newDate.toISOString());
  };

  return (
    <div className="min-h-0 flex-1 flex h-full gap-2">
      <div className="flex-2 border border-gray-700 bg-slate-900 flex flex-col">
        <Month currentDate={date} setDate={setDate} />
      </div>
      <div className="flex-6 border border-gray-700 bg-slate-900 flex items-center">
        <Day currentDate={date} setDate={setDate} />
      </div>
      <div className="flex-2 bg-slate-900">
        <Clock currentDate={date} setDate={setDate} />
      </div>
    </div>
  );
};

export default CalendarClock;