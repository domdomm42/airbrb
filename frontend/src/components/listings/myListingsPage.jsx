import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import BathroomIcon from '@mui/icons-material/Bathroom';
import HotelIcon from '@mui/icons-material/Hotel';
import FoundationIcon from '@mui/icons-material/Foundation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
              detailedListing.buttonText = detailedListing.listing.availability.length > 0 ? 'Unpublish' : 'Go Live'
              detailedListing.id = listing.id;
              return detailedListing;
            })
          );
          setUserListings(detailedListings);
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
    // Implement your fetch logic here
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
                      <Card
                        sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                      >
                        <CardMedia
                          component="div"
                          sx={{
                            // 16:9
                            pt: '56.25%',
                          }}
                          image={listing.listing.thumbnail}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {listing.listing.title}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          ${listing.listing.price} AUD per night
                        </Typography>
                        <Grid container spacing={1} alignItems="flex-start" justifyContent="flex-start">
                          <Grid item>
                            <BathroomIcon name="bathroom" />
                          </Grid>
                          <Grid item>
                            <Typography>{listing.listing.metadata.bathrooms}</Typography>
                          </Grid>
                          <Grid item>
                            <HotelIcon name="bedroom" />
                          </Grid>
                          <Grid item>
                            <Typography>{listing.listing.metadata.bedrooms}</Typography>
                          </Grid>
                          <Grid item>
                            <FoundationIcon name="divider" />
                          </Grid>
                          <Grid item>
                            <Typography>{listing.listing.metadata.propertyType}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container alignItems="center">
                          <Grid item>
                            <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" gutterBottom>({listing.listing.reviews.length} reviews)</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Grid container justifyContent="space-between">
                          <Grid item>
                          { listing.buttonText === 'Go Live'
                            ? (
                            <Button size="small" component={RouterLink} to={`/publishlisting/${listing.id}`}>
                              {listing.buttonText}
                            </Button>
                              )
                            : (
                            <Button
                              size="small"
                              onClick={() => fetchUnpublishListing(listing.id)}
                            >
                              {listing.buttonText}
                            </Button>
                              )}
                          </Grid>
                          <Grid item>
                            <Button size="small" component={RouterLink} to={`/editlisting/${listing.id}`}>
                              Edit
                            </Button>
                          </Grid>
                          <Grid item>
                            <Button size="small" >
                              Delete
                            </Button>
                          </Grid>
                        </Grid>
                      </CardActions>
                      </Card>
                    </Grid>
                  ))
                )
              : (
                  <Typography variant="body1">No listings available.</Typography>
                )}
          </Grid>
          <Snackbar
            open={openError}
            autoHideDuration={5000}
            onClose={handleCloseError}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseError} severity="error">
              {errorMessage}
            </Alert>
          </Snackbar>
          <Snackbar
            open={openSuccess}
            autoHideDuration={5000}
            onClose={handleCloseSuccess}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSuccess} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>
        </Container>
      </main>
    </>
  );
};

export default MyListings;
