import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { renderResearchPeriods } from '../../../components/admin/RenderAdminVariables'

describe('renderResearchPeriods Component', () => {
  const defaultProps = {
    loadingResearchPeriods: false,
    researchPeriods: [{ id: 1, name: 'Fall 2027' }, { id: 2, name: 'Spring 2027' }],
    editingIdPeriod: null,
    newPeriodName: '',
    setNewPeriodName: jest.fn(),
    setEditedNamePeriod: jest.fn(),
    handleEditPeriod: jest.fn(),
    handleCancelPeriodEdit: jest.fn(),
    handleBeginDeletePeriods: jest.fn(),
    handleSavePeriod: jest.fn(),
    handleAddPeriod: jest.fn()
  }

  it('should show loading state when loadingResearchPeriods is true', () => {
    render(renderResearchPeriods({ ...defaultProps, loadingResearchPeriods: true }))

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Research Periods')).toBeInTheDocument()
  })

  it('should render research periods list when loading is false', () => {
    render(renderResearchPeriods(defaultProps))

    expect(screen.getByText('Research Periods')).toBeInTheDocument()
    expect(screen.getByText('Fall 2027')).toBeInTheDocument()
    expect(screen.getByText('Spring 2027')).toBeInTheDocument()
  })

  it('should trigger handleEditPeriod when edit button is clicked', () => {
    render(renderResearchPeriods(defaultProps))

    const editButtons = screen.getAllByTestId('edit-period-btn')
    fireEvent.click(editButtons[0])

    expect(defaultProps.handleEditPeriod).toHaveBeenCalledWith(1, 'Fall 2027')
  })

  it('should trigger handleBeginDeletePeriods when delete button is clicked', () => {
    render(renderResearchPeriods(defaultProps))

    const deleteButtons = screen.getAllByTestId('delete-period-btn')
    fireEvent.click(deleteButtons[0])

    expect(defaultProps.handleBeginDeletePeriods).toHaveBeenCalledWith(1)
  })

  it('should show edit mode when editingIdPeriod is set', () => {
    render(renderResearchPeriods({ ...defaultProps, editingIdPeriod: 1 }))

    expect(screen.getAllByRole('textbox')[0]).toHaveValue('Fall 2027')
    expect(screen.getByTestId('save-period-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-period-btn')).toBeInTheDocument()
  })

  it('should call handleSavePeriod when save button is clicked', async () => {
    render(renderResearchPeriods({ ...defaultProps, editingIdPeriod: 1 }))

    const saveButton = screen.getByTestId('save-period-btn')
    fireEvent.click(saveButton)

    expect(defaultProps.handleSavePeriod).toHaveBeenCalledWith(1)
  })

  it('should call handleCancelPeriodEdit when cancel button is clicked', async () => {
    render(renderResearchPeriods({ ...defaultProps, editingIdPeriod: 1 }))

    const cancelButton = screen.getByTestId('cancel-period-btn')
    fireEvent.click(cancelButton)

    expect(defaultProps.handleCancelPeriodEdit).toHaveBeenCalledWith()
  })

  it('should update new research period name when input is changed', async () => {
    render(renderResearchPeriods(defaultProps))

    const input = screen.getByLabelText('New Research Period Name')
    fireEvent.change(input, { target: { value: 'Summer 2027' } })

    expect(defaultProps.setNewPeriodName).toHaveBeenCalledWith('Summer 2027')
  })

  it('should call handleAddPeriod when add button is clicked', async () => {
    render(renderResearchPeriods(defaultProps))

    const addButton = screen.getByTestId('add-period-btn')
    fireEvent.click(addButton)

    expect(defaultProps.handleAddPeriod).toHaveBeenCalled()
  })
})
