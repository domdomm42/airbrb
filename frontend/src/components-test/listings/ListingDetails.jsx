import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import PaymentsIcon from '@mui/icons-material/Payments';
import BathtubIcon from '@mui/icons-material/Bathtub';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BedIcon from '@mui/icons-material/Bed';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FoundationIcon from '@mui/icons-material/Foundation';

const ListingDetails = ({ listingDetails, priceType }) => {
  return (
    <Box>
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
    </Box>
  );
};

export default ListingDetails;
