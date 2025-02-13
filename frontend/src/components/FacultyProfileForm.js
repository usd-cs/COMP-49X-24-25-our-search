import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

const FacultyProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // In a real app, you would send this data to your backend API.
    console.log('Submitted data: ', formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Create Your Faculty Profile
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        margin="normal"
        required
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Profile
      </Button>
    </Box>
  );
};

export default FacultyProfileForm;
