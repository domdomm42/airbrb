import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';

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
            <React.Fragment key={index}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={`Start Date ${index + 1}`}
                      value={item.start}
                      onChange={(date) => handleDateChange(date, index, 'start')}
                      textField={(props) => <TextField {...props} InputLabelProps={{ shrink: true }} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label={`End Date ${index + 1}`}
                      value={item.end}
                      onChange={(date) => handleDateChange(date, index, 'end')}
                      textField={(props) => <TextField {...props} InputLabelProps={{ shrink: true }} />}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid>
            </React.Fragment>
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
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PublishListing;
