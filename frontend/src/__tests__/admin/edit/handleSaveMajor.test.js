import { handleSaveMajor } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSaveMajor', () => {
  let setEditingIdMajor, setMajors, setError

  beforeEach(() => {
    setEditingIdMajor = jest.fn()
    setMajors = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should return an error if no disciplines are selected', async () => {
    const selectedDisciplines = { 1: [] }

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, selectedDisciplines, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith(
      'You must associate this major with one or more disciplines. Please try again.'
    )
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should make a PUT request to save major', async () => {
    const selectedDisciplines = { 1: [{ name: 'Science' }] }
    const majors = [{ id: 1, name: 'Old Name', disciplines: [] }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/major'), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1,
        name: 'New Name',
        disciplines: [selectedDisciplines[1][0].name]
      })
    })
  })

  it('should update major successfully after successfully saving major', async () => {
    const selectedDisciplines = { 1: [{ name: 'Science' }] }
    const majors = [{ id: 1, name: 'Old Name', disciplines: [] }]

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, selectedDisciplines, majors, setMajors, setError)

    expect(setMajors).toHaveBeenCalledWith([{ id: 1, name: 'New Name', disciplines: selectedDisciplines[1] }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdMajor).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('New Name cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSaveMajor(1, 'New Name', setEditingIdMajor, { 1: [{ name: 'Science' }] }, [], setMajors, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating major: New Name.')
  })
})
