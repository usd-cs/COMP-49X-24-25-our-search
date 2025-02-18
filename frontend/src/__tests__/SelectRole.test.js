import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectRole from '../components/SelectRole';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('RoleSelection Component', () => {
  test('renders welcome messages and instructions', () => {
    renderWithTheme(<SelectRole />);
    
    expect(
      screen.getByRole('heading', { level: 1, name: /Welcome to OUR SEARCH/i })
    ).toBeInTheDocument();
    
    expect(
      screen.getByText(/Please select your role to continue/i)
    ).toBeInTheDocument();
  });

  test('does not show the continue button initially', () => {
    renderWithTheme(<SelectRole />);
    
    expect(
      screen.queryByRole('button', { name: /Continue as/i })
    ).not.toBeInTheDocument();
  });

  test('displays continue button after selecting the Student role', () => {
    renderWithTheme(<SelectRole />);
    
    const studentRole = screen.getByText('Student');
    fireEvent.click(studentRole);
    
    expect(
      screen.getByRole('button', { name: /Continue as Student/i })
    ).toBeInTheDocument();
  });

  test('displays continue button after selecting the Professor role', () => {
    renderWithTheme(<SelectRole />);
    
    const professorRole = screen.getByText('Professor');
    fireEvent.click(professorRole);
    
    expect(
      screen.getByRole('button', { name: /Continue as Professor/i })
    ).toBeInTheDocument();
  });
});
