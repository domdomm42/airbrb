import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListingCard from '../../components/listings/ListingCard';
import SearchBar from '../../components/Searchbar';

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
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchAndFilters={handleSearchAndFilters}
      />
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
                      <ListingCard
                        listing={listing}
                      />
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
