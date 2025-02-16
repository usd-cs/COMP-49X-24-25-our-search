import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; 
import LandingPage from '../components/LandingPage';


describe('LandingPage component', () => {
  it('renders the heading "Our Search"', () => {
    render(<LandingPage />);
    const heading = screen.getByText(/our search/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the "FAKE LOGIN" button', () => {
    render(<LandingPage />);
    const loginButton = screen.getByRole('button', { name: /fake login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('redirects to http://localhost:8080 when the "FAKE LOGIN" button is clicked', () => {
    delete window.location;
    window.location = { href: '' };

    render(<LandingPage />);
    const loginButton = screen.getByRole('button', { name: /fake login/i });
    userEvent.click(loginButton);

    expect(window.location.href).toBe('http://localhost:8080');
  });

  // 4. Renders descriptive text
  it('renders descriptive text about the SEARCH project', () => {
    render(<LandingPage />);
    const description = screen.getByText(
      /The SEARCH project enhances student-faculty collaboration/i
    );
    expect(description).toBeInTheDocument();
  });

  it('renders "Streamlined Profiles" heading', () => {
    render(<LandingPage />);
    const streamlinedProfiles = screen.getByText(/Streamlined Profiles/i);
    expect(streamlinedProfiles).toBeInTheDocument();
  });

  it('renders "Advanced Filtering" heading', () => {
    render(<LandingPage />);
    const advancedFiltering = screen.getByText(/Advanced Filtering/i);
    expect(advancedFiltering).toBeInTheDocument();
  });

  it('renders "Real-Time Notifications" heading', () => {
    render(<LandingPage />);
    const notifications = screen.getByText(/Real-Time Notifications/i);
    expect(notifications).toBeInTheDocument();
  });
});
