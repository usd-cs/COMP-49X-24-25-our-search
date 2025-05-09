import React from 'react';
import { render, screen } from '@testing-library/react';
import MobileRedirectMessage, { MobileBlockPage } from '../components/MobileRedirect';
import useMediaQuery from '@mui/material/useMediaQuery';

jest.mock('@mui/material/useMediaQuery', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mq = useMediaQuery;      

afterEach(() => {
  jest.clearAllMocks();          
});

it('renders children on desktop', () => {
  mq.mockReturnValue(false);
  render(
    <MobileRedirectMessage>
      <div data-testid="desktop">desktop</div>
    </MobileRedirectMessage>
  );
  expect(screen.getByTestId('desktop')).toBeInTheDocument();
  expect(screen.queryByText(/Desktop Access Required/i)).toBeNull();
});

it('shows block notice on mobile', () => {
  mq.mockReturnValue(true);
  render(
    <MobileRedirectMessage>
      <span>hidden</span>
    </MobileRedirectMessage>
  );
  expect(screen.getByText(/Desktop Access Required/i)).toBeInTheDocument();
  expect(screen.queryByText(/hidden/)).toBeNull();
});

it('MobileBlockPage is hidden on desktop', () => {
  mq.mockReturnValue(false);
  const { container } = render(<MobileBlockPage />);
  expect(container.firstChild).toBeNull();
});

it('MobileBlockPage overlays on mobile', () => {
  mq.mockReturnValue(true);
  render(<MobileBlockPage />);
  expect(screen.getByText(/Desktop Access Required/i)).toBeInTheDocument();
});
