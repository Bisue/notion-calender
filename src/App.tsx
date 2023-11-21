import { HashRouter, Route, Routes } from 'react-router-dom';
import NotFoundPage from '@/pages/NotFoundPage';
import CalenderPage from '@/pages/CalenderPage';
import SettingPage from '@/pages/SettingPage';
import type { FC } from 'react';

const App: FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={SettingPage}></Route>
        <Route path="/calender" Component={CalenderPage}></Route>
        <Route path="/*" Component={NotFoundPage}></Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
