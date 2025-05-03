"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert
} from "@mui/material";
import { useRouter } from "next/navigation";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ChangePassword from "@/components/profile/ChangePassword";
import SocialMedia from "@/components/profile/SocialMedia";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          Please log in to view your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Profile
      </Typography>
      
      <Paper sx={{ mt: 4, borderRadius: 2, overflow: "hidden", display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="profile tabs"
            variant="fullWidth"
            sx={{ mb: 1 }}
          >
            <Tab label="Profile Information" />
            <Tab label="Change Password" />
            <Tab label="Social Media" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <ProfileInfo user={user} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <ChangePassword />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <SocialMedia user={user} />
        </TabPanel>
      </Paper>
    </Container>
  );
}
