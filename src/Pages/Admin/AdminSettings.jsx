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
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUploadProfileImage = async () => {
    if (!profileImage)
      return;

    const username = sessionStorage.getItem('username');
    const formData = new FormData();
    formData.append('file', profileImage);

    try {
      const response = await axios.post(`http://localhost:8080/api/admin/uploadProfilePhoto/${username}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert('Profile picture updated successfully!');
        setPreviewImage(response.data.fileName);
      }
    } catch (error) {
      console.error('Error uploading profile photo: ', error);
      alert('Failed to upload profile photo');
    }
  };

  const handleSave = async () => {
    if (window.confirm('Are you sure you want to update your account?')) {
      try {
        // Updated Data Keys MUST match the backend field names
        const updatedData = {firstName, lastName, email, contactNo};
  
        const username = sessionStorage.getItem('username');
  
        const response = await axios.put(`http://localhost:8080/api/admin/putAdminRecord/${username}`,updatedData);
  
        if (response.status === 200) {
          sessionStorage.setItem('firstName', firstName);
          sessionStorage.setItem('lastName', lastName);
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('contactNo', contactNo);
  
          setEditMode(false);
          alert('Admin record updated successfully!');
        }
      } catch (error) {
        console.error('Error updating user data:', error);
        alert('Failed to update admin record.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    const username = sessionStorage.getItem('username');
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            const response = await axios.delete(`http://localhost:8080/api/admin/deleteAdminRecord/${username}`);

            if (response.status === 200) {
                alert(response.data); 
                
                sessionStorage.clear();
                window.location.href = '/'; 
            } else {
                console.error('Error deleting user account:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting user account:', error);
        }
    }
};
  

  useEffect(() => {
    const fetchProfileData = async () => {
        const username = sessionStorage.getItem('username');
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/getAdminRecord/${username}`);
            console.log(response.data);
            if (response.status === 200) {
                const { firstName, lastName, email, contactNo, profilePhoto } = response.data;

                setUsername(username);
                setFirstName(firstName);
                setLastName(lastName);
                setEmail(email);
                setContactNo(contactNo);

                if (profilePhoto) {
                  setPreviewImage(`http://localhost:8080/profile-images/${profilePhoto}`);
              }
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
            src={previewImage ? previewImage : 'default-placeholder-url'}
            sx={{ bgcolor: '#8A252C', width: 150, height: 150, marginRight: 2 }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography sx={{ marginBottom: 1, fontSize: { xs: '18px', sm: '16px', md: '14px' } }}>
              Clear frontal face photos are an important way for buyers and sellers to learn about each other.
            </Typography>
            <Box>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
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
                onClick={handleUploadProfileImage}
                sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C', marginLeft: '5px', textTransform: 'none' }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 1 }}>
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
          onClick={editMode ? handleSave : toggleEditMode}
          sx={{ mt: 3, color: 'black', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '20px', textTransform: 'none' }}
        >
          {editMode ? 'Save Changes' : 'Edit Information'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleDeleteAccount}
          sx={{ mt: 3, color: 'black', borderColor: 'rgba(0, 0, 0, 0.23)', borderRadius: '20px', textTransform: 'none', marginLeft: '5px' }}
        >
          Delete Account
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminSettings;
