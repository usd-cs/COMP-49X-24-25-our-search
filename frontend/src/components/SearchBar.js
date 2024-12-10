import React from 'react'
import { Box, Typography, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

function SearchBar () {
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
