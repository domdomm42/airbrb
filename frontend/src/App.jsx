import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './components/misc/homePage';
import { Login } from './components/auth/loginPage';
import { Register } from './components/auth/registerPage';
import ErrorPage from './components/misc/notFoundPage';
import Navbar from './components/misc/Navbar';
import { CreateListing } from './components/listings/createListingPage';
import { EditListing } from './components/listings/editListingPage';
import PublishListing from './components/listings/publishListingPage';
import Mylistings from './components/listings/myListingsPage';
import ListingPage from './components/listings/listingPage';
import HostedListings from './components/listings/hostedListingsPage';

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
