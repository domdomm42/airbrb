import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../components-test/Searchbar';

describe('SearchBar Component', () => {
  it('renders search bar with button', () => {
    const searchTerm = 'LOOKING FOR A LISTING';
    const setSearchTerm = jest.fn();
    const handleSearchAndFilters = jest.fn();

    const { getByLabelText, getByRole } = render(
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearchAndFilters={handleSearchAndFilters}
      />
    );

    const searchInput = getByLabelText('Search Listings');
    const searchButton = getByRole('button', { name: 'Search' });

    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('LOOKING FOR A LISTING');
    expect(searchButton).toBeInTheDocument();
  });

  it('triggers setSearchTerm on input change', () => {
    const setSearchTerm = jest.fn();
    const handleSearchAndFilters = jest.fn();

    const { getByLabelText } = render(
      <SearchBar
        searchTerm=""
        setSearchTerm={setSearchTerm}
        handleSearchAndFilters={handleSearchAndFilters}
      />
    );

    const searchInput = getByLabelText('Search Listings');

    fireEvent.change(searchInput, { target: { value: 'LOOKING FOR ANOTHER LISTING' } });

    expect(setSearchTerm).toHaveBeenCalledTimes(1);
    expect(setSearchTerm).toHaveBeenCalledWith('LOOKING FOR ANOTHER LISTING');
  });

  it('triggers handleSearchAndFilters on button click', () => {
    const setSearchTerm = jest.fn();
    const handleSearchAndFilters = jest.fn();

    const { getByRole } = render(
      <SearchBar
        searchTerm=""
        setSearchTerm={setSearchTerm}
        handleSearchAndFilters={handleSearchAndFilters}
      />
    );

    const searchButton = getByRole('button', { name: 'Search' });

    fireEvent.click(searchButton);

    expect(handleSearchAndFilters).toHaveBeenCalledTimes(1);
  });
});
