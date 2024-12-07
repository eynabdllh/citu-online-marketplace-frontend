import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const AdminSettings = () => {
  const [username, setUsername] = useState(sessionStorage.getItem('userName') || '');
  const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName') || '');
  const [lastName, setLastName] = useState(sessionStorage.getItem('lastName') || '');
  const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
  const [contactNo, setContactNo] = useState(sessionStorage.getItem('contactNo') || '');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
        const username = sessionStorage.getItem('username');
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/getAdminRecord/${username}`);
            console.log(response.data);
            if (response.status === 200) {
                const { firstname, lastname, email, contactNo, profilePhoto } = response.data;

                setUsername(username);
                setFirstName(firstname);
                setLastName(lastname);
                setEmail(email);
                setContactNo(contactNo);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchProfileData();
  }, []);


  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Account Settings</Typography>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        sx={{ bgcolor: '#8A252C', width: 150, height: 150, marginRight: 2 }}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography sx={{ marginBottom: 1, fontSize: { xs: '18px', sm: '16px', md: '14px' }}}>
                            Clear frontal face photos are an important way for buyers and sellers to learn about each other.
                        </Typography>
                        <Box>
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="profile-upload"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => document.getElementById('profile-upload').click()}
                            sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C', textTransform: 'none' }}
                        >
                            Upload a photo
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C', marginLeft: '5px', textTransform: 'none' }}
                        >
                            Save
                        </Button>
                        </Box>
                    </Box>
        </Box>
        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 1}}>
            Public Profile
        </Typography>

        <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="grey">Username</Typography>
            <Typography variant="body1">{username}</Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="grey">First Name</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{firstName}</Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="grey">Last Name</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{lastName}</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 3, marginBottom: 1 }}>
          <LockOutlinedIcon sx={{ marginRight: 1 }} />
          <Typography variant="h6">Private Information</Typography>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="grey">Email</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <Typography variant="body1" color="black">{email}</Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="grey">Contact No.</Typography>
          {editMode ? (
            <TextField
              fullWidth
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
            />
          ) : (
            <Typography variant="body1" color="black">{contactNo}</Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          sx={{ mt: 3, color: 'black', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '20px', textTransform: 'none' }}
        >
          {editMode ? 'Save Changes' : 'Edit Information'}
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 3, color: 'black', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '20px', textTransform: 'none', marginLeft: '5px' }}
        >
          Delete Account
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
