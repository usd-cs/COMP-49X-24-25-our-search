/**
* @file Renders a search bar
* @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
* @author Natalie Jungquist <njungquist@sandiego.edu>
* @author Rayan Pal <rpal@sandiego.edu>
*/

import React, { useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'

function SearchBar () {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    const next = new URLSearchParams(window.location.search)

    if (searchQuery) {
      next.set('search', searchQuery)
    } else {
      next.delete('search')
    }

    navigate(`?${next.toString()}`, { replace: true })
  }

  return (
    <Box sx={{ ml: 1, mr: 3 }}>
      <TextField
        fullWidth
        label='Search'
        id='searchField'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchIcon onClick={handleSearch} style={{ cursor: 'pointer' }} />
            </InputAdornment>
          )
        }}
      />
    </Box>
  )
}

export default SearchBar
