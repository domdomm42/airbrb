import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const SearchBar = ({ searchTerm, setSearchTerm, handleSearchAndFilters }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, ml: 2, mt: -6 }}>
      <TextField
        label="Search Listings"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mr: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearchAndFilters}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
