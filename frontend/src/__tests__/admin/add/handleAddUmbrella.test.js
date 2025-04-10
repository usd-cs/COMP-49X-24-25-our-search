import { handleAddUmbrella } from '../../../utils/adminFetching'

describe('handleAddUmbrella', () => {
  let setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError

  const newUmbrellaName = 'Technology'

  beforeEach(() => {
    setLoadingUmbrellaTopics = jest.fn()
    getDataFrom = jest.fn()
    setUmbrellaTopics = jest.fn()
    setNewUmbrellaName = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if umbrella topic name is empty', async () => {
    await handleAddUmbrella('  ', setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Error adding umbrella topic. Must have a name.')
    expect(setLoadingUmbrellaTopics).not.toHaveBeenCalled()
  })

  it('should set loading state while adding umbrella topic', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newUmbrellaName }])

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(true)
    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add umbrella topic', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newUmbrellaName }])

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/umbrella-topic'), {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUmbrellaName })
    })
  })

  it('should update umbrella topics after successfully adding a topic', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    const newUmbrellaTopics = [{ id: 1, name: 'Technology' }]
    getDataFrom.mockResolvedValue(newUmbrellaTopics)

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setUmbrellaTopics).toHaveBeenCalledWith(newUmbrellaTopics)
    expect(setNewUmbrellaName).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if getDataFrom returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Topic added, but there was an error loading updated umbrella topics data.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding topic: Technology.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })

    await handleAddUmbrella(newUmbrellaName, setNewUmbrellaName, setUmbrellaTopics, setLoadingUmbrellaTopics, getDataFrom, setError)

    expect(setLoadingUmbrellaTopics).toHaveBeenCalledWith(false)
  })
})
