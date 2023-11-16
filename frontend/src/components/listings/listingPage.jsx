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
import ListingDetails from '../../components-test/listings/ListingDetails';
import { differenceInCalendarDays } from 'date-fns';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = ['https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random', 'https://source.unsplash.com/random'];

function ListingPage () {
  const theme = useTheme();
  const { listingid } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const dateFilter = JSON.parse(searchParams.get('dateFilter'));
  console.log(dateFilter);
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
          console.log(data);
          // Check if dateFilter contains startDate or endDate
          const startDate = dateFilter.start;
          const endDate = dateFilter.end;
          console.log(startDate);
          console.log(endDate);
          if (!(startDate == null && endDate == null)) {
            // Calculate the price based on the difference between endDate and startDate
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(endDate).getTime();
            const numberOfDays = Math.round((endTime - startTime) / millisecondsPerDay);
            console.log(numberOfDays);
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
          <div key={booking.id}>
            <p>Status: {booking.status}</p>
            {/* You can display other relevant booking details here */}
          </div>
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

  console.log(listingDetails);

  // eslint-disable-next-line no-unused-vars
  const handleBookings = async () => {
    try {
      const formattedStartDate = bookingStart ? bookingStart.toISOString() : null;
      const formattedEndDate = bookingEnd ? bookingEnd.toISOString() : null;

      const isDateInRange = (startDate, endDate, range) => {
        console.log('hello');
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
      console.log(formattedStartDate, formattedEndDate, bookingCost, token);

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

  const handleReviews = async () => {
    console.log(reviewText)
    console.log(reviewRating)
    try {
      const response = await fetch(`http://localhost:5005/listings/${listingid}/review/${userBookings[0].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review: { review: reviewText, rating: reviewRating }
        }),
      });
      if (response.ok) {
        const newReview = {
          review: reviewText,
          rating: reviewRating,
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
            <Container maxWidth="sm">
              {renderBookingStatus()}
            </Container>
            <Box mt={5}>
            <Typography component="h4" variant="h4" align="left" color="text.primary" gutterBottom>
              Reviews
            </Typography>
            {listingDetails && listingDetails.listing.reviews && listingDetails.listing.reviews.length > 0
              ? (
                  listingDetails.listing.reviews.map((review, index) =>
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1">{review.review} - {review.rating} Stars</Typography>
                </Box>
                  ))
              : (
              <Typography variant="body2">No reviews yet.</Typography>
                )}
          </Box>

          </Container>
          {
            (
              <Container maxWidth="sm">
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
