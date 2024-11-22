import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/orders/${id}/status`, null, {
        params: { status },
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${id}/cancel`);
      alert("Order canceled successfully.");
      navigate("/orders");
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <Box sx={{ padding: "16px" }}>
      {loading ? (
        <Typography variant="h6">Loading order details...</Typography>
      ) : !order ? (
        <Typography variant="h6">Order not found.</Typography>
      ) : (
        <Box>
          <Typography variant="h4">Order ID: {order.id}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Typography>Total Amount: ₱{order.totalAmount.toFixed(2)}</Typography>
          <Typography>Order Date: {new Date(order.orderDate).toLocaleString()}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Items:
          </Typography>
          {order.items.map((item) => (
            <Typography key={item.id}>
              {item.quantity} x {item.productName} (₱{item.price.toFixed(2)})
            </Typography>
          ))}

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => handleUpdateStatus("Shipped")}
            >
              Mark as Shipped
            </Button>
            <Button variant="contained" color="error" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default OrderDetails;
