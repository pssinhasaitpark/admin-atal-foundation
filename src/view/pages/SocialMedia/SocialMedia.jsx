import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSocialMedia,
  updateSocialMedia,
} from "../../redux/slice/socialMediaSlice";

const SocialMedia = () => {
  const dispatch = useDispatch();
  const { links, id, loading } = useSelector((state) => state.socialMedia);
  console.log("Links:", links);

  const [socialLinks, setSocialLinks] = useState({
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  // Update state when links are fetched
  useEffect(() => {
    if (links) {
      setSocialLinks({
        whatsapp: links.whatsapp?.link || "", // Extracting `link` field
        facebook: links.facebook?.link || "",
        instagram: links.instagram?.link || "",
        youtube: links.youtube?.link || "",
      });
    }
  }, [links]);

  // Handle input change
  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  // Handle saving all fields at once
  const handleSaveAll = async () => {
    if (!id) {
      setSnackbar({
        open: true,
        message: "Error: Data not loaded. Please refresh.",
        severity: "error",
      });
      return;
    }

    setSaving(true);

    try {
      await dispatch(updateSocialMedia({ id, updatedLinks: socialLinks }));
      setSnackbar({
        open: true,
        message: "Social media links updated successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Update failed. Try again.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "white",
          mt: 4,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Update Social Media Links
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}

        {/* Input Fields */}
        {Object.keys(socialLinks).map((key) => (
          <TextField
            key={key}
            fullWidth
            label={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
            name={key}
            value={socialLinks[key]}
            onChange={handleChange}
            margin="normal"
          />
        ))}

        {/* Save All Button */}
        <Box sx={{ textAlign: "right", mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveAll}
            disabled={saving || loading}
          >
            {saving ? <CircularProgress size={24} /> : "Update All"}
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SocialMedia;
