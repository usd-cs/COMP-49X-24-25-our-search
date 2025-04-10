import { handleAddPeriod } from '../../../utils/adminFetching'

describe('handleAddPeriod', () => {
  let setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError

  const newPeriodName = 'Renaissance'

  beforeEach(() => {
    setLoadingResearchPeriods = jest.fn()
    getDataFrom = jest.fn()
    setResearchPeriods = jest.fn()
    setNewPeriodName = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if research period name is empty', async () => {
    await handleAddPeriod('  ', setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Error adding research period. Must have a name.')
    expect(setLoadingResearchPeriods).not.toHaveBeenCalled()
  })

  it('should set loading state while adding research period', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newPeriodName }])

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(true)
    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add research period', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newPeriodName }])

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/research-period'), {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newPeriodName })
    })
  })

  it('should update research periods after successfully adding a period', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    const newResearchPeriods = [{ id: 1, name: 'Renaissance' }]
    getDataFrom.mockResolvedValue(newResearchPeriods)

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setResearchPeriods).toHaveBeenCalledWith(newResearchPeriods)
    expect(setNewPeriodName).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if getDataFrom returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Period added, but there was an error loading updated research periods data.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding period: Renaissance.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })

    await handleAddPeriod(newPeriodName, setNewPeriodName, setResearchPeriods, setLoadingResearchPeriods, getDataFrom, setError)

    expect(setLoadingResearchPeriods).toHaveBeenCalledWith(false)
  })
})
