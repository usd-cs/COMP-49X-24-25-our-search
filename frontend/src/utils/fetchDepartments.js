/**
 * @file Function that calls the backend to retrieve and return a list of the departments.
 * A utility function to isolate its definition from UI-related code, and
 * because it is shared by several components.
 * Note that a call to fetchDepartments() is equivalent to a call to getDataFrom(BACKEND_ENDPOINT).
 * The helper function getDataFrom(…) was implemented later and the earlier fetch… functions were not refactored.
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */

import { BACKEND_URL } from '../resources/constants'

const fetchDepartments = async () => {
  try {
    const response = await fetch(BACKEND_URL + '/departments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch departments')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }

  // Return an empty list if the fetch call fails
  return []
}

export default fetchDepartments
