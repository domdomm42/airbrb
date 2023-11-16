import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import AvailabilityPicker from '../../components-test/listings/AvailabilityPicker';
import SnackbarAlert from '../../components-test/SnackbarAlert';

const PublishListing = () => {
  const [availability, setAvailability] = useState([{ start: null, end: null }]);
  const navigate = useNavigate();
  const { listingid } = useParams();
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setOpenError(false);
  };

  const handleDateChange = (date, index, key) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: date } : item))
    );
  };

  const addAvailabilityField = () => {
    setAvailability((prev) => [...prev, { start: null, end: null }]);
  };

  const handlePublish = () => {
    // Filter out entries with null start or end dates
    const validAvailability = availability.filter(
      (item) => item.start && item.end
    );

    if (validAvailability.length < 1) {
      setErrorMessage('Please select an availability range.');
      setOpenError(true);
      return;
    }

    // Convert the object of objects to a list of objects
    const availabilityList = Object.values(validAvailability);
    const requestBody = {
      availability: availabilityList,
    };

    fetch(`http://localhost:5005/listings/publish/${listingid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          navigate('/mylistings')
        } else {
          response.json()
            .then(data => {
              setErrorMessage(data.error);
              setOpenError(true);
            })
            .catch(error => {
              console.error('Error parsing JSON:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5' mb={3}>
          Publish Listing
        </Typography>
        <Grid container spacing={3} mb={4}>
          {availability.map((item, index) => (
            <AvailabilityPicker
              key={index}
              item={item}
              index={index}
              handleDateChange={handleDateChange}
            />
          ))}
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={addAvailabilityField}
            >
              Add Availability
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handlePublish}
            >
              Publish
            </Button>
          </Grid>
        </Grid>
      </Box>
      <SnackbarAlert
        open={openError}
        onClose={handleCloseError}
        message={errorMessage}
        severity="error"
      />
    </Container>
  );
};

export default PublishListing;
