import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { saveVisionToBackend } from "../../redux/slice/visionSlice";
import debounce from "lodash.debounce";

const Vision = () => {
  const dispatch = useDispatch();
  const visionData = useSelector((state) => state.vision);

  const [title, setTitle] = useState(
    localStorage.getItem("title") || visionData.title
  );
  const [name, setName] = useState(
    localStorage.getItem("name") || visionData.name
  );
  const [visionText, setVisionText] = useState(
    localStorage.getItem("visionText") || visionData.visionContent
  );
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrl, setImageUrl] = useState(""); // State for the image URL
  const [isEditable, setIsEditable] = useState(true);

  const editor = useRef(null);

  useEffect(() => {
    if (title) localStorage.setItem("title", title);
    if (name) localStorage.setItem("name", name);
    if (visionText) localStorage.setItem("visionText", visionText);
  }, [title, name, visionText]);

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleEditorChange = debounce((newContent) => {
    setVisionText(newContent);
  }, 1000);

  const handleSave = async (e) => {
    e.preventDefault();

    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    const visionDataToSend = new FormData();
    visionDataToSend.append("heading", title);
    visionDataToSend.append("text", visionText);

    if (selectedImages.length > 0) {
      visionDataToSend.append("image", selectedImages[0]); // Append the first image
    }

    try {
      // Make the API call to save the data
      const response = await dispatch(saveVisionToBackend(visionDataToSend));

      // Set the image URL from the response if available
      if (response.payload.image) {
        setImageUrl(response.payload.image); // Set the image URL here
      }

      setIsEditable(false);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleUpdateVisionText = () => {
    setIsEditable(true); // Allow text editing
  };

  return (
    <Box sx={{ p: 5, pt: "50px", maxWidth: "1200px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        {title}
      </Typography>

      <Paper sx={{ p: 4, border: "1px solid #ddd", borderRadius: "8px" }}>
        <Stack spacing={4}>
          {/* Image Upload */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Image (Single file allowed)
            </Typography>

            <IconButton
              color="primary"
              component="label"
              sx={{
                fontSize: 40,
                border: "2px dashed",
                borderColor: "#1976d2",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageUpload}
              />
              <Edit />
            </IconButton>

            {/* Image Preview */}
            {selectedImages.length > 0 && (
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(selectedImages[0])}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}

            {/* Displaying image from response */}
            {imageUrl && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="h6">Uploaded Image:</Typography>
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    borderRadius: "8px",
                    marginTop: "10px",
                  }}
                />
              </Box>
            )}
          </Box>

          <Divider />

          {/* Form Fields */}
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => handleChange(e, setTitle)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Vision Statement
            </Typography>
            <JoditEditor
              ref={editor}
              value={visionText}
              config={{
                readonly: !isEditable,
                placeholder: "Write about the vision...",
                height: 400,
                cleanOnPaste: false,
                cleanOnChange: false,
              }}
              style={{
                width: "100%",
                minHeight: "200px",
                marginBottom: "20px",
              }}
              onChange={handleEditorChange}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isEditable}
                sx={{ width: "48%" }}
              >
                Save
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleUpdateVisionText}
                sx={{ width: "48%" }}
              >
                Update Vision Text
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Vision;
