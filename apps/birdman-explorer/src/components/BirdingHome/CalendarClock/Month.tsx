import { monthsData } from "@birdman/shared-data";
import type { Month as MonthType } from "@birdman/shared-types";

const months: MonthType[] = monthsData as MonthType[];

interface MonthProps {
  currentDate: Date;
  setDate: (date: Date) => void;
}

const Month = ({ currentDate, setDate }: MonthProps) => {
  return (
    <>
      <div className="relative h-full flex items-center justify-center">
        <div className="absolute top-0 right-0 flex gap-1">
        <button
          className="h-full text-[10px] mb-1 pl-2"
          onClick={() =>
            currentDate.getMonth() > 0 &&
            setDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                currentDate.getDate(),
                currentDate.getHours(),
                currentDate.getMinutes(),
              ),
            )
          }
        >{`<--`}</button>
        <button
          className="h-full text-[10px] mb-1 pl-2"
          onClick={() =>
            currentDate.getMonth() < 11 &&
            setDate(
              new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                currentDate.getDate(),
                currentDate.getHours(),
                currentDate.getMinutes(),
              ),
            )
          }
        >{`-->`}</button>
        </div>
        <div className="flex items-center justify-center">
          {months.find((m) => m.order === currentDate.getMonth() + 1)?.name}
        </div>
      </div>
    </>
  );
};

export default Month;
