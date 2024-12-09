import React from 'react';
import { Dialog } from '@mui/material';

const AddAdminModal = ({ open, onClose, onAdd }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {/* Add your modal content here */}
    </Dialog>
  );
};

export default AddAdminModal;
