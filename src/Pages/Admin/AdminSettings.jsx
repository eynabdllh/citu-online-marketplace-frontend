import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AdminSettings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Admin Settings</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Account Settings</Typography>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
