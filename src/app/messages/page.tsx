"use client";
import React, { useState } from "react";
import { Container, Box, Typography, Paper, TextField, IconButton, List, ListItem, ListItemText, Divider, Avatar } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from '@mui/icons-material/Person';

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { sender: "me", text: "Hi! I'm interested in trading." },
    { sender: "User123", text: "Sure! What pieces do you have?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "me", text: input }]);
      setInput("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 3, minHeight: 500, display: 'flex', flexDirection: 'column', boxShadow: 6, borderRadius: 3, bgcolor: 'background.default' }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Messenger
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems={msg.sender === "me" ? "right" : "left"} sx={{ justifyContent: msg.sender === "me" ? 'flex-end' : 'flex-start' }}>
                {msg.sender !== "me" && <Avatar sx={{ mr: 1, bgcolor: '#1976d2' }}><PersonIcon /></Avatar>}
                <Paper sx={{ p: 1.5, bgcolor: msg.sender === "me" ? 'primary.main' : 'grey.900', color: '#fff', borderRadius: 2, minWidth: 80 }}>
                  <ListItemText primary={msg.text} />
                </Paper>
                {msg.sender === "me" && <Avatar sx={{ ml: 1, bgcolor: 'secondary.main' }}>M</Avatar>}
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
