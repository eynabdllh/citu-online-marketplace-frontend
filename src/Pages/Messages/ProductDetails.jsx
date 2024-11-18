import React from "react";
import { Box, Typography, CardMedia, Button } from "@mui/material";

const ProductDetails = ({ product, markAsSold, viewSellerChats }) => (
  <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px" bgcolor="white" borderBottom="1px solid #ddd">
    <Box display="flex" alignItems="center">
      <CardMedia component="img" src={product?.image} alt="Product" sx={{ width: "50px", height: "50px", marginRight: "16px" }} />
      <Box>
        <Typography variant="body1" fontWeight="bold">
          {product?.name || "No Product"}
        </Typography>
        <Typography variant="body2" color="#999">
          ₱{product?.price.toFixed(2) || "0.00"}
        </Typography>
      </Box>
    </Box>
    {!viewSellerChats && (
      <Button variant="contained" size="small" color="success" onClick={() => markAsSold(product)}>
        Mark as Sold
      </Button>
    )}
  </Box>
);

export default ProductDetails;