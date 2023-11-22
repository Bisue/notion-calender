import type { CalenderItem } from '@/modules/notion';
import type { Dayjs } from 'dayjs';
import type { FC } from 'react';

export interface CalenderCellProps {
  date: Dayjs;
  thisMonth: boolean;
  today: boolean;
  todos: CalenderItem[];
}

const CalenderCell: FC<CalenderCellProps> = ({ date, thisMonth, today, todos }) => {
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

  if (!thisMonth) {
    classNames['bg-opacity-50'] = false;

    classNames['bg-opacity-25'] = true;
  }

  if (date.day() === 0) {
    classNames['text-black'] = false;

    classNames['text-red-700'] = true;
  } else if (date.day() === 6) {
    classNames['text-black'] = false;

    classNames['text-blue-600'] = true;
  }

  const className = Object.keys(classNames)
    .filter(key => classNames[key])
    .join(' ');

  const displayDate = date.format('DD');

  return (
    <div className={className}>
      <div className="flex items-baseline">
        {today ? <span className="ml-1 rounded-full bg-orange-700 px-2 py-1 text-xs text-white">{displayDate}</span> : <span>{displayDate}</span>}
      </div>
      <div className="grow overflow-y-auto font-normal text-black">
        {todos.map((calender, index) => (
          <a key={index} href={calender.url.replace('https', 'notion')} className="group mb-2 block rounded-lg p-1 transition-colors hover:bg-white/50">
            <div className="w-full truncate text-xs font-bold transition-colors group-hover:text-blue-700">{calender.title}</div>
            <div className="text-xs">
              <span className="my-1 inline-block rounded p-1 font-bold text-white" style={{ backgroundColor: calender.color }}>
                {calender.category}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-500/50">
              <div className="h-full rounded-full bg-blue-700/50" style={{ width: `${calender.progress * 100}%` }}></div>
            </div>
            <div className="text-xs text-blue-700">{calender.progress * 100}%</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CalenderCell;
