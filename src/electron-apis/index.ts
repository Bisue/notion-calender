import { ipcRenderer } from 'electron';
import type { CalenderList } from '../modules/notion';

const electronApis = {
  // This is a simple example of an Electron API that can be called from the renderer process:
  async getCalender() {
    return (await ipcRenderer.invoke('getCalender')) as CalenderList;
  },
};

export type ElectronApis = typeof electronApis;

export default electronApis;
