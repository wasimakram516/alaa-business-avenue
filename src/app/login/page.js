"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (email === validEmail && password === validPass) {
      sessionStorage.setItem(
        "authToken",
        JSON.stringify({
          email,
          timestamp: Date.now(),
        })
      );
      router.push("/cms");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #2c3e50, #000)",
        color: "white",
        textAlign: "center",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => router.replace("/")}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
        }}
      >
        <BackIcon
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
        Admin Login
      </Typography>

      <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "400px" }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            sx: { backgroundColor: "white", borderRadius: 1 },
          }}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            sx: { backgroundColor: "white", borderRadius: 1 },
          }}
        />
        {error && <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            py: 1.5,
            fontSize: "1.2rem",
            background: "linear-gradient(135deg, #ff512f, #dd2476)",
            "&:hover": {
              background: "linear-gradient(135deg, #dd2476, #ff512f)",
            },
          }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
}
