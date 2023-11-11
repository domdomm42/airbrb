import React, { useEffect, useState } from 'react';
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

const MyListings = () => {
  // State to store the user's listings
  // eslint-disable-next-line
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
  console.log(userListings);
  const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
              <Button variant="contained">Create a new listing</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Heading
                    </Typography>
                    <Typography>
                      Apartment
                    </Typography>
                    <Typography>
                      $35
                    </Typography>
                    <Rating name="half-rating-read" defaultValue={2.5} precision={0.5} readOnly />
                    <Typography>(100)</Typography>
                    <BathroomIcon name="bathroom" />
                    <HotelIcon name="bedroom" />
                  </CardContent>
                  <CardActions>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                    <Button size="small">Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default MyListings;
