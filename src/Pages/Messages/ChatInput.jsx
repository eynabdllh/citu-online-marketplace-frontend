import React from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage }) => (
  <Box display="flex" alignItems="center" padding="16px" bgcolor="white" borderTop="1px solid #ddd">
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Type a message"
      size="small"
      value={inputMessage}
      onChange={(e) => setInputMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSendMessage();
        }
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSendMessage}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  </Box>
);

export default ChatInput;