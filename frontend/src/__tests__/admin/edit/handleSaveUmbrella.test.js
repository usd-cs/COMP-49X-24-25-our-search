import { handleSaveUmbrella } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSaveUmbrella', () => {
  let setEditingIdUmbrella, setUmbrellaTopics, setError

  beforeEach(() => {
    setEditingIdUmbrella = jest.fn()
    setUmbrellaTopics = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should make a PUT request to save umbrella topic', async () => {
    const umbrellaTopics = [{ id: 1, name: 'Old Umbrella' }]
    const editedNameUmbrella = 'New Umbrella'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveUmbrella(1, editedNameUmbrella, umbrellaTopics, setUmbrellaTopics, setEditingIdUmbrella, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/umbrella-topic'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, name: editedNameUmbrella })
    })
  })

  it('should update umbrella topic successfully after saving', async () => {
    const umbrellaTopics = [{ id: 1, name: 'Old Umbrella' }]
    const editedNameUmbrella = 'New Umbrella'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveUmbrella(1, editedNameUmbrella, umbrellaTopics, setUmbrellaTopics, setEditingIdUmbrella, setError)

    expect(setUmbrellaTopics).toHaveBeenCalledWith([{ id: 1, name: editedNameUmbrella }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdUmbrella).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSaveUmbrella(1, 'New Umbrella', [], setUmbrellaTopics, setEditingIdUmbrella, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSaveUmbrella(1, 'New Umbrella', [], setUmbrellaTopics, setEditingIdUmbrella, setError)

    expect(setError).toHaveBeenCalledWith('New Umbrella cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSaveUmbrella(1, 'New Umbrella', [], setUmbrellaTopics, setEditingIdUmbrella, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating umbrella topic: New Umbrella.')
  })
})
