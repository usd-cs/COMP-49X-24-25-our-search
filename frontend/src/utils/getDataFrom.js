/**
 * @file Function that calls the backend to retrieve and return data based on specified endpoint.
 * They are utility functions to isolate its definition from UI-related code
 * and because it is shared by several components.
 * Note that a call to fetchDisciplines() is equivalent to a call to getDataFrom(BACKEND_ENDPOINT).
 * The helper function getDataFrom(…) was implemented later and the earlier fetch… functions were not refactored.
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */

const getDataFrom = async (endpointUrl) => {
  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${endpointUrl}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error.message)
    throw new Error(error)
  }
}

export default getDataFrom
