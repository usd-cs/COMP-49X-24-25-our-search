import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, Button, List, ListItem, Typography } from '@mui/material';

const PostDialog = ({ open, onClose, project }) => {
  if (!project) return null;

  const {
    project_name,
    description,
    desired_qualifications,
    umbrella_topics = [],
    research_periods = [],
    is_active,
    majors = [],
    faculty = {},
  } = project;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Close button */}
      <Button onClick={onClose} sx={{ position: 'absolute', top: 6, right: 6 }}>
        X
      </Button>

      <DialogTitle>{project_name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Description:</strong> {description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Desired Qualifications:</strong> {desired_qualifications}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Umbrella Topics:</strong> {umbrella_topics.join(', ')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Research Periods:</strong> {research_periods.join(', ')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Majors:</strong> {majors.join(', ')}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          <strong>Faculty:</strong> {`${faculty.first_name} ${faculty.last_name} (${faculty.email})`}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

PostDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  project: PropTypes.shape({
    project_name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    desired_qualifications: PropTypes.string,
    umbrella_topics: PropTypes.arrayOf(PropTypes.string),
    research_periods: PropTypes.arrayOf(PropTypes.string),
    is_active: PropTypes.bool.isRequired,
    majors: PropTypes.arrayOf(PropTypes.string),
    faculty: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
    }),
  }),
};

export default PostDialog;
