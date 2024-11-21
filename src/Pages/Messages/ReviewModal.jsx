import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Rating } from "@mui/lab";

const ReviewModal = ({ open, onClose, product }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = () => {
    alert(
      `Review submitted for ${product?.name}:\nRating: ${rating}\nFeedback: ${feedback}\nAnonymous: ${anonymous}`
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h6" mb={2}>
          Leave a Review for {product?.name}
        </Typography>
        <Rating
          value={rating}
          onChange={(e, newValue) => setRating(newValue)}
          size="large"
          precision={0.5}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            />
          }
          label="Leave review anonymously"
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewModal;