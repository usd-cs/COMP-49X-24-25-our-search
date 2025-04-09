import { handleAddMajor } from '../../../utils/adminFetching'

describe('handleAddMajor', () => {
  let setNewMajorName, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError

  const newMajorName = 'Marketing'
  const newMajorDisciplines = ['Science']

  beforeEach(() => {
    setLoadingDisciplinesMajors = jest.fn()
    prepopulateMajorsWithDisciplines = jest.fn()
    getDataFrom = jest.fn()
    setDisciplines = jest.fn()
    setNewMajorName = jest.fn()
    setError = jest.fn()

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show an error if major name is empty', async () => {
    await handleAddMajor('  ', setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Error adding major. Must have a name.')
    expect(setLoadingDisciplinesMajors).not.toHaveBeenCalled()
  })

  it('should set loading state while adding major', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newMajorName, disciplines: newMajorDisciplines }])

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(true)
    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })

  it('should make a POST request to add major', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([{ id: 1, name: newMajorName, disciplines: newMajorDisciplines }])

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/major'), {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMajorName, disciplines: newMajorDisciplines.map(discipline => discipline.name) })
    })
  })

  it('should update disciplines and majors after successfully adding a major', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    const newDisciplines = [
      {
        id: 1,
        name: 'Science',
        majors: [
          {
            id: 1,
            name: newMajorName
          }
        ]
      }
    ]
    getDataFrom.mockResolvedValue(newDisciplines)

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(prepopulateMajorsWithDisciplines).toHaveBeenCalledWith(newDisciplines)
    expect(setNewMajorName).toHaveBeenCalledWith('')
  })

  it('should set an error if fetch response is bad (400)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 400 })

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Bad request.')
  })

  it('should set an error if fetch response is forbidden (403)', async () => {
    fetch.mockResolvedValue({ ok: false, status: 403 })

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, fetchDisciplines, setError)

    expect(setError).toHaveBeenCalledWith("'Undeclared' is permanent and cannot be duplicated.")
  })

  it('should set an error if get data returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith("'Undeclared' is permanent and cannot be duplicated.")
  })

  it('should set an error if get data returns an empty array', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })
    getDataFrom.mockResolvedValue([])

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Major added, but there was an error loading updated disciplines and majors data.')
  })

  it('should handle unexpected errors', async () => {
    fetch.mockRejectedValue(new Error('Network error'))

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setError).toHaveBeenCalledWith('Unexpected error adding major: Marketing.')
  })

  it('should always set loading to false at the end', async () => {
    fetch.mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue([]) })

    await handleAddMajor(newMajorName, setNewMajorName, newMajorDisciplines, setDisciplines, prepopulateMajorsWithDisciplines, setLoadingDisciplinesMajors, getDataFrom, setError)

    expect(setLoadingDisciplinesMajors).toHaveBeenCalledWith(false)
  })
})
