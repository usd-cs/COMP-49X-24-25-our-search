import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacyPolicy from '../components/PrivacyPolicy.js'

describe('PrivacyPolicy Component', () => {
  beforeEach(() => {
    render(<PrivacyPolicy />);
  });

  test('renders the privacy policy title', () => {
    expect(screen.getByText(/OUR SEARCH Privacy Policy/i)).toBeInTheDocument();
  });

  test('renders key section headings', () => {
    expect(screen.getByText('1 | Who we are')).toBeInTheDocument();
    expect(screen.getByText('4 | How we share')).toBeInTheDocument();
    expect(screen.getByText('7 | Security')).toBeInTheDocument();
  });

  test('ensures section 10 is missing', () => {
    expect(screen.queryByText(/10 \| Children/i)).not.toBeInTheDocument();
  });

  test('renders important content about data protection', () => {
    expect(screen.getByText(/never sell/i)).toBeInTheDocument();
    expect(screen.getByText(/Google OAuth/i)).toBeInTheDocument();
  });
});