import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SnackbarAlert from '../components-test/SnackbarAlert';

describe('SnackbarAlert Component', () => {
  it('renders SnackbarAlert with given message and severity', async () => {
    const message = 'Test message';
    const severity = 'error';

    const { getByText } = render(
      <SnackbarAlert open={true} onClose={() => {}} message={message} severity={severity} />
    );

    const alertElement = getByText(message);
    expect(alertElement).toBeInTheDocument();
  });

  it('closes SnackbarAlert on close button click', async () => {
    const handleClose = jest.fn();
    const message = 'Test message';
    const severity = 'error';

    const { getByRole } = render(
      <SnackbarAlert open={true} onClose={handleClose} message={message} severity={severity} />
    );

    const closeButton = getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it('auto hides SnackbarAlert after 5 seconds', async () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    const message = 'Test message';
    const severity = 'error';

    render(<SnackbarAlert open={true} onClose={handleClose} message={message} severity={severity} />);

    jest.advanceTimersByTime(5000);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
