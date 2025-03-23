import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderDisciplines } from '../../components/admin/RenderAdminVariables'

describe('renderDisciplines Component', () => {
  const defaultProps = {
    loadingDisciplinesMajors: false,
    disciplines: [{ id: 1, name: 'Computer Science' }, { id: 2, name: 'Arts' }],
    editingIdDiscipline: null,
    newDisciplineName: '',
    setNewDisciplineName: jest.fn(),
    setEditedNameDiscipline: jest.fn(),
    handleEditDiscipline: jest.fn(),
    handleCancelDisciplineEdit: jest.fn(),
    handleBeginDeleteDiscipline: jest.fn(),
    handleSaveDiscipline: jest.fn(),
    handleAddDiscipline: jest.fn()
  }

  it('should show loading state when loadingDisciplinesMajors is true', () => {
    render(renderDisciplines({ ...defaultProps, loadingDisciplinesMajors: true }))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Disciplines')).toBeInTheDocument()
  })

  it('should render disciplines list when loading is false', () => {
    render(renderDisciplines(defaultProps))

    expect(screen.getByText('Disciplines')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('Arts')).toBeInTheDocument()
  })

  it('should trigger handleEditDiscipline when edit button is clicked', () => {
    render(renderDisciplines(defaultProps))

    const editButtons = screen.getAllByTestId('edit-discipline-btn')
    fireEvent.click(editButtons[0])

    expect(defaultProps.handleEditDiscipline).toHaveBeenCalledWith(1, 'Computer Science')
  })

  it('should trigger handleBeginDeleteDiscipline when delete button is clicked', () => {
    render(renderDisciplines(defaultProps))

    const deleteButtons = screen.getAllByTestId('delete-discipline-btn')
    fireEvent.click(deleteButtons[0])

    expect(defaultProps.handleBeginDeleteDiscipline).toHaveBeenCalledWith(1)
  })

  it('should show edit mode when editingIdDiscipline is set', () => {
    render(renderDisciplines({ ...defaultProps, editingIdDiscipline: 1 }))

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Computer Science')
    expect(screen.getByTestId('save-discipline-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-discipline-btn')).toBeInTheDocument()
  })

  it('should call handleSaveDiscipline when save button is clicked', async () => {
    render(renderDisciplines({ ...defaultProps, editingIdDiscipline: 1 }))

    const saveButton = screen.getByTestId('save-discipline-btn')
    fireEvent.click(saveButton)

    expect(defaultProps.handleSaveDiscipline).toHaveBeenCalledWith(1)
  })

  it('should call handleCancelDisciplineEdit when cancel button is clicked', async () => {
    render(renderDisciplines({ ...defaultProps, editingIdDiscipline: 1 }))

    const cancelButton = screen.getByTestId('cancel-discipline-btn')
    fireEvent.click(cancelButton)

    expect(defaultProps.handleCancelDisciplineEdit).toHaveBeenCalledWith(1)
  })

  it('should update new discipline name when input is changed', async () => {
    render(renderDisciplines(defaultProps))

    const input = screen.getByLabelText('New Discipline Name')
    fireEvent.change(input, { target: { value: 'Mathematics' } })

    expect(defaultProps.setNewDisciplineName).toHaveBeenCalledWith('Mathematics')
  })

  it('should call handleAddDiscipline when add button is clicked', async () => {
    render(renderDisciplines(defaultProps))

    const addButton = screen.getByTestId('add-discipline-btn')
    fireEvent.click(addButton)

    expect(defaultProps.handleAddDiscipline).toHaveBeenCalled()
  })
})
