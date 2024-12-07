import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import OrderService from '../services/OrderService'; // Make sure to adjust the path if needed
import { useNavigate } from 'react-router-dom'; 

const BoldTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    fontWeight: 'bold',
  },
});

const UpdateOrderForm = ({ order, onUpdateSuccess }) => {
  const [status, setStatus] = useState(order.status || '');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || '');
  const [totalAmount, setTotalAmount] = useState(order.totalAmount || '');
  const navigate = useNavigate();

  useEffect(() => {
    setStatus(order.status || '');
    setPaymentStatus(order.paymentStatus || '');
    setTotalAmount(order.totalAmount || '');
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedOrder = {
      id: order.id, // Assuming `order` has the `id` field
      status,
      paymentStatus,
      totalAmount,
    };

    try {
      await OrderService.updateOrder(updatedOrder); // Call the service to update the order
      alert('Order updated successfully!');
      onUpdateSuccess(); // Callback to refresh the parent component
      navigate(`/`); // Navigate to another page if needed
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '100vh',
        }}
      >
        <Typography variant="h5" sx={{ fontSize: '30px', fontWeight: '800', color: '#89343b' }}>
          Update Order - {order.id}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <BoldTextField
            margin="normal"
            required
            fullWidth
            label="Status"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </BoldTextField>

          <BoldTextField
            margin="normal"
            required
            fullWidth
            label="Payment Status"
            select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </BoldTextField>

          <BoldTextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Total Amount"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            disabled // Assuming the total amount is not editable by the seller
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ marginTop: 3, width: '100%', bgcolor: '#89343b' }}
          >
            Update Order
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UpdateOrderForm;
