import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";

const SocialMedia = () => {
  // State to store social media links
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });

  // Fetch existing links from backend (Mocked for now)
  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("socialLinks"));
    if (savedLinks) setSocialLinks(savedLinks);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  // Handle save/update button
  const handleSave = () => {
    localStorage.setItem("socialLinks", JSON.stringify(socialLinks)); // Mock backend
    alert("Social media links updated!");
  };

  return (
    <Container maxWidth="xlg">
      <Box
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          mt: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Update Social Media Links
        </Typography>

        {/* Facebook */}
        <TextField
          fullWidth
          label="Facebook URL"
          name="facebook"
          value={socialLinks.facebook}
          onChange={handleChange}
          margin="normal"
        />

        {/* Twitter */}
        <TextField
          fullWidth
          label="Twitter URL"
          name="twitter"
          value={socialLinks.twitter}
          onChange={handleChange}
          margin="normal"
        />

        {/* Instagram */}
        <TextField
          fullWidth
          label="Instagram URL"
          name="instagram"
          value={socialLinks.instagram}
          onChange={handleChange}
          margin="normal"
        />

        {/* LinkedIn */}
        <TextField
          fullWidth
          label="LinkedIn URL"
          name="linkedin"
          value={socialLinks.linkedin}
          onChange={handleChange}
          margin="normal"
        />

        {/* YouTube */}
        <TextField
          fullWidth
          label="YouTube URL"
          name="youtube"
          value={socialLinks.youtube}
          onChange={handleChange}
          margin="normal"
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSave}
        >
          Save Links
        </Button>
      </Box>
    </Container>
  );
};

export default SocialMedia;
