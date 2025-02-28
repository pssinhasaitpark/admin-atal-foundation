import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../../redux/slice/galleryslice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  TableHead,
  CircularProgress,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { Image, VideoLibrary } from "@mui/icons-material";
function Gallery() {
  const dispatch = useDispatch();
  const { gallery_image, gallery_video, loading, error } = useSelector(
    (state) => state.gallery
  );
  const [showLoader, setShowLoader] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    type: "image",
    title: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // Ensure loader runs for at least one full round

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );

  const handleOpen = (type, data = null) => {
    setOpen(true);
    setFormData(
      data
        ? {
            type,
            title: data.title,
            description: data.description,
            file: null,
            id: data.id,
          }
        : { type, file: null }
    );
    setEditData(data);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = () => {
    const formDataToSend = new FormData();

    if (formData.type === "image") {
      if (formData.title) {
        formDataToSend.append("gallery_image_title", formData.title);
      }
      if (formData.description) {
        formDataToSend.append(
          "gallery_image_description",
          formData.description
        );
      }
    } else if (formData.type === "video") {
      if (formData.title) {
        formDataToSend.append("gallery_video_title", formData.title);
      }
      if (formData.description) {
        formDataToSend.append(
          "gallery_video_description",
          formData.description
        );
      }
    }

    if (formData.file) {
      formDataToSend.append(
        formData.type === "image" ? "images" : "videos",
        formData.file
      );
    }

    if (editData && formData.id) {
      dispatch(
        updateGalleryItem({
          id: formData.id,
          updatedItem: formDataToSend,
          type: formData.type,
        })
      ).then(() => dispatch(fetchGallery()));
    } else {
      const galleryId =
        formData.type === "image" ? gallery_image?._id : gallery_video?._id;
      dispatch(
        addGalleryItem({
          galleryId,
          formData: formDataToSend,
          type: formData.type,
        })
      ).then(() => dispatch(fetchGallery()));
    }

    handleClose();
  };

  const handleDelete = (fileUrl, type) => {
    let galleryId = type === "image" ? gallery_image?._id : gallery_video?._id;

    if (!galleryId) return;

    dispatch(deleteGalleryItem({ galleryId, fileUrl, type })).then(() => {
      dispatch(fetchGallery());
    });
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        Gallery
      </Typography>

      <Button onClick={() => handleOpen("image")} startIcon={<Image />}>
        Add Image
      </Button>

      <Button
        onClick={() => handleOpen("video")}
        startIcon={<VideoLibrary />}
        sx={{ ml: 1 }}
      >
        Add Video
      </Button>

      {/* Image Gallery Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
        {gallery_image.title}{" "}
        <Button
          onClick={() =>
            handleOpen("image", {
              title: gallery_image.title,
              description: gallery_image.description,
            })
          }
          startIcon={<Edit />}
        >
          Edit
        </Button>
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "gray", mb: 2 }}>
        {gallery_image.description || "No description available."}
      </Typography>
      {gallery_image?.images?.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", width: "120px" }}>
                  Image
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    width: "100px",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gallery_image.images.map((img, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <img
                      src={img}
                      alt="gallery"
                      width="80px"
                      height="60px"
                      style={{
                        objectFit: "cover",
                        borderRadius: "5px",
                        display: "block",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleDelete(img, "image")}
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: "50px", padding: "4px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No images available.</Typography>
      )}
      {/* Video Gallery Section */}
      <Typography variant="h5" gutterBottom style={{ marginTop: 20 }}>
        {gallery_video.title}{" "}
        <Button
          onClick={() =>
            handleOpen("video", {
              title: gallery_video.title,
              description: gallery_video.description,
            })
          }
          startIcon={<Edit />}
        >
          Edit
        </Button>
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: "gray", mb: 2 }}>
        {gallery_video.description || "No description available."}
      </Typography>
      {gallery_video?.videos?.length > 0 ? (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold", width: "120px" }}>
                  Video
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    width: "100px",
                    textAlign: "center",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gallery_video.videos.map((vid, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <video
                      controls
                      width="100px"
                      height="100px"
                      style={{
                        borderRadius: "5px",
                        display: "block",
                      }}
                    >
                      <source src={vid} type="video/mp4" />
                    </video>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => handleDelete(vid, "video")}
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ minWidth: "50px", padding: "4px" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No videos available.</Typography>
      )}
      {/* Dialog for Add/Edit Image or Video */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editData ? "Edit" : "Add"} {formData.type}
        </DialogTitle>
        <DialogContent>
          {/* Conditionally render title and description inputs for editing */}
          {editData ? (
            <>
              <TextField
                fullWidth
                margin="dense"
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="dense"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </>
          ) : (
            // Only show file input when adding a new item
            <input
              type="file"
              name="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Gallery;
