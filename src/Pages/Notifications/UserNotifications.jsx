import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

const UserNotifications = () => {
  const notifications = [
    { id: 1, message: 'Your product was approved!', time: '2 minutes ago' },
    { id: 2, message: 'New message received', time: '1 hour ago' },
    { id: 3, message: 'Someone liked your product', time: '2 hours ago' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>My Notifications</Typography>
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

export default UserNotifications;
