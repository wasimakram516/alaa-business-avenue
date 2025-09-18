"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";

export default function CmsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [location, setLocation] = useState("");
  const [signupLink, setSignupLink] = useState("");
  const [config, setConfig] = useState(null);

  // For delete confirmation
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  // Check auth on load
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // Load config
  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data.config);
        if (data.config) {
          setLocation(data.config.location || "");
          setSignupLink(data.config.signupLink || "");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file first");

    setUploading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`✅ Uploaded successfully: ${data.fileUrl}`);
        setConfig(data.config);
        setFile(null);
      } else {
        setMessage("❌ Upload failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error while uploading");
    } finally {
      setUploading(false);
    }
  };

  // Open confirmation before deletion
  const confirmDeleteMedia = (media) => {
    setSelectedMedia(media);
    setOpenConfirm(true);
  };

  const handleDeleteMedia = async () => {
    if (!selectedMedia) return;
    try {
      const res = await fetch(`/api/media/${selectedMedia._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setMessage("🗑️ File removed");
      } else {
        setMessage("❌ Failed to remove file");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error removing file");
    } finally {
      setOpenConfirm(false);
      setSelectedMedia(null);
    }
  };

  const saveLocation = async () => {
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });
      const data = await res.json();
      setConfig(data.config);
      setMessage("✅ Location saved");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving location");
    }
  };

  const saveSignup = async () => {
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupLink }),
      });
      const data = await res.json();
      setConfig(data.config);
      setMessage("✅ Signup link saved");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving signup link");
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    router.replace("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        color: "white",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 8,
        px: 3,
      }}
    >
      <IconButton
        onClick={() => setOpenLogoutConfirm(true)}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <LogoutIcon
          sx={{
            fontSize: "4rem",
            color: "#000",
            backgroundColor: "rgba(255,255,255,0.8)",
            borderRadius: "50%",
            padding: "0.5rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.8)",
              color: "#fff",
            },
          }}
        />
      </IconButton>

      <Typography variant="h3" gutterBottom>
        CMS Dashboard
      </Typography>

      {/* Media Upload */}
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "700px",
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Media Upload
        </Typography>
        <input
          type="file"
          accept="image/*,video/*,application/pdf"
          onChange={handleFileChange}
          style={{ display: "block", marginBottom: "20px" }}
        />
        {file && (
          <Typography sx={{ mb: 2 }}>
            Selected: <b>{file.name}</b>
          </Typography>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleUpload}
          disabled={uploading}
          sx={{
            background: "linear-gradient(135deg, #ff512f, #dd2476)",
            "&:hover": {
              background: "linear-gradient(135deg, #dd2476, #ff512f)",
            },
            py: 1.5,
            fontSize: "1.2rem",
            mb: 3,
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        {/* Media Preview */}
        {config?.media?.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Uploaded Files
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 2,
              }}
            >
              {config.media.map((m, i) => (
                <Box
                  key={i}
                  sx={{
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 2,
                    p: 1,
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {m.type === "image" ? (
                    <img
                      src={m.fileUrl}
                      alt={m.fileName}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  ) : m.type === "video" ? (
                    <video
                      src={m.fileUrl}
                      controls
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  ) : (
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#fff" }}
                    >
                      📄 {m.fileName}
                    </a>
                  )}

                  <IconButton
                    size="small"
                    onClick={() => confirmDeleteMedia(m)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(255,0,0,0.7)",
                      "&:hover": { backgroundColor: "rgba(255,0,0,1)" },
                    }}
                  >
                    <DeleteIcon sx={{ color: "white" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <b>{selectedMedia?.fileName || "this file"}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteMedia}>
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Logout Dialog */}
      <Dialog
        open={openLogoutConfirm}
        onClose={() => setOpenLogoutConfirm(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to Logout?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutConfirm(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Divider */}
      <Divider
        sx={{
          width: "100%",
          maxWidth: "600px",
          mb: 4,
          borderColor: "rgba(255,255,255,0.3)",
        }}
      />

      {/* Location */}
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "600px",
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Google Maps Location
        </Typography>
        <TextField
          label="Google Maps URL"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={saveLocation}
          sx={{
            background: "linear-gradient(135deg, #36d1dc, #5b86e5)",
            "&:hover": {
              background: "linear-gradient(135deg, #5b86e5, #36d1dc)",
            },
            py: 1.5,
            fontSize: "1.2rem",
          }}
        >
          Save Location
        </Button>
      </Box>

      {/* Signup */}
      <Box
        sx={{
          backgroundColor: "rgba(255,255,255,0.1)",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Signup Link
        </Typography>
        <TextField
          label="Signup URL"
          fullWidth
          value={signupLink}
          onChange={(e) => setSignupLink(e.target.value)}
          sx={{ backgroundColor: "white", borderRadius: 1, mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={saveSignup}
          sx={{
            background: "linear-gradient(135deg, #11998e, #38ef7d)",
            "&:hover": {
              background: "linear-gradient(135deg, #38ef7d, #11998e)",
            },
            py: 1.5,
            fontSize: "1.2rem",
          }}
        >
          Save Signup Link
        </Button>
      </Box>

      {message && (
        <Typography sx={{ mt: 4, textAlign: "center" }}>{message}</Typography>
      )}
    </Box>
  );
}
