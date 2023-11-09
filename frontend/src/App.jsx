import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/misc/homePage';
import { Login } from './components/auth/loginPage';
import { Register } from './components/auth/registerPage';
import ErrorPage from './components/misc/notFoundPage';

function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register"element={<Register />} />
        <Route path="*"element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
