import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button, 
  Checkbox,
  Snackbar,
  Alert,
  ListItemIcon,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Product Approval Request',
      content: 'New product "iPhone 15 Pro" needs your approval',
      time: '2 minutes ago', 
      read: false 
    },
    { 
      id: 2, 
      title: 'User Report',
      content: 'A user reported an issue with order #12345',
      time: '30 minutes ago', 
      read: false 
    },
    { 
      id: 3, 
      title: 'System Update',
      content: 'System maintenance and updates have been completed successfully',
      time: '1 hour ago', 
      read: false 
    },
    { 
      id: 4, 
      title: 'Product Approval Request',
      content: 'New product "iPhone 15 Pro" needs your approval',
      time: '1 hour ago', 
      read: false 
    },
    { 
      id: 5, 
      title: 'User Report',
      content: 'A user reported an issue with order #12345',
      time: '2 hours ago', 
      read: false 
    },
    { 
      id: 6, 
      title: 'System Update',
      content: 'System maintenance and updates have been completed successfully',
      time: '3 hours ago', 
      read: false 
    },
    { 
      id: 7, 
      title: 'Product Approval Request',
      content: 'New product "iPhone 15 Pro" needs your approval',
      time: '3 hours ago', 
      read: true 
    },
    { 
      id: 8, 
      title: 'User Report',
      content: 'A user reported an issue with order #12345',
      time: '4 hours ago', 
      read: true 
    },
    { 
      id: 9, 
      title: 'System Update',
      content: 'System maintenance and updates have been completed successfully',
      time: '4 hours ago', 
      read: true 
    },
  ]);
  
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleMarkAsRead = () => {
    if (selectedNotifications.length === 0) {
      setToast({
        open: true,
        message: 'Please select at least one notification',
        severity: 'error'
      });
      return;
    }

    setNotifications(prev => prev.map(notification => 
      selectedNotifications.includes(notification.id) 
        ? { ...notification, read: true }
        : notification
    ));
    setSelectedNotifications([]);
    setToast({
      open: true,
      message: 'Notifications marked as read',
      severity: 'success'
    });
  };

  const handleDelete = () => {
    if (selectedNotifications.length === 0) {
      setToast({
        open: true,
        message: 'Please select at least one notification',
        severity: 'error'
      });
      return;
    }

    setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
    setSelectedNotifications([]);
    setToast({
      open: true,
      message: 'Notifications deleted',
      severity: 'success'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Title and Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, mt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <NotificationsIcon sx={{ color: '#89343b', fontSize: 28 }} />
          <Typography variant="h4" sx={{ color: '#89343b' }}>Notifications</Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={handleMarkAsRead}
            sx={{ 
              bgcolor: '#89343b',
              color: 'white',
              '&:hover': { bgcolor: '#6d2931' },
              height: '32px',
              textTransform: 'none',
              px: 2,
              '& .MuiButton-startIcon': { color: 'white' }
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DoneAllIcon sx={{ fontSize: 18, color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Mark as Read</Typography>
            </Stack>
          </Button>
          <Button
            size="small"
            onClick={handleDelete}
            sx={{ 
              bgcolor: '#89343b',
              color: 'white',
              '&:hover': { bgcolor: '#6d2931' },
              height: '32px',
              textTransform: 'none',
              px: 2,
              '& .MuiButton-startIcon': { color: 'white' }
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DeleteIcon sx={{ fontSize: 18, color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Delete</Typography>
            </Stack>
          </Button>
        </Stack>
      </Box>

      {/* Notifications Container */}
      <Paper sx={{ 
        width: '100%',
        border: '1px solid rgba(0,0,0,0.12)',
        bgcolor: '#fff',
        borderRadius: 1,
      }}>
        <ListItem sx={{ 
          bgcolor: '#f5f5f5', 
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          <ListItemIcon sx={{ minWidth: '42px' }}>
            <Checkbox
              indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.length}
              checked={selectedNotifications.length === notifications.length && notifications.length > 0}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedNotifications(notifications.map(n => n.id));
                } else {
                  setSelectedNotifications([]);
                }
              }}
            />
          </ListItemIcon>
          <ListItemText primary={<Typography variant="subtitle2">Select All</Typography>} />
        </ListItem>

        {/* Notifications List */}
        <Box sx={{ height: '500px', overflow: 'auto' }}>
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'inherit' : 'rgba(137, 52, 59, 0.03)',
                    borderLeft: notification.read ? 'none' : '4px solid #89343b',
                    py: 1.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: '42px' }}>
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => {
                        setSelectedNotifications(prev => 
                          prev.includes(notification.id)
                            ? prev.filter(id => id !== notification.id)
                            : [...prev, notification.id]
                        );
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Box sx={{ mb: 0.5 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: notification.read ? 500 : 600,
                            color: notification.read ? 'text.secondary' : 'text.primary',
                            fontSize: '0.95rem',
                            mb: 0.5
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: notification.read ? 'text.secondary' : 'text.primary',
                            fontSize: '0.875rem'
                          }}
                        >
                          {notification.content}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          mt: 0.5 
                        }}
                      >
                        {notification.time}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert 
          severity={toast.severity}
          sx={{ 
            width: '100%',
            '& .MuiAlert-action': { display: 'none' }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotifications;