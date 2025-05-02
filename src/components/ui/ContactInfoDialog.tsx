"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  Stack,
  IconButton,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DiscordIcon from "./DiscordIcon";

// Define a contact object type
interface ContactInfo {
  type: string;
  value: string;
}

interface ContactInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedContact: string | null;
  contactValue: string;
  onContactSelect: (contact: string) => void;
  onContactValueChange: (value: string) => void;
}

const ContactInfoDialog: React.FC<ContactInfoDialogProps> = ({
  open,
  onClose,
  onSubmit,
  selectedContact,
  contactValue,
  onContactSelect,
  onContactValueChange,
}) => {
  // State to track multiple contacts
  const [contacts, setContacts] = React.useState<ContactInfo[]>([]);
  const [currentContact, setCurrentContact] = React.useState<string | null>(null);
  const [currentValue, setCurrentValue] = React.useState<string>("");

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setContacts([]);
      setCurrentContact(null);
      setCurrentValue("");
    }
  }, [open]);

  // Add current contact to the list
  const addContact = () => {
    if (currentContact && currentValue.trim()) {
      setContacts([...contacts, { type: currentContact, value: currentValue.trim() }]);
      setCurrentContact(null);
      setCurrentValue("");
    }
  };

  // Remove a contact from the list
  const removeContact = (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts);
  };

  // Get icon for contact type
  const getContactIcon = (type: string) => {
    switch (type) {
      case "discord":
        return <DiscordIcon style={{ fontSize: 16, color: "#5865F2" }} />;
      case "whatsapp":
        return <WhatsAppIcon style={{ fontSize: 16, color: "#25D366" }} />;
      case "telegram":
        return <TelegramIcon style={{ fontSize: 16, color: "#0088cc" }} />;
      default:
        return null;
    }
  };

  // Get color for contact type
  const getContactColor = (type: string) => {
    switch (type) {
      case "discord":
        return "#5865F2";
      case "whatsapp":
        return "#25D366";
      case "telegram":
        return "#0088cc";
      default:
        return "#666";
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
            width: "100%",
            maxWidth: 500,
          },
        },
      }}
    >
      <DialogTitle>Add Your Contact Information</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2" mb={2}>
          Provide ways for others to reach you about this piece:
        </Typography>

        {/* Added contacts list */}
        {contacts.length > 0 && (
          <Box mb={3}>
            <Typography variant="body2" mb={1} fontWeight="bold">
              Your Contact Methods:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {contacts.map((contact, index) => (
                <Chip
                  key={index}
                  icon={getContactIcon(contact.type)}
                  label={`${contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}: ${contact.value}`}
                  sx={{ 
                    bgcolor: "#23272F", 
                    color: "#fff",
                    borderLeft: `3px solid ${getContactColor(contact.type)}`,
                    mb: 1
                  }}
                  deleteIcon={<DeleteIcon style={{ color: "#fff" }} />}
                  onDelete={() => removeContact(index)}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ bgcolor: "#333", my: 2 }} />

        {/* Contact type selection */}
        <Typography variant="body2" mb={1}>
          Add a new contact method:
        </Typography>
        <Stack direction="row" spacing={2} mb={2}>
          <IconButton
            sx={{
              color: "#5865F2",
              border: currentContact === "discord" ? "2px solid #5865F2" : "2px solid transparent",
              bgcolor: "#23272F",
            }}
            onClick={() => setCurrentContact("discord")}
          >
            <DiscordIcon style={{ fontSize: 32 }} />
          </IconButton>
          <IconButton
            sx={{
              color: "#25D366",
              border: currentContact === "whatsapp" ? "2px solid #25D366" : "2px solid transparent",
              bgcolor: "#23272F",
            }}
            onClick={() => setCurrentContact("whatsapp")}
          >
            <WhatsAppIcon fontSize="large" />
          </IconButton>
          <IconButton
            sx={{
              color: "#0088cc",
              border: currentContact === "telegram" ? "2px solid #0088cc" : "2px solid transparent",
              bgcolor: "#23272F",
            }}
            onClick={() => setCurrentContact("telegram")}
          >
            <TelegramIcon fontSize="large" />
          </IconButton>
        </Stack>

        {/* Contact value input */}
        {currentContact && (
          <Box mb={2}>
            <Typography variant="body2" mb={1}>
              Enter your {currentContact.charAt(0).toUpperCase() + currentContact.slice(1)} handle:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <input
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #333",
                  background: "#23272F",
                  color: "#fff",
                  flexGrow: 1,
                }}
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={
                  currentContact === "discord"
                    ? "e.g. username#1234"
                    : currentContact === "whatsapp"
                    ? "e.g. +1234567890"
                    : "e.g. @username"
                }
              />
              <Button 
                variant="contained" 
                color="primary" 
                disabled={!currentValue.trim()}
                onClick={addContact}
                sx={{ minWidth: 'auto' }}
              >
                <AddIcon />
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Box textAlign="right" p={2}>
        <Button
          variant="contained"
          color="secondary"
          disabled={contacts.length === 0}
          onClick={() => {
            // Here you would handle the multiple contacts
            onSubmit();
          }}
        >
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};

export default ContactInfoDialog;
