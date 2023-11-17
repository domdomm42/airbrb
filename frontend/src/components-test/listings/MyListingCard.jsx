import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActions, CardContent, CardMedia, Grid, Typography, Button, Rating } from '@mui/material';
import BathroomIcon from '@mui/icons-material/Bathroom';
import HotelIcon from '@mui/icons-material/Hotel';
import FoundationIcon from '@mui/icons-material/Foundation';

const MyListingCard = ({ listing, onUnpublish, onDelete }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          // 16:9
          pt: '56.25%',
        }}
        image={listing.listing.thumbnail}
        data-testid="my-listing-card-image"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {listing.listing.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          ${listing.listing.price} AUD per night
        </Typography>
        <Grid container spacing={1} alignItems="flex-start" justifyContent="flex-start">
          <Grid item>
            <BathroomIcon name="bathroom" />
          </Grid>
          <Grid item>
            <Typography>{listing.listing.metadata.bathrooms}</Typography>
          </Grid>
          <Grid item>
            <HotelIcon name="bedroom" />
          </Grid>
          <Grid item>
            <Typography>{listing.listing.metadata.numBeds}</Typography>
          </Grid>
          <Grid item>
            <FoundationIcon name="divider" />
          </Grid>
          <Grid item>
            <Typography>{listing.listing.metadata.propertyType}</Typography>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item>
            <Rating
              name="half-rating-read"
              value={listing.rating}
              defaultValue={2.5}
              precision={0.5}
              readOnly
            />
          </Grid>
          <Grid item>
            <Typography variant="caption" gutterBottom>
              ({listing.listing.reviews.length} reviews)
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container justifyContent="space-between">
          <Grid item>
            {listing.buttonText === 'Go Live'
              ? (
              <Button
                size="small"
                component={RouterLink}
                to={`/publishlisting/${listing.id}`}
              >
                {listing.buttonText}
              </Button>
                )
              : (
              <Button size="small" onClick={() => onUnpublish(listing.id)}>
                {listing.buttonText}
              </Button>
                )}
          </Grid>
          <Grid item>
            <Button size="small" component={RouterLink} to={`/editlisting/${listing.id}`}>
              Edit
            </Button>
          </Grid>
          <Grid item>
            <Button size="small" onClick={() => onDelete(listing.id)}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default MyListingCard;
