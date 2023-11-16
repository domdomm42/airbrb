import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export const Home = () => {
  // State to store the user's listings
  const [userListings, setUserListings] = useState([]);

  // SEARCH STUFF
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);

  // FILTER STUFF
  const [minBedrooms, setMinBedrooms] = useState(null);
  const [maxBedrooms, setMaxBedrooms] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  // Setting filteredListings as userListings so that I can use filteredlisting in the return UI
  useEffect(() => {
    setFilteredListings(userListings);
  }, [userListings]);

  console.log(userListings);

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
          // Fetch detailed information for each listing
          const detailedListings = await Promise.all(
            data.listings.map(async (listing) => {
              const res = await fetch(`http://localhost:5005/listings/${listing.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const detailedListing = await res.json();
              detailedListing.id = listing.id;
              return detailedListing;
            })
          );

          // Calculate rating for each listing based on reviews
          const listingsWithRating = detailedListings.map((listing) => {
            const reviews = listing.listing.reviews || [];
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length || 0;
            return {
              ...listing,
              rating: averageRating,
            };
          });

          const sortedListings = [...listingsWithRating].sort((a, b) => {
            const titleA = a.listing.title.toUpperCase();
            const titleB = b.listing.title.toUpperCase();

            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
            return 0;
          });
          setUserListings(sortedListings.filter(listing => listing.listing.availability.length > 0));
        } else {
          console.error('Error fetching user listings');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserListings();

    const fetchUserBookings = async () => {
      const userToken = localStorage.getItem('token');
      const userEmail = localStorage.getItem('email');

      try {
        const response = await fetch('http://localhost:5005/bookings', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (response.ok) {
          const { bookings } = await response.json();

          // Filter user bookings by owner and status "accepted" or "pending"
          const relevantBookings = bookings.filter(
            (booking) => booking.owner === userEmail && (booking.status === 'accepted' || booking.status === 'pending')
          );

          // Filter user listings based on relevant bookings' listingId
          const listingsWithBookings = userListings.filter((listing) =>
            relevantBookings.some((booking) => booking.listingId === listing.id)
          );

          // Sort user listings based on bookings with "accepted" or "pending" status
          const sortedListings = listingsWithBookings.sort((a, b) => {
            // Logic to sort listings based on booking status
            if (relevantBookings.find((booking) => booking.listingId === a.id)?.status === 'accepted') {
              return -1;
            }
            if (relevantBookings.find((booking) => booking.listingId === b.id)?.status === 'accepted') {
              return 1;
            }
            // If "accepted" bookings are not found, sort "pending" bookings
            if (relevantBookings.find((booking) => booking.listingId === a.id)?.status === 'pending') {
              return -1;
            }
            if (relevantBookings.find((booking) => booking.listingId === b.id)?.status === 'pending') {
              return 1;
            }
            // If neither "accepted" nor "pending" is found, maintain original order
            return 0;
          });

          setFilteredListings(sortedListings);
        } else {
          console.error('Error fetching user bookings');
        }
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      }
    };

    fetchUserBookings();
  }, []);

  const handleSearchAndFilters = () => {
    let results = userListings;
    // search logic
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      results = results.filter(listing =>
        listing.listing.title.toLowerCase().includes(lowercasedSearchTerm) ||
        listing.listing.metadata.city.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // filter logic
    results = results.filter(listing => {
      let matchesFilter = true;
      if (minBedrooms != null && listing.listing.metadata.bedrooms < Number(minBedrooms)) {
        matchesFilter = false;
      }
      if (maxBedrooms != null && listing.listing.metadata.bedrooms > Number(maxBedrooms)) {
        matchesFilter = false;
      }
      if (minPrice != null && listing.listing.price < Number(minPrice)) {
        matchesFilter = false;
      }
      if (maxPrice != null && listing.listing.price > Number(maxPrice)) {
        matchesFilter = false;
      }

      if (dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        const isAvailable = listing.listing.availability.some(avail => {
          const listingStart = new Date(avail.start);
          const listingEnd = new Date(avail.end);
          return listingEnd >= startDate && listingStart <= endDate;
        });
        if (!isAvailable) {
          matchesFilter = false;
        }
      }

      return matchesFilter;
    });

    // JUST A TEMPLATE, WE DONT HAVE RATINGS YET
    if (sortOrder) {
      results.sort((a, b) => sortOrder === 'high-to-low' ? b.rating - a.rating : a.rating - b.rating);
    }

    setFilteredListings(results);
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 2, mt: -6 }}>
        <TextField
          label="Search Listings"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mr: 2 }}
        />
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleSearchAndFilters}
        >
          Search
        </Button> */}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mx: 4 }}>
        <TextField label="Min Bedrooms" value={minBedrooms} onChange={(e) => setMinBedrooms(e.target.value)} />
        <TextField label="Max Bedrooms" value={maxBedrooms} onChange={(e) => setMaxBedrooms(e.target.value)} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="Start Date" selected={dateRange.start} onChange={date => setDateRange({ ...dateRange, start: date })} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="End Date" selected={dateRange.end} onChange={date => setDateRange({ ...dateRange, end: date })} />
        </LocalizationProvider>
        <TextField label="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <TextField label="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

        <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="sort-order-label">Sort Order</InputLabel>
        <Select
          labelId="sort-order-label"
          value={sortOrder}
          label="Sort Order"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="high-to-low">High to Low</MenuItem>
          <MenuItem value="low-to-high">Low to High</MenuItem>
        </Select>
      </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearchAndFilters}>
          Apply Search and Filters
        </Button>
      </Box>

        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {filteredListings.length > 0
              ? (
                  filteredListings.map((listing) => (
                    <Grid item key={listing.id} xs={12} sm={6} md={4} component={RouterLink} to={`/listings/${listing.id}?dateFilter=${JSON.stringify(dateRange)}`} sx={{ textDecoration: 'None' }}>
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
                          {listing.listing.metadata.propertyType}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          ${listing.listing.price} AUD per night
                        </Typography>

                        <Grid container alignItems="center">
                          <Grid item>
                            <Rating name="half-rating-read" defaultValue={0} value={listing.rating} precision={0.5} readOnly />
                          </Grid>
                          <Grid item>
                            <Typography variant="caption" gutterBottom>({listing.listing.reviews.length} reviews)</Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                      </Card>
                    </Grid>
                  ))
                )
              : (
                  <Typography variant="body1">No listings available.</Typography>
                )}
          </Grid>
        </Container>
      </main>
    </>
  );
}
