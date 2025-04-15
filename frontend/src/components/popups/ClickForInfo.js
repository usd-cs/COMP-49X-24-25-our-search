/**
 * @file ClickForInfo.j
 * s@description #TODO
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */

import React, { useState } from 'react'
import { IconButton, Popover } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

export default function ClickForInfo ({ content }) {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton size='small' onClick={handleClick}>
        <InfoOutlinedIcon fontSize='small' />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        disableRestoreFocus
        PaperProps={{
          sx: {
            p: 1,
            maxWidth: 300
          }
        }}
      >
        {content}
      </Popover>
    </>
  )
}
