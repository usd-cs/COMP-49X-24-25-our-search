import { handleAdd } from '../../../utils/faqFetching'

describe('handleAdd', () => {
  let setNewQuestion, setNewAnswer, setFAQs, setLoading, setError

  const newQuestion = 'What is this app?'
  const newAnswer = 'A place to look at research opportunities.'
  const type = 'student'

  beforeEach(() => {
    setNewQuestion = jest.fn()
    setNewAnswer = jest.fn()
    setFAQs = jest.fn()
    setLoading = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if question is empty', async () => {
    await handleAdd(type, '  ', newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

    expect(setError).toHaveBeenCalledWith('Error adding FAQ. Must have a question.')
    expect(setLoading).not.toHaveBeenCalled()
  })

  it('should show an error if answer is empty', async () => {
    await handleAdd(type, newQuestion, '  ', setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

    expect(setError).toHaveBeenCalledWith('Error adding FAQ. Must have an answer.')
    expect(setLoading).not.toHaveBeenCalled()
  })

  it('should set loading state while adding FAQ', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

    expect(setLoading).toHaveBeenCalledWith(true)
  })

  it('should make a POST request to add FAQ', async () => {
    fetch.mockResolvedValue({ ok: true })

    await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/faq'), {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, question: newQuestion, answer: newAnswer })
    })
  })

  it('should update FAQs after successfully adding an FAQ', async () => {
    const newFAQs = [{ id: 1, question: newQuestion, answer: newAnswer }]
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue(newFAQs) })

    await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

    expect(setFAQs).toHaveBeenCalledWith(newFAQs)
    expect(setNewQuestion).toHaveBeenCalledWith('')
    expect(setNewAnswer).toHaveBeenCalledWith('')
  })

   it('should set an error if fetch response is bad (400)', async () => {
      fetch.mockResolvedValue({ ok: false, status: 400 })
  
      await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

      expect(setError).toHaveBeenCalledWith('Bad request.')
    })
  
    it('should set an error if fetchResearchPeriods returns an empty array', async () => {
      fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
  
      await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)  

      expect(setError).toHaveBeenCalledWith('FAQ added for student, but there was an error loading updated data. Please refresh this page.')
    })
  
    it('should handle unexpected errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'))
  
      await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

      expect(setError).toHaveBeenCalledWith('Unexpected error adding FAQ for student.')
    })
  
    it('should always set loading to false at the end', async () => {
      fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
  
      await handleAdd(type, newQuestion, newAnswer, setNewQuestion, setNewAnswer, setFAQs, setLoading, setError)

      expect(setLoading).toHaveBeenCalledWith(false)
    })
})
