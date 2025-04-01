/**
 * @file Function that calls the backend to retrieve and return data based on specified endpoint.
 * They are utility functions to isolate its definition from UI-related code
 * and because it is shared by several components.
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
  }

  // Return an empty list if the fetch call fails
  return []
}

export default getDataFrom
