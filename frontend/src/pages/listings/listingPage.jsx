import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import ListingDetails from '../../components/listings/ListingDetails';
import { differenceInCalendarDays } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import { Card, CardContent, Grid, Typography, Button, Rating } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = ['https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random'];

function ListingPage () {
  const theme = useTheme();
  const { listingid } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dateFilter = JSON.parse(searchParams.get('dateFilter'));
  const [activeStep, setActiveStep] = React.useState(0);
  const [listingDetails, setListingDetails] = React.useState(null);
  const [userBookings, setUserBookings] = React.useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // BOOKING STUFF
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [bookingStart, setBookingStart] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [bookingEnd, setBookingEnd] = useState(null);
  const [bookingCost, setBookingCost] = useState(0);

  const [priceType, setPriceType] = React.useState('per night');

  // REVIEW STUFF
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

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
          // Check if dateFilter contains startDate or endDate
          const startDate = dateFilter.start;
          const endDate = dateFilter.end;
          if (!(startDate == null && endDate == null)) {
            // Calculate the price based on the difference between endDate and startDate
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            const numberOfDays = Math.round((endTime - startTime) / millisecondsPerDay);
            // Calculate the total price for the entire stay
            data.listing.price = numberOfDays * data.listing.price;
            setPriceType('for full stay');
          }
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

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const userToken = localStorage.getItem('token');
        if (!userToken) {
          // User is not logged in, do nothing
          return;
        }

        const response = await fetch('http://localhost:5005/bookings', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const { bookings } = await response.json();
          const userEmail = localStorage.getItem('email');
          const filteredBookings = bookings.filter(
            (booking) => booking.owner === userEmail && booking.listingId === listingid
          );
          setUserBookings(filteredBookings);
        } else {
          console.error('Error fetching user bookings');
        }
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserBookings();
  }, []);

  const renderBookingStatus = () => {
    if (!localStorage.getItem('token')) {
      return null; // User not logged in
    }

    if (userBookings.length === 0) {
      return <p>No bookings for this listing.</p>; // User logged in but no bookings for this listing
    }

    // Display status(es) for the bookings of this listing
    return (
      <div>
        <h3>Booking Status:</h3>
        {userBookings.map((booking) => (
          <Grid item key={booking.id} xs={12} md={6}>
            <Card>
            <CardContent style={{
              backgroundColor: booking.status === 'accepted' ? 'rgb(193, 225, 193)' : (booking.status === 'pending' ? 'rgb(250, 160, 160)' : 'white'),
              padding: '10px',
            }}>
                {/* Display reviewer */}
                <Typography variant="body1">Booking Id: {booking.id}</Typography>
                {/* Display review details */}
                <Typography variant="body1">Status: {booking.status}</Typography>
                {/* Use the Rating component to display the rating */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </div>
    );
  };

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

  // eslint-disable-next-line no-unused-vars
  const handleBookings = async () => {
    try {
      const formattedStartDate = bookingStart ? bookingStart.toISOString() : null;
      const formattedEndDate = bookingEnd ? bookingEnd.toISOString() : null;

      const isDateInRange = (startDate, endDate, range) => {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        return startDate >= rangeStart && endDate <= rangeEnd;
      };

      const isAvailable = listingDetails.listing.availability.some(range =>
        isDateInRange(bookingStart, bookingEnd, range)
      );

      if (!isAvailable) {
        setSnackbarMessage('Requested dates are not available for booking');
        setSnackbarOpen(true);
        return;
      }

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

  const userEmail = localStorage.getItem('email');

  const handleReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5005/listings/${listingid}/review/${userBookings[0].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          {
            review: {
              review: reviewText,
              rating: reviewRating,
              reviewer: userEmail,
            }
          }
        ),
      });
      if (response.ok) {
        const newReview = {
          review: reviewText,
          rating: reviewRating,
          reviewer: userEmail,
        };
        setListingDetails(prevDetails => {
          const updatedReviews = prevDetails.listing.reviews ? [...prevDetails.listing.reviews, newReview] : [newReview];
          return {
            ...prevDetails,
            listing: {
              ...prevDetails.listing,
              reviews: updatedReviews
            }
          };
        });
        setReviewText('');
        setReviewRating(0);
        setSnackbarMessage('Review Successfully posted');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('An Error has occurred');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Error sending review request');
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
            <Box mt={5}>
              <Typography
                component="h4"
                variant="h4"
                align="left"
                color="text.primary"
                gutterBottom
              >Listing Details</Typography>
            </Box>
            <ListingDetails
              listingDetails={listingDetails}
              priceType={priceType}
            />
            <Box mt={5}>
              <Typography
                component="h4"
                variant="h4"
                align="left"
                color="text.primary"
                gutterBottom
              >My Bookings</Typography>

            </Box>
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
            <Grid item xs={12} mt={2}>
              <Button variant="contained" color="primary" onClick={handleBookings}>
                Book Now
              </Button>
              <Typography variant="h6" mt={1}>
                Total Cost: {bookingCost} AUD
              </Typography>
            </Grid>
              {renderBookingStatus()}
          </Container>
          {
            (
              <Container maxWidth="sm">
                <Typography component="h4" variant="h4" align="left" color="text.primary" mt={5} gutterBottom>
                    Reviews
                </Typography>
                <Box mt={2}>
                  <TextField
                    label="Write a Review"
                    multiline
                    rows={4}
                    fullWidth
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                  <Box mt={2}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      name="simple-controlled"
                      value={reviewRating}
                      onChange={(event, newValue) => {
                        setReviewRating(newValue);
                      }}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReviews}
                    sx={{ mt: 2 }}
                  >
                    Submit Review
                  </Button>
                </Box>
                <Box mt={5}>
                  {listingDetails && listingDetails.listing.reviews && listingDetails.listing.reviews.length > 0
                    ? (
                        listingDetails.listing.reviews.map((review, index) =>
                        <Grid item key={index} xs={12} md={6}>
                          <Card>
                            <CardContent>
                              <Typography variant="subtitle2">By: {review.reviewer}</Typography>
                              <Rating name={`rating-${index}`} value={review.rating} readOnly />
                              <Typography variant="body1">{review.review}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        ))
                    : (
                    <Typography variant="body2">No reviews yet.</Typography>
                      )}
                </Box>
              </Container>
            )
          }
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
