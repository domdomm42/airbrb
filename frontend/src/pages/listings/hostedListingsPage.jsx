import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';

const HostedListings = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await getAllBookingsForHost();
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // GETS ALL HOST LISTINGS
  const getAllBookingsForHost = async () => {
    try {
      const response = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const hostListings = data.listings.filter(listing => listing.owner === userEmail);
        const listingIds = hostListings.map(listing => listing.id);

        await getBookedBookings(listingIds);
      } else {
        console.error('Error fetching listings: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching listings: ', error);
    }
  };

  const getBookedBookings = async (listingIds) => {
    try {
      const response = await fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const filteredBookings = data.bookings.filter(booking => listingIds.includes(Number(booking.listingId)));
        setBookingRequests(filteredBookings);
      } else {
        console.error('Error fetching bookings: ', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching bookings: ', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await fetch(`http://localhost:5005/bookings/${action.toLowerCase()}/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSnackbarMessage(`Booking ${action.toLowerCase()}ed successfully`);
        setBookingRequests(currentBookings => currentBookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: action.toLowerCase() === 'accept' ? 'accepted' : 'declined' };
          }
          return booking;
        }));
      } else {
        setSnackbarMessage(`Failed to ${action.toLowerCase()} booking`);
      }
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setOpenSnackbar(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <CssBaseline />
      <main>
        <Box sx={{ bgcolor: 'background.paper', pt: 8, pb: 6 }}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
              Booking Requests
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {bookingRequests.length > 0
              ? (bookingRequests.map((request) => (
                <Grid item key={request.id} xs={12} sm={6} md={4}>
                  <Box sx={{ border: '1px solid gray', padding: 2 }}>
                    <Typography variant="h6">Listing ID: {request.listingId}</Typography>
                    <Typography variant="subtitle1">Requested by: {request.owner}</Typography>
                    <Typography variant="subtitle1">Dates: {formatDate(request.dateRange.startDate)} - {formatDate(request.dateRange.endDate)}</Typography>
                    <Typography variant="subtitle1">Total Price: {request.totalPrice} AUD</Typography>
                    <Typography variant="subtitle1">Status: {request.status}</Typography>
                    {request.status === 'pending' && (
                      <>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => handleBookingAction(request.id, 'Accept')}>
                          Accept
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => handleBookingAction(request.id, 'Decline')}>
                          Deny
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
                ))
                )
              : (
              <Typography variant="body1">No booking requests available.</Typography>
                )}
          </Grid>
        </Container>
      </main>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default HostedListings;
