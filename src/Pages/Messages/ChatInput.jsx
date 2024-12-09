import React, { useRef } from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, handleImageUpload }) => {
  const fileInputRef = useRef(null);

  return (
    <Box display="flex" alignItems="center" padding="16px" bgcolor="white" borderTop="1px solid #ddd">
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      <IconButton onClick={() => fileInputRef.current.click()} sx={{ mr: 1 }}>
        <AttachFileIcon />
      </IconButton>
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
};

export default ChatInput;