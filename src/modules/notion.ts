import { Client } from '@notionhq/client';
import dayjs from 'dayjs';

export interface CalenderItem {
  id: string;
  url: string;
  title: string;
  date: dayjs.Dayjs;
  progress: number;
  category: string;
}

export type CalenderList = Record<string, CalenderItem[]>;

const info: { key?: string; databaseId?: string } = {};

async function setNotionInfo({ key, databaseId }: { key: string; databaseId: string }) {
  info.key = key;
  info.databaseId = databaseId;
}

async function getCalenderList() {
  if (!info.databaseId || !info.key) throw Error('Notion database id or key is not set.');

  const notion = new Client({
    auth: info.key,
  });
  const databaseId = info.databaseId;

  const { results } = await notion.databases.query({
    database_id: databaseId,
    filter: {
      // and: [
      // {
      property: '진행률',
      number: {
        less_than: 1,
      },
      // },
      //   {
      //     property: '날짜',
      //     date: {
      //       after: new Date().toISOString(),
      //     },
      //   },
      // ],
    },
  });

  const calenders: CalenderItem[] = results.map(page => {
    const { id, properties, url } = page as { id: string; properties: Record<string, any>; url: string };

    const title: string = properties['이름'].title.reduce((acc: string, cur: { plain_text: string }) => acc + cur.plain_text, '');

    return {
      id,
      title,
      url,
      date: dayjs(properties['날짜'].date.start),
      progress: properties['진행률'].number,
      category: properties['분류'].select.name,
    };
  });

  return calenders.reduce((acc: CalenderList, cur: CalenderItem) => {
    const key = cur.date.format('YYYY-MM-DD');

    if (!(key in acc)) {
      acc[key] = [];
    }

    acc[key].push(cur);

    return acc;
  }, {});
}

export { setNotionInfo, getCalenderList };
