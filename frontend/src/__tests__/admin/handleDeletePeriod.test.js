import { handleDeletePeriod } from '../../utils/adminFetching'

describe('handleDeletePeriod', () => {
  let setLoadingResearchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError, researchPeriods

  beforeEach(() => {
    setLoadingResearchPeriods = jest.fn()
    setPeriods = jest.fn()
    setDeletingIdPeriod = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    // Sample researchPeriods
    researchPeriods = [
      { id: 1, name: 'Fall 2029' },
      { id: 2, name: 'Summer 2026' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setLoadingResearchPeriods(true) to set loading state while deleting research period', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(true)
    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the research period', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/research-period'), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update researchPeriods after successfully deleting the research period', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setPeriods).toHaveBeenCalledWith([{ id: 2, name: 'Summer 2026' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingIdPeriod).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set error if the DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error if research period has connections (409)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Fall 2029 cannot be deleted because it has connections to other projects and/or students. Please edit or remove those connections first. Remove connections, then try again.')
  })

  it('should set an error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting research period: Fall 2029.')
  })

  it('should call setLoadingResearchPeriods(false) after succesful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeletePeriod(1, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(false)
  })

  it('should NOT call setLoadingResearchPeriods(false) to keep loading if research period not found', async () => {
    await handleDeletePeriod(3, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setLoadingResearchPeriods).not.toHaveBeenCalledWith(false)
  })

  it('should set error message if research period not found', async () => {
    await handleDeletePeriod(3, setLoadingResearchPeriods, researchPeriods, setPeriods, setDeletingIdPeriod, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Research period not found.')
  })
})
