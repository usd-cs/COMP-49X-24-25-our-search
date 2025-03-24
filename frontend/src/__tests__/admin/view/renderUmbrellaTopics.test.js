import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderUmbrellaTopics } from '../../../components/admin/RenderAdminVariables'

describe('renderUmbrellaTopics Component', () => {
  const defaultProps = {
    loadingUmbrellaTopics: false,
    umbrellaTopics: [{ id: 1, name: 'Technology' }, { id: 2, name: 'Health' }],
    editingIdUmbrella: null,
    newUmbrellaName: '',
    setNewUmbrellaName: jest.fn(),
    setEditedNameUmbrella: jest.fn(),
    handleEditUmbrella: jest.fn(),
    handleCancelUmbrellaEdit: jest.fn(),
    handleBeginDeleteUmbrella: jest.fn(),
    handleSaveUmbrella: jest.fn(),
    handleAddUmbrella: jest.fn()
  }

  it('should show loading state when loadingUmbrellaTopics is true', () => {
    render(renderUmbrellaTopics({ ...defaultProps, loadingUmbrellaTopics: true }))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Umbrella Topics')).toBeInTheDocument()
  })

  it('should render umbrella topics list when loading is false', () => {
    render(renderUmbrellaTopics(defaultProps))

    expect(screen.getByText('Umbrella Topics')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
  })

  it('should trigger handleEditUmbrella when edit button is clicked', () => {
    render(renderUmbrellaTopics(defaultProps))

    const editButtons = screen.getAllByTestId('edit-umbrella-btn')
    fireEvent.click(editButtons[0])

    expect(defaultProps.handleEditUmbrella).toHaveBeenCalledWith(1, 'Technology')
  })

  it('should trigger handleBeginDeleteUmbrella when delete button is clicked', () => {
    render(renderUmbrellaTopics(defaultProps))

    const deleteButtons = screen.getAllByTestId('delete-umbrella-btn')
    fireEvent.click(deleteButtons[0])

    expect(defaultProps.handleBeginDeleteUmbrella).toHaveBeenCalledWith(1)
  })

  it('should show edit mode when editingIdUmbrella is set', () => {
    render(renderUmbrellaTopics({ ...defaultProps, editingIdUmbrella: 1 }))

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Technology')
    expect(screen.getByTestId('save-umbrella-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-umbrella-btn')).toBeInTheDocument()
  })

  it('should call handleSaveUmbrella when save button is clicked', async () => {
    render(renderUmbrellaTopics({ ...defaultProps, editingIdUmbrella: 1 }))

    const saveButton = screen.getByTestId('save-umbrella-btn')
    fireEvent.click(saveButton)

    expect(defaultProps.handleSaveUmbrella).toHaveBeenCalledWith(1)
  })

  it('should call handleCancelUmbrellaEdit when cancel button is clicked', async () => {
    render(renderUmbrellaTopics({ ...defaultProps, editingIdUmbrella: 1 }))

    const cancelButton = screen.getByTestId('cancel-umbrella-btn')
    fireEvent.click(cancelButton)

    expect(defaultProps.handleCancelUmbrellaEdit).toHaveBeenCalledWith(1)
  })

  it('should update new umbrella topic name when input is changed', async () => {
    render(renderUmbrellaTopics(defaultProps))

    const input = screen.getByLabelText('New Umbrella Topic Name')
    fireEvent.change(input, { target: { value: 'Education' } })

    expect(defaultProps.setNewUmbrellaName).toHaveBeenCalledWith('Education')
  })

  it('should call handleAddUmbrella when add button is clicked', async () => {
    render(renderUmbrellaTopics(defaultProps))

    const addButton = screen.getByTestId('add-umbrella-btn')
    fireEvent.click(addButton)

    expect(defaultProps.handleAddUmbrella).toHaveBeenCalled()
  })
})
