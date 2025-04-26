import { handleAddEmail } from '../../../utils/adminFetching'
import { ADMIN_EMAIL_URL } from '../../../resources/constants'

describe('handleAddEmail', () => {
  let setLoading, setAdminEmails, setNewEmail, setError, getDataFrom
  const newEmail = 'test@sandiego.edu'

  beforeEach(() => {
    setLoading = jest.fn()
    setAdminEmails = jest.fn()
    setNewEmail = jest.fn()
    setError = jest.fn()
    getDataFrom = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if email is empty', async () => {
    await handleAddEmail('  ', setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setError).toHaveBeenCalledWith('Error adding admin email. Cannot be blank.')
    expect(setLoading).not.toHaveBeenCalled()
  })

  it('should set loading state while adding email', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, email: newEmail }])

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add email', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, email: newEmail }])

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(fetch).toHaveBeenCalledWith(ADMIN_EMAIL_URL, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail })
    })
  })

  it('should update emails after successfully adding an email', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, email: newEmail }])

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setAdminEmails).toHaveBeenCalledWith([{ id: 1, email: newEmail }])
    expect(setNewEmail).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if getDataFrom returns empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setError).toHaveBeenCalledWith('Email added for, but there was an error loading updated data. Please refresh this page.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding email.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, email: newEmail }])

    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)

    expect(setLoading).toHaveBeenCalledWith(false)
  })
})
