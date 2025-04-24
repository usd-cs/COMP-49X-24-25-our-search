/**
 * @file AdminEmails.js
 * @description Provides the implementation for rendering, managing, and controlling AdminEmails.
 *              The main features include:
 *              - Admin privileges to add and delete AdminEmails with confirmation dialogues.
 *
 * @imports getDataFrom(url) to prepopulate data.
 * @imports url definitions from 'constants.js'
 * @imports AreYouSureDialogue to ask the admin to confirm before deleting.
 * @imports handleAdd..., handleSave..., handleDelete... to execute communication with backend.
 *
 * @author Natalie Jungquist
 */

import React, { useState, useEffect } from 'react'
import {
  Typography, CircularProgress, Box, Button,
  TextField, IconButton, List, ListItem, ListItemText
} from '@mui/material'
import { Delete } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import AreYouSureDialog from '../popups/AreYouSureDialog'
import PersistentAlert from '../popups/PersistentAlert'
import getDataFrom from '../../utils/getDataFrom'
import { handleAddEmail, handleDeleteEmail } from '../../utils/adminFetching'
import { ADMIN_EMAIL_URL } from '../../resources/constants'

const isValidSandiegoEmail = (email) => {
  return /^[^\s@]+@sandiego\.edu$/.test(email)
}

function AdminEmails () {
  const [error, setError] = useState(null)

  const [loading, setLoading] = useState(true)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const [AdminEmails, setAdminEmails] = useState([])
  const [newEmail, setNewEmail] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    async function fetchData () {
      try {
        const emailsRes = await getDataFrom(ADMIN_EMAIL_URL)
        setAdminEmails(emailsRes)
        setLoading(false)
      } catch (error) {
        setError('Error loading admin emails. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const onBeginDelete = (id) => {
    setDeletingId(id)
    setOpenDeleteDialog(true)
  }

  const onCancelDelete = () => {
    setOpenDeleteDialog(false)
    if (error !== null) {
      setError(null)
    }
    if (deletingId !== null) { setDeletingId(null) }
  }

  const onAdd = async () => {
    await handleAddEmail(newEmail, setNewEmail, setAdminEmails, setLoading, setError, getDataFrom)
  }

  const onDelete = async () => {
    if (deletingId !== null) {
      await handleDeleteEmail(deletingId, setLoading, AdminEmails, setAdminEmails, setDeletingId, setOpenDeleteDialog, setError)
    }
  }

  const renderAdminEmails = ({
    title,
    AdminEmails,
    newEmail,
    setNewEmail
  }) => {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>{title}</Typography>
        <List>
          {AdminEmails.map(({ id, email }) => (
            <ListItem key={id} sx={{ display: 'flex', flexDirection: 'row' }}>
              <ListItemText primary={email} sx={{ width: '35%' }} />
              {/* Delete button */}
              <div style={{ display: 'flex', gap: '5px' }}>
                <IconButton onClick={() => onBeginDelete(id)} color='error' data-testid='delete-btn'>
                  <Delete />
                </IconButton>
              </div>
            </ListItem>
          ))}
        </List>

        {/* Add New Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
          <TextField
            label='New Email (@sandiego.edu)'
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            size='small'
            sx={{ width: '35%' }}
            error={newEmail !== '' && !isValidSandiegoEmail(newEmail)}
            helperText={newEmail !== '' && !isValidSandiegoEmail(newEmail) ? 'Email must end with @sandiego.edu' : ''}
          />

          <Button
            variant='contained'
            color='primary'
            onClick={onAdd}
            startIcon={<AddIcon />}
            sx={{ mx: '50px' }}
            data-testid='add-btn'
            disabled={!isValidSandiegoEmail(newEmail)}
          >
            Add
          </Button>

        </div>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
        <CircularProgress data-testid='initial-loading' />
      </Box>
    )
  } else {
    return (
      <>
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ marginTop: 10 }}>
          <Typography variant='h2'>Admin Emails</Typography>
          <Typography sx={{ ml: 3 }}>
            <ul>
              <li>You cannot remove an email if you are currently logged in with this email.</li>
              <li>Emails must be @sandiego.edu</li>
            </ul>
          </Typography>
          {error && (
            <PersistentAlert msg={error} type='error' />
          )}
        </Box>

        {!loading && renderAdminEmails({
          title: 'Admin Emails',
          AdminEmails,
          newEmail,
          setNewEmail
        })}

        <AreYouSureDialog
          open={openDeleteDialog}
          onClose={onCancelDelete}
          onConfirm={() => onDelete()}
          error={error}
          action='delete'
        />
      </>
    )
  }
}

export default AdminEmails
