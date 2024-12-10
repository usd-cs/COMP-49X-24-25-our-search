import { mockResearchOps } from '../resources/mockData'
import { fetchStudentsUrl, fetchProjectsUrl } from '../resources/constants'

const fetchPostings = async (isStudent) => {
  // Params:
  // isStudent: true if the user is a student
  // Filters for the postings

  // Returns:
  // all of the data for the departments
  // the majors under each department
  // and the postings under each major
  // The postings will either be students (if isFaculty) or research opportunities (if isStudent)

  let endpointUrl = ''

  if (isStudent) {
    endpointUrl = fetchProjectsUrl
  } else if (!isStudent) {
    endpointUrl = fetchStudentsUrl
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch postings')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching postings:', error)
  }

  // Simulating an API call with hardcoded data
  return mockResearchOps
}

export default fetchPostings
