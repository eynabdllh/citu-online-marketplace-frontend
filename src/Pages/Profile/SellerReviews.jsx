import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const SellerReviews = () => {
    const reviews = [
        { user: 'user1', review: 'Had a great deal with her', daysAgo: '9 days ago' },
        { user: 'user2', review: 'One of the best sellers! Decisive and easy to transact with.', daysAgo: '11 days ago' },
    ];

    return (
        <Paper elevation={1} sx={{ padding: 3, marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
                Reviews
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" color="textPrimary" fontWeight="bold">
                    5.0
                </Typography>
                <StarIcon color="warning" sx={{ marginLeft: 0.5 }} />
                <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
                    (130 Reviews)
                </Typography>
            </Box>

            {/* Reviews List */}
            <List>
                {reviews.map((item, index) => (
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
                                        <Badge
                                            badgeContent="Amazing chat"
                                            color="primary"
                                            sx={{
                                                marginLeft: 6,
                                                marginRight: 1,
                                                '& .MuiBadge-badge': {
                                                    minWidth: '100px',
                                                    padding: '0 5px',
                                                },
                                            }}
                                        />
                                        <Badge
                                            badgeContent="Fast and decisive"
                                            color="secondary"
                                            sx={{
                                                marginLeft: 13,
                                                marginRight: 1,
                                                '& .MuiBadge-badge': {
                                                    minWidth: '120px',
                                                    padding: '0 5px',
                                                },
                                            }}
                                        />
                                        <Badge
                                            badgeContent="Easygoing buyer"
                                            color="success"
                                            sx={{
                                                marginLeft: 13,
                                                marginRight: 1,
                                                '& .MuiBadge-badge': {
                                                    minWidth: '100px',
                                                    padding: '0 5px',
                                                },
                                            }}
                                        />
                                    </Box>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default SellerReviews;
