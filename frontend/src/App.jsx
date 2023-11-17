import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/misc/homePage';
import { Login } from './pages/auth/loginPage';
import { Register } from './pages/auth/registerPage';
import ErrorPage from './pages/misc/notFoundPage';
import Navbar from './components/Navbar';
import { CreateListing } from './pages/listings/createListingPage';
import { EditListing } from './pages/listings/editListingPage';
import PublishListing from './pages/listings/publishListingPage';
import Mylistings from './pages/listings/myListingsPage';
import ListingPage from './pages/listings/listingPage';
import HostedListings from './pages/listings/hostedListingsPage';

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
          <Route path="/editlisting/:listingid"element={<EditListing />} />
          <Route path="/publishlisting/:listingid"element={<PublishListing />} />
          <Route path="/listings/:listingid"element={<ListingPage />} />
          <Route path="/hostedListings"element={<HostedListings />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
