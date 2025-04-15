/**
 * @file NavLinkItem.js
 * @description       Shows a pretty button on the top navigation bar that navigates the user to a specific page when clicked.
 *                    It also shows a fancy underline and animation when hovered on.
 * 
 * @author Natalie Jungquist 
 */

import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { CUSTOM_BUTTON_COLOR } from '../../resources/constants'

const NavLinkItem = ({ to, children }) => {
  return (
    <Typography
      variant='subtitle2'
      component={Link}
      to={to}
      sx={{
        textDecoration: 'none',
        color: CUSTOM_BUTTON_COLOR,
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.3s ease',
        paddingBottom: '6px',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '3px',
          width: '0%',
          backgroundColor: CUSTOM_BUTTON_COLOR,
          transition: 'width 0.3s ease',
          borderRadius: '2px'
        },
        '&:hover': {
          color: '#0D47A1', // darker blue on hover
          transform: 'translateY(-2px)' // subtle lift
        },
        '&:hover::after': {
          width: '100%'
        }
      }}
    >
      {children}
    </Typography>
  )
}

export default NavLinkItem
