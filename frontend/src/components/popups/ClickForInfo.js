/**
 * @file ClickForInfo.js
 * @description         Component uses MUI's IconButton and Popover to create an info icon that,
 *                      once clicked, displays a specified message to end users. This custom component
 *                      displays the information in better way than MUI's built-in Tooltip component
 *                      because I adjusted the font size to be large enough to read and the popup size to 
 *                      dynamically adjust itself, and not cover up too much of the page.
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
