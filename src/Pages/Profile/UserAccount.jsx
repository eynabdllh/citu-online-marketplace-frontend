import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import '../../App.css';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
const UserAccount = (props) => {
    const [value, setValue] = useState(0);
    const [username, setUsername] = useState(sessionStorage.getItem('userName') || '');
    const [firstName, setFirstName] = useState(sessionStorage.getItem('firstName') || '');
    const [lastName, setLastName] = useState(sessionStorage.getItem('lastName') || '');
    const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
    const [address, setAddress] = useState(sessionStorage.getItem('address') || '');
    const [contactNo, setContactNo] = useState(sessionStorage.getItem('contactNo') || '');
    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    // State for Change Password
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
      };

    const handleSave = async () => {
        if (window.confirm('Are you sure you want to update your account?')) {
            try {
                const updatedData = { firstName, lastName, email, address, contactNo };
                const username = sessionStorage.getItem('username'); 
    
                const response = await axios.put(`http://localhost:8080/api/seller/putSellerRecord/${username}`, updatedData);
    
                if (response.status === 200) {
                    sessionStorage.setItem('firstName', firstName);
                    sessionStorage.setItem('lastName', lastName);
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('address', address);
                    sessionStorage.setItem('contactNo', contactNo);
    
                    setEditMode(false); 
                } else {
                    console.error('Error updating user data:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating user data:', error);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const username = sessionStorage.getItem('username');
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/seller/deleteSellerRecord/${username}`);

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

    const handleChangePassword = async () => {
        if (!newPassword) {
            alert('New password cannot be empty! Please input neccessary details.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match!');
            return;
        }
        if (newPassword.length < 8) {
            alert('New password should be at least 8 characters long.');
            return;
        }
        
    
        try {
            const username = sessionStorage.getItem('username'); 
            const response = await axios.put(`http://localhost:8080/api/seller/changePassword/${username}`, {
                currentPassword,
                newPassword,
            });
    
            if (response.status === 200) {
                alert('Password changed successfully!');
                setOpenChangePassword(false); 
    
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                console.error('Error changing password:', response.data);
                alert(response.data.message || 'An error occurred while changing the password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            alert('An error occurred while changing the password. Please try again.');
        }
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file) {
            setProfileImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUploadProfileImage = async () => {
        if(!profileImage) 
            return;

        const username = sessionStorage.getItem('username');
        const formData = new FormData();
        formData.append('file', profileImage);

        try {
            const response = await axios.post(`http://localhost:8080/api/seller/uploadProfilePhoto/${username}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data'},
            });

            if(response.status === 200) {
                alert('Profile picture updated successfully!');
                setPreviewImage(response.data.fileName);
                //setPreviewImage(URL.createObjectURL(profileImage));
                //sessionStorage.setItem('profilePhoto', response.data.fileName);
            }
        } catch (error) {
            console.error('Error uploading profile photo: ', error);
            alert('Failed to upload profile photo');
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            const username = sessionStorage.getItem('username');
            try {
                const response = await axios.get(`http://localhost:8080/api/seller/getSellerRecord/${username}`);
                if (response.status === 200) {
                    const { firstName, lastName, email, address, contactNo, profilePhoto } = response.data;
    
                    setFirstName(firstName);
                    setLastName(lastName);
                    setEmail(email);
                    setAddress(address);
                    setContactNo(contactNo);
                    setUsername(username);

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
        <Box 
            sx={{ 
                display: 'flex',
                padding: '50px'
            }}
        >
            {/* Vertical Tabs */}
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                textColor="black"
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider', width: '250px', '& .MuiTabs-indicator': {backgroundColor: '#8A252C'} }}
            >
                <Tab label="Personal Info" {...a11yProps(0)} />
                <Tab label="Change Password" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <Paper elevation={1} sx={{ padding: 3, marginTop: '-25px', backgroundColor: '#f0f0f0', border: '2px solid #8A252C', borderRadius: '10px' }}>
                    <Typography variant="h5" sx={{fontWeight: 'bold'}}>Edit Profile</Typography>
                    <Typography variant="h6" sx={{ marginTop: 5, marginBottom: 1, fontWeight: '600' }}>
                        Profile Photo
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={previewImage ? previewImage : 'default-placeholder-url'}
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
                    <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 1, fontWeight: '600' }}>
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
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="grey">Address</Typography>
                        {editMode ? (
                        <TextField
                            fullWidth
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        ) : (
                        <Typography variant="body1" color="black">{address}</Typography>
                        )}
                    </Box>
                    <Typography variant="h6" sx={{ marginTop: 3, marginBottom: 1, fontWeight: '600' }}>
                       Private Information
                    </Typography>
                    <LockOutlinedIcon style={{ verticalAlign: 'middle', marginBottom: '5px', marginLeft: '-5px' }}/> 
                    <span style={{ marginLeft: '10px', textDecoration: 'none', color: 'inherit', fontSize: '14px' }}>We do not share this information with other users unless explicit permission is given by you.</span>
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
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Paper elevation={1} sx={{ padding: 3, marginTop: '-25px', backgroundColor: '#f0f0f0', border: '2px solid #8A252C', borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>Change Password</Typography>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            margin="dense"
                            label="Current Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </Box>
                        <Button onClick={handleChangePassword} color="primary" variant="outlined" sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C' }}  >Change Password</Button>
                </Paper>
            </TabPanel>
        </Box>
    );
};

export default UserAccount;
