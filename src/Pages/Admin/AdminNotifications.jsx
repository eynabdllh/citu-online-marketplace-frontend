import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

// Export the notifications array
export const notifications = [
  { id: 1, message: 'New product approval request', time: '2 minutes ago' },
  { id: 2, message: 'New user registration', time: '1 hour ago' },
];

const AdminNotifications = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Notifications</Typography>
      <Paper>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem>
                <ListItemText 
                  primary={notification.message}
                  secondary={notification.time}
                />
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminNotifications;
