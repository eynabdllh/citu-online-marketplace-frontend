import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axios';
import UpdateOrderForm from './UpdateOrderForm'; // Import the UpdateOrderForm component

const ViewOrder = () => {
  const { orderId } = useParams(); 
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the order details by ID
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateSuccess = () => {
    navigate('/orders'); // Go back to the order list page
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <UpdateOrderForm order={order} onUpdateSuccess={handleUpdateSuccess} />
    </div>
  );
};

export default ViewOrder;
