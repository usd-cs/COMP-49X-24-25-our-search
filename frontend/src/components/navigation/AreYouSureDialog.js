/**
 * @file Renders a popup asking user to confirm their submission.
 * Used for actions such as deleting, which is permanent.
 * The 'action' prop defines the action to ask the user if they are sure about.
 *    It is set to 'delete' by default.
 * 'onConfirm' references the function to call once the user has confirmed.
 * 'error' is a string detailing a potential error message.
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 */

import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material'

const AreYouSureDialog = ({ open, onClose, onConfirm, error, action = 'delete' }) => {
  action = action.toLowerCase()

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to {action}? This action cannot be undone.
        </DialogContentText>
        {error && (
          <Typography color='error' sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='error' data-testid='confirm'>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AreYouSureDialog
