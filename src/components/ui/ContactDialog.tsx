"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Box,
  useTheme,
  Typography,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";
import DiscordIcon from "./DiscordIcon";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  username: string | null;
}

interface UserContact {
  id: string;
  username: string;
  discord: string | null;
  whatsapp: string | null;
  telegram: string | null;
}

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  username,
}) => {
  const theme = useTheme();
  const [userContact, setUserContact] = useState<UserContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && username) {
      fetchUserContact(username);
    } else {
      // Reset state when dialog closes
      setUserContact(null);
      setError(null);
    }
  }, [open, username]);

  const fetchUserContact = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/contact?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user contact information');
      }
      const data = await response.json();
      setUserContact(data.user);
    } catch (err) {
      console.error('Error fetching user contact:', err);
      setError('Could not load contact information');
    } finally {
      setLoading(false);
    }
  };

  // Create actual links based on user's contact information
  const getContactLink = (platform: string) => {
    switch (platform) {
      case 'whatsapp':
        return userContact?.whatsapp ? `https://wa.me/${userContact.whatsapp}` : '#';
      case 'telegram':
        return userContact?.telegram ? `https://t.me/${userContact.telegram}` : '#';
      case 'discord':
        return userContact?.discord ? `https://discord.com/users/${userContact.discord}` : '#';
      default:
        return '#';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#121212",
            color: "#fff",
            maxWidth: 400,
            width: '100%',
          },
        },
      }}
    >
      <DialogTitle>
        Contact {username}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        ) : (
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            alignItems="center"
            sx={{ py: 2 }}
          >
            {/* WhatsApp */}
            <Tooltip title={userContact?.whatsapp ? "Contact via WhatsApp" : "WhatsApp not available"}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "#23272F",
                  opacity: userContact?.whatsapp ? 1 : 0.5,
                }}
              >
                <IconButton
                  sx={{
                    color: "#25D366",
                    "&:hover": { bgcolor: userContact?.whatsapp ? "rgba(37,211,102,0.1)" : "transparent" },
                    pointerEvents: userContact?.whatsapp ? "auto" : "none",
                  }}
                  href={getContactLink('whatsapp')}
                  target="_blank"
                  disabled={!userContact?.whatsapp}
                >
                  <WhatsAppIcon fontSize="large" />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Telegram */}
            <Tooltip title={userContact?.telegram ? "Contact via Telegram" : "Telegram not available"}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "#23272F",
                  opacity: userContact?.telegram ? 1 : 0.5,
                }}
              >
                <IconButton
                  sx={{
                    color: "#0088cc",
                    "&:hover": { bgcolor: userContact?.telegram ? "rgba(0,136,204,0.1)" : "transparent" },
                    pointerEvents: userContact?.telegram ? "auto" : "none",
                  }}
                  href={getContactLink('telegram')}
                  target="_blank"
                  disabled={!userContact?.telegram}
                >
                  <TelegramIcon fontSize="large" />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Discord */}
            <Tooltip title={userContact?.discord ? "Contact via Discord" : "Discord not available"}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "#23272F",
                  opacity: userContact?.discord ? 1 : 0.5,
                }}
              >
                <IconButton
                  sx={{
                    color: "#5865F2",
                    "&:hover": { bgcolor: userContact?.discord ? "rgba(88,101,242,0.1)" : "transparent" },
                    pointerEvents: userContact?.discord ? "auto" : "none",
                  }}
                  href={getContactLink('discord')}
                  target="_blank"
                  disabled={!userContact?.discord}
                >
                  <DiscordIcon style={{ fontSize: 32 }} />
                </IconButton>
              </Box>
            </Tooltip>

            {/* Internal Messages */}
            <Tooltip title="Send internal message">
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "#23272F",
                }}
              >
                <IconButton
                  sx={{
                    color: theme.palette.secondary.main,
                    "&:hover": { bgcolor: "rgba(156,39,176,0.1)" },
                  }}
                  href="/messages"
                >
                  <MessageIcon fontSize="large" />
                </IconButton>
              </Box>
            </Tooltip>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
