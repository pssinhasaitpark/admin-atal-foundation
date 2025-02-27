import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGallery,
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../../redux/slice/galleryslice";
import {
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
} from "@mui/material";

function Gallery() {
  const dispatch = useDispatch();
  const { gallery_image, gallery_video, loading, error } = useSelector(
    (state) => state.gallery
  );

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

  if (loading) return <Typography variant="h6">Loading...</Typography>;
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
            title:
              type === "image"
                ? data.gallery_image_title
                : data.gallery_video_title,
            description:
              type === "image"
                ? data.gallery_image_description
                : data.gallery_video_description,
            file: null,
            id: data.id, // Ensure ID is passed for editing
          }
        : { type, file: null } // Only file for adding
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

    // If it's a video, only send the video file without title/description
    if (formData.type === "video") {
      if (formData.file) {
        formDataToSend.append("videos", formData.file); // Only append video file
      }
    }

    // If it's an image, only send the image file without title/description
    if (formData.type === "image") {
      if (formData.file) {
        formDataToSend.append("images", formData.file); // Only append image file
      }
    }

    // For updating the gallery item (when an item is being edited)
    if (editData) {
      dispatch(
        updateGalleryItem({
          id: editData.id,
          updatedItem: formData,
          type: formData.type,
        })
      ).then(() => {
        dispatch(fetchGallery()); // Re-fetch gallery data after update
      });
    } else {
      // For adding new image or video
      dispatch(addGalleryItem(formDataToSend)).then(() => {
        dispatch(fetchGallery()); // Re-fetch gallery data after adding new item
      });
    }

    handleClose();
  };

  const handleDelete = (id, type) => {
    dispatch(deleteGalleryItem({ id, type })).then(() => {
      dispatch(fetchGallery()); // Re-fetch gallery data after deleting item
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="left" gutterBottom>
        Gallery
      </Typography>

      <Button onClick={() => handleOpen("image")}>Add Image</Button>
      <Button onClick={() => handleOpen("video")} style={{ marginLeft: 10 }}>
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
        >
          Edit
        </Button>
      </Typography>
      <Typography variant="body1" gutterBottom>
        {gallery_image.description}
      </Typography>
      {gallery_image?.images?.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ mb: 3 }}>
          <Table>
            <TableBody>
              {gallery_image.images.map((img, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={img}
                      alt="gallery"
                      width="120px"
                      style={{ borderRadius: "5px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index, "image")}>
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
      <Typography variant="h5" gutterBottom>
        {gallery_video.title}
        <Button
          onClick={() =>
            handleOpen("video", {
              title: gallery_video.title,
              description: gallery_video.description,
            })
          }
        >
          Edit
        </Button>
      </Typography>
      <Typography variant="body1" gutterBottom>
        {gallery_video.description}
      </Typography>
      {gallery_video?.videos?.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableBody>
              {gallery_video.videos.map((vid, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <video
                      controls
                      width="200px"
                      style={{ borderRadius: "5px" }}
                    >
                      <source src={vid} type="video/mp4" />
                    </video>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index, "video")}>
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
