import React from 'react';
import { render } from '@testing-library/react';
import ThumbnailUpload from '../components-test/listings/ThumbnailUpload';

describe('ThumbnailUpload Component', () => {
  it('renders upload button', () => {
    const { getByText } = render(<ThumbnailUpload />);

    const uploadButton = getByText('Upload Thumbnail');
    expect(uploadButton).toBeInTheDocument();
  });

  it('renders thumbnail preview when provided', () => {
    const thumbnailPreviewUrl = 'https://example.com/thumbnail.png';
    const { getByAltText } = render(<ThumbnailUpload thumbnailPreview={thumbnailPreviewUrl} />);

    const thumbnailPreview = getByAltText('Thumbnail Preview');
    expect(thumbnailPreview).toBeInTheDocument();
    expect(thumbnailPreview).toHaveAttribute('src', thumbnailPreviewUrl);
  });
});
