import React, { useState, useRef, useEffect } from "react";
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
import {  Delete as DeleteIcon } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGallery, saveGalleryToBackend, deleteGalleryItem } from "../../redux/slice/galleryslice";
import { toast } from "react-toastify";

const Gallery = () => {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);

  const [galleryImageTitle, setGalleryImageTitle] = useState("");
  const [galleryImageDescription, setGalleryImageDescription] = useState("");
  const [galleryVideoTitle, setGalleryVideoTitle] = useState("");
  const [galleryVideoDescription, setGalleryVideoDescription] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const imageEditor = useRef(null);
  const videoEditor = useRef(null);

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  // When gallery data is fetched, update the state
  useEffect(() => {
    if (galleries?.length > 0) {
      const gallery = galleries[0]; // Assuming only one gallery exists
      setGalleryImageTitle(gallery.gallery_image.title || "");
      setGalleryImageDescription(gallery.gallery_image.description || "");
      setGalleryImages(gallery.gallery_image.images || []);

      setGalleryVideoTitle(gallery.gallery_video.title || "");
      setGalleryVideoDescription(gallery.gallery_video.description || "");
      setGalleryVideos(gallery.gallery_video.videos || []);
    }
  }, [galleries]);

  const handleFileUpload = (event, setter) => {
    const files = Array.from(event.target.files);
    setter((prev) => [...prev, ...files]);
  };

  const handleDelete = async (id, type) => {
    await dispatch(deleteGalleryItem({ id, type }));
    toast.success(`${type} deleted successfully!`);
  };

  const handleSave = async () => {
    const imageFormData = new FormData();
    imageFormData.append("title", galleryImageTitle);
    imageFormData.append("description", galleryImageDescription);
    selectedImages.forEach((image) => imageFormData.append("images", image));

    const videoFormData = new FormData();
    videoFormData.append("title", galleryVideoTitle);
    videoFormData.append("description", galleryVideoDescription);
    selectedVideos.forEach((video) => videoFormData.append("videos", video));

    await dispatch(saveGalleryToBackend({ imageFormData, videoFormData }));
    setIsEditable(false);
    toast.success("Gallery updated successfully!");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gallery Management</Typography>

      {/* Image Section */}
      <Paper sx={{ p: 3, border: "1px solid #ddd", mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Gallery Images</Typography>

        <TextField
          fullWidth
          label="Image Title"
          variant="outlined"
          value={galleryImageTitle}
          onChange={(e) => setGalleryImageTitle(e.target.value)}
          disabled={!isEditable}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>Image Description</Typography>
        <JoditEditor ref={imageEditor} value={galleryImageDescription} onChange={setGalleryImageDescription} />

        <Typography variant="h6" sx={{ mt: 3 }}>Upload Images</Typography>
        <input type="file" multiple accept="image/*" onChange={(e) => handleFileUpload(e, setSelectedImages)} />
        <Stack direction="row" spacing={2} mt={2}>
          {galleryImages.map((img, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <Avatar src={img} sx={{ width: 100, height: 100 }} />
              <IconButton onClick={() => handleDelete(img, "image")} sx={{ position: "absolute", top: 0, right: 0 }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Video Section */}
      <Paper sx={{ p: 3, border: "1px solid #ddd", mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Gallery Videos</Typography>

        <TextField
          fullWidth
          label="Video Title"
          variant="outlined"
          value={galleryVideoTitle}
          onChange={(e) => setGalleryVideoTitle(e.target.value)}
          disabled={!isEditable}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" sx={{ mb: 1 }}>Video Description</Typography>
        <JoditEditor ref={videoEditor} value={galleryVideoDescription} onChange={setGalleryVideoDescription} />

        <Typography variant="h6" sx={{ mt: 3 }}>Upload Videos</Typography>
        <input type="file" multiple accept="video/*" onChange={(e) => handleFileUpload(e, setSelectedVideos)} />
        <Stack direction="row" spacing={2} mt={2}>
          {galleryVideos.map((vid, index) => (
            <Box key={index} sx={{ position: "relative" }}>
              <video src={vid} width={150} height={100} controls />
              <IconButton onClick={() => handleDelete(vid, "video")} sx={{ position: "absolute", top: 0, right: 0 }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* Save and Edit Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        {!isEditable ? (
          <Button variant="outlined" onClick={() => setIsEditable(true)}>Edit</Button>
        ) : (
          <Button variant="contained" onClick={handleSave}>Save</Button>
        )}
      </Stack>
    </Box>
  );
};

export default Gallery;
