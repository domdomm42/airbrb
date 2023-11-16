import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { differenceInCalendarDays } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = ['https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random'];

function ListingPage () {
  const theme = useTheme();
  const { listingid } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search); // Access query parameters
  const dateFilter = searchParams.get('dateFilter');
  console.log(dateFilter);
  const [activeStep, setActiveStep] = React.useState(0);
  const [listingDetails, setListingDetails] = React.useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // BOOKING STUFF
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [bookingStart, setBookingStart] = useState(null);
  const [bookingEnd, setBookingEnd] = useState(null);
  const [bookingCost, setBookingCost] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5005/listings/${listingid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setListingDetails(data);
        } else {
          console.error('Error fetching listing details');
          navigate('*');
        }
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    };

    // Fetch listing details when the component mounts
    fetchListingDetails();
  }, [listingid, token, navigate]);

  useEffect(() => {
    if (bookingStart && bookingEnd && listingDetails) {
      const numberOfNights = differenceInCalendarDays(new Date(bookingEnd), new Date(bookingStart));
      const totalCost = numberOfNights * listingDetails.listing.price;
      setBookingCost(totalCost);
    }
  }, [bookingStart, bookingEnd, listingDetails]);

  if (!listingDetails) {
    // If listingDetails is null, return null or loading indicator
    return null;
  }

  const imagesToDisplay = listingDetails.listing.metadata.pictures.length > 0
    ? listingDetails.listing.metadata.pictures
    : images;

  const maxSteps = listingDetails.listing.metadata.pictures.length > 0
    ? listingDetails.listing.metadata.pictures.length
    : images.length;

  console.log(listingDetails);

  const handleBookings = async () => {
    try {
      // Ensure dates are in the correct format (e.g., ISO string)

      const formattedStartDate = bookingStart ? bookingStart.toISOString() : null;
      const formattedEndDate = bookingEnd ? bookingEnd.toISOString() : null;
      console.log(formattedStartDate);
      console.log(formattedEndDate);
      console.log(bookingCost);
      console.log(token);

      const response = await fetch(`http://localhost:5005/bookings/new/${listingid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dateRange: {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
          totalPrice: bookingCost,
        }),
      });

      if (response.ok) {
        setSnackbarMessage('Booking request sent successfully');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Error sending booking request');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error sending booking request');
      setSnackbarOpen(true);
    }
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
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
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
              {listingDetails.listing.title}
            </Typography>
            <AutoPlaySwipeableViews
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={activeStep}
              onChangeIndex={handleStepChange}
              enableMouseEvents
            >
              {imagesToDisplay.map((step, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {Math.abs(activeStep - index) <= 2
                    ? (
                    <Box
                      component="img"
                      sx={{
                        height: '40vh',
                        width: '60vh',
                        objectFit: 'cover',
                      }}
                      src={step}
                      alt='Image of listing'
                    />
                      )
                    : null}
                </div>
              ))}
            </AutoPlaySwipeableViews>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 2,
              }}
            >
              <Button
                size="small"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  marginRight: 1,
                }}
              >
                {theme.direction === 'rtl'
                  ? (
                  <KeyboardArrowRight />
                    )
                  : (
                  <KeyboardArrowLeft />
                    )}
                Back
              </Button>
              <Button
                size="small"
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}
                sx={{
                  marginLeft: 1,
                }}
              >
                Next
                {theme.direction === 'rtl'
                  ? (
                  <KeyboardArrowLeft />
                    )
                  : (
                  <KeyboardArrowRight />
                    )}
              </Button>
            </Box>
            <Grid container spacing={3} sx={{ marginTop: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Address</Typography>
                <Typography>{listingDetails?.listing.address}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Price</Typography>
                <Typography>{listingDetails?.listing.price}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Baths</Typography>
                <Typography>{listingDetails.listing.metadata.bathrooms}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Beds</Typography>
                <Typography>{listingDetails.listing.metadata.bedrooms}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Bedrooms</Typography>
                <Typography>{listingDetails.listing.metadata.bedroomDetails.length}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Amenities</Typography>
                <ul>
                  {listingDetails.listing.metadata.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </Grid>
              <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={bookingStart}
                  onChange={(date) => setBookingStart(date)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={bookingEnd}
                  onChange={(date) => setBookingEnd(date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleBookings}>
                Book Now
              </Button>
              <Typography variant="h6">
                Total Cost: {bookingCost} AUD
              </Typography>
            </Grid>
            </Grid>
          </Container>
        </Box>
      </main>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
      <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
}

export default ListingPage;
