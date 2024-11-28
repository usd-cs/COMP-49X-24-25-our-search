import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostDialog from '../components/PostDialog';

const mockProject = {
  project_name: 'AI Research',
  description: 'Exploring AI in education.',
  desired_qualifications: 'Experience in Python and AI frameworks.',
  umbrella_topics: ['AI', 'Education'],
  research_periods: ['Spring 2024', 'Fall 2024'],
  is_active: true,
  majors: ['Computer Science', 'Education'],
  faculty: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@sandiego.edu',
  },
};

describe('PostDialog Component', () => {
  it('renders the project details correctly', () => {
    render(<PostDialog open={true} onClose={() => {}} project={mockProject} />);

    // Title
    expect(screen.getByText('AI Research')).toBeInTheDocument();

    // Description
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument();

    // Desired Qualifications
    expect(screen.getByText('Desired Qualifications:')).toBeInTheDocument();
    expect(screen.getByText('Experience in Python and AI frameworks.')).toBeInTheDocument();

    // Umbrella Topics
    expect(screen.getByText('Umbrella Topics:')).toBeInTheDocument();
    expect(screen.getByText('AI, Education')).toBeInTheDocument();

    // Research Periods
    expect(screen.getByText('Research Periods:')).toBeInTheDocument();
    expect(screen.getByText('Spring 2024, Fall 2024')).toBeInTheDocument();

    // Majors
    expect(screen.getByText('Majors:')).toBeInTheDocument();
    expect(screen.getByText('Computer Science, Education')).toBeInTheDocument();

    // Status
    expect(screen.getByText('Status:')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();

    // Faculty
    expect(screen.getByText('Faculty:')).toBeInTheDocument();
    expect(screen.getByText('John Doe (john.doe@sandiego.edu)')).toBeInTheDocument();
  });

  it('renders the close button and triggers onClose when clicked', () => {
    const handleClose = jest.fn();
    render(<PostDialog open={true} onClose={handleClose} project={mockProject} />);

    // Close button
    const closeButton = screen.getByText('X');
    expect(closeButton).toBeInTheDocument();

    // Event when clicked
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when project is null', () => {
    const { container } = render(<PostDialog open={true} onClose={() => {}} project={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('does not render when dialog is closed', () => {
    const { container } = render(<PostDialog open={false} onClose={() => {}} project={mockProject} />);
    expect(container.firstChild).toBeNull();
  });
});
