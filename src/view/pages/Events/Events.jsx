import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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

  const [title, setTitle] = useState(eventsData.title || "Events");
  const [location, setLocation] = useState(eventsData.location || "");
  const [description, setDescription] = useState(eventsData.description || "");
  const [selectedImages, setSelectedImages] = useState(eventsData.images || []);
  const [isEditable, setIsEditable] = useState(false);

  const memoizedImages = useMemo(() => selectedImages, [selectedImages]);

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  useEffect(() => {
    if (eventsData) {
      setTitle(eventsData.title || "Events");
      setLocation(eventsData.location || "");
      setDescription(eventsData.description || "");
      setSelectedImages(eventsData.images || []);
    }
  }, [eventsData]);

  const debouncedEditorChange = useCallback(
    debounce((newContent) => {
      setDescription(newContent);
    }, 1000),
    []
  );

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleImageRemove = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("location", location);
      formData.append("description", description);

      memoizedImages.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });

      try {
        await dispatch(saveEventsToBackend(formData)).unwrap();
        await dispatch(fetchEventsData());
      } catch (error) {
        console.error("Error saving data: ", error);
      }
    }

    setIsEditable(!isEditable);
  };

  return (
    <Box sx={{ mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Stack spacing={2}>
          <form onSubmit={handleEditSave}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditable}
              />

              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!isEditable}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Description
              </Typography>
              <JoditEditor
                ref={editor}
                value={description}
                config={{
                  readonly: !isEditable,
                  placeholder: "Write about the event...",
                  height: 300,
                  cleanOnPaste: false,
                  cleanOnChange: false,
                }}
                onChange={debouncedEditorChange}
                onBlur={(newContent) => setDescription(newContent)}
              />
            </Box>

            <Box
              sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Upload Event Images
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
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
                <Typography variant="body2">Click to upload images</Typography>
              </Stack>

              {/* Display uploaded images */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mt: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                {memoizedImages.map((image, index) => (
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
                        top: 5,
                        right: 5,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, width: "10%" }}
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
