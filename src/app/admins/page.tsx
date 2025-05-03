"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  List,
  ListItem,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import TelegramIcon from "@mui/icons-material/Telegram";
import TagIcon from "@mui/icons-material/Tag";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

type Admin = {
  id: string;
  username: string;
  name: string | null;
  email: string;
  role: string;
  discord: string | null;
  whatsapp: string | null;
  telegram: string | null;
};

export default function AdminsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch admin users
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/list-admins");
        
        if (!response.ok) {
          throw new Error("Failed to fetch admin users");
        }
        
        const data = await response.json();
        setAdmins(data.admins);
      } catch (err: Error | unknown) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred while fetching admin users";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin List
      </Typography>

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      <Paper sx={{ mt: 3 }}>
        {admins.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6">No admins yet</Typography>
          </Box>
        ) : (
          <List>
            {admins.map((admin, index) => (
              <Box key={admin.id}>
                <ListItem>
                  <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
                    {/* Left side: Avatar */}
                    <Avatar sx={{ width: 50, height: 50 }}>
                      {admin.name?.[0] || admin.username[0]}
                    </Avatar>
                    
                    {/* Middle: Username and Send Message button */}
                    <Box sx={{ ml: 2, flexGrow: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="subtitle1" component="span">
                          {admin.name || admin.username}
                        </Typography>
                        <Chip 
                          label="ADMIN" 
                          color="error" 
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, fontWeight: 700, border: 2 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        @{admin.username}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 1 }}
                        onClick={() => router.push(`/messages?recipient=${admin.username}`)}
                      >
                        Send Message
                      </Button>
                    </Box>
                    
                    {/* Right side: Social Media Icons */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Tooltip title={admin.email}>
                        <IconButton size="small" color="primary">
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {admin.discord && (
                        <Tooltip title={`Discord: ${admin.discord}`}>
                          <IconButton size="small" color="primary">
                            <TagIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {admin.whatsapp && (
                        <Tooltip title={`WhatsApp: ${admin.whatsapp}`}>
                          <IconButton size="small" color="primary">
                            <WhatsAppIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {admin.telegram && (
                        <Tooltip title={`Telegram: ${admin.telegram}`}>
                          <IconButton size="small" color="primary">
                            <TelegramIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </ListItem>
                {index < admins.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
