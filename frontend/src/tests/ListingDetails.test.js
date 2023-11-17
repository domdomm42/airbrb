import React from 'react';
import { render } from '@testing-library/react';
import ListingDetails from '../components-test/listings/ListingDetails';

const mockListingDetails = {
  listing: {
    address: '45 Sussex St, Blacktown NSW 2148',
    metadata: {
      propertyType: 'House',
      bathrooms: 2,
      bedrooms: 3,
      bedroomDetails: [{}, {}, {}, {}], // Assume three bedrooms for testing
      amenities: ['WiFi', 'Parking', 'Gym'],
    },
    price: '10000',
  },
};

describe('ListingDetails Component', () => {
  it('renders listing details correctly', () => {
    const { getByText } = render(
      <ListingDetails listingDetails={mockListingDetails} priceType="per night" />
    );

    expect(getByText('Address')).toBeInTheDocument();
    expect(getByText('45 Sussex St, Blacktown NSW 2148')).toBeInTheDocument();

    expect(getByText('Type')).toBeInTheDocument();
    expect(getByText('House')).toBeInTheDocument();

    expect(getByText('Price (per night)')).toBeInTheDocument();
    expect(getByText('10000')).toBeInTheDocument();

    expect(getByText('Baths')).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();

    expect(getByText('Beds')).toBeInTheDocument();
    expect(getByText('3')).toBeInTheDocument();

    expect(getByText('Bedrooms')).toBeInTheDocument();
    expect(getByText('4')).toBeInTheDocument();

    expect(getByText('Amenities')).toBeInTheDocument();
    expect(getByText('WiFi')).toBeInTheDocument();
    expect(getByText('Parking')).toBeInTheDocument();
    expect(getByText('Gym')).toBeInTheDocument();
  });
});
