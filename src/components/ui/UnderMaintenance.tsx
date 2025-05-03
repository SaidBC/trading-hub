import React from 'react';
import { Box, Typography, Paper, Container, SvgIcon } from '@mui/material';

// Maintenance icon as an SVG
const MaintenanceIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
  </SvgIcon>
);

export default function UnderMaintenance() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <MaintenanceIcon sx={{ fontSize: 80, color: 'warning.main', mb: 2 }} />
        
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Under Maintenance
        </Typography>
        
        <Typography variant="body1" paragraph color="text.secondary">
          We're currently performing some scheduled maintenance on this page.
          Please check back soon.
        </Typography>
        
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            bgcolor: 'background.default',
            borderRadius: 1,
            maxWidth: '400px',
            mx: 'auto'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Expected completion: <strong>May 4, 2025</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            We apologize for any inconvenience this may cause.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
