import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';

const MarketplaceHeader = () => {
  const [activeButton, setActiveButton] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
      case location.pathname === '/':
        setActiveButton('Home');
        break;
      case location.pathname.startsWith('/buy'):
        setActiveButton('Buy');
        break;
      case location.pathname === '/sell' || location.pathname === '/addnewproduct' || /^\/sell\/product\/\d+$/.test(location.pathname):
        setActiveButton('Sell');
        break;
      case location.pathname === '/message':
        setActiveButton('Message/Inquiry');
        break;
      case location.pathname === '/feedback':
        setActiveButton('Feedback');
        break;
      case location.pathname === '/bookmark':
        setActiveButton('Bookmark/Saving');
        break;
      default:
        setActiveButton('');
    }
  }, [location.pathname]);

  const handleButtonClick = (label) => {
    setActiveButton(label);
    
    // Map labels to routes
    switch (label) {
      case 'Home':
        navigate('/');
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
              src='/images/On.png'
              alt="Logo"
              style={{ width: '270px', height: '60px' }} 
            />
          </IconButton>
          <IconButton edge="end" color="black" aria-label="profile">
            <AccountCircle />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              John Doe
            </Typography>
          </IconButton>
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
