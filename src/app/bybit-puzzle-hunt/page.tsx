"use client";
import React from "react";
import { Container, Typography, Box, Button, Grid, Card, CardContent } from "@mui/material";
import ExtensionIcon from "@mui/icons-material/Extension";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
export default function BybitPuzzleHunt() {

  // Uncomment to automatically redirect to trading page
  // useEffect(() => {
  //   router.push("/bybit-puzzle-hunt/trading");
  // }, [router]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <ExtensionIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight={700}>
          Bybit Puzzle Hunt
        </Typography>
      </Box>

      {/* Description */}
      <Typography variant="body1" mb={6}>
        Welcome to the Bybit Puzzle Hunt! Collect, trade, and complete puzzles to win exclusive rewards.
        Join our community of puzzle enthusiasts and start your collection today.
      </Typography>

      {/* Main options */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#1e1e1e", height: "100%", boxShadow: 3, transition: "transform 0.2s", '&:hover': { transform: "translateY(-5px)" } }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom color="primary" fontWeight={600}>
                Trading Platform
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Exchange puzzle pieces with other collectors. Post what you have and what you need to complete your collection.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                endIcon={<ArrowForwardIcon />}
                component={Link}
                href="/bybit-puzzle-hunt/trading"
                sx={{ mt: 2 }}
              >
                Go to Trading
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "#1e1e1e", height: "100%", boxShadow: 3, transition: "transform 0.2s", '&:hover': { transform: "translateY(-5px)" } }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom color="secondary" fontWeight={600}>
                Marketplace
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Buy and sell puzzle pieces in our marketplace. Find rare pieces to complete your collection or sell your duplicates to other collectors.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary" 
                endIcon={<ArrowForwardIcon />}
                component={Link}
                href="/bybit-puzzle-hunt/marketplace"
                sx={{ mt: 2 }}
              >
                Go to Marketplace
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call to action */}
      <Box textAlign="center" sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Ready to start trading?
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={Link}
          href="/bybit-puzzle-hunt/trading"
          sx={{ mt: 2, px: 4, py: 1.5 }}
        >
          Go to Trading Platform
        </Button>
      </Box>
    </Container>
  );
}
