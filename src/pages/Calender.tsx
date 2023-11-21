import React, { useEffect, useState } from 'react';
import './Calender.css';
import dayjs from 'dayjs';
import type { CalenderList } from '@/modules/notion';
import Spinner from '@/components/icons/Spinner';
import Refresh from '@/components/icons/Refresh';
import CalenderCell from '@/components/icons/calender/CalenderCell';

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

const Calender: React.FC = () => {
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
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-5">
      <div className="text-center font-bold text-2xl text-white mb-5 tracking-wider">
        {firstDayOfMonth.year()}-{firstDayOfMonth.month() + 1}
        <button className="inline-flex justify-center items-center h-8 w-8 bg-blue-500 text-white ml-3" onClick={getCalenderList}>
          {loading ? <Spinner></Spinner> : <Refresh></Refresh>}
        </button>
      </div>
      {calenders != null && (
        <div className="grid grid-cols-7 gap-2 justify-center text-white">
          {days.map(day => (
            <CalenderCell key={day.key} date={day.dayjs} thisMonth={day.thisMonth} today={day.today} todos={day.key in calenders ? calenders[day.key] : []} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Calender;
