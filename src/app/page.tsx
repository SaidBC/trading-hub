"use client";
import React from "react";
import UnderMaintenance from "@/components/ui/UnderMaintenance";
import {
  Container,
  Typography,
  Box,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

export default function Home() {
  return (
    <>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <SwapHorizIcon fontSize="large" color="primary" />
          <Typography variant="h3" fontWeight={700}>
            Trading Hub
          </Typography>
        </Box>
      </Container>
      <UnderMaintenance />
    </>
  );
}
