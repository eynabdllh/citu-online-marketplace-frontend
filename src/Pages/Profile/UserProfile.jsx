import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Avatar, Box, Button, Paper, Tabs, Tab, Card, CardContent, CardMedia, Rating } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import axios from 'axios';
import SellerReviews from './SellerReviews'; // Import the new component
import { mockReviews } from './SellerReviews'; // Import mock reviews

const UserProfile = () => {
    const [tabValue, setTabValue] = useState('1');
    const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
    const [email, setEmail] = useState(sessionStorage.getItem('email') || '');
    const [address, setAddress] = useState(sessionStorage.getItem('address') || '');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loggedInUser = sessionStorage.getItem('username');
    const navigate = useNavigate();

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
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProfileData = async () => {
            const username = sessionStorage.getItem('username');
            try {
                const response = await axios.get(`http://localhost:8080/api/seller/getSellerRecord/${username}`);
                if (response.status === 200) {
                    const { firstName, email, profilePhoto } = response.data;

                    setUsername(firstName);
                    setEmail(email);

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

    const averageRating = products.length > 0 ? 
        mockReviews.reduce((sum, review) => sum + review.productQuality, 0) / mockReviews.length : 0;

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    padding: 3,
                    marginBottom: 2,
                    backgroundImage: 'url("https://marketplace.canva.com/EAEmGBdkt5A/3/0/1600w/canva-blue-pink-photo-summer-facebook-cover-gy8LiIJTTGw.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                }}
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                            <Avatar
                                src={profilePhoto}
                                alt="Profile Picture"
                                sx={{ width: 100, height: 100, position: 'absolute', top: -10 }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs sx={{ textAlign: 'left', marginLeft: 3 }}>
                        <Typography variant="h5">{username}</Typography>
                        <Typography variant="body2" color="inherit">
                            {email}
                        </Typography>
                        <Typography variant="body2" color="inherit" sx={{ textAlign: 'left', marginTop: 1 }}>
                            {address} 
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, margin: 0, padding: 0 }}>
                            {/* Average Rating */}
                            <Box display="flex" alignItems="center" sx={{ margin: 0, padding: 0 }}>
                                <Typography variant="body2" sx={{ display: 'flex', margin: 0, padding: 0, gap: 1, mt: 1 }}>
                                    {averageRating.toFixed(1)}
                                    <Rating
                                        value={averageRating}
                                        readOnly                                    
                                        sx={{
                                            color: '#FFD700',
                                            margin: 0, 
                                            padding: 0,
                                            '& .MuiRating-icon': { color: '#FFD700' },
                                        }}
                                    />
                                    ({mockReviews.length} Reviews)
                                </Typography>
                            </Box>

                            {/* Verified Badge */}
                            <Box display="flex" alignItems="center" sx={{ position: 'absolute', top: 320 }}>
                                <VerifiedIcon color="primary" sx={{ marginRight: 0.5 }} />
                                <Typography variant="body2" color="inherit">
                                    Verified · Very Responsive
                                </Typography>
                            </Box>
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
                                    bottom: -20,
                                },
                                '& .MuiTab-root': {
                              
                                    minWidth: 100,
                                    fontSize: '15px',
                                    fontWeight: 400,
                                    color: '#666',
                                 
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        color: '#89343b',
                                        background: 'transparent',
                                        opacity: 0.7,
                                    },
                                    '&.Mui-selected': {
                                        color: '#89343b',
                                        fontWeight: 500,
                                    },
                                },
                                '& .MuiTabs-flexContainer': {
                                    gap: '24px', 
                                }
                            }}
                            aria-label="profile tabs"
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
                        <Paper elevation={1} sx={{ padding: 3, marginTop: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                My Products
                            </Typography>
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
                                    {products.map((product) => (
                                        <Grid item xs={2.4} key={product.id}>
                                            <Card 
                                                sx={{ 
                                                    width: '100%',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                                    }
                                                }} 
                                                onClick={() => handleCardClick(product.code)}
                                            >
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
                                    ))}
                                </Grid>
                            )}
                        </Paper>
                    </TabPanel>

                    {/* Reviews Tab */}
                    <TabPanel value="2">
                        <SellerReviews />
                    </TabPanel>
                </TabContext>
            </Box>
            {/* Footer Section */}
            <Box sx={{  padding: "20px", textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#555" }}>
                © 2024 CIT-U Marketplace. All Rights Reserved.
            </Typography>
            </Box>
        </Container>
    );
};

export default UserProfile;
