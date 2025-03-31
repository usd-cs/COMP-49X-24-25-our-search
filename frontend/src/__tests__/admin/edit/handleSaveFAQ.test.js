import { handleSave } from "../../../utils/faqFetching"

describe('handleSave', () => {
  let setFAQs, setEditingId, setError

  const FAQs = [{ id: 1, question: 'Old Question?', answer: 'Old Answer.' }]
  const editedQuestion = 'Updated Question?'
  const editedAnswer = 'Updated Answer.'
  const type = 'general'
  const id = 1

  beforeEach(() => {
    setFAQs = jest.fn()
    setEditingId = jest.fn()
    setError = jest.fn()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should make a PUT request to save FAQ', async () => {
    global.fetch.mockResolvedValue({ ok: true })

    await handleSave(type, id, editedQuestion, editedAnswer, FAQs, setFAQs, setEditingId, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/faq'), {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type, question: editedQuestion, answer: editedAnswer })
    })
  })

  it('should update FAQ successfully after saving', async () => {
    global.fetch.mockResolvedValue({ ok: true })

    await handleSave(type, id, editedQuestion, editedAnswer, FAQs, setFAQs, setEditingId, setError)

    expect(setFAQs).toHaveBeenCalledWith([{ id: 1, question: editedQuestion, answer: editedAnswer }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingId).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSave(type, id, editedQuestion, editedAnswer, FAQs, setFAQs, setEditingId, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSave(type, id, editedQuestion, editedAnswer, FAQs, setFAQs, setEditingId, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating FAQ for general.')
  })
})