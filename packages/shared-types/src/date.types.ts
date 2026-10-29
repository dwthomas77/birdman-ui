type DayId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type MonthId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type CalendarDate = {
  month: MonthId;
  dayOfMonth: number;
};

interface WeekDay {
  id: DayId;
  name: string;
  shortName: string;
}

interface Month {
  id: MonthId;
  name: string;
  shortName: string;
  firstDayId: DayId;
  lastDate: number;
  order: number;
}

export type { WeekDay, DayId, Month, MonthId, CalendarDate };