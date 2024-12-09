import React from "react";
import { Box, Typography, CardMedia, Button } from "@mui/material";

const ProductDetails = ({ product, markAsSold, viewSellerChats, openReviewModal, loggedInUsername, hasReviewed }) => {
    const isMarkedAsSoldToCurrentUser = 
        product?.status === "Sold" && 
        product?.markedAsSoldTo === loggedInUsername;

    const StatusDisplay = () => (
        <Typography 
            variant="body2" 
            color={product?.status === "Sold" ? "error.main" : "success.main"}
            sx={{ ml: 1 }}
        >
            • {product?.status}
        </Typography>
    );

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px" bgcolor="white">
            <Box display="flex" alignItems="center">
                <CardMedia
                    component="img"
                    src={product?.image || "https://via.placeholder.com/100"}
                    alt="Product"
                    sx={{ width: 50, height: 50, marginRight: "16px" }}
                />
                <Box>
                    <Typography variant="body1" fontWeight="bold">
                        {product?.name || "No Product"}
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Typography variant="body2" color="gray">
                            ₱{product?.price?.toFixed(2) || "0.00"}
                        </Typography>
                        <StatusDisplay />
                    </Box>
                </Box>
            </Box>
            {viewSellerChats ? (
                isMarkedAsSoldToCurrentUser ? (
                    hasReviewed ? (
                        <Typography variant="body2" color="success.main">
                            Reviewed
                        </Typography>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => openReviewModal(product)}
                        >
                            Leave a Review
                        </Button>
                    )
                ) : null
            ) : (
                product?.status === "Available" && (
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={() => markAsSold(product)}
                    >
                        Mark as Sold
                    </Button>
                )
            )}
        </Box>
    );
};

export default ProductDetails;