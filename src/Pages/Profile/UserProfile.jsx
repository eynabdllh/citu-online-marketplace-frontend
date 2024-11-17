import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Avatar, Box, Button, Paper, List, ListItem, ListItemText, ListItemAvatar, Badge, Tabs, Tab, Card, CardContent, CardMedia } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Link } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const [tabValue, setTabValue] = useState('1');
    const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
    const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
    const [address, setAddress] = useState(sessionStorage.getItem('address') || '');
    const [profilePhoto, setProfilePhoto] = useState(''); 

    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loggedInUser = sessionStorage.getItem('username');
    console.log("Logged-in username:", loggedInUser);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleCardClick = (code) => {
        navigate(`/sell/product/${code}`); 
      };

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/product/getProductsBySeller/${loggedInUser}`);
            console.log('API Response:', response.data);
            setProducts(response.data);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
    }, []);

    // Fetch user data including profile photo
    useEffect(() => {
        const fetchProfileData = async () => {
            const username = sessionStorage.getItem('username');
            try {
                const response = await axios.get(`http://localhost:8080/api/seller/getSellerRecord/${username}`);
                if (response.status === 200) {
                    const { firstName, email, profilePhoto } = response.data;

                    setUsername(firstName);
                    setEmail(email);

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

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            {/* Profile Section with Background Image */}
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 2,
                    backgroundImage: 'url("https://marketplace.canva.com/EAEmGBdkt5A/3/0/1600w/canva-blue-pink-photo-summer-facebook-cover-gy8LiIJTTGw.jpg")', // Replace with your background image URL
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Box
                            sx={{
                                position: 'relative',
                                width: 80,
                                height: 80,
                            }}
                        >
                            <Avatar
                                src={profilePhoto} // Use profile photo URL here
                                alt="Profile Picture"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    position: 'absolute',
                                    top: -10,
                                }}
                            />
                            <Button 
                                component={Link} 
                                to="/account" 
                                color="white"
                                variant="outlined" 
                                sx={{
                                    width: "130px",            
                                    height: "20px",           
                                    padding: "10px 5px",      
                                    lineHeight: 1,            
                                    fontSize: "14px",         
                                    position: "absolute",
                                    top: -40,
                                    left: 980,
                                    transition: "all 0.3s ease", 
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.2)", 
                                    },
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs sx={{ textAlign: 'left', marginLeft: 3 }}>
                        <Typography variant="h5">{username}</Typography>
                        <Typography variant="body2" color="inherit">
                            {email}
                        </Typography>
                        <Typography variant="body2" color="inherit" sx={{ textAlign: 'left', marginTop: 1 }}>
                            {address} · Joined (insert registerd date here in format '2y 10m')
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                5.0
                                {[...Array(5)].map((_, index) => (
                                    <StarIcon key={index} fontSize="small" color="warning" sx={{ marginLeft: index === 0 ? 0 : 0.5 }} />
                                ))}
                                (130 Reviews)
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mt={1}>
                            <VerifiedIcon color="primary" sx={{ marginRight: 0.5 }} />
                            <Typography variant="body2" color="inherit">Verified · Very Responsive</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabs */}
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            onChange={handleChange}
                            sx={{
                                justifyContent: 'center',
                                paddingBottom: '0',
                                '& .MuiTabs-indicator': {
                                    height: '2px',
                                    borderRadius: '0',
                                    backgroundColor: '#89343b',
                                },
                            }}
                            aria-label="lab API tabs example"
                            centered
                        >
                            <Tab
                                label="Listings"
                                value="1"
                                sx={{
                                    paddingBottom: 3,
                                    '&.Mui-selected': {
                                        color: '#89343b',
                                    },
                                }}
                            />
                            <Tab
                                label="Reviews"
                                value="2"
                                sx={{
                                    paddingBottom: 3,
                                    '&.Mui-selected': {
                                        color: '#89343b',
                                    },
                                }}
                            />
                        </TabList>
                    </Box>
                    {/* Listings Tab */}
                    <TabPanel value="1">
                        {/* Listings Section */}
                        <Paper elevation={1} sx={{ padding: 3, marginTop: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                My Products
                            </Typography>
                            {/* Loading and product display logic */}
                            {loading ? (
                                <Typography variant="h6" sx={{ marginTop: '16px' }}>
                                    Loading products...
                                </Typography>
                            ) : products.length === 0 ? (
                                <Typography variant="h6" sx={{ marginTop: '16px' }}>
                                    No products available.
                                </Typography>
                            ) : (
                                <Grid container spacing={2} sx={{ marginTop: '40px' }}>
                                    {products.map((product) => {
                                        return (
                                        <Grid item xs={2.4} key={product.id}>
                                            <Card sx={{ width: '100%' }} onClick={() => handleCardClick(product.code)}> 
                                            <CardMedia
                                                component="img"
                                                alt={product.name}
                                                height="140"
                                                image={`http://localhost:8080/${product.imagePath}`}
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/140'; }}
                                            />
                                            <CardContent>
                                                <Typography variant="h6" noWrap>{product.name}</Typography>
                                                <Typography color="textSecondary" noWrap>{product.pdtDescription}</Typography>
                                                <Typography variant="body1">Quantity: {product.qtyInStock}</Typography>
                                                <Typography variant="body1">Price: ₱{product.buyPrice.toFixed(2)}</Typography>
                                            </CardContent>
                                            </Card>
                                        </Grid>
                                        );
                                    })}
                                    </Grid>
                            )}
                        </Paper>
                    </TabPanel>

                    <TabPanel value="2">
                        {/* Reviews Section */}
                        <Paper elevation={1} sx={{ padding: 3, marginTop: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Reviews
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="h4" color="textPrimary" fontWeight="bold">5.0</Typography>
                                <StarIcon color="warning" sx={{ marginLeft: 0.5 }} />
                                <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
                                    (130 Reviews)
                                </Typography>
                            </Box>

                            {/* Reviews List */}
                            <List>
                                {[
                                    { user: 'user1', review: 'Had a great deal with her', daysAgo: '9 days ago' },
                                    { user: 'user2', review: 'One of the best sellers! Decisive and easy to transact with.', daysAgo: '11 days ago' },
                                ].map((item, index) => (
                                    <ListItem key={index} alignItems="flex-start">
                                        <ListItemAvatar>
                                            <Avatar>{item.user.charAt(0).toUpperCase()}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="body1" fontWeight="bold">
                                                        {item.user}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
                                                        {item.daysAgo}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <React.Fragment>
                                                    <Typography variant="body2" color="textPrimary">
                                                        {item.review}
                                                    </Typography>
                                                    <Box mt={1}>
                                                        <Badge badgeContent="Amazing chat" color="primary" 
                                                            sx={{ marginLeft: 6, marginRight: 1, '& .MuiBadge-badge': { 
                                                                minWidth: '100px',  
                                                                padding: '0 5px',  
                                                            }  }} 
                                                        />
                                                        <Badge badgeContent="Fast and decisive" color="secondary" 
                                                            sx={{ marginLeft: 13, marginRight: 1, '& .MuiBadge-badge': { 
                                                                minWidth: '120px',  
                                                                padding: '0 5px',  
                                                            }  }} 
                                                        />
                                                        <Badge badgeContent="Easygoing buyer" color="success" 
                                                            sx={{ marginLeft: 13, marginRight: 1, '& .MuiBadge-badge': { 
                                                                minWidth: '100px',  
                                                                padding: '0 5px',  
                                                            }  }} 
                                                        />
                                                    </Box>
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </TabPanel>
                </TabContext>
            </Box>
            
        </Container>
    );
};

export default UserProfile;
