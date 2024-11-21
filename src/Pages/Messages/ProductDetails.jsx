import React from "react";
import { Box, Typography, CardMedia, Button } from "@mui/material";

const ProductDetails = ({ product, markAsSold, viewSellerChats, openReviewModal, loggedInUsername }) => {
    if (!product) {
        return (
            <Typography variant="body2" color="text.secondary" padding="16px">
                No product details available.
            </Typography>
        );
    }

    const isMarkedAsSoldToCurrentUser =
        product?.status === "Sold" && product?.markedAsSoldTo === loggedInUsername;

    const shouldShowSoldText = product?.status === "Sold" && product?.markedAsSoldTo !== loggedInUsername;

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
                    <Typography variant="body2" color="gray">
                        ₱{product?.price?.toFixed(2) || "0.00"} - {product?.status || "Unknown"}
                    </Typography>
                </Box>
            </Box>
            {viewSellerChats ? (
                // Chat with Seller interface
                isMarkedAsSoldToCurrentUser ? (
                    <Button variant="contained" color="primary" onClick={() => openReviewModal(product)}>
                        Leave a Review
                    </Button>
                ) : shouldShowSoldText ? (
                    <Typography variant="body2" color="error.main">
                        Sold
                    </Typography>
                ) : (
                    <Typography variant="body2" color="success.main">
                        Available
                    </Typography>
                )
            ) : (
                // Chat with Buyer interface
                product?.status === "Available" && (
                    <Button variant="contained" color="success" onClick={() => markAsSold(product)}>
                        Mark as Sold
                    </Button>
                )
            )}
        </Box>
    );
};

export default ProductDetails;