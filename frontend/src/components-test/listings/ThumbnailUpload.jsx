import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const ThumbnailUpload = ({ onThumbnailChange, thumbnailPreview }) => {
  return (
    <Box>
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
    </Box>
  );
};

export default ThumbnailUpload;
