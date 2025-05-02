"use client";
import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

interface TradePost {
  have: string;
  need: string;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState<TradePost[]>([
    { have: "Old Laptop", need: "Smartphone" },
    { have: "Bike", need: "Tablet" },
  ]);
  const [form, setForm] = useState<TradePost>({ have: "", need: "" });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ have: "", need: "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = () => {
    if (form.have && form.need) {
      setPosts([{ ...form }, ...posts]);
      handleClose();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <SwapHorizIcon fontSize="large" color="primary" />
        <Typography variant="h3" fontWeight={700}>
          Trading Hub
        </Typography>
      </Box>
      <Typography variant="h6" mb={4}>
        Post what you have and what you need. Connect and trade with others!
      </Typography>
      <Grid container spacing={3}>
        {posts.map((post, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Have:
              </Typography>
              <Typography variant="body1" mb={1}>{post.have}</Typography>
              <Typography variant="subtitle1" fontWeight={600}>
                Need:
              </Typography>
              <Typography variant="body1">{post.need}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "fixed", bottom: 32, right: 32 }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a Trade Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="have"
            label="What do you have?"
            type="text"
            fullWidth
            variant="outlined"
            value={form.have}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="need"
            label="What do you need?"
            type="text"
            fullWidth
            variant="outlined"
            value={form.need}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.have || !form.need}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
