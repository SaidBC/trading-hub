"use client";

import { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Session } from "next-auth";
import TelegramIcon from "@mui/icons-material/Telegram";
import TagIcon from "@mui/icons-material/Tag";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useRouter } from "next/navigation";

interface SocialMediaProps {
  user: Session["user"] & {
    discord?: string | null;
    whatsapp?: string | null;
    telegram?: string | null;
  };
}

export default function SocialMedia({ user }: SocialMediaProps) {
  const [formData, setFormData] = useState({
    discord: user.discord || "",
    whatsapp: user.whatsapp || "",
    telegram: user.telegram || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/profile/update-social", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update social media");
      }

      setSuccess("Social media profiles updated successfully");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Social Media Profiles
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Add your social media handles to make it easier for others to
            connect with you
          </Typography>
        </Box>

        {success && <Alert severity="success">{success}</Alert>}

        {error && <Alert severity="error">{error}</Alert>}

        {/* First row: Discord and WhatsApp */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="Discord"
            name="discord"
            value={formData.discord}
            onChange={handleChange}
            placeholder="username#0000"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TagIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="WhatsApp"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            placeholder="+1234567890"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Second row: Telegram and Submit button */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            label="Telegram"
            name="telegram"
            value={formData.telegram}
            onChange={handleChange}
            placeholder="username (without @)"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TelegramIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 1, px: 3, py: 1.5, height: 56, flexGrow: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
