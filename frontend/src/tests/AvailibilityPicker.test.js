import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AvailabilityPicker from '../components/listings/AvailabilityPicker';
import dayjs from 'dayjs';

jest.mock('@mui/x-date-pickers', () => {
  return {
    DatePicker: jest.requireActual('@mui/x-date-pickers').DesktopDatePicker,
  };
});

describe('AvailabilityPicker Component', () => {
  const mockItem = {
    start: dayjs('2023-01-01'),
    end: dayjs('2023-01-14'),
  };

  it('renders DatePicker for start and end dates', () => {
    const handleDateChange = jest.fn();
    const { getByLabelText } = render(
      <AvailabilityPicker item={mockItem} index={0} handleDateChange={handleDateChange} />
    );

    const startDatePicker = getByLabelText('Start Date 1');
    const endDatePicker = getByLabelText('End Date 1');

    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker).toBeInTheDocument();
  });

  it('calls handleDateChange when a date is selected for start', () => {
    const handleDateChange = jest.fn();
    const { getByLabelText } = render(
      <AvailabilityPicker item={mockItem} index={0} handleDateChange={handleDateChange} />
    );

    const startDatePicker = getByLabelText('Start Date 1');
    expect(startDatePicker).toBeInTheDocument();
    fireEvent.change(startDatePicker, { target: { value: mockItem.start } });

    expect(handleDateChange).toHaveBeenCalledTimes(1);
  });

  it('calls handleDateChange when a date is selected for end', () => {
    const handleDateChange = jest.fn();
    const { getByLabelText } = render(
      <AvailabilityPicker item={mockItem} index={0} handleDateChange={handleDateChange} />
    );

    const endDatePicker = getByLabelText('End Date 1');
    expect(endDatePicker).toBeInTheDocument();
    fireEvent.change(endDatePicker, { target: { value: mockItem.end } });

    expect(handleDateChange).toHaveBeenCalledTimes(1);
  });

  it('renders indexes of pickers in order and triggers handle function for each', () => {
    const handleDateChange = jest.fn();
    const { getByLabelText } = render(
      <>
      <AvailabilityPicker item={mockItem} index={0} handleDateChange={handleDateChange} />
      <AvailabilityPicker item={mockItem} index={1} handleDateChange={handleDateChange} />
      </>
    );

    const endDatePicker = getByLabelText('End Date 1');
    const startDatePicker = getByLabelText('Start Date 1');
    const endDatePicker2 = getByLabelText('End Date 2');
    const startDatePicker2 = getByLabelText('Start Date 2');

    expect(endDatePicker).toBeInTheDocument();
    expect(startDatePicker).toBeInTheDocument();
    expect(endDatePicker2).toBeInTheDocument();
    expect(startDatePicker2).toBeInTheDocument();

    fireEvent.change(endDatePicker, { target: { value: mockItem.end } });
    fireEvent.change(startDatePicker, { target: { value: mockItem.start } });
    fireEvent.change(endDatePicker2, { target: { value: mockItem.end } });
    fireEvent.change(startDatePicker2, { target: { value: mockItem.start } });

    expect(handleDateChange).toHaveBeenCalledTimes(4);
  });
});
