import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/misc/homePage';
import { Login } from './components/auth/loginPage';
import { Register } from './components/auth/registerPage';
import ErrorPage from './components/misc/notFoundPage';
import Navbar from './components/misc/Navbar';
import { CreateListing } from './components/listings/createListingPage';
import { EditListing } from './components/listings/editListingPage';
import Mylistings from './components/listings/myListingsPage';

function App () {
  return (
    <>
    <Navbar/>
    <div>
      <Routes>
      <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register"element={<Register />} />
          <Route path="/mylistings"element={<Mylistings />} />
          <Route path="/createlisting"element={<CreateListing />} />
          <Route path="/listings/:listingid"element={<EditListing />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
