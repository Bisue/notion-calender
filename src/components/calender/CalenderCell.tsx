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
        {today ? <span className="text-xs bg-orange-700 text-white py-1 px-2 rounded-full ml-1">{displayDate}</span> : <span>{displayDate}</span>}
      </div>
      <div className="font-normal text-black flex-grow overflow-y-auto">
        {todos.map((calender, index) => (
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
  );
};

export default CalenderCell;
