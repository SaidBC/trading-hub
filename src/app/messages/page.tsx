"use client";
import React from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import UnderMaintenance from "@/components/ui/UnderMaintenance";

export default function MessagesPage() {
  return (
    <>
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={1} align="center">
          Messenger
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Container>
      <UnderMaintenance />
    </>
  );
}
