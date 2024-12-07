import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem, Avatar, Badge } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { notifications } from '../Pages/Admin/AdminNotifications';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = React.useState(null);
  const [activeButton, setActiveButton] = useState('Dashboard');
  const firstName = sessionStorage.getItem('firstName');
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/admin');
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const handleButtonClick = (label) => {
    setActiveButton(label);
    switch(label) {
      case 'Dashboard':
        navigate('/admin/dashboard');
        break;
      case 'User Management':
        navigate('/admin/users');
        break;
      case 'Product Management':
        navigate('/admin/productsellers');
        break;
      case 'Product Listing Approval':
        navigate('/admin/approvals');
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const baseButtonStyle = {
    width: '250px',
    color: 'white',
    height: '50px',
    borderRadius: '0px',
  };

  const activeButtonStyle = {
    bgcolor: '#ffd700',
    height: '50px',
    width: '250px',
    borderRadius: '0px',
    color: '#89343b',
   fontWeight: 'bold',
    boxShadow: 'inset 0px 4px 8px rgba(0, 0, 0, 0.4)',
  };

  useEffect(() => {
    switch (true) {
      case location.pathname === '/admin/dashboard':
        setActiveButton('Dashboard');
        break;
      case location.pathname === '/admin/users':
        setActiveButton('User Management');
        break;
      case location.pathname === '/admin/productsellers':
        setActiveButton('Product Management');
        break;
      case location.pathname === '/admin/approvals':
        setActiveButton('Product Listing Approval');
        break;
      default:
        setActiveButton('');
    }
  }, [location.pathname]);

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', color: 'black', boxShadow: 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit">
            <img
              src='/images/logoCIT.png'
              alt="Logo"
              style={{ width: '270px', height: '60px' }}
            />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleNotificationClick}
              edge="end"
              color="black"
              sx={{
                marginLeft: "10px",
                marginTop: "20px"
              }}
            >
              <Badge 
                badgeContent={notifications.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '12px',
                    height: '20px',
                    minWidth: '20px',
                    marginTop: '5px',   
                    marginRight: '3px'
                  }
                }}
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: "30px" }}/>
              </Badge>
            </IconButton>
            <IconButton 
              onClick={handleClick}
              edge="end" 
              color="black" 
              aria-label="profile"
            >
              <Avatar sx={{ width: 32, height: 32 }} />
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {firstName}
              </Typography>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                width: 200,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <MenuItem
              sx={{
                color: 'gray',
                pointerEvents: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                py: 1
              }}
            >
              Account
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/settings"
              onClick={handleClose}
              sx={{
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <SettingsOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Typography>Settings</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleLogout();
              }}
              sx={{
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <LogoutOutlinedIcon sx={{ color: 'text.secondary' }} />
              <Typography>Logout</Typography>
            </MenuItem>
          </Menu>
          <Menu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleNotificationClose}
            PaperProps={{
                sx: {
                mt: 0,
                width: 320,
                maxHeight: 400,
                backgroundColor: '#f0f0f0',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
            <MenuItem
              sx={{
                color: 'gray',
                pointerEvents: 'none',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                py: 1,
                borderBottom: '1px solid #eee'
              }}
            >
              Notifications
            </MenuItem>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={handleNotificationClose}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid #f5f5f5',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => {
                handleNotificationClose();
                navigate('/admin/notifications');
              }}
              sx={{
                justifyContent: 'center',
                color: 'primary.main',
                py: 1,
                fontWeight: 'medium',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              View All Notifications
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Nav Bar with Dividers */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        bgcolor: '#89343b', 
        height: '50px',
        alignItems: 'center',
        position: 'relative'
      }}>
        {['Dashboard', 'User Management', 'Product Management', 'Product Listing Approval'].map((label, index, array) => (
          <React.Fragment key={label}>
            <Button
              onClick={() => handleButtonClick(label)}
              sx={activeButton === label ? activeButtonStyle : baseButtonStyle}
            >
              {label}
            </Button>
            {index < array.length - 1 && (
              <Box 
                sx={{ 
                  height: '30px',
                  width: '1px',
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  alignSelf: 'center'
                }} 
              />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default AdminHeader;