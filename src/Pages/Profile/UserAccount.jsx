import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, TextField, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from 'axios';
import '../../App.css';

const UserAccount = () => {
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

    const handleSave = async () => {
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
        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match!');
            return;
        }
    
        // Perform any other validation checks here (e.g., password length, complexity)
        if (newPassword.length < 8) {
            alert('New password should be at least 8 characters long.');
            return;
        }
    
        try {
            const username = sessionStorage.getItem('username'); // Get the username from session storage
    
            // Send the request to change the password
            const response = await axios.put(`http://localhost:8080/api/seller/changePassword/${username}`, {
                currentPassword,
                newPassword,
            });
    
            // Handle successful response
            if (response.status === 200) {
                alert('Password changed successfully!');
                setOpenChangePassword(false); 
    
                // Clear the password fields after a successful change
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // If the API returns an error status, show it
                console.error('Error changing password:', response.data);
                alert(response.data.message || 'An error occurred while changing the password.');
            }
        } catch (error) {
            // Handle server or network errors
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
        <Box display="flex" sx={{ height: '100vh' }}>
            <Box sx={{ width: '250px', p: 2, boxShadow: 1 }}>
                <Button startIcon={<ArrowBackIosIcon />} sx={{ mb: 3 }}>
                </Button>
                <List component="nav">
                    <ListItem button selected>
                        <ListItemIcon><PersonIcon /></ListItemIcon>
                        <ListItemText primary="Personal" />
                    </ListItem>
                    {/*<ListItem button>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>*/}
                </List>
            </Box>

            <Box sx={{ flex: 1, p: 4 }}>
                <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                    src={previewImage ? previewImage : 'default-placeholder-url'}
                    sx={{ bgcolor: '#8A252C', width: 80, height: 80 }}
                ></Avatar>
                    <Box>
                        <Typography variant="h5">{firstName} {lastName}</Typography>
                        <Typography color="textSecondary">{email}</Typography>

                        {/* Hidden file input */}
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
                            sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C' }}
                        >
                            Upload Profile Picture
                        </Button>

                        {/* Save button */}
                        <Button
                            variant="outlined"
                            onClick={handleUploadProfileImage}
                            sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C', marginLeft: '5px' }}
                        >
                            Save Profile Picture
                        </Button>

                        <Button 
                            variant="outlined" 
                            onClick={() => setOpenChangePassword(true)} 
                            sx={{ mt: 1, borderColor: '#8A252C', color: '#8A252C', marginLeft: '5px'}}
                        >
                            Change Password
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                
                <Typography variant="h6">Personal</Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="grey">First Name</Typography>
                    {editMode ? (
                        <TextField
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    ) : (
                        <Typography variant="body1" color="black">{firstName}</Typography>
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
                        <Typography variant="body1" color="black">{lastName}</Typography>
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

                {/* Change Password Dialog */}
                <Dialog open={openChangePassword} onClose={() => setOpenChangePassword(false)}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChangePassword(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword} color="primary">
                            Change Password
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default UserAccount;