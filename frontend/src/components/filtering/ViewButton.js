import { Button } from '@mui/material'
import { styled } from '@mui/system'

const color = '#0189ce'

const ViewButton = styled(Button)(({ isActive }) => ({
  textDecoration: isActive ? 'underline' : 'none',
  border: 'none',
  padding: '8px 16px',
  fontWeight: 'bold',
  color,
  backgroundColor: isActive ? '#DFEAF4' : 'transparent',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: isActive ? '#DFEAF4' : 'rgba(1, 137, 206, 0.1)',
    border: 'none'
  },
  '&.MuiButton-root': {
    textTransform: 'none'
  },
  position: 'relative', // Make sure to set the button to relative to position the underline correctly
  '&:after': {
    content: "''",
    display: isActive ? 'inline-block' : 'none', // Makes it follow the text width
    width: '100%', // Ensure the underline spans the width of the button's text
    height: '2px',
    // backgroundColor: color, // Makes it underlined after being clicked
    marginTop: '4px',
    opacity: isActive ? 1 : 0, // Ensure underline visibility for active state
    position: 'absolute', // Absolute positioning to keep it under the text
    bottom: '0' // Align it at the bottom of the button
  },
  '&:hover::after': {
    opacity: isActive ? 1 : 0 // Hover effect
  }
}))

export default ViewButton
