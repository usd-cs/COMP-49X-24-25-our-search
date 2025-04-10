/**
 * @file Function that calls the backend to retrieve and return a list of the umbrella topics.
 * A utility function to isolate its definition from UI-related code, and
 * because it is shared by several components.
 *
 * @author Eduardo Perez Rocha
 */

import { BACKEND_URL } from '../resources/constants'

const fetchUmbrellaTopics = async () => {
  try {
    const response = await fetch(BACKEND_URL + '/umbrella-topics', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch umbrella-topics')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }

  // Return an empty list if the fetch call fails
  return []
}

export default fetchUmbrellaTopics
