"use client";

import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import useInactivityRedirect from "@/utils/useInactivityRedirect";

import PhotosModal from "@/components/modals/PhotosModal";
import BrochureModal from "@/components/modals/BrochureModal";
import VideoModal from "@/components/modals/VideoModal";
import LocationModal from "@/components/modals/LocationModal";
import SignupModal from "@/components/modals/SignupModal";
import { useRouter } from "next/navigation";

const buttonsConfig = [
  {
    text: "Photos",
    modalKey: "photos",
    size: "clamp(8rem, 28vw, 28rem)",
    x: "15%",
    y: "33%",
    icon: <CameraAltIcon sx={{ fontSize: "clamp(3rem, 10vw, 12rem)" }} />,
    delay: "0s",
  },
  {
    text: "Brochure",
    modalKey: "brochure",
    size: "clamp(10rem, 33vw, 32rem)",
    x: "52%",
    y: "40%",
    icon: <MenuBookIcon sx={{ fontSize: "clamp(4rem, 12vw, 14rem)" }} />,
    delay: "1s",
  },
  {
    text: "Video",
    modalKey: "video",
    size: "clamp(8rem, 28vw, 28rem)",
    x: "10%",
    y: "56%",
    icon: (
      <PlayCircleFilledIcon sx={{ fontSize: "clamp(3rem, 10vw, 12rem)" }} />
    ),
    delay: "2s",
  },
  {
    text: "Location",
    modalKey: "location",
    size: "clamp(8rem, 28vw, 28rem)",
    x: "55%",
    y: "68%",
    icon: <LocationOnIcon sx={{ fontSize: "clamp(3rem, 10vw, 12rem)" }} />,
    delay: "1.5s",
  },
  {
    text: "Register Your Interest",
    modalKey: "sign-up",
    size: "clamp(10rem, 33vw, 32rem)",
    x: "15%",
    y: "80%",
    icon: <HowToRegIcon sx={{ fontSize: "clamp(3rem, 10vw, 12rem)" }} />,
    delay: "2.5s",
  },
];

export default function MenuPage() {
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [openModal, setOpenModal] = useState(null);

  // preload sound
  const [buttonSound, setButtonSound] = useState(null);

  useInactivityRedirect(3 * 60 * 1000, "/"); // 3 minutes inactivity redirect to home

  useEffect(() => {
    if (typeof window !== "undefined") {
      setButtonSound(new Audio("/buttonSound.wav"));
    }
  }, []);

  useEffect(() => {
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setConfig(data.config))
      .catch((err) => console.error("Config fetch error:", err));
  }, []);

  const handleClick = (e, modal) => {
    if (buttonSound) {
      buttonSound.currentTime = 0;
      buttonSound
        .play()
        .catch((err) => console.warn("Audio play failed:", err));
    }

    const btn = e.currentTarget;
    btn.classList.remove("clicked");
    void btn.offsetWidth;
    btn.classList.add("clicked");
    setOpenModal(modal);
  };

  const handleClose = () => {
    document.querySelectorAll(".clicked").forEach((btn) => {
      btn.classList.remove("clicked");
    });
    setOpenModal(null);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <source src="/menuBG2.mp4" type="video/mp4" />
      </video>

      {/* Header Video Logo */}
      <Box
        sx={{
          position: "absolute",
          top: "2%",
          left: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "35vw",
            borderRadius: "50px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <video
            src="/menuLogo2.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      {/* Floating Bubbles */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 160px)",
        }}
      >
        {buttonsConfig.map((btn, index) => (
          <Button
            key={index}
            variant="contained"
            onClick={(e) => handleClick(e, btn.modalKey)}
            sx={{
              position: "absolute",
              top: btn.y,
              left: btn.x,
              width: btn.size,
              height: btn.size,
              borderRadius: "50%",
              flexDirection: "column",
              background: "radial-gradient(circle at 30% 30%, #800000, #4b0000)",
              color: "#fff",
              fontSize: "clamp(1rem, 4vw, 3rem)",
              textTransform: "capitalize",
              border: "3px solid white",
              boxShadow:
                "0 15px 30px rgba(0,0,0,0.8), 0 4px 10px rgba(255,255,255,0.1) inset",
              animation: `floatY 6s ease-in-out infinite`,
              animationDelay: btn.delay,
              transition: "all 0.4s ease",
              "&:hover": {
                background: "radial-gradient(circle at 30% 30%, #a00000, #600000)",
                transform: "scale(1.05)",
              },
              "&.clicked": {
                animation: "clickPulse 0.3s ease",
                background: "radial-gradient(circle at 30% 30%, #b00000, #700000)",
              },
              "@keyframes floatY": {
                "0%, 100%": { transform: "translateY(0)" },
                "50%": { transform: "translateY(-22px)" },
              },
              "@keyframes clickPulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(0.9)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            {btn.icon}
            {btn.text}
          </Button>
        ))}
      </Box>

      {/* Footer Logo */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 1,
          cursor: "pointer",
        }}
      >
        <img
          src="/WWDSLogo.png"
          alt="WhiteWall Logo"
          style={{ width: "50vw", objectFit: "contain" }}
        />
      </Box>

      {/* Modals */}
      <PhotosModal
        open={openModal === "photos"}
        onClose={handleClose}
        media={config?.media}
      />
      <BrochureModal
        open={openModal === "brochure"}
        onClose={handleClose}
        fileUrl={config?.media.find((m) => m.type === "pdf")?.fileUrl}
      />
      <VideoModal
        open={openModal === "video"}
        onClose={handleClose}
        media={config?.media}
      />
      <LocationModal
        open={openModal === "location"}
        onClose={handleClose}
        location={config?.location}
      />
      <SignupModal
        open={openModal === "sign-up"}
        onClose={handleClose}
        signupLink={config?.signupLink}
      />
    </Box>
  );
}
