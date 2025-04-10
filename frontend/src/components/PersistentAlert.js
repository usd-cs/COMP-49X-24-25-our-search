/**
 * @file PersistentAlert.js
 * @description shows an alert message persisently on the page based on if there is a message to display.
 *              This is so that the user can see the alert no matter where they are on the page.
 *              Uses MUI's Alert component's severity prop to make it show up as a certain types of alert.
 *              Expected type is 'info', 'success', 'error', or 'warning'.
 *              If specified type is not one of these, it gets set to 'info' for default behavior.
 */

import { Snackbar, Alert } from '@mui/material'

function PersistentAlert ({ msg, type }) {
  const allowedTypes = ['info', 'success', 'error', 'warning']
  if (!allowedTypes.includes(type)) { // default to info if specified type is not in list of allowed
    type = 'info'
  }

  return (
    <>
      <Snackbar
        open={msg !== null}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ bottom: '600px' }}
      >
        <Alert severity={type}>
          {msg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default PersistentAlert
