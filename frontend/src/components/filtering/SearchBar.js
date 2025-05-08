/**
* @file Renders a search bar
* @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
* @author Natalie Jungquist <njungquist@sandiego.edu>
* @author Rayan Pal <rpal@sandiego.edu>
*/

import React from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { viewFacultyFlag, viewProjectsFlag, viewStudentsFlag } from '../../resources/constants'

function SearchBar ({ handleApply, searchQuery, setSearchQuery, postsView }) {
  let label = 'Search'
  if (postsView === viewStudentsFlag) {
    label = 'Search for name or interest reason'
  } else if (postsView === viewProjectsFlag) {
    label = 'Search for title, description, desired qualification, faculty name'
  } else if (postsView === viewFacultyFlag) {
    label = 'Search for name'
  }
  return (
    <Box sx={{ ml: 1, mr: 3 }}>
      <TextField
        fullWidth
        label={label}
        id='searchField'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleApply()
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon onClick={handleApply} style={{ cursor: 'pointer' }} />
            </InputAdornment>
          )
        }}
      />
    </Box>
  )
}

export default SearchBar
