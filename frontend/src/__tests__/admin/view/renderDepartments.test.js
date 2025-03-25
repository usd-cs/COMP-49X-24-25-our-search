import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderDepartments } from '../../../components/admin/RenderAdminVariables'

describe('renderDepartments Component', () => {
  const defaultProps = {
    loadingDepartments: false,
    departments: [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Physics' }],
    editingIdDepartment: null,
    newDepartmentName: '',
    setNewDepartmentName: jest.fn(),
    setEditedNameDepartment: jest.fn(),
    handleEditDepartment: jest.fn(),
    handleCancelDepartmentEdit: jest.fn(),
    handleBeginDeleteDepartment: jest.fn(),
    handleSaveDepartment: jest.fn(),
    handleAddDepartment: jest.fn()
  }

  it('should show loading state when loadingDepartments is true', () => {
    render(renderDepartments({ ...defaultProps, loadingDepartments: true }))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Departments')).toBeInTheDocument()
  })

  it('should render departments list when loading is false', () => {
    render(renderDepartments(defaultProps))

    expect(screen.getByText('Departments')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('Physics')).toBeInTheDocument()
  })

  it('should trigger handleEditDepartment when edit button is clicked', () => {
    render(renderDepartments(defaultProps))

    const editButtons = screen.getAllByTestId('edit-department-btn')
    fireEvent.click(editButtons[0])

    expect(defaultProps.handleEditDepartment).toHaveBeenCalledWith(1, 'Computer Science')
  })

  it('should trigger handleBeginDeleteDepartment when delete button is clicked', () => {
    render(renderDepartments(defaultProps))

    const deleteButtons = screen.getAllByTestId('delete-department-btn')
    fireEvent.click(deleteButtons[0])

    expect(defaultProps.handleBeginDeleteDepartment).toHaveBeenCalledWith(1)
  })

  it('should show edit mode when editingIdDepartment is set', () => {
    render(renderDepartments({ ...defaultProps, editingIdDepartment: 1 }))

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Computer Science')
    expect(screen.getByTestId('save-department-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-department-btn')).toBeInTheDocument()
  })

  it('should call handleSaveDepartment when save button is clicked', async () => {
    render(renderDepartments({ ...defaultProps, editingIdDepartment: 1 }))

    const saveButton = screen.getByTestId('save-department-btn')
    fireEvent.click(saveButton)

    expect(defaultProps.handleSaveDepartment).toHaveBeenCalledWith(1)
  })

  it('should call handleCancelDepartmentEdit when cancel button is clicked', async () => {
    render(renderDepartments({ ...defaultProps, editingIdDepartment: 1 }))

    const cancelButton = screen.getByTestId('cancel-department-btn')
    fireEvent.click(cancelButton)

    expect(defaultProps.handleCancelDepartmentEdit).toHaveBeenCalledWith(1)
  })

  it('should update new department name when input is changed', async () => {
    render(renderDepartments(defaultProps))

    const input = screen.getByLabelText('New Department Name')
    fireEvent.change(input, { target: { value: 'Mathematics' } })

    expect(defaultProps.setNewDepartmentName).toHaveBeenCalledWith('Mathematics')
  })

  it('should call handleAddDepartment when add button is clicked', async () => {
    render(renderDepartments(defaultProps))

    const addButton = screen.getByTestId('add-department-btn')
    fireEvent.click(addButton)

    expect(defaultProps.handleAddDepartment).toHaveBeenCalled()
  })
})
