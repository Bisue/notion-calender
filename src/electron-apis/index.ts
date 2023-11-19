import { ipcRenderer } from 'electron';
import type { CalenderList } from '../modules/notion';

const electronApis = {
  // This is a simple example of an Electron API that can be called from the renderer process:
  async getCalender() {
    return (await ipcRenderer.invoke('getCalender')) as CalenderList;
  },
  async submitNotionInfo({ key, databaseId }: { key: string; databaseId: string }) {
    return await ipcRenderer.invoke('submitNotionInfo', { key, databaseId });
  },
};

export type ElectronApis = typeof electronApis;

export default electronApis;
