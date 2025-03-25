import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAudio,
  updateAudioData,
  updateAudioSection,
  deleteAudio,
} from "../../redux/slice/audiofileSlice"; // Adjust the import path as necessary
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";

function AudioFiles() {
  const dispatch = useDispatch();
  const { audio, loading, error } = useSelector((state) => state.audiolist);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [newSection, setNewSection] = useState({
    title: "",
    image: null,
    audio: null,
  });
  const [currentSection, setCurrentSection] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchAudio());
  }, [dispatch]);

  useEffect(() => {
    if (audio) {
      setHeading(audio.heading);
      setDescription(audio.description);
    }
  }, [audio]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const id = audio._id; // Assuming audio has an _id field
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("description", description);
    dispatch(updateAudioData({ id, updatedData: formData }));
    setEditDialogOpen(false);
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    const id = audio._id; // Assuming audio has an _id field
    const formData = new FormData();
    formData.append("title", newSection.title);
    if (newSection.image) {
      formData.append("audio_section_images", newSection.image);
    }
    if (newSection.audio) {
      formData.append("audio_section_audio", newSection.audio);
    }

    dispatch(updateAudioData({ id, updatedData: formData }));
    setAddDialogOpen(false);
  };

  const handleEditSection = (section) => {
    setCurrentSection(section);
    setNewSection({
      title: section.title,
      image: null,
      audio: null,
    });
    setEditSectionDialogOpen(true);
  };

  const handleUpdateSection = (e) => {
    e.preventDefault();
    const id = audio._id; // Assuming audio has an _id field
    const section_id = currentSection._id; // Get the section ID
    const formData = new FormData();
    formData.append("title", newSection.title);
    if (newSection.image) {
      formData.append("audio_section_images", newSection.image);
    }
    if (newSection.audio) {
      formData.append("audio_section_audio", newSection.audio);
    }

    dispatch(updateAudioSection({ id, section_id, updatedData: formData }));
    setEditSectionDialogOpen(false);
  };

  const handleDeleteSection = (section) => {
    setCurrentSection(section);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const id = audio._id; // Assuming audio has an _id field
    const section_id = currentSection._id; // Get the section ID
    dispatch(deleteAudio({ id, section_id }));
    setDeleteDialogOpen(false);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setNewSection((prev) => ({ ...prev, [name]: file }));

      // Create a preview URL for the image or audio
      if (name === "image") {
        setImagePreview(URL.createObjectURL(file));
      } else if (name === "audio") {
        setAudioPreview(URL.createObjectURL(file));
      }
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress sx={{ color: "#F68633" }} />
      </Box>
    );

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error.message || "An unknown error occurred."}
      </Typography>
    );
  }
  return (
    <Box>
      {audio && (
        <>
          <Box display="flex" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {audio.heading}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {audio.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
                ml: 5,
              }}
              onClick={() => setEditDialogOpen(true)}
            >
              <EditIcon />
            </Button>
          </Box>
          <Box display="flex" justifyContent="flex-end" mb={1}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: "#e0752d",
                "&:hover": { backgroundColor: "#F68633" },
                textTransform: "none",
              }}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Audio
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Audio</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audio?.audio_section?.map((section) => (
                  <TableRow key={section._id}>
                    <TableCell>{section.title}</TableCell>
                    <TableCell>
                      {section.images ? (
                        <img
                          src={section.images}
                          alt={section.title}
                          style={{ width: "100px", height: "auto" }}
                        />
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Image
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {section.audio ? (
                        <audio controls>
                          <source src={section.audio} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No Audio
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditSection(section)}>
                        <EditIcon />
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDeleteSection(section)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Title & Description Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          >
            <DialogTitle>Edit Title & Description</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Heading"
                type="text"
                fullWidth
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#e0752d",
                  "&:hover": { backgroundColor: "#F68633" },
                  textTransform: "none",
                }}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add New Audio Section Dialog */}
          <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
            <DialogTitle>Add New Audio Section</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="New Section Title"
                type="text"
                fullWidth
                value={newSection.title}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
              />

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#e0752d",
                    "&:hover": { backgroundColor: "#F68633" },
                  }}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#e0752d",
                    "&:hover": { backgroundColor: "#F68633" },
                  }}
                >
                  Upload Audio
                  <input
                    type="file"
                    accept="audio/*"
                    name="audio"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>

              {/* Preview Section */}
              {imagePreview && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Image Preview:</Typography>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                </Box>
              )}
              {audioPreview && (
                <Box mt={2}>
                  <Typography variant="subtitle1">Audio Preview:</Typography>
                  <audio controls style={{ marginTop: "10px" }}>
                    <source src={audioPreview} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleAddSection} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Audio Section Dialog */}
          <Dialog
            open={editSectionDialogOpen}
            onClose={() => setEditSectionDialogOpen(false)}
          >
            <DialogTitle>Edit Audio Section</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Section Title"
                type="text"
                fullWidth
                value={newSection.title}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
              />
              <Box display="flex" flexDirection="column" gap={2} mt={2}>
                {/* Image Upload */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: "#e0752d",
                      "&:hover": { backgroundColor: "#F68633" },
                    }}
                  >
                    Choose Image File
                    <input
                      type="file"
                      accept="image/*"
                      name="image"
                      hidden
                      onChange={(e) => {
                        handleFileChange(e);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      width="50"
                      height="50"
                      style={{ borderRadius: "5px" }}
                    />
                  )}
                </Box>

                {/* Audio Upload */}
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      backgroundColor: "#e0752d",
                      "&:hover": { backgroundColor: "#F68633" },
                    }}
                  >
                    Choose Audio File
                    <input
                      type="file"
                      accept="audio/*"
                      name="audio"
                      hidden
                      onChange={(e) => {
                        handleFileChange(e);
                        setAudioPreview(URL.createObjectURL(e.target.files[0]));
                      }}
                    />
                  </Button>

                  {audioPreview && (
                    <audio controls>
                      <source src={audioPreview} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setEditSectionDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateSection}
                sx={{
                  backgroundColor: "#e0752d",
                  "&:hover": { backgroundColor: "#F68633" },
                  textTransform: "none",
                }}
              >
                Update
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this audio section?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default AudioFiles;
