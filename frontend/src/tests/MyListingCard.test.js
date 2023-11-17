import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import MyListingCard from '../components/listings/MyListingCard';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/' }),
}));

const mockListing = {
  id: 'test-id',
  listing: {
    thumbnail: 'https://example.com/image.jpg',
    title: 'Sample Listing',
    metadata: {
      propertyType: 'House',
    },
    price: 100,
    rating: 4.5,
    reviews: [{}, {}, {}], // Assume three reviews for testing
  },
  buttonText: 'Go Live',
};

describe('MyListingCard Component', () => {
  it('renders listing information correctly', () => {
    const { getByText, getByTestId } = render(
      <Router>
        <MyListingCard listing={mockListing} />
      </Router>
    );

    // Check if elements with specific text content are rendered
    expect(getByText('Sample Listing')).toBeInTheDocument();
    expect(getByText('House')).toBeInTheDocument();
    expect(getByText(/100 AUD per night/)).toBeInTheDocument();
    expect(getByText('(3 reviews)')).toBeInTheDocument();

    // Check if image is rendered with the provided URL
    const image = getByTestId('my-listing-card-image');
    expect(image).toBeInTheDocument();
    const imageStyle = window.getComputedStyle(image);
    const backgroundImage = imageStyle.getPropertyValue('background-image');
    expect(backgroundImage).toEqual('url(https://example.com/image.jpg)');
  });
  it('Test buttons clicks', () => {
    const { getByText } = render(
      <Router>
        <MyListingCard listing={mockListing} />
      </Router>
    );

    // Check for the button element by text and role (button)
    const publishButton = getByText(/Go Live/);
    fireEvent.click(publishButton);
    expect(window.location.pathname).toBe('/publishlisting/test-id');

    const editButton = getByText('Edit');
    fireEvent.click(editButton);
    expect(window.location.pathname).toBe('/editlisting/test-id');
  });
  it('Test buttonText changes', () => {
    mockListing.buttonText = 'Unpublish';
    const onUnpublish = jest.fn();
    const { queryByText } = render(
      <Router>
        <MyListingCard listing={mockListing} onUnpublish={onUnpublish} />
      </Router>
    );
    expect(queryByText('Unpublish')).toBeInTheDocument();
    expect(queryByText('Go Live')).not.toBeInTheDocument();

    const UnpublishButton = queryByText(/Unpublish/);
    fireEvent.click(UnpublishButton);

    expect(onUnpublish).toHaveBeenCalledWith('test-id');
  });
});
