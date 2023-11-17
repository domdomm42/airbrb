import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SnackbarAlert from '../../components-test/SnackbarAlert';
import MyListingCard from '../../components-test/listings/MyListingCard';

const MyListings = () => {
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCloseError = () => {
    setOpenError(false);
  };

  const handleCloseSuccess = () => {
    setOpenSuccess(false);
  };

  // State to store the user's listings
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
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
          const userEmail = localStorage.getItem('email');
          const filteredListings = data.listings.filter(
            (listing) => listing.owner === userEmail
          );
          // Fetch detailed information for each listing
          const detailedListings = await Promise.all(
            filteredListings.map(async (listing) => {
              const res = await fetch(`http://localhost:5005/listings/${listing.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const detailedListing = await res.json();
              detailedListing.buttonText = detailedListing.listing.published > 0 ? 'Unpublish' : 'Go Live'
              detailedListing.id = listing.id;
              // Calculate rating for each listing based on reviews
              return detailedListing;
            })
          );
          const listingsWithRating = detailedListings.map((listing) => {
            const reviews = listing.reviews || [];
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length || 0;
            return {
              ...listing,
              rating: averageRating,
            };
          });
          setUserListings(listingsWithRating);
        } else {
          console.error('Error fetching user listings');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserListings();
  }, []);

  const fetchUnpublishListing = (listingId) => {
    fetch(`http://localhost:5005/listings/unpublish/${listingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Successfully unpublishing listing');
          setOpenSuccess(true);
          setUserListings((prevListings) => {
            return prevListings.map((listing) => {
              if (listing.id === listingId) {
                return {
                  ...listing,
                  buttonText: 'Go Live',
                };
              }
              return listing;
            });
          });
        } else {
          response.json()
            .then(data => {
              setErrorMessage(data.error);
              setOpenError(true);
            })
            .catch(error => {
              console.error('Error parsing JSON:', error);
            });
        }
      })
      .catch((error) => {
        setErrorMessage(error);
        setOpenError(true);
      });
  };

  const fetchDeleteListing = (listingId) => {
    // Implement your fetch logic here
    fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage('Successfully Deleted listing');
          setOpenSuccess(true);
          setUserListings((prevListings) => {
            return prevListings.filter((listing) => listing === listingId);
          });
        } else {
          response.json()
            .then(data => {
              setErrorMessage(data.error);
              setOpenError(true);
            })
            .catch(error => {
              console.error('Error parsing JSON:', error);
            });
        }
      })
      .catch((error) => {
        setErrorMessage(error);
        setOpenError(true);
      });
  };

  console.log(userListings);

  return (
    <>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Listings
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button component={RouterLink} to="/createListing" variant="contained">
                Create a new listing
              </Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
          {userListings.length > 0
            ? (
                userListings.map((listing) => (
              <Grid item key={listing.id} xs={12} sm={6} md={4}>
                <MyListingCard
                  listing={listing}
                  onUnpublish={fetchUnpublishListing}
                  onDelete={fetchDeleteListing}
                />
              </Grid>
                ))
              )
            : (
            <Typography variant="body1">No listings available.</Typography>
              )}
        </Grid>
          <SnackbarAlert
            open={openError}
            onClose={handleCloseError}
            message={errorMessage}
            severity="error"
          />

          <SnackbarAlert
            open={openSuccess}
            onClose={handleCloseSuccess}
            message={successMessage}
            severity="success"
          />
        </Container>
      </main>
    </>
  );
};

export default MyListings;
