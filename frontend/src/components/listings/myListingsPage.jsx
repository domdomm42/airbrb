import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MyListings = () => {
  // State to store the user's listings
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    // Fetch user listings when the component mounts
    const fetchUserListings = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5005/listings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter listings based on user email
          const userEmail = localStorage.getItem('email');
          const filteredListings = data.listings.filter(
            (listing) => listing.owner === userEmail
          );
          console.log(filteredListings);
          setUserListings(filteredListings);
        } else {
          // Handle error
          console.error('Error fetching user listings');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserListings();
  }, []); // Empty dependency array ensures the effect runs once when the component mounts

  return (
    <div>
      <Typography variant="h4">My Listings</Typography>
      {userListings.map((listing) => (
        <div key={listing.id}>
          <Typography variant="h6">{listing.title}</Typography>
          <Typography>{`Property Type: ${listing.propertyType}`}</Typography>
          <Typography>{`Beds: ${listing.beds}`}</Typography>
          <Typography>{`Bathrooms: ${listing.bathrooms}`}</Typography>
          {/* Add other listing details here */}
          <Button
            variant="outlined"
            onClick={() => {
              // Handle click to edit
              // Redirect to the edit screen with the listing ID
              console.log(`Edit listing ${listing.id}`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              // Handle click to delete
              console.log(`Delete listing ${listing.id}`);
            }}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};

export default MyListings;
