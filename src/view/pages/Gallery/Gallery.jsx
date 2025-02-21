import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { Edit, Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { saveGalleryToBackend } from "../../redux/slice/galleryslice";
import debounce from "lodash.debounce";

const Gallery = () => {
  const dispatch = useDispatch();
  const galleryData = useSelector((state) => state.gallery) || {};

  const [title, setTitle] = useState(
    localStorage.getItem("galleryTitle") || galleryData.title || "Gallery"
  );
  const [description, setDescription] = useState(
    localStorage.getItem("galleryDescription") || galleryData.description || ""
  );
  const [selectedImages, setSelectedImages] = useState(
    JSON.parse(localStorage.getItem("selectedGalleryImages")) || []
  );
  const [isEditable, setIsEditable] = useState(false);

  const editor = useRef(null);

  const handleChange = (event, setter, storageKey) => {
    setter(event.target.value);
    localStorage.setItem(storageKey, event.target.value);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const updatedImages = [...selectedImages, ...files];
    setSelectedImages(updatedImages);
    localStorage.setItem(
      "selectedGalleryImages",
      JSON.stringify(updatedImages)
    );
  };

  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    localStorage.setItem(
      "selectedGalleryImages",
      JSON.stringify(updatedImages)
    );
  };

  const handleEditorChange = debounce((newContent) => {
    setDescription(newContent);
    localStorage.setItem("galleryDescription", newContent);
  }, 5000);

  const handleSave = async (e) => {
    e.preventDefault();
    const galleryDataToSend = new FormData();
    galleryDataToSend.append("title", title);
    galleryDataToSend.append("description", description);
    selectedImages.forEach((image) => {
      galleryDataToSend.append("images", image);
    });

    try {
      await dispatch(saveGalleryToBackend(galleryDataToSend));
      setIsEditable(false);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleUpdate = () => {
    setIsEditable(true);
  };

  return (
    <Box >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>

      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <form onSubmit={handleSave}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => handleChange(e, setTitle, "galleryTitle")}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Description
            </Typography>

            <JoditEditor
              ref={editor}
              value={description}
              config={{
                readonly: !isEditable,
                placeholder: "Write about the gallery...",
                height: 400,
                cleanOnPaste: false, // Retain styles when pasting
                cleanOnChange: false, // Retain the HTML structure while editing
                toolbar: {
                  items: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "eraser",
                    "|",
                    "font",
                    "fontsize",
                    "paragraph",
                    "|",
                    "align",
                    "outdent",
                    "indent",
                    "|",
                    "link",
                    "image",
                    "video",
                    "table",
                    "line",
                    "code",
                    "fullsize",
                    "undo",
                    "redo",
                  ],
                },
                uploader: {
                  insertImageAsBase64URI: true,
                  url: "/upload", // Define your upload endpoint
                  format: "json",
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={handleEditorChange} // Update state on content change
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
                onClick={handleUpdate}
                sx={{ width: "48%" }}
              >
                Update Gallery Text
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>

      <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Upload Gallery Images
        </Typography>
        <IconButton color="primary" component="label">
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={handleImageUpload}
          />
          <Edit />
        </IconButton>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 2,
            mt: 2,
          }}
        >
          {selectedImages.map((image, index) => (
            <Box key={index} sx={{ textAlign: "center", position: "relative" }}>
              {image instanceof File && (
                <Avatar
                  src={URL.createObjectURL(image)}
                  alt={`Gallery ${index + 1}`}
                  sx={{ width: 100, height: 100, borderRadius: 2 }}
                />
              )}
              <IconButton
                onClick={() => handleImageRemove(index)}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Gallery;
