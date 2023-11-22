import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Spinner from '@/components/icons/Spinner';
import Refresh from '@/components/icons/Refresh';
import CalenderCell from '@/components/calender/CalenderCell';
import type { FC } from 'react';
import type { CalenderList } from '@/modules/notion';
import './CalenderPage.css';

interface DayItem {
  key: string;
  today: boolean;
  dayjs: dayjs.Dayjs;
  thisMonth: boolean;
}

function buildCalenderDates(today: dayjs.Dayjs) {
  const days: DayItem[] = [];
  const firstDayOfMonth = today.startOf('month');
  const lastDayOfWeekOfMonth = today.endOf('month').endOf('week');

  let cur = firstDayOfMonth.clone().startOf('week');
  while (cur.isBefore(lastDayOfWeekOfMonth)) {
    days.push({
      key: cur.format('YYYY-MM-DD'),
      today: cur.isSame(today, 'date'),
      dayjs: cur,
      thisMonth: cur.month() === firstDayOfMonth.month(),
    });
    cur = cur.add(1, 'day');
  }

  return {
    days,
    firstDayOfMonth,
  };
}

const CalenderPage: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [calenders, setCalenders] = useState<CalenderList | null>(null);

  const today = dayjs();
  const { days, firstDayOfMonth } = buildCalenderDates(today);

  async function getCalenderList() {
    if (loading) return;

    try {
      setLoading(true);
      const calenders = await window.electron.getCalender();

      setCalenders(calenders);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCalenderList();
    const intervalId = setInterval(() => {
      getCalenderList();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-5">
      <div className="mb-5 text-center text-2xl font-bold tracking-wider text-white">
        {firstDayOfMonth.year()}-{firstDayOfMonth.month() + 1}
        <button className="ml-3 inline-flex h-8 w-8 items-center justify-center bg-blue-500 text-white" onClick={getCalenderList}>
          {loading ? <Spinner></Spinner> : <Refresh></Refresh>}
        </button>
      </div>
      {calenders != null && (
        <div className="grid grid-cols-7 justify-center gap-2 text-white">
          {days.map(day => (
            <CalenderCell key={day.key} date={day.dayjs} thisMonth={day.thisMonth} today={day.today} todos={day.key in calenders ? calenders[day.key] : []} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CalenderPage;
