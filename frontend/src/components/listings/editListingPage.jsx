import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export function EditListing () {
  const navigate = useNavigate();
  const { listingid } = useParams();

  // States for each GET request
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [price, setPrice] = useState('');
  const [listingThumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [numBathrooms, setNumBathrooms] = useState('');
  const [numBedrooms, setNumBedrooms] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [bedroomDetails, setBedroomDetails] = useState([]);
  const BED_SIZES = ['Single', 'Double', 'Queen', 'King'];
  const [pictures, setPictures] = useState([]);

  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    handleTitleChange,
    handleAddressChange,
    handleCityChange,
    handlePriceChange,
    handleBathroomChange,
    handlePropertyTypeChange,
    handleBedroomCountChange,
    handleBedTypeChange,
    handleThumbnailChange,
    handleAmenityChange,
    handleCloseError,
  } = ListingHelpers();

  const onTitleChange = handleTitleChange(setTitle);
  const onAddressChange = handleAddressChange(setAddress);
  const onCityChange = handleCityChange(setCity);
  const onPriceChange = handlePriceChange(setPrice);
  const onBathroomChange = handleBathroomChange(setNumBathrooms);
  const onPropertyTypeChange = handlePropertyTypeChange(setPropertyType);
  const onBedroomCountChange = handleBedroomCountChange(setNumBedrooms, setBedroomDetails);
  const onBedTypeChange = handleBedTypeChange(bedroomDetails, setBedroomDetails);
  const onThumbnailChange = handleThumbnailChange(setThumbnail, setThumbnailPreview);
  const onAmenityChange = handleAmenityChange(amenities, setAmenities);
  const onCloseError = handleCloseError(setOpenError);

  const onPicturesChange = async (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      try {
        const dataUrls = await Promise.all(files.map(async (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          });
        }));
        setPictures(prevPictures => [...prevPictures, ...dataUrls]);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  };

  const removePicture = (index) => {
    setPictures(prevPictures => prevPictures.filter((_, i) => i !== index));
  };

  const removeBedFromRoom = (roomIndex, bedIndex) => {
    setBedroomDetails(currentBedrooms => {
      const updatedBedrooms = [...currentBedrooms];
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

  // GET req so user know what their old data was
  useEffect(() => {
    fetch(`http://localhost:5005/listings/${listingid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(data.listing.numBathrooms)
        setTitle(data.listing.title);
        setAddress(data.listing.address);
        setCity(data.listing.metadata.city)
        setPrice(data.listing.price);
        setThumbnailPreview(data.listing.thumbnail);
        setThumbnail(data.listing.thumbnail)
        setPropertyType(data.listing.metadata.propertyType);
        setNumBathrooms(data.listing.metadata.bathrooms);
        setNumBedrooms(data.listing.metadata.bedrooms);
        setAmenities(data.listing.metadata.amenities);
        setBedroomDetails(data.listing.metadata.bedroomDetails);
        setPictures(data.listing.metadata.pictures)
        pictures.push(data.listing.thumbnail);
      })
      .catch(error => {
        setErrorMessage(error.message || 'Error fetching data');
        setOpenError(true);
      })
  }, [listingid]);

  // Handle form submission
  const handleEditListings = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const editTitle = formData.get('title') || title;
    const editAddress = formData.get('address') || address;
    const editCity = formData.get('city') || city;
    const editPrice = formData.get('price') || price;
    const thumbnail = formData.get('thumbnail') || listingThumbnail;
    const editPropertyTypes = formData.get('propertyType') || propertyType;
    const editNumBathrooms = formData.get('numBathrooms') || numBathrooms;
    const editNumBedrooms = formData.get('numBedrooms') || numBedrooms;
    // const allPictures = formData.get('pictures') || pictures;

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
      !editTitle ||
      !editAddress ||
      !editCity ||
      editPrice === null ||
      !thumbnail ||
      !editPropertyTypes ||
      !editNumBathrooms ||
      !editNumBedrooms ||
      bedroomDetails.length !== parseInt(numBedrooms)
    ) {
      setErrorMessage('Please fill in all required fields.');
      setOpenError(true);
      return;
    }

    if (thumbnail) {
      formData.append('thumbnail', listingThumbnail);
    }

    const totalBeds = bedroomDetails.reduce((total, room) => {
      const filledBeds = room.beds.filter(bed => bed.type !== '');
      return total + filledBeds.length;
    }, 0);

    // const allPictures = ()

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

    try {
      const response = await fetch(`http://localhost:5005/listings/${listingid}`, {
        method: 'PUT',
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
          Edit Listing
        </Typography>
        <Box
          component='form'
          noValidate
          onSubmit={handleEditListings}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='title'
                // label='Listing Title'
                name='title'
                autoComplete='listing-title'
                value={title}
                onChange={onTitleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='address'
                // label='Listing Address'
                name='address'
                autoComplete='listing-address'
                value={address}
                onChange={onAddressChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='city'
                // label='City'
                name='city'
                autoComplete='listing-city'
                value={city}
                onChange={onCityChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='price'
                // label='Listing Price (per night)'
                name='price'
                autoComplete='listing-price'
                type='number'
                value={price}
                onChange={onPriceChange}
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
            <Button variant='contained' component='label'>
              Upload More Pictures
              <input type='file' hidden onChange={onPicturesChange} multiple />
            </Button>
            {pictures.map((imageSrc, index) => (
            <Box key={index} mt={2} textAlign='center'>
              <img
                src={imageSrc}
                alt={`Picture Preview ${index + 1}`}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => removePicture(index)}
              >
                Remove Picture
              </Button>
            </Box>
            ))}
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
                // label='Number of Bathrooms'
                name='numBathrooms'
                type='number'
                value={numBathrooms}
                onChange={onBathroomChange}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id='numBedrooms'
                // label='Number of Bedrooms'
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
                Edit Listing
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
