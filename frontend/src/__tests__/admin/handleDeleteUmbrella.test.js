import { handleDeleteUmbrella } from '../../utils/adminFetching'

describe('handleDeleteUmbrella', () => {
  let setLoadingUmbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError, umbrellaTopics

  beforeEach(() => {
    setLoadingUmbrellaTopics = jest.fn()
    setUmbrellaTopics = jest.fn()
    setDeletingIdUmbrella = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    // Sample umbrella topics
    umbrellaTopics = [
      { id: 1, name: 'Culture' },
      { id: 2, name: 'Diversity' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call setLoadingUmbrellaTopics(true) to set loading state while deleting umbrella topic', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(true)
    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the umbrella topic', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/umbrella-topic'), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update umbrella topics after successfully deleting the umbrella topic', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setUmbrellaTopics).toHaveBeenCalledWith([{ id: 2, name: 'Diversity' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingIdUmbrella).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set error if the DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error if umbrella topic has connections (409)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Culture cannot be deleted because it has connections to other projects. Please edit or remove those connections first. Remove connections, then try again.')
  })

  it('should set an error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting topic: Culture.')
  })

  it('should call setLoadingUmbrellaTopics(false) after succesful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteUmbrella(1, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(false)
  })

  it('should NOT call setLoadingUmbrellaTopics(false) to keep loading if umbrella topic not found', async () => {
    await handleDeleteUmbrella(3, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setLoadingUmbrellaTopics).not.toHaveBeenCalledWith(false)
  })

  it('should set error message if umbrella topic not found', async () => {
    await handleDeleteUmbrella(3, setLoadingUmbrellaTopics, umbrellaTopics, setUmbrellaTopics, setDeletingIdUmbrella, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Umbrella topic not found.')
  })
})
