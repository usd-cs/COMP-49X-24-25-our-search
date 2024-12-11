import React from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar () {
  // A simple search bar with a search icon at the end
  return (
    <Box>
      <TextField
        fullWidth
        label='FakeSearchBar'
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
