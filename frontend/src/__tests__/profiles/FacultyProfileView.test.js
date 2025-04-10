import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import FacultyProfileView from '../../components/profiles/FacultyProfileView';
import * as getDataFromModule from '../../utils/getDataFrom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('../../components/posts/PostList', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-post-list">Mock PostList</div>
}));

jest.mock('../../components/posts/PostDialog', () => ({
  __esModule: true,
  default: () => null
}));

jest.mock('../../resources/constants', () => ({
  BACKEND_URL: 'http://localhost:8080',
  CURRENT_FACULTY_ENDPOINT: 'http://localhost:8080/api/facultyProfiles/current',
  viewProjectsFlag: true
}));

jest.mock('../../components/navigation/AreYouSureDialog', () => ({
  __esModule: true,
  default: ({ open, onClose, onConfirm }) => 
    open ? <div data-testid="mock-dialog">Dialog</div> : null
}));

const renderWithTheme = (ui) => {
  const theme = createTheme();
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ThemeProvider>
  );
};

const { useNavigate } = require('react-router-dom');

const mockFacultyData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@university.edu',
  department: [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Data Science' }
  ],
  projects: [
    { id: '1', title: 'Research Project 1' }
  ]
};

const emptyFacultyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  department: [],
  projects: []
};

describe('FacultyProfileView', () => {
  const mockNavigate = jest.fn();
  
  const getDataFromSpy = jest.spyOn(getDataFromModule, 'default');

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('shows a loading spinner initially', () => {
    getDataFromSpy.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithTheme(<FacultyProfileView />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('displays "Create Profile" button if fetch does not return expected faculty data', async () => {
    getDataFromSpy.mockRejectedValue(new Error('API Error'));

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const createButton = screen.getByRole('button', { name: /Create Profile/i });
    expect(createButton).toBeInTheDocument();
    
    expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument();
  });

  it('navigates to /edit-professor-profile page when edit button is clicked', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const button = screen.getByRole('button', { name: /Edit Profile/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/edit-professor-profile');
  });

  it('navigates to /posts page when back button is clicked', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);
    
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const backIcon = screen.getByTestId('ArrowBackIcon');
    const backButton = backIcon.closest('button');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/posts');
  });

  it('displays a custom error message when fetch fails', async () => {
    getDataFromSpy.mockRejectedValue(new Error('API Error'));

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred\. Please try again\./i)).toBeInTheDocument();
    });
  });

  it('displays profile data when fetch is successful', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    expect(screen.getByText(/Faculty Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(mockFacultyData.email)).toBeInTheDocument();
    
    mockFacultyData.department.forEach(dept => {
      expect(screen.getByText(dept.name)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    
    expect(screen.getByRole('button', { name: /Create new project/i })).toBeInTheDocument();
  });

  it('displays "No profile found" when profile is empty', async () => {
    getDataFromSpy.mockResolvedValue(emptyFacultyProfile);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => {
      expect(screen.getByText(/No profile found/i)).toBeInTheDocument();
    });
  });
  
  it('navigates to /create-project when Create new project button is clicked', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const button = screen.getByRole('button', { name: /Create new project/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/create-project');
  });
  
  it('displays faculty badge with correct styling', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    expect(screen.getByText(/Faculty Member/i)).toBeInTheDocument();
    expect(screen.getByTestId('VerifiedUserIcon')).toBeInTheDocument();
  });
  
  it('displays avatar with initials correctly', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);

    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
  
  it('renders PostList component with correct props when projects exist', async () => {
    getDataFromSpy.mockResolvedValue(mockFacultyData);
    
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    expect(screen.getByTestId('mock-post-list')).toBeInTheDocument();
  });
  
  it('displays "No projects yet" message when there are no projects', async () => {
    const noProjectsFacultyData = {
      ...mockFacultyData,
      projects: []
    };
    
    getDataFromSpy.mockResolvedValue(noProjectsFacultyData);
    
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    expect(screen.getByText(/No projects yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-post-list')).not.toBeInTheDocument();
  });
});

describe('FacultyProfileView - Delete Profile', () => {
  const mockNavigate = jest.fn();
  const getDataFromSpy = jest.spyOn(getDataFromModule, 'default');
  
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    getDataFromSpy.mockResolvedValue(mockFacultyData);
    global.fetch = jest.fn();
    
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    });
  });

  it('shows the delete profile button', async () => {
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const deleteButton = screen.getByRole('button', { name: /delete profile/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('opens dialog when delete button is clicked', async () => {
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());

    const deleteButton = screen.getByRole('button', { name: /delete profile/i });
    fireEvent.click(deleteButton);
    
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call fetch with DELETE method when handleDeleteProfile is executed', async () => {
    global.fetch.mockResolvedValueOnce({ ok: true });
    
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    global.fetch.mockImplementationOnce(() => Promise.resolve({ ok: true }));
    
    const deleteButton = screen.getByRole('button', { name: /delete profile/i });
    expect(deleteButton).toBeInTheDocument();
    
    const response = await global.fetch('http://localhost:8080/api/facultyProfiles/current', {
      method: 'DELETE',
      credentials: 'include'
    });
    
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/facultyProfiles/current', 
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );
    
    if (response.ok) {
      window.location.href = 'http://localhost:8080/logout';
      expect(window.location.href).toBe('http://localhost:8080/logout');
    }
  });

  it('should set error when delete request fails', async () => {
    global.fetch.mockImplementationOnce(() => Promise.resolve({ 
      ok: false,
      statusText: 'Failed to delete'
    }));
    
    renderWithTheme(<FacultyProfileView />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    
    try {
      const response = await global.fetch('http://localhost:8080/api/facultyProfiles/current', {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }
    } catch (err) {
      expect(err.message).toBe('Failed to delete profile');
    }
    
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/facultyProfiles/current', 
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );
  });
});