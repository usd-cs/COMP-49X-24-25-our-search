/**
 * @file RenderAdminVariables.js
 * @description This file defines and exports various render functions
 *              for the admin page, including rendering disciplines and majors.
 *              These functions handle UI elements, loading states, and user interactions.
 *
 * @exports renderDisciplines
 * @exports renderMajors
 * @exports renderUmbrellaTopics
 * @exports renderResearchPeriods
 * @exports renderDepartments
 */

import React from 'react'
import { Box, List, ListItem, ListItemText, Typography, TextField, IconButton, Button, Autocomplete, CircularProgress, Chip } from '@mui/material'
import { Edit, Delete, Save, Cancel } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'

export const renderDisciplines = ({
  loadingDisciplinesMajors,
  disciplines,
  editingIdDiscipline,
  newDisciplineName,
  setNewDisciplineName,
  setEditedNameDiscipline,
  handleEditDiscipline,
  handleCancelDisciplineEdit,
  handleBeginDeleteDiscipline,
  handleSaveDiscipline,
  handleAddDiscipline
}) => {
  if (loadingDisciplinesMajors) {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>Disciplines</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom>Disciplines</Typography>
      <List>
        {disciplines
          .filter((disc) => disc.id !== -1)
          .map(({ id, name }) => (
            <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingIdDiscipline === id ? '10px' : '0px' }}>

                {/* Textbox, can edit once the edit button is clicked */}
                {editingIdDiscipline === id
                  ? (
                    <TextField
                      defaultValue={name}
                      onChange={(e) => setEditedNameDiscipline(e.target.value)}
                      size='small'
                      autoFocus
                      sx={{ width: '35%' }}
                    />
                    )
                  : (
                    <ListItemText primary={name} sx={{ width: '35%' }} />
                    )}

                {/* Edit and Delete buttons */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {editingIdDiscipline !== id && (
                    <>
                      <IconButton onClick={() => handleEditDiscipline(id, name)} data-testid='edit-discipline-btn'>
                        <Edit />
                      </IconButton>

                      <IconButton onClick={() => handleBeginDeleteDiscipline(id)} color='error' data-testid='delete-discipline-btn'>
                        <Delete />
                      </IconButton>
                    </>
                  )}

                </div>
              </div>

              {/* Save and cancel buttons below */}
              {editingIdDiscipline === id && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                  <Button
                    variant='contained' color='primary'
                    startIcon={<Save />}
                    onClick={() => handleSaveDiscipline(id)}
                    data-testid='save-discipline-btn'
                  >
                    Save
                  </Button>
                  <Button
                    variant='outlined' color='warning'
                    startIcon={<Cancel />}
                    onClick={() => handleCancelDisciplineEdit()}
                    data-testid='cancel-discipline-btn'
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </ListItem>
          ))}
      </List>

      {/* Add New Discipline Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
        <TextField
          label='New Discipline Name'
          value={newDisciplineName}
          onChange={(e) => setNewDisciplineName(e.target.value)}
          size='small'
          sx={{ width: '35%' }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddDiscipline}
          startIcon={<AddIcon />}
          sx={{ mx: '50px' }}
          data-testid='add-discipline-btn'
        >
          Add
        </Button>
      </div>
    </Box>
  )
}

export const renderMajors = ({
  loadingDisciplinesMajors,
  disciplines,
  majors,
  selectedDisciplines,
  setSelectedDisciplines,
  newMajorDisciplines,
  setNewMajorDisciplines,
  editingIdMajor,
  newMajorName,
  setNewMajorName,
  setEditedNameMajor,
  handleEditMajor,
  handleCancelMajorEdit,
  handleBeginDeleteMajor,
  handleSaveMajor,
  handleAddMajor
}) => {
  if (loadingDisciplinesMajors) {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>Majors</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom sx={{ marginTop: 6 }}>Majors</Typography>
      <List>
        {majors.map(({ id, name }) => (
          <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingIdMajor === id ? '10px' : '0px' }}>

              {/* Textbox, can edit once the edit button is clicked */}
              {editingIdMajor === id
                ? (
                  <TextField
                    defaultValue={name}
                    onChange={(e) => setEditedNameMajor(e.target.value)}
                    size='small'
                    autoFocus
                    sx={{ width: '35%' }}
                  />
                  )
                : (
                  <ListItemText primary={name} sx={{ width: '35%' }} />
                  )}

              <Autocomplete
                multiple
                sx={{ width: '60%' }}
                options={disciplines} // add .filter(disc => disc.id !== -1) to remove "Other" from the dropdowns
                getOptionLabel={(option) => option.name}
                value={selectedDisciplines[id] || []}
                onChange={(_, newValue) => setSelectedDisciplines({ ...selectedDisciplines, [id]: newValue })}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip {...getTagProps({ index })} label={option.name} key={option.id} />
                  ))}
                renderInput={(params) => <TextField {...params} label='Discipline(s)' />}
                disabled={editingIdMajor !== id}
              />

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {editingIdMajor !== id && (
                  <>
                    <IconButton onClick={() => handleEditMajor(id, name)} data-testid='edit-major-btn'>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleBeginDeleteMajor(id)} color='error' data-testid='delete-major-btn'>
                      <Delete />
                    </IconButton>
                  </>
                )}

              </div>
            </div>

            {/* Save and cancel buttons below */}
            {editingIdMajor === id && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Save />}
                  onClick={() => handleSaveMajor(id)}
                  data-testid='save-major-btn'
                >
                  Save
                </Button>
                <Button
                  variant='outlined'
                  color='warning'
                  startIcon={<Cancel />}
                  onClick={() => handleCancelMajorEdit(id)}
                  data-testid='cancel-major-btn'
                >
                  Cancel
                </Button>
              </Box>
            )}

          </ListItem>
        ))}
      </List>

      {/* Add New Major Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
        <TextField
          label='New Major Name'
          value={newMajorName}
          onChange={(e) => setNewMajorName(e.target.value)}
          size='small'
          sx={{ width: '35%' }}
        />

        <Autocomplete
          multiple
          sx={{ width: '50%' }}
          options={disciplines}
          getOptionLabel={(option) => option.name}
          value={newMajorDisciplines}
          onChange={(_, newValue) => setNewMajorDisciplines(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} label={option.name} key={option.id} />
            ))}
          renderInput={(params) => <TextField {...params} label='Discipline(s)' />}
          data-testid='new-discipline-autocomplete'
        />

        <Button
          variant='contained'
          color='primary'
          onClick={handleAddMajor}
          startIcon={<AddIcon />}
          sx={{ mx: '50px' }}
          data-testid='add-major-btn'
        >
          Add
        </Button>
      </div>
    </Box>
  )
}

export const renderUmbrellaTopics = ({
  loadingUmbrellaTopics,
  umbrellaTopics,
  editingIdUmbrella,
  newUmbrellaName,
  setNewUmbrellaName,
  setEditedNameUmbrella,
  handleEditUmbrella,
  handleCancelUmbrellaEdit,
  handleBeginDeleteUmbrella,
  handleSaveUmbrella,
  handleAddUmbrella
}) => {
  if (loadingUmbrellaTopics) {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>Umbrella Topics</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom>Umbrella Topics</Typography>
      <List>
        {umbrellaTopics.map(({ id, name }) => (
          <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingIdUmbrella === id ? '10px' : '0px' }}>

              {/* Textbox, can edit once the edit button is clicked */}
              {editingIdUmbrella === id
                ? (
                  <TextField
                    defaultValue={name}
                    onChange={(e) => setEditedNameUmbrella(e.target.value)}
                    size='small'
                    autoFocus
                    sx={{ width: '35%' }}
                  />
                  )
                : (
                  <ListItemText primary={name} sx={{ width: '35%' }} />
                  )}

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {editingIdUmbrella !== id && (
                  <>
                    <IconButton onClick={() => handleEditUmbrella(id, name)} data-testid='edit-umbrella-btn'>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleBeginDeleteUmbrella(id)} color='error' data-testid='delete-umbrella-btn'>
                      <Delete />
                    </IconButton>
                  </>
                )}

              </div>
            </div>

            {/* Save and cancel buttons below */}
            {editingIdUmbrella === id && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                <Button
                  variant='contained' color='primary'
                  startIcon={<Save />}
                  onClick={() => handleSaveUmbrella(id)}
                  data-testid='save-umbrella-btn'
                >
                  Save
                </Button>
                <Button
                  variant='outlined' color='warning'
                  startIcon={<Cancel />}
                  onClick={() => handleCancelUmbrellaEdit()}
                  data-testid='cancel-umbrella-btn'
                >
                  Cancel
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {/* Add New Umbrella Topic Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
        <TextField
          label='New Umbrella Topic Name'
          value={newUmbrellaName}
          onChange={(e) => setNewUmbrellaName(e.target.value)}
          size='small'
          sx={{ width: '35%' }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddUmbrella}
          startIcon={<AddIcon />}
          sx={{ mx: '50px' }}
          data-testid='add-umbrella-btn'
        >
          Add
        </Button>
      </div>
    </Box>
  )
}

export const renderResearchPeriods = ({
  loadingResearchPeriods,
  researchPeriods,
  editingIdPeriod,
  newPeriodName,
  setNewPeriodName,
  setEditedNamePeriod,
  handleEditPeriod,
  handleCancelPeriodEdit,
  handleBeginDeletePeriods,
  handleSavePeriod,
  handleAddPeriod
}) => {
  if (loadingResearchPeriods) {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>Research Periods</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom>Research Periods</Typography>
      <List>
        {researchPeriods.map(({ id, name }) => (
          <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingIdPeriod === id ? '10px' : '0px' }}>

              {/* Textbox, can edit once the edit button is clicked */}
              {editingIdPeriod === id
                ? (
                  <TextField
                    defaultValue={name}
                    onChange={(e) => setEditedNamePeriod(e.target.value)}
                    size='small'
                    autoFocus
                    sx={{ width: '35%' }}
                  />
                  )
                : (
                  <ListItemText primary={name} sx={{ width: '35%' }} />
                  )}

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {editingIdPeriod !== id && (
                  <>
                    <IconButton onClick={() => handleEditPeriod(id, name)} data-testid='edit-period-btn'>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleBeginDeletePeriods(id)} color='error' data-testid='delete-period-btn'>
                      <Delete />
                    </IconButton>
                  </>
                )}

              </div>
            </div>

            {/* Save and cancel buttons below */}
            {editingIdPeriod === id && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                <Button
                  variant='contained' color='primary'
                  startIcon={<Save />}
                  onClick={() => handleSavePeriod(id)}
                  data-testid='save-period-btn'
                >
                  Save
                </Button>
                <Button
                  variant='outlined' color='warning'
                  startIcon={<Cancel />}
                  onClick={() => handleCancelPeriodEdit()}
                  data-testid='cancel-period-btn'
                >
                  Cancel
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {/* Add New Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
        <TextField
          label='New Research Period Name'
          value={newPeriodName}
          onChange={(e) => setNewPeriodName(e.target.value)}
          size='small'
          sx={{ width: '35%' }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddPeriod}
          startIcon={<AddIcon />}
          sx={{ mx: '50px' }}
          data-testid='add-period-btn'
        >
          Add
        </Button>
      </div>
    </Box>
  )
}

export const renderDepartments = ({
  loadingDepartments,
  departments,
  editingIdDepartment,
  newDepartmentName,
  setNewDepartmentName,
  setEditedNameDepartment,
  handleEditDepartment,
  handleCancelDepartmentEdit,
  handleBeginDeleteDepartment,
  handleSaveDepartment,
  handleAddDepartment
}) => {
  if (loadingDepartments) {
    return (
      <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
        <Typography variant='h5' gutterBottom>Departments</Typography>
        <Box display='flex' justifyContent='center' alignItems='center' height='50vh'>
          <CircularProgress />
        </Box>
      </Box>
    )
  }
  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: 'auto' }}>
      <Typography variant='h5' gutterBottom>Departments</Typography>
      <List>
        {departments.map(({ id, name }) => (
          <ListItem key={id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: editingIdDepartment === id ? '10px' : '0px' }}>

              {/* Textbox, can edit once the edit button is clicked */}
              {editingIdDepartment === id
                ? (
                  <TextField
                    defaultValue={name}
                    onChange={(e) => setEditedNameDepartment(e.target.value)}
                    size='small'
                    autoFocus
                    sx={{ width: '35%' }}
                  />
                  )
                : (
                  <ListItemText primary={name} sx={{ width: '35%' }} />
                  )}

              {/* Edit and Delete buttons */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {editingIdDepartment !== id && (
                  <>
                    <IconButton onClick={() => handleEditDepartment(id, name)} data-testid='edit-department-btn'>
                      <Edit />
                    </IconButton>

                    <IconButton onClick={() => handleBeginDeleteDepartment(id)} color='error' data-testid='delete-department-btn'>
                      <Delete />
                    </IconButton>
                  </>
                )}

              </div>
            </div>

            {/* Save and cancel buttons below */}
            {editingIdDepartment === id && (
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1, mb: 4 }}>
                <Button
                  variant='contained' color='primary'
                  startIcon={<Save />}
                  onClick={() => handleSaveDepartment(id)}
                  data-testid='save-department-btn'
                >
                  Save
                </Button>
                <Button
                  variant='outlined' color='warning'
                  startIcon={<Cancel />}
                  onClick={() => handleCancelDepartmentEdit()}
                  data-testid='cancel-department-btn'
                >
                  Cancel
                </Button>
              </Box>
            )}
          </ListItem>
        ))}
      </List>

      {/* Add New Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', gap: '10px' }}>
        <TextField
          label='New Department Name'
          value={newDepartmentName}
          onChange={(e) => setNewDepartmentName(e.target.value)}
          size='small'
          sx={{ width: '35%' }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleAddDepartment}
          startIcon={<AddIcon />}
          sx={{ mx: '50px' }}
          data-testid='add-department-btn'
        >
          Add
        </Button>
      </div>
    </Box>
  )
}
