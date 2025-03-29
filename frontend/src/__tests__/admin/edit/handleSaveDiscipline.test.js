import { handleSaveDiscipline } from '../../../utils/adminFetching'

global.fetch = jest.fn()

describe('handleSaveDiscipline', () => {
  let setEditingIdDiscipline, setDisciplines, setError

  beforeEach(() => {
    setEditingIdDiscipline = jest.fn()
    setDisciplines = jest.fn()
    setError = jest.fn()
    global.fetch.mockClear()
  })

  it('should show an error if name is empty', async () => {
    await handleSaveDiscipline(1, ' ', [], setDisciplines, setEditingIdDiscipline, setError)

    expect(setError).toHaveBeenCalledWith('Error editing discipline. Must have a name.')
  })

  it('should make a PUT request to save discipline', async () => {
    const disciplines = [{ id: 1, name: 'Old Discipline' }]
    const editedNameDiscipline = 'New Discipline'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveDiscipline(1, editedNameDiscipline, disciplines, setDisciplines, setEditingIdDiscipline, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/discipline'), {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, name: editedNameDiscipline })
    })
  })

  it('should update discipline successfully after saving', async () => {
    const disciplines = [{ id: 1, name: 'Old Discipline' }]
    const editedNameDiscipline = 'New Discipline'

    global.fetch.mockResolvedValue({ ok: true })

    await handleSaveDiscipline(1, editedNameDiscipline, disciplines, setDisciplines, setEditingIdDiscipline, setError)

    expect(setDisciplines).toHaveBeenCalledWith([{ id: 1, name: editedNameDiscipline }])
    expect(setError).toHaveBeenCalledWith(null)
    expect(setEditingIdDiscipline).toHaveBeenCalledWith(null)
  })

  it('should handle 400 error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleSaveDiscipline(1, 'New Discipline', [], setDisciplines, setEditingIdDiscipline, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should handle 409 conflict error', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 409 })

    await handleSaveDiscipline(1, 'New Discipline', [], setDisciplines, setEditingIdDiscipline, setError)

    expect(setError).toHaveBeenCalledWith('New Discipline cannot be editted due to conflicts with other data. Remove connections, then try again.')
  })

  it('should handle unexpected errors', async () => {
    global.fetch.mockRejectedValue(new Error('500'))

    await handleSaveDiscipline(1, 'New Discipline', [], setDisciplines, setEditingIdDiscipline, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error updating discipline: New Discipline.')
  })
})
