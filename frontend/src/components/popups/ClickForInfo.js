/**
 * @file ClickForInfo.js
 * @description Component uses MUI's IconButton and Popover to create an info icon that,
*                once clicked, displays a specified message to end users. This custom component
*                displays the information in better way than MUI's built-in Tooltip component
*                because I adjusted the font size to be large enough to read and the popup size to
*                dynamically adjust itself, and not cover up too much of the page.
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Eduardo Perez Rocha <eperezrocha@sandiego.edu>
 */

import React from 'react'
import { IconButton } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { styled } from '@mui/material/styles'

const PopoverRoot = styled('div')({
  position: 'relative',
  display: 'inline-block'
})

const PopoverTrigger = styled(IconButton)({
  padding: 4,
  cursor: 'default',
  '&:hover': {
    backgroundColor: 'transparent'
  }
})

const PopoverContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(2),
  maxWidth: 300,
  border: `1px solid ${theme.palette.divider}`,
  transform: 'translateY(8px)',
  animation: 'fadeIn 0.2s ease-in-out',
  textAlign: 'left',
  '& p': {
    margin: '0 0 8px 0',
    lineHeight: 1.5
  },
  '& p:last-child': {
    marginBottom: 0
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -8,
    left: 12,
    width: 16,
    height: 16,
    backgroundColor: theme.palette.background.paper,
    transform: 'rotate(45deg)',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderLeft: `1px solid ${theme.palette.divider}`
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(4px)'
    },
    to: {
      opacity: 1,
      transform: 'translateY(8px)'
    }
  }
}))

const NonSelectableText = styled('div')({
  userSelect: 'none'
})

export default function ClickForInfo ({ content }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hoverTimeout, setHoverTimeout] = React.useState(null)

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }

    const timeoutId = setTimeout(() => {
      setIsOpen(true)
    }, 200)

    setHoverTimeout(timeoutId)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }

    const timeoutId = setTimeout(() => {
      setIsOpen(false)
    }, 300)

    setHoverTimeout(timeoutId)
  }

  React.useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <PopoverRoot
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: 'default' }}
    >
      <PopoverTrigger
        size='small'
        disableRipple
        aria-label='More information'
        disableTouchRipple
        component='span'
      >
        <InfoOutlinedIcon fontSize='small' color='primary' />
      </PopoverTrigger>

      {isOpen && (
        <PopoverContent>
          <NonSelectableText>
            {content}
          </NonSelectableText>
        </PopoverContent>
      )}
    </PopoverRoot>
  )
}
