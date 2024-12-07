import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem, Avatar, Badge } from '@mui/material';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import AddProductForm from '../Pages/Sell/AddProductForm'

const MarketplaceHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);
  const firstName = sessionStorage.getItem('firstName');
  const [profilePhoto, setProfilePhoto] = useState(''); 
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New message from seller', time: '2 minutes ago' },
    { id: 2, message: 'Your item was liked', time: '1 hour ago' },
  ]);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };
  const handleClose = () => {
      setAnchor(null);
  };

  const handleLikesClick = () => {
    navigate('/likes');
  };

  const handleMessageClick = () => {
    navigate('/message');
  };
  
  /*const handleAddNewProduct = () => {
    navigate('/addnewproduct');
  };*/

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const baseButtonStyle = { width: '250px', color: 'white' };
  const activeButtonStyle = {
    bgcolor: '#ffd700',
    height: '50px',
    width: '250px',
    borderRadius: '0px',
    color: '#89343b',
    fontWeight: 'bold',
    boxShadow: 'inset 0px 4px 8px rgba(0, 0, 0, 0.4)',
  };

  // active button
  useEffect(() => {
    switch (true) {
      case location.pathname === '/home':
        setActiveButton('Home');
        break;
      case location.pathname.startsWith('/buy'):
        setActiveButton('Buy');
        break;
      case location.pathname === '/sell' || location.pathname === '/addnewproduct' || /^\/sell\/product\/\d+$/.test(location.pathname):
        setActiveButton('Sell');
        break;
      case location.pathname === '/message':
        setActiveButton('Message');
        break;
      case location.pathname === '/profile':
        setActiveButton('Profile');
        break;
      default:
        setActiveButton('');
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfileData = async () => {
        const username = sessionStorage.getItem('username');
        try {
            const response = await axios.get(`http://localhost:8080/api/seller/getSellerRecord/${username}`);
            if (response.status === 200) {
                const { profilePhoto } = response.data;

                if (profilePhoto) {
                    setProfilePhoto(`http://localhost:8080/profile-images/${profilePhoto}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchProfileData();
}, []);

  const handleButtonClick = (label) => {
    setActiveButton(label);

    switch (label) {
      case 'Home':
        navigate('/home');
        break;
      case 'Buy':
        navigate('/buy');
        break;
      case 'Sell':
        navigate('/sell');
        break;
      case 'Message':
        navigate('/message');
        break;
      case 'Profile':
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => navigate('/home')}>
            <img
              src='/images/logoCIT.png'
              alt="Logo"
              style={{ width: '270px', height: '60px' }} 
            />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton edge="end" color="black" aria-label="profile" onClick={handleClick} >
            <Avatar src={profilePhoto} />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {firstName}
            </Typography>
          </IconButton>
          <IconButton edge="end" color="black"  onClick={handleLikesClick} sx={{marginLeft: "25px"}}>
              <FavoriteBorderOutlinedIcon sx={{ fontSize: "30px" }}/>
          </IconButton>
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
          <IconButton edge="end" color="black" onClick={handleMessageClick} sx={{marginLeft: "10px"}}>
              <MailOutlineOutlinedIcon sx={{ fontSize: "30px"}}/>
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenModal}
            sx={{backgroundColor: '#89343b', color: 'white',marginLeft: '15px',
                  '&:hover': {
                    backgroundColor: '#ffd700',
                    color:'#89343b',
                },
            }}
          >
            Sell
          </Button>
          </Box>
          <Menu
            anchorEl={anchor}
            open={open}
            onClose={handleClose}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#f0f0f0', 
                    color: '#333', 
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', 
                },
            }}
          >
            <MenuItem
                onClick={handleClose}
                sx={{
                    '&:hover': {
                        backgroundColor: 'white', 
                    },
                }}
            >
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit'}}> 
                  <Person2OutlinedIcon style={{ verticalAlign: 'middle', marginBottom: '5px', marginLeft: '-5px' }}/> 
                  <span style={{ marginLeft: '10px', textDecoration: 'none', color: 'inherit', fontSize: '16px' }}>Profile</span>
                </Link>
            </MenuItem>

            <Typography
              variant="body2"
              sx={{
                marginLeft: 2,
                marginTop: 1,
                marginBottom: 0.5,
                color: "gray",
                fontWeight: "bold",
                textDecoration: 'none'
              }}
            >
              Buying
            </Typography>
            <MenuItem
                onClick={handleClose}
                sx={{
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            >
            <Link to="/likes" style={{ textDecoration: 'none', color: 'inherit'}}> 
                <FavoriteBorderOutlinedIcon style={{ verticalAlign: 'middle', marginBottom: '5px', marginLeft: '-5px' }}/> 
                <span style={{ marginLeft: '10px', textDecoration: 'none', color: 'inherit', fontSize: '16px' }}>Likes</span>
            </Link>
            </MenuItem>

            <Typography
              variant="body2"
              sx={{
                marginLeft: 2,
                marginTop: 1,
                marginBottom: 0.5,
                color: "gray",
                fontWeight: "bold",
                textDecoration: 'none'
              }}
            >
              Account
            </Typography>
            <MenuItem
                onClick={handleClose}
                sx={{
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            ><Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SettingsOutlinedIcon fontSize='medium' style={{ verticalAlign: 'middle', marginBottom: '5px', marginLeft: '-5px' }}/> 
            <span style={{ marginLeft: '10px', textDecoration: 'none', color: 'inherit', fontSize: '16px' }}>Settings</span>
            </Link>
            </MenuItem>
            <MenuItem
                onClick={() => {
                  handleClose(); 
                  handleLogout(); 
              }}
                sx={{
                  display: 'flex',       
                  alignItems: 'center',
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            >
              <LogoutOutlinedIcon style={{ marginLeft: '-4px', marginRight: '8px' }} />
                Logout
            </MenuItem>
        </Menu>
        {/* Notification Menu */}
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
            sx={{
              justifyContent: 'center',
              color: '#89343b',
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
      <AddProductForm open={openModal} handleClose={handleCloseModal} />

      {/* Nav Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', bgcolor: '#89343b', height: '50px' }}>
        {['Home', 'Buy', 'Message', 'Profile'].map((label) => (
          <Button
            key={label}
            sx={activeButton === label ? activeButtonStyle : baseButtonStyle}
            onClick={() => handleButtonClick(label)}
          >
            {label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default MarketplaceHeader;