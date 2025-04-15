/**
 * @file Renderrs a searchbar
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */
import React from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar () {
  // A simple search bar with a search icon at the end
  return (
    <Box>
      <TextField
        fullWidth
        label='Search'
        id='fullWidth'
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    </Box>
  )
}

export default SearchBar
