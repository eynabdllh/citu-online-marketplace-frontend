import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const MarketplaceHeader = () => {
  const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);
  const firstName = sessionStorage.getItem('firstName');
  const [profilePhoto, setProfilePhoto] = useState(''); 

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
      setAnchor(null);
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
      case location.pathname === '/feedback':
        setActiveButton('Feedback');
        break;
      case location.pathname === '/bookmark':
        setActiveButton('Saved Items');
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

                // Construct image URL using the server path
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
      case 'Message/Inquiry':
        navigate('/message');
        break;
      case 'Feedback':
        navigate('/feedback');
        break;
      case 'Bookmark/Saving':
        navigate('/bookmark');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <img
              src='/images/logoCIT.png'
              alt="Logo"
              style={{ width: '270px', height: '60px' }} 
            />
          </IconButton>
          <IconButton edge="end" color="black" aria-label="profile" onClick={handleClick}>
            <Avatar src={profilePhoto} />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {firstName}
            </Typography>
          </IconButton>
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
                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
            </MenuItem>
            <MenuItem
                onClick={handleClose}
                sx={{
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            >
            <Link to="/account" style={{ textDecoration: 'none', color: 'inherit' }}>My Account</Link>
            </MenuItem>
            <MenuItem
                onClick={handleClose}
                sx={{
                    '&:hover': {
                        backgroundColor: 'white',
                    },
                }}
            >
                Logout
            </MenuItem>
        </Menu>
        </Toolbar>
      </AppBar>

      {/* Nav Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', bgcolor: '#89343b', height: '50px' }}>
        {['Home', 'Buy', 'Sell', 'Message/Inquiry', 'Feedback', 'Bookmark/Saving'].map((label) => (
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