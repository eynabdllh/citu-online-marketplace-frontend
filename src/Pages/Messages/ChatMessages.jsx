import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const ChatMessages = ({ messages, selectedUser }) => (
  <Box flex="1" overflow="auto" padding="16px" display="flex" flexDirection="column" bgcolor="#f9f9f9">
    {messages
      .filter((msg) => msg.sender === selectedUser?.username || msg.recipient === selectedUser?.username)
      .map((msg, index) => (
        <Box key={index} display="flex" flexDirection={msg.sender === "you" ? "row-reverse" : "row"} marginBottom="16px">
          <Avatar
            sx={{
              marginRight: msg.sender === "you" ? 0 : "10px",
              marginLeft: msg.sender === "you" ? "10px" : 0,
              bgcolor: msg.sender === "you" ? "#64b5f6" : "#ffb74d",
            }}
          >
            {msg.sender.charAt(0)}
          </Avatar>
          <Box bgcolor={msg.sender === "you" ? "#e3f2fd" : "#f5f5f5"} padding="12px" borderRadius="10px" maxWidth="70%">
            <Typography variant="body2" fontWeight="bold" color={msg.sender === "you" ? "#1565c0" : "#444"}>
              {msg.sender}
            </Typography>
            <Typography variant="body2" color="#555" marginBottom="4px">
              {msg.text}
            </Typography>
            <Typography variant="caption" color="#999">
              {msg.time}
            </Typography>
          </Box>
        </Box>
      ))}
  </Box>
);

export default ChatMessages;