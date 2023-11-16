import React, { useEffect, useState } from 'react';
import './Calender.css';
import dayjs from 'dayjs';
import type { CalenderList } from '../modules/notion';
import Spinner from '../components/icons/Spinner';
import Refresh from '../components/icons/Refresh';

interface DayItem {
  key: string;
  dayjs: dayjs.Dayjs;
  day: number;
  date: string;
  month: number;
  isCurrentMonth: boolean;
  year: number;
}

function Calender() {
  const [loading, setLoading] = useState<boolean>(false);
  const [days, setDays] = useState<DayItem[]>([]);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState<dayjs.Dayjs | null>(null);
  const [calenders, setCalenders] = useState<CalenderList | null>(null);
  const [today, setToday] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getCalenderList();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const days: DayItem[] = [];
    const firstDayOfMonth = dayjs().startOf('month');
    setFirstDayOfMonth(firstDayOfMonth);
    const lastDayOfWeekOfMonth = dayjs().endOf('month').endOf('week');
    let cur = firstDayOfMonth.clone().startOf('week');
    while (cur.isBefore(lastDayOfWeekOfMonth)) {
      days.push({
        key: cur.format('YYYY-MM-DD'),
        dayjs: cur,
        date: cur.format('DD'),
        day: cur.day(),
        month: cur.month(),
        isCurrentMonth: cur.month() === firstDayOfMonth.month(),
        year: cur.year(),
      });
      cur = cur.add(1, 'day');
    }

    setDays(days);
  }, []);

  async function getCalenderList() {
    if (loading) return;

    try {
      setLoading(true);
      const calenders = await window.electron.getCalender();

      setToday(dayjs());
      setCalenders(calenders);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCalenderList();
  }, []);

  function calcClassNames(day: DayItem) {
    const classNames: Record<string, boolean> = {
      'h-32': true,
      'bg-white': true,
      'bg-opacity-50': true,
      rounded: true,
      'py-2': true,
      'px-2': true,
      'text-black': true,
      'font-bold': true,
      flex: true,
      'flex-col': true,
    };

    if (!day.isCurrentMonth) {
      classNames['bg-opacity-50'] = false;

      classNames['bg-opacity-25'] = true;
    }

    if (day.day === 0) {
      classNames['text-black'] = false;

      classNames['text-red-700'] = true;
    } else if (day.day === 6) {
      classNames['text-black'] = false;

      classNames['text-blue-600'] = true;
    }

    return Object.keys(classNames)
      .filter(key => classNames[key])
      .join(' ');
  }

  return (
    <div className="p-5">
      {firstDayOfMonth != null && (
        <div className="text-center font-bold text-2xl text-white mb-5 tracking-wider">
          {firstDayOfMonth.year()}-{firstDayOfMonth.month() + 1}
          <button className="inline-flex justify-center items-center h-8 w-8 bg-blue-500 text-white ml-3" onClick={getCalenderList}>
            {loading ? (<Spinner></Spinner>) : <Refresh></Refresh>}
          </button>
        </div>
      )}
      {calenders != null && (
        <div className="grid grid-cols-7 gap-2 justify-center text-white">
          {days.map(day => (
            <div key={day.key} className={calcClassNames(day)}>
              <div className="flex items-baseline">
                {day.dayjs.isSame(today, 'date') ? <span className="text-xs bg-orange-700 text-white py-1 px-2 rounded-full ml-1">{day.date}</span> : day.date}
                {/* {day.dayjs.isSame(today, 'date') ? <span className="text-xs bg-blue-700 text-white py-1 px-2 rounded-full ml-1">오늘</span> : null} */}
              </div>
              <div className="font-normal text-black flex-grow overflow-y-auto">
                {day.key in calenders &&
                  calenders[day.key].map((calender, index) => (
                    <a
                      key={index}
                      href={calender.url.replace('https', 'notion')}
                      className="block group mb-2 p-1 transition-colors rounded-lg hover:bg-opacity-50 hover:bg-white"
                    >
                      <div className="text-xs font-bold w-full overflow-hidden text-ellipsis whitespace-nowrap transition-colors group-hover:text-blue-700">
                        {calender.title}
                      </div>
                      <div className="text-xs">{calender.category}</div>
                      <div className="text-xs text-blue-700">{calender.progress * 100}%</div>
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calender;
