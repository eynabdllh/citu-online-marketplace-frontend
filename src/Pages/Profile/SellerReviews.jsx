import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, LinearProgress } from '@mui/material';
import { Rating } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const mockReviews = [
  {
    id: 1,
    username: 'anadia',
    productQuality: 4,
    sellerService: 5,
    feedback: 'Loved the structure and flow. Thank you!',
    anonymous: false,
    date: '12/27/2022',
    time: '10:30 AM',
  },
  {
    id: 2,
    username: 'Anonymous',
    productQuality: 3,
    sellerService: 2,
    feedback: 'Some information is outdated. Could do better!',
    anonymous: true,
    date: '12/27/2022',
    time: '10:30 AM',
  },
  
];

const SellerReviews = () => {
  const averageRating = mockReviews.reduce((sum, review) => sum + review.productQuality, 0) / mockReviews.length;

  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => {
    const count = mockReviews.filter((review) => review.productQuality === rating).length;
    return (count / mockReviews.length) * 100;
  });

  return (
    <Paper elevation={1} sx={{ padding: 3, marginTop: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
            Reviews
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h2" color="textPrimary" fontWeight="bold" sx={{ marginLeft: 12 }}>
                {averageRating.toFixed(1)}
            </Typography>
            <StarIcon color="warning" sx={{ marginLeft: 1, marginRight: 10, fontSize: '35px' }} />
        
            {/* Rating Distribution Bar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1,  marginRight: 5}}>
            {[5, 4, 3, 2, 1].map((rating, index) => (
                <Box key={rating} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                <Typography variant="body2" sx={{ width: 20, textAlign: 'center' }}>
                    {rating}
                </Typography>
                <Box sx={{ flex: 1, margin: '0 10px' }}>
                    <LinearProgress
                    variant="determinate"
                    value={ratingDistribution[5 - rating]}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: 'gold', 
                        },
                    }}
                    />
                </Box>
                <Typography variant="body2" color="textSecondary">
                    {ratingDistribution[5 - rating].toFixed(0)}%
                </Typography>
                </Box>
            ))}
            </Box>
        </Box>

      {/* Reviews List */}
      <List>
        {mockReviews.map((item) => (
          <ListItem key={item.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{item.username.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" flexDirection="column">
                  <Typography variant="body1" fontWeight="bold">
                    {item.anonymous ? 'Anonymous User' : item.username}
                  </Typography>
                  <Box display="flex" mb={1}>
                    <Rating value={item.productQuality} size="small" sx={{ color: 'gold' }} />
                    <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1 }}>
                      {item.date} - {item.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textPrimary">
                    {item.feedback}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SellerReviews;