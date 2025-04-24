/**
 * @file PersistentAlert.js
 * @description shows an alert message persisently on the page based on if there is a message to display.
 *              This is so that the user can see the alert no matter where they are on the page.
 *              Uses MUI's Alert component's severity prop to make it show up as a certain types of alert.
 *              Expected type is 'info', 'success', 'error', or 'warning'.
 *              If specified type is not one of these, it gets set to 'info' for default behavior.
 */

import { Snackbar, Alert } from '@mui/material'
import { useState, useEffect } from 'react'

function PersistentAlert ({ msg, type }) {
  const allowedTypes = ['info', 'success', 'error', 'warning']
  const [open, setOpen] = useState(Boolean(msg))

  if (!allowedTypes.includes(type)) {
    type = 'info'
  }

  useEffect(() => {
    if (msg) setOpen(true)
  }, [msg])

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ bottom: '600px' }}
    >
      <Alert severity={type} onClose={handleClose}>
        {msg}
      </Alert>
    </Snackbar>
  )
}

export default PersistentAlert
