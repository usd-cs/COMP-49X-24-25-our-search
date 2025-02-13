import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StudentProfileForm from '../components/StudentProfileForm';

describe('StudentProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields and the submit button', () => {
    render(<StudentProfileForm />);
    
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Major/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Class Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Research Field Interests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Research Periods Interest/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Interest Reason/i)).toBeInTheDocument();
    expect(screen.getByText(/Do you have prior research experience/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Profile/i })).toBeInTheDocument();
  });

  it('submits the form with the correct data', async () => {
    // Verify the submission data
    console.log = jest.fn();

    render(<StudentProfileForm />);

    // Fill out text fields
    await userEvent.type(screen.getByLabelText(/Name/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/Email/i), 'jane.doe@example.com');
    await userEvent.type(screen.getByLabelText(/Major/i), 'Computer Science');

    // Click the select to open options, then click the "Senior" option.
    const selectElement = screen.getByLabelText(/Class Status/i);
    await userEvent.click(selectElement);
    const seniorOption = await screen.findByRole('option', { name: 'Senior' });
    await userEvent.click(seniorOption);

    // Fill out remaining text fields
    await userEvent.type(
      screen.getByLabelText(/Research Field Interests/i),
      'Artificial Intelligence, Machine Learning'
    );
    await userEvent.type(
      screen.getByLabelText(/Research Periods Interest/i),
      'Fall 2024, Spring 2025'
    );
    await userEvent.type(
      screen.getByLabelText(/Interest Reason/i),
      'I want to gain research experience and contribute to innovative projects.'
    );

    // Click the radio button for prior experience
    await userEvent.click(screen.getByLabelText(/Yes/i));

    // Submit the form
    await userEvent.click(screen.getByRole('button', { name: /Create Profile/i }));

    expect(console.log).toHaveBeenCalledWith('Submitted data: ', {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      major: 'Computer Science',
      classStatus: 'Senior',
      researchFieldInterests: 'Artificial Intelligence, Machine Learning',
      researchPeriodsInterest: 'Fall 2024, Spring 2025',
      interestReason: 'I want to gain research experience and contribute to innovative projects.',
      hasPriorExperience: 'yes',
    });
  });
});
