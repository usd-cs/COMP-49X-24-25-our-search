/**
 * @file Function that filters for the postings to be displayed to the user.
 * The postings will either be students (if isFaculty) or research opportunities (if isStudent).
 * Returns:
 *  - all of the data for the displines
 *  - the majors under each displines
 *  - and the postings under each major
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */

import { fetchStudentsUrl, fetchProjectsUrl } from '../resources/constants'
import PropTypes from 'prop-types'

const fetchPostings = async (isStudent, isFaculty, isAdmin) => {
  let endpointUrl = ''

  if (isStudent) {
    endpointUrl = fetchProjectsUrl
  } else if (isFaculty) {
    endpointUrl = fetchStudentsUrl
  } else {
    return []
  }

  try {
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch postings')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching postings:', error)
  }

  // Return an empty list if the fetch call fails
  return []
}

fetchPostings.propTypes = {
  isStudent: PropTypes.bool.isRequired,
  isFaculty: PropTypes.bool.isRequired
}

export default fetchPostings
