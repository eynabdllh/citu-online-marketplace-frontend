// src/components/HomePage.js
import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';

function HomePage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
            {/* Main Content */}
            <Box sx={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={4} alignItems="center" maxWidth="lg">
                    {/* Left Side: Text Content */}
                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Welcome Wildcat!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                            Nulla quis lorem ut libero malesuada feugiat. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Button variant="contained" color="primary" sx={{ paddingX: 3 }}>
                                Button
                            </Button>
                            <Button variant="outlined" color="primary" sx={{ paddingX: 3 }}>
                                Button
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Side: Actual Image */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 0,
                              overflow: 'hidden',
                              height: { xs: 300, md: 513 }, // Change height based on screen size
                              width: { xs: '100%', md: '100%' }, // Adjust width for different screen sizes
                              boxShadow: 3,
                            }}
                        >
                            <img
                                src='/images/building.jpg'
                                alt="GLE building"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    backgroundColor: '#89343b',
                    color: '#fff',
                    textAlign: 'center',
                    padding: 2,
                    mt: 'auto', // Ensures the footer stays at the bottom
                }}
            >
                <Typography variant="body1">Footer</Typography>
            </Box>
        </Box>
    );
}

export default HomePage;