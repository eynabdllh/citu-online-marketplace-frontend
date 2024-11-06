import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle'; 
//import logo from '../../images/On.png'; if inside a folder
import logo from '../assets/img/On.png';

const MarketplaceHeader = () => {
  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);
  const firstName = sessionStorage.getItem('firstName');

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
      setAnchor(null);
  };


  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent'}}>
        <Toolbar sx={{display:'flex', justifyContent:'space-between'}}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <img
              src={logo} 
              alt="Logo"
              style={{ width: '270px', height: '60px' }} 
            />
          </IconButton>
          <IconButton edge="end" color="black" aria-label="profile" onClick={handleClick}>
            <AccountCircle />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {firstName}
            </Typography>
          </IconButton>
          <Menu
              anchorEl={anchor}
              open={open}
              onClose={handleClose}
          >
              <MenuItem onClick={handleClose}><Link to="/profile">Profile</Link></MenuItem>
              <MenuItem onClick={handleClose}><Link to="/account">My Account</Link></MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Nav Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-around', bgcolor: '#89343b', height: '50px' }}>
        <Button sx={{ width:'250px', color:'white'}}>Home</Button>
        <Button sx={{ width:'250px', color:'white'}}>Buy</Button>
        <Button sx={{bgcolor:'#ffd700', height:'50px', width:'250px',borderRadius:'0px', color:'#89343b'}} variant="contained">Sell</Button> {/* Highlighted Button */}
        <Button sx={{ width:'250px', color:'white'}}>Message/Inquiry</Button>
        <Button sx={{ width:'250px', color:'white'}}>Feedback</Button>
        <Button sx={{ width:'250px', color:'white'}}>Bookmark/Saving</Button>
      </Box>
    </Box>
  );
};

export default MarketplaceHeader;
