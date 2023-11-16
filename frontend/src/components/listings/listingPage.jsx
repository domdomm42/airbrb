import React, { useEffect } from 'react';
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
import PlaceIcon from '@mui/icons-material/Place';
import PaymentsIcon from '@mui/icons-material/Payments';
import BathtubIcon from '@mui/icons-material/Bathtub';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BedIcon from '@mui/icons-material/Bed';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FoundationIcon from '@mui/icons-material/Foundation';

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
  const [priceType, setPriceType] = React.useState('per night');
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
            <Grid container spacing={3} sx={{ marginTop: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><PlaceIcon></PlaceIcon> Address</Typography>
                <Typography>{listingDetails?.listing.address}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><FoundationIcon></FoundationIcon> Type</Typography>
                <Typography>{listingDetails?.listing.metadata.propertyType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><PaymentsIcon></PaymentsIcon> Price ({priceType})</Typography>
                <Typography>{listingDetails?.listing.price}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><BathtubIcon></BathtubIcon> Baths</Typography>
                <Typography>{listingDetails.listing.metadata.bathrooms}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><BedIcon></BedIcon> Beds</Typography>
                <Typography>{listingDetails.listing.metadata.bedrooms}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><MeetingRoomIcon></MeetingRoomIcon> Bedrooms</Typography>
                <Typography>{listingDetails.listing.metadata.bedroomDetails.length}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6"><LibraryAddIcon></LibraryAddIcon> Amenities</Typography>
                <ul>
                  {listingDetails.listing.metadata.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Typography
                component="h4"
                variant="h4"
                align="left"
                color="text.primary"
                gutterBottom
              >My Bookings</Typography>
            </Box>
            {/* Display booking status */}
            <Container maxWidth="sm">
              {renderBookingStatus()}
              {/* ... (existing code) */}
            </Container>
          </Container>
        </Box>
      </main>
    </>
  );
}

export default ListingPage;