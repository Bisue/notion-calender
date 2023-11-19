import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Calender from './pages/Calender';
import Setting from './pages/Setting';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={Setting}></Route>
        <Route path="/calender" Component={Calender}></Route>
        <Route path="/*" Component={NotFound}></Route>
      </Routes>
    </HashRouter>
  );
}
