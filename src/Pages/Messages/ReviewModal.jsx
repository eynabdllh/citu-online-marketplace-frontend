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
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

const labels = {
  1: "Terrible",
  2: "Poor",
  3: "Ok",
  4: "Good",
  5: "Amazing",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

const ReviewModal = ({ open, onClose, product }) => {
  const [productQuality, setProductQuality] = useState(0); 
  const [sellerService, setSellerService] = useState(0); 
  const [feedback, setFeedback] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const renderRating = (value, setValue, label) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1" sx={{ color: "#8A252C", mb: 1 }}>
        {label}
      </Typography>
  
      {/*Stars and Rating Label*/}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Rating
          name={`${label}-rating`}
          value={value}
          getLabelText={getLabelText}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          sx={{
            "& .MuiRating-iconFilled": { color: "gold" },
          }}
        />
        {value !== null && (
          <Typography
            variant="body2"
            sx={{
              color: "gold",
              fontWeight: 500,
              lineHeight: 1.5, 
            }}
          >
            {labels[value]}
          </Typography>
        )}
      </Box>
    </Box>
  );
  
  const handleSubmit = () => {
    alert(
      `Review submitted for ${product?.name}:\nProduct Quality: ${productQuality}\nSeller Service: ${sellerService}\nFeedback: ${feedback}\nAnonymous: ${anonymous}`
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
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          border: "2px solid rgba(140, 24, 35, 0.5)",
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          sx={{ color: "#8A252C", fontWeight: "bold" }}
        >
          Leave a Review for {product?.name}
        </Typography>

        {renderRating(productQuality, setProductQuality, "Product Quality")}
        {renderRating(sellerService, setSellerService, "Seller Service")}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
          sx={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "5px",
          }}
        />

        {/* Anonymity Checkbox */}
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
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              mr: 2,
              borderColor: "#8A252C",
              color: "#8A252C",
              "&:hover": {
                borderColor: "#bd323b",
                backgroundColor: "#bd323b",
                color: "white",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#8A252C",
              "&:hover": {
                backgroundColor: "#bd323b",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewModal;