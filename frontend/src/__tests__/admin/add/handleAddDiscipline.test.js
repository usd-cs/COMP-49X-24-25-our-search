import { handleAddDiscipline } from '../../../utils/adminFetching'

describe('handleAddDiscipline', () => {
  let setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError

  const newDisciplineName = 'Humanities'

  beforeEach(() => {
    setLoadingDisciplinesMajors = jest.fn()
    prepopulateMajorsWithDisciplines = jest.fn()
    getDataFrom = jest.fn()
    setDisciplines = jest.fn()
    setNewDisciplineName = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if discipline name is empty', async () => {
    await handleAddDiscipline('  ', setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Error adding discipline. Must have a name.')
    expect(setLoadingDisciplinesMajors).not.toHaveBeenCalled()
  })

  it('should set loading state while adding discipline', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newDisciplineName }])

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(true)
    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add discipline', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newDisciplineName }])

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/discipline'), {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDisciplineName })
    })
  })

  it('should update disciplines after successfully adding a discipline', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    const newDisciplines = [{ id: 1, name: 'Humanities', majors: [] }]
    getDataFrom.mockResolvedValue(newDisciplines)

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(prepopulateMajorsWithDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(setNewDisciplineName).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if fetch response is forbidden (403)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403 })

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Discipline is permanent and cannot be duplicated.')
  })

  it('should set an error if getDataFrom returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Discipline added, but there was an error loading updated disciplines and majors data.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding discipline: Humanities.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })

    await handleAddDiscipline(newDisciplineName, setNewDisciplineName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })
})
