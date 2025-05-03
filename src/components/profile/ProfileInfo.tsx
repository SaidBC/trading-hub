"use client";

import { useState } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

interface ProfileInfoProps {
  user: Session["user"];
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
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
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully");
      router.refresh();
    } catch (err: Error | unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{ width: 100, height: 100, fontSize: 40, bgcolor: "primary.main" }}
        >
          {user.name?.[0] || user.username?.[0] || "U"}
        </Avatar>

        <Chip 
          label={`Role: ${user.role}`} 
          color={user.role === "ADMIN" ? "error" : "primary"} 
          variant="outlined"
          sx={{
            fontWeight: 700,
            border: 2,
            fontSize: "0.9rem",
            '&:hover': {
              borderWidth: 3,
              boxShadow: 1
            }
          }}
        />

      </Box>

      {success && (
        <Alert severity="success">{success}</Alert>
      )}

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          disabled
          helperText="Username cannot be changed"
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          disabled
          helperText="Email cannot be changed"
        />

        <TextField
          fullWidth
          label="Display Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="Tell others about yourself..."
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2, alignSelf: 'flex-start' }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
