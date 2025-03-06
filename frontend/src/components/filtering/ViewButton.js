import { Button } from '@mui/material'
import { styled } from '@mui/system'

const ViewButton = styled(Button)(({ isActive }) => ({
  textDecoration: 'none',
  border: 'none',
  padding: '8px 16px',
  fontWeight: 'bold',
  backgroundColor: isActive ? 'lightblue' : 'initial', // Conditionally set background color
  '&:hover': {
    border: 'none',
    backgroundColor: isActive ? 'lightblue' : 'initial' // Change hover color if active
  },
  '&.MuiButton-root': {
    textTransform: 'none'
  },
  position: 'relative', // Make sure to set the button to relative to position the underline correctly
  '&:after': {
    content: "''",
    display: 'inline-block', // Makes it follow the text width
    width: '100%', // Ensure the underline spans the width of the button's text
    height: '2px',
    backgroundColor: 'lightblue',
    marginTop: '4px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    position: 'absolute', // Absolute positioning to keep it under the text
    bottom: '0' // Align it at the bottom of the button
  },
  '&:hover:after': {
    opacity: 1
  }
}))

export default ViewButton
