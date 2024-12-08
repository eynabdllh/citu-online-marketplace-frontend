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

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Product Approved',
      content: 'Your product "iPhone 15 Pro" has been approved',
      time: '2 minutes ago', 
      read: false 
    },
    { 
      id: 2, 
      title: 'New Message',
      content: 'You have received a new message from buyer regarding iPhone 15 Pro',
      time: '1 hour ago', 
      read: false 
    },
    { 
      id: 3, 
      title: 'Product Liked',
      content: 'Someone liked your product iPhone 15 Pro',
      time: '2 hours ago', 
      read: false 
    },
    { 
      id: 4, 
      title: 'Product View Update',
      content: 'Your MacBook Pro listing received 50 new views today',
      time: '3 hours ago', 
      read: true 
    },
    { 
      id: 5, 
      title: 'Similar Product Alert',
      content: 'A similar product to your "MacBook Pro" was recently listed',
      time: '5 hours ago', 
      read: true 
    },
    { 
      id: 6, 
      title: 'Product Review',
      content: 'A buyer left a 5-star review on your Samsung Galaxy S23',
      time: '1 day ago', 
      read: true 
    },
    { 
      id: 7, 
      title: 'Message Reminder',
      content: 'You have an unread message about your iPad Pro listing',
      time: '2 days ago', 
      read: true 
    },
    { 
      id: 8, 
      title: 'Account Activity',
      content: 'Your profile was viewed by 15 potential buyers today',
      time: '3 days ago', 
      read: true 
    },
    { 
      id: 9, 
      title: 'Account Security',
      content: 'New login detected from Chrome on Windows',
      time: '4 days ago', 
      read: true 
    }
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
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DeleteIcon sx={{ fontSize: 18, color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Delete</Typography>
            </Stack>
          </Button>
        </Stack>
      </Box>

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

        <Box sx={{ height: '500px', overflow: 'auto' }}>
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.read ? 'inherit' : 'rgba(137, 52, 59, 0.03)',
                    borderLeft: notification.read ? 'none' : '4px solid #89343b',
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
                            mb: 0.5
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: notification.read ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {notification.content}
                        </Typography>
                      </Box>
                    }
                    secondary={notification.time}
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

export default UserNotifications;