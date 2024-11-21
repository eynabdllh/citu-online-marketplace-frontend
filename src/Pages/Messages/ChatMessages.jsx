import React from "react";
import { Box, Typography, Avatar } from "@mui/material";

const ChatMessages = ({ messages, selectedUser }) => (
  <Box flex="1" overflow="auto" padding="16px" display="flex" flexDirection="column" bgcolor="#f9f9f9">
    {messages
      .filter(
        (msg) =>
          msg.sender === selectedUser?.username || msg.recipient === selectedUser?.username
      )
      .map((msg, index) => (
        <Box
          key={index}
          display="flex"
          flexDirection={msg.sender === selectedUser?.username ? "row" : "row-reverse"}
          marginBottom="16px"
        >
          <Avatar
            sx={{
              marginRight: msg.sender === selectedUser?.username ? "10px" : 0,
              marginLeft: msg.sender === selectedUser?.username ? 0 : "10px",
              bgcolor: msg.sender === selectedUser?.username ? "#ffb74d": "#64b5f6",
            }}
          >
            {msg.sender.charAt(0).toUpperCase()}
          </Avatar>
          <Box
            bgcolor={msg.sender === selectedUser?.username ? "#f5f5f5": "#e3f2fd"}
            padding="12px"
            borderRadius="10px"
            maxWidth="70%"
          >
            <Typography variant="body2" fontWeight="bold" color="#444">
              {msg.sender === "you" ? "Me" : msg.sender}
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