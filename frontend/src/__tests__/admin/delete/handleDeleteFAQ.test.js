import { handleDelete } from "../../../utils/faqFetching"

describe('handleDelete', () => {
  let setLoading, setFAQs, setDeletingId, setOpenDeleteDialog, setError, FAQs

  beforeEach(() => {
    setLoading = jest.fn()
    setFAQs = jest.fn()
    setDeletingId = jest.fn()
    setOpenDeleteDialog = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()

    // Sample FAQs
    FAQs = [
      { id: 1, question: 'What is this app?', answer: 'A way for students to connect with faculty for research opportunities.' },
      { id: 2, question: 'How do I delete my account?', answer: 'Click on the upper right profile button. View profile. Delete button at bottom.' }
    ]
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should set loading state while deleting FAQ', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setLoading).toHaveBeenCalledWith(true)
    expect(setLoading).toHaveBeenCalledWith(false)
  })

  it('should make a DELETE request to remove the FAQ', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/faq'), {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'general', id: 1 })
    })
  })

  it('should update FAQs after successfully deleting an FAQ', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    // Asserts that the first one at index 0 from FAQs was deleted, so the second at index 1 still exists
    expect(setFAQs).toHaveBeenCalledWith([{ id: 2, question: FAQs[1].question, answer: FAQs[1].answer }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setDeletingId).toHaveBeenCalledWith(null)
    expect(setOpenDeleteDialog).toHaveBeenCalledWith(false)
  })

  it('should handle 400 error', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error deleting FAQ for general')
  })

  it('should set loading to false after successful deletion', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleDelete('general', 1, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setLoading).toHaveBeenCalledWith(false)
  })

  it('should NOT set loading to false if FAQ is not found', async () => {
    await handleDelete('general', 3, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setLoading).not.toHaveBeenCalledWith(false)
  })

  it('should set error if FAQ is not found', async () => {
    await handleDelete('general', 3, setLoading, FAQs, setFAQs, setDeletingId, setOpenDeleteDialog, setError)

    expect(setError).toHaveBeenCalledWith('FAQ not found.')
  })
})
