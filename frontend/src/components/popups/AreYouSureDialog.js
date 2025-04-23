/**
 * @file Renders a popup asking user to confirm their submission.
 * Used for actions such as deleting, which is permanent.
 * The 'action' prop defines the action to ask the user if they are sure about.
 *    It is set to 'delete' by default.
 * 'onConfirm' references the function to call once the user has confirmed.
 * 'error' is a string detailing a potential error message.
 *
 * @author Natalie Jungquist <njungquist@sandiego.edu>
 * @author Rayan Pal <rpal@sandiego.edu>
 */

import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Box } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const AreYouSureDialog = ({ open, onClose, onConfirm, error, action = 'delete' }) => {
  const act = action.toLowerCase()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 24
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, pt: 3 }}>
        <WarningAmberIcon color="warning" sx={{ mr: 1, fontSize: 28 }} />
        <DialogTitle sx={{ m: 0, p: 0, typography: 'h6', fontWeight: 'bold' }}>
          Confirm Action
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 3, pt: 2 }}>
        <DialogContentText sx={{ typography: 'body1', mb: 2 }}>
          Are you sure you want to{' '}
          <Typography
            component="span"
            sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
          >
            {act}
          </Typography>
          ? This action cannot be undone.
        </DialogContentText>

        {error && (
          <Typography
            color="error"
            sx={{ mb: 2, typography: 'body2', textAlign: 'center' }}
          >
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: 'capitalize', flex: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          data-testid="confirm"
          sx={{ textTransform: 'capitalize', flex: 1 }}
        >
          {act}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AreYouSureDialog
