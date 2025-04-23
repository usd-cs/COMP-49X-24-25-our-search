import { handleDeleteEmail } from "../../../utils/adminFetching"
import { ADMIN_EMAIL_URL } from "../../../resources/constants"

describe('handleDeleteEmail', () => {
  let setLoading, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError, adminEmails

  beforeEach(() => {
    setLoading = jest.fn()
    setAdminEmails = jest.fn()
    setDeletingId = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    adminEmails = [
      { id: 1, email: 'admin1@sandiego.edu' },
      { id: 2, email: 'admin2@sandiego.edu' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should set loading to true while deleting email', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteEmail(1, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to delete the email', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteEmail(1, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(ADMIN_EMAIL_URL, {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 })
    })
  })

  it('should update admin emails after successful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDeleteEmail(1, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(setAdminEmails).toHaveBeenCalledWith([{ id: 2, email: 'admin2@sandiego.edu' }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingId).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should set error if DELETE request is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDeleteEmail(1, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set error for unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDeleteEmail(1, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting email')
  })

  it('should not proceed if email is not found', async () => {
    await handleDeleteEmail(3, setLoading, adminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Email not found.')
    expect(fetch).not.toHaveBeenCalled()
    expect(setLoading).not.toHaveBeenCalledWith(false) // `finally` should still fire but no fetch means only first `setLoading(true)`
  })
})
