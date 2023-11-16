import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ListingHelpers } from './helper.jsx';
const CustomLink = React.forwardRef((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

CustomLink.displayName = 'CustomLink';

export function CreateListing () {
  const navigate = useNavigate();
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [propertyType, setPropertyType] = useState('');
  const [amenities, setAmenities] = useState([]);

  const [listingThumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const [numBedrooms, setNumBedrooms] = useState('');
  const BED_SIZES = ['Single', 'Double', 'Queen', 'King'];
  const [bedroomDetails, setBedroomDetails] = useState([]);

  const {
    handlePropertyTypeChange,
    handleBedroomCountChange,
    handleBedTypeChange,
    handleThumbnailChange,
    handleAmenityChange,
    handleCloseError,
  } = ListingHelpers();

  const onPropertyTypeChange = handlePropertyTypeChange(setPropertyType);
  const onBedroomCountChange = handleBedroomCountChange(setNumBedrooms, setBedroomDetails);
  const onBedTypeChange = handleBedTypeChange(bedroomDetails, setBedroomDetails);
  const onThumbnailChange = handleThumbnailChange(setThumbnail, setThumbnailPreview);
  const onAmenityChange = handleAmenityChange(amenities, setAmenities);
  const onCloseError = handleCloseError(setOpenError);

  const removeBedFromRoom = (roomIndex, bedIndex) => {
    setBedroomDetails(currentBedrooms => {
      // Clone the current state to avoid direct mutation
      const updatedBedrooms = [...currentBedrooms];
      // Check if the specified bed exists before removing
      if (updatedBedrooms[roomIndex] && updatedBedrooms[roomIndex].beds[bedIndex] !== undefined) {
        updatedBedrooms[roomIndex].beds.splice(bedIndex, 1);
      }
      return updatedBedrooms;
    });
  };

  const addBedToRoom = (roomIndex) => {
    setBedroomDetails(currentBedrooms => {
      const updatedBedrooms = [...currentBedrooms];
      updatedBedrooms[roomIndex].beds.push({ type: '' });
      return updatedBedrooms;
    });
  };

  const handleCreateListings = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title');
    const address = formData.get('address');
    const city = formData.get('city');
    const price = formData.get('price');
    const thumbnail = listingThumbnail;
    const propertyType = formData.get('propertyType');
    const numBathrooms = formData.get('numBathrooms');
    const numBedrooms = formData.get('numBedrooms');
    const pictures = [];

    // Assuming you can't rent a room without a room or a bathroom, also assuming you can rent your place out for free for whatever reason.
    if (
      parseInt(numBathrooms) < 1 ||
      parseInt(numBedrooms) < 1 ||
      parseInt(price) < 0
    ) {
      setErrorMessage('Numbers cannot be less than 0');
      setOpenError(true);
      return;
    }

    if (
      !title ||
      !address ||
      !city ||
      price === null ||
      !thumbnail ||
      !propertyType ||
      !numBathrooms ||
      !numBedrooms ||
      bedroomDetails.length !== parseInt(numBedrooms)
    ) {
      setErrorMessage('Please fill in all required fields.');
      setOpenError(true);
      return;
    }

    if (thumbnail) {
      formData.append('thumbnail', listingThumbnail);
      pictures.push(thumbnail);
    }

    const totalBeds = bedroomDetails.reduce((total, room) => {
      const filledBeds = room.beds.filter(bed => bed.type !== '');
      return total + filledBeds.length;
    }, 0);

    const metadata = {
      city,
      pictures,
      propertyType,
      bathrooms: JSON.parse(numBathrooms),
      bedrooms: JSON.parse(numBedrooms),
      numBeds: totalBeds,
      amenities,
      bedroomDetails,
    };

    console.log(metadata);

    try {
      const response = await fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title,
          address,
          price: JSON.parse(price),
          thumbnail,
          metadata,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.error || 'An error occurred');
        setOpenError(true);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('An unexpected error occurred');
      setOpenError(true);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Create Listing
        </Typography>
        <Box
          component='form'
          noValidate
          onSubmit={handleCreateListings}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='title'
                label='Listing Title'
                name='title'
                autoComplete='listing-title'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='address'
                label='Full Listing Address'
                name='address'
                autoComplete='listing-address'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='city'
                label='City'
                name='city'
                autoComplete='listing-city'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='price'
                label='Listing Price (per night)'
                name='price'
                autoComplete='listing-price'
                type='number'
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' component='label'>
                Upload Thumbnail
                <input type='file' hidden onChange={onThumbnailChange} />
              </Button>
              {thumbnailPreview && (
                <Box mt={2} textAlign='center'>
                  <img
                    src={thumbnailPreview}
                    alt='Thumbnail Preview'
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <InputLabel id='propertyType-label'>Property Type</InputLabel>
                <Select
                  labelId='propertyType-label'
                  id='propertyType'
                  name='propertyType'
                  value={propertyType}
                  onChange={onPropertyTypeChange}
                  label='Property Type'
                >
                  <MenuItem value='Apartment'>Apartment</MenuItem>
                  <MenuItem value='House'>House</MenuItem>
                  <MenuItem value='Condo'>Condo</MenuItem>
                  <MenuItem value='Townhouse'>Townhouse</MenuItem>
                  <MenuItem value='Studio'>Studio</MenuItem>
                  <MenuItem value='Villa'>Villa</MenuItem>
                  <MenuItem value='Cabin'>Cabin</MenuItem>
                  <MenuItem value='Cottage'>Cottage</MenuItem>
                  <MenuItem value='Bungalow'>Bungalow</MenuItem>
                  <MenuItem value='Duplex'>Duplex</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='numBathrooms'
                label='Number of Bathrooms'
                name='numBathrooms'
                type='number'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='numBedrooms'
                label='Number of Bedrooms'
                name='numBedrooms'
                type='number'
                value={numBedrooms}
                onChange={onBedroomCountChange}
              />
            </Grid>
            {bedroomDetails.map((room, roomIndex) => (
          <Grid item xs={12} key={roomIndex}>
            <Typography variant="subtitle1">Bedroom {roomIndex + 1}</Typography>

            {room.beds.length === 0
              ? <Typography>No beds</Typography>
              : room.beds.map((bed, bedIndex) => (
                  <FormControl fullWidth key={`bed-${roomIndex}-${bedIndex}`}>
                    <InputLabel id={`bed-type-label-${roomIndex}-${bedIndex}`}>Bed {bedIndex + 1} Type</InputLabel>
                    <Select
                      labelId={`bed-type-label-${roomIndex}-${bedIndex}`}
                      label={`Bed ${bedIndex + 1} Type`}
                      value={bed.type}
                      onChange={(e) => onBedTypeChange(roomIndex, bedIndex, e.target.value)}
                    >
                      {BED_SIZES.map((size, sizeIndex) => (
                        <MenuItem key={sizeIndex} value={size}>{size}</MenuItem>
                      ))}
                    </Select>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => removeBedFromRoom(roomIndex, bedIndex)}
                    >
                      Remove Bed {bedIndex + 1}
                    </Button>
                  </FormControl>
              )
              )}

            <Button onClick={() => addBedToRoom(roomIndex)}>Add Bed to Room {roomIndex + 1}</Button>
          </Grid>
            ))}

            <Grid item xs={12}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={amenities.includes('WiFi')}
                      onChange={onAmenityChange}
                      value='WiFi'
                    />
                  }
                  label='WiFi'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={amenities.includes('Pool')}
                      onChange={onAmenityChange}
                      value='Pool'
                    />
                  }
                  label='Pool'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={amenities.includes('Gym')}
                      onChange={onAmenityChange}
                      value='Gym'
                    />
                  }
                  label='Gym'
                />
              </FormGroup>
            </Grid>
            <Grid item xs={12}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
              >
                Create Listing
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={onCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={onCloseError} severity='error'>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
