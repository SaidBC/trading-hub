"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Box,
  useTheme,
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

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  username,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#121212",
            color: "#fff",
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
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ py: 2 }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "50%",
              bgcolor: "#23272F",
            }}
          >
            <IconButton
              sx={{
                color: "#25D366",
                "&:hover": { bgcolor: "rgba(37,211,102,0.1)" },
              }}
              href="https://wa.me/"
              target="_blank"
            >
              <WhatsAppIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: "50%",
              bgcolor: "#23272F",
            }}
          >
            <IconButton
              sx={{
                color: "#0088cc",
                "&:hover": { bgcolor: "rgba(0,136,204,0.1)" },
              }}
              href="https://t.me/"
              target="_blank"
            >
              <TelegramIcon fontSize="large" />
            </IconButton>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: "50%",
              bgcolor: "#23272F",
            }}
          >
            <IconButton
              sx={{
                color: "#5865F2",
                "&:hover": { bgcolor: "rgba(88,101,242,0.1)" },
              }}
              href="https://discord.com/"
              target="_blank"
            >
              <DiscordIcon style={{ fontSize: 32 }} />
            </IconButton>
          </Box>
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
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
