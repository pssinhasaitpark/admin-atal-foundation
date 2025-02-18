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
import {
  saveVisionToBackend,
  fetchVisionData,
} from "../../redux/slice/visionSlice";
import debounce from "lodash.debounce";

const Vision = () => {
  const dispatch = useDispatch();
  const visionData = useSelector((state) => state.vision);

  const [title, setTitle] = useState(visionData.title);
  const [visionText, setVisionText] = useState(visionData.visionContent);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [isEditable, setIsEditable] = useState(true);

  const editor = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    dispatch(fetchVisionData());
  }, [dispatch]);

  useEffect(() => {
    if (visionData.title) setTitle(visionData.title);
    if (visionData.visionContent) setVisionText(visionData.visionContent);
    if (visionData.image && visionData.image.length > 0) {
      setImageUrl(visionData.image[0]);
    }
  }, [visionData]);

  const handleEditorReady = (editor) => {
    setEditorInstance(editor);

    if (visionData.image && visionData.image.length > 0) {
      const imageTag = `<img src="${visionData.image[0]}" alt="Vision Image" style="max-width: 100%; border-radius: 8px;" />`;
      editor.insertHTML(imageTag);
    }
  };

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

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    const visionDataToSend = new FormData();
    visionDataToSend.append("heading", title);
    visionDataToSend.append("text", visionText);

    if (selectedImages.length > 0) {
      visionDataToSend.append("images", selectedImages[0]);
    }

    try {
      const response = await dispatch(saveVisionToBackend(visionDataToSend));

      if (response.payload.image) {
        setImageUrl(response.payload.image);
      }

      setIsEditable(false); // Disable editing after save
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  return (
    <Box sx={{ p: 5, pt: "50px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
      >
        {title}
      </Typography>

      <Paper sx={{ p: 4, border: "1px solid #ddd", borderRadius: "8px" }}>
        <Stack spacing={4}>
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
                  url: "/upload",
                  format: "json",
                },
              }}
              style={{ width: "100%", minHeight: "200px" }}
              onChange={handleEditorChange}
              onReady={handleEditorReady}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isEditable}
                sx={{ width: "30%" }}
              >
                Save
              </Button>
            </Box>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Vision;
