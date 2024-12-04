import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostDialog from '../components/PostDialog';
import { mockOneActiveProject } from '../resources/mockData';

describe('PostDialog Component', () => {
  it('renders the project details correctly', () => {
    render(<PostDialog onClose={() => {}} post={mockOneActiveProject} />);

    // Title
    expect(screen.getByText('AI Research')).toBeInTheDocument();

    // Description
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Exploring AI in education.')).toBeInTheDocument();

    // Desired Qualifications
    expect(screen.getByText('Qualifications:')).toBeInTheDocument();
    expect(screen.getByText('Experience in Python and AI frameworks.')).toBeInTheDocument();

    // Umbrella Topics
    expect(screen.getByText('Topics:')).toBeInTheDocument();
    expect(screen.getByText('AI, Education')).toBeInTheDocument();

    // Research Periods
    expect(screen.getByText('Periods:')).toBeInTheDocument();
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
    render(<PostDialog onClose={handleClose} post={mockOneActiveProject} />);

    // Close button
    const closeButton = screen.getByText('X');
    expect(closeButton).toBeInTheDocument();

    // Simulate click event
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not render when project is null', () => {
    const { container } = render(<PostDialog onClose={() => {}} post={null} />);
    expect(container.firstChild).toBeNull();
  });
});
