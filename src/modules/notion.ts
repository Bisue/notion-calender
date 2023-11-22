import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import dayjs from 'dayjs';
import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export interface NotionConfig {
  /**
   * Notion integration key
   */
  key: string;
  /**
   * Target calender's notion database id
   */
  databaseId: string;
}

export interface CalenderItem {
  id: string;
  url: string;
  title: string;
  date: dayjs.Dayjs;
  progress: number;
  category: string;
  color: string;
}

export type CalenderList = Record<string, CalenderItem[]>;

export class NotionPropertyError extends Error {
  constructor(property: string, expectedType: PageObjectResponse['properties'][string]['type'], actualType: PageObjectResponse['properties'][string]['type']) {
    const actualMessage = actualType === undefined ? '존재하지 않습니다.' : `"${actualType}" 입니다.`;
    super(`"${property}" 속성은 "${expectedType}" 타입이어야 하지만 ${actualMessage}`);
    this.name = 'NotionPropertyError';
  }
}

const configPath = path.resolve(app.getPath('userData'), 'config.json');

function loadConfig() {
  return new Promise<NotionConfig>((resolve, reject) => {
    fs.readFile(configPath, { encoding: 'utf-8' }, (e, json) => {
      if (e) reject(e);
      else resolve(JSON.parse(json));
    });
  });
}

function saveConfig(config: NotionConfig) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(configPath, JSON.stringify(config), { encoding: 'utf-8' }, e => {
      if (e) reject(e);
      else resolve();
    });
  });
}

function getTypeColors(color: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red') {
  const colors: Record<typeof color, string> = {
    default: '#64748b',
    gray: '#6b7280',
    brown: '#422006',
    orange: '#f97316',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    red: '#ef4444',
  };

  return colors[color];
}

class NotionCalender {
  config: NotionConfig = null;
  client: Client;

  init({ key, databaseId }: NotionConfig) {
    this.config = { key, databaseId };
    saveConfig(this.config);

    this.client = new Client({
      auth: key,
    });
  }

  async load() {
    this.init(await loadConfig());
  }

  get initialized() {
    return this.config !== null;
  }

  async fetch() {
    if (!this.initialized) throw Error('initialize first.');

    const { results } = await this.client.databases.query({
      database_id: this.config.databaseId,
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
      const { id, properties, url } = page as PageObjectResponse;

      if (properties['이름']?.type !== 'title') throw new NotionPropertyError('이름', 'title', properties['이름']?.type);
      if (properties['날짜']?.type !== 'date') throw new NotionPropertyError('날짜', 'date', properties['날짜']?.type);
      if (properties['진행률']?.type !== 'number') throw new NotionPropertyError('진행률', 'number', properties['진행률']?.type);
      if (properties['분류']?.type !== 'select') throw new NotionPropertyError('분류', 'select', properties['분류']?.type);

      const title = properties['이름'].title.reduce((acc, cur) => acc + cur.plain_text, '');
      const date = dayjs(properties['날짜'].date.start);
      const progress = properties['진행률'].number;
      const category = properties['분류'].select.name;
      const color = getTypeColors(properties['분류'].select.color);

      return {
        id,
        title,
        url,
        date,
        progress,
        category,
        color,
      };
    });

    return calenders.reduce((acc: CalenderList, cur) => {
      const key = cur.date.format('YYYY-MM-DD');

      if (!(key in acc)) {
        acc[key] = [];
      }

      acc[key].push(cur);

      return acc;
    }, {});
  }
}

/**
 * Singleton(using Module Caching)
 * https://nodejs.org/api/modules.html#modules_caching
 */

/**
 * Notion Calender 모듈

 * load ( -> init ) -> fetch
 */
const instance = new NotionCalender();
export default instance;
