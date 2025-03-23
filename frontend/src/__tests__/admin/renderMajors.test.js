import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderMajors } from '../../components/admin/RenderAdminVariables'

describe('renderMajors Component', () => {
  const defaultProps = {
    loadingDisciplinesMajors: false,
    disciplines: [{ id: 1, name: 'Science' }, { id: 2, name: 'Arts' }],
    majors: [{ id: 1, name: 'Computer Science' }],
    selectedDisciplines: { 1: [{ id: 1, name: 'Science' }] },
    setSelectedDisciplines: jest.fn(),
    newMajorDisciplines: [],
    setNewMajorDisciplines: jest.fn(),
    editingIdMajor: null,
    newMajorName: '',
    setNewMajorName: jest.fn(),
    setEditedNameMajor: jest.fn(),
    handleEditMajor: jest.fn(),
    handleCancelMajorEdit: jest.fn(),
    handleBeginDeleteMajor: jest.fn(),
    handleSaveMajor: jest.fn(),
    handleAddMajor: jest.fn()
  }

  it('should show loading state when loadingDisciplinesMajors is true', () => {
    render(renderMajors({ ...defaultProps, loadingDisciplinesMajors: true }))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Majors')).toBeInTheDocument()
  })

  it('should render major list when loading is false', () => {
    render(renderMajors(defaultProps))

    expect(screen.getByText('Majors')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
  })

  it('should trigger handleEditMajor when edit button is clicked', () => {
    render(renderMajors(defaultProps))

    const editButton = screen.getByTestId('edit-major-btn')
    fireEvent.click(editButton)

    expect(defaultProps.handleEditMajor).toHaveBeenCalledWith(1, 'Computer Science')
  })

  it('should trigger handleBeginDeleteMajor when delete button is clicked', () => {
    render(renderMajors(defaultProps))

    const deleteButton = screen.getByTestId('delete-major-btn')
    fireEvent.click(deleteButton)

    expect(defaultProps.handleBeginDeleteMajor).toHaveBeenCalledWith(1)
  })

  it('should show edit mode when editingIdMajor is set', () => {
    render(renderMajors({ ...defaultProps, editingIdMajor: 1 }))

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Computer Science')
    expect(screen.getByTestId('save-major-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-major-btn')).toBeInTheDocument()
  })

  it('should call handleSaveMajor when save button is clicked', async () => {
    render(renderMajors({ ...defaultProps, editingIdMajor: 1 }))

    const saveButton = screen.getByTestId('save-major-btn')
    fireEvent.click(saveButton)

    expect(defaultProps.handleSaveMajor).toHaveBeenCalledWith(1)
  })

  it('should call handleCancelMajorEdit when cancel button is clicked', async () => {
    render(renderMajors({ ...defaultProps, editingIdMajor: 1 }))

    const cancelButton = screen.getByTestId('cancel-major-btn')
    fireEvent.click(cancelButton)

    expect(defaultProps.handleCancelMajorEdit).toHaveBeenCalledWith(1)
  })

  it('should update new major name when input is changed', async () => {
    render(renderMajors(defaultProps))

    const input = screen.getByLabelText('New Major Name')
    fireEvent.change(input, { target: { value: 'Mathematics' } })

    expect(defaultProps.setNewMajorName).toHaveBeenCalledWith('Mathematics')
  })

  it('should call handleAddMajor when add button is clicked', async () => {
    render(renderMajors(defaultProps))

    const addButton = screen.getByTestId('add-major-btn')
    fireEvent.click(addButton)

    expect(defaultProps.handleAddMajor).toHaveBeenCalled()
  })
})
