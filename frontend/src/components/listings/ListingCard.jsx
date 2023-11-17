import React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography, Rating } from '@mui/material';

const MyListingCard = ({ listing }) => {
  return (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
  );
};

export default MyListingCard;
