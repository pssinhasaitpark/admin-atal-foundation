import React, { useState, useRef, useEffect, useCallback } from "react";
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
import {
  fetchEventsData,
  saveEventsToBackend,
} from "../../redux/slice/eventSlice";
import debounce from "lodash.debounce";

const Events = () => {
  const dispatch = useDispatch();
  const eventsData = useSelector((state) => state.events) || {};

  const editor = useRef(null);

  const [title, setTitle] = useState("Events");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  // Update state when data is fetched
  useEffect(() => {
    if (eventsData) {
      setTitle(eventsData.title || "Events");
      setLocation(eventsData.location || "");
      setDescription(eventsData.description || "");
      setSelectedImages(eventsData.images || []);
    }
  }, [eventsData]);

  // Debounced description update
  const debouncedEditorChange = useCallback(
    debounce((newContent) => {
      setDescription(newContent);
    }, 3000),
    []
  );

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  // Remove Image
  const handleImageRemove = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  // Handle Save/Edit
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (isEditable) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);

      selectedImages.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      try {
        await dispatch(saveEventsToBackend(formData)).unwrap(); // Ensure data is saved
        await dispatch(fetchEventsData()); // Fetch latest data after saving
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }
    setIsEditable(!isEditable);
  };

  return (
    <Box sx={{ p: 5 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, border: "1px solid #ddd" }}>
        <Stack spacing={2}>
          <form onSubmit={handleEditSave}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!isEditable}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
                placeholder: "Write about the event...",
                height: 400,
                cleanOnPaste: false,
                cleanOnChange: false,
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
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={debouncedEditorChange} // Update immediately
              onBlur={(newContent) => setDescription(newContent)} // Ensure update on blur
            />

            {/* Image Upload Section */}
            <Box
              sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Event Images
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {selectedImages.map((image, index) => (
                  <Box key={index} sx={{ position: "relative" }}>
                    <Avatar
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt={`Event ${index + 1}`}
                      sx={{ width: 100, height: 100, borderRadius: 2 }}
                    />
                    <IconButton
                      onClick={() => handleImageRemove(index)}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Edit/Save Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Events;
