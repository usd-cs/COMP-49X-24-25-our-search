import { handleSavePeriod } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSavePeriod', () => {
  let setEditingIdPeriod, setResearchPeriods, setError

  beforeEach(() => {
    setEditingIdPeriod = jest.fn()
    setResearchPeriods = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should make a PUT request to save research period', async () => {
    const researchPeriods = [{ id: 1, name: 'Old Period' }]
    const editedNamePeriod = 'New Period'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSavePeriod(1, editedNamePeriod, setResearchPeriods, researchPeriods, setEditingIdPeriod, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/research-period'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, name: editedNamePeriod })
    })
  })

  it('should update research period successfully after saving', async () => {
    const researchPeriods = [{ id: 1, name: 'Old Period' }]
    const editedNamePeriod = 'New Period'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSavePeriod(1, editedNamePeriod, setResearchPeriods, researchPeriods, setEditingIdPeriod, setError)

    expect(setResearchPeriods).toHaveBeenCalledWith([{ id: 1, name: editedNamePeriod }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdPeriod).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSavePeriod(1, 'New Period', setResearchPeriods, [], setEditingIdPeriod, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSavePeriod(1, 'New Period', setResearchPeriods, [], setEditingIdPeriod, setError)

    expect(setError).toHaveBeenCalledWith('New Period cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSavePeriod(1, 'New Period', setResearchPeriods, [], setEditingIdPeriod, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating research period: New Period.')
  })
})
