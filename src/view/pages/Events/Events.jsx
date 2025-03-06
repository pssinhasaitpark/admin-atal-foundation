import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsData,
  createEvent,
  updateEvent,
  updateEventSection,
  deleteEventSection,
} from "../../redux/slice/eventSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Divider,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import EventVideos from "./EventVideos.jsx";
function Events() {
  const dispatch = useDispatch();
  const { events = [], loading, error } = useSelector((state) => state.events);

  const [newBanner, setNewBanner] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    banner: "",
    imageGroups: [],
  });

  const [newSection, setNewSection] = useState({
    image_title: "",
    image_description: "",
    images: [],
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
  const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false); // New state for editing section
  const [newSectionImages, setNewSectionImages] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState(null); // Track which section is being edited

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  const handleCreateEvent = () => {
    dispatch(createEvent(newEvent)).then(() => {
      setNewEvent({ title: "", description: "", banner: "", imageGroups: [] });
      dispatch(fetchEventsData());
    });
  };

  const handleUpdateEvent = () => {
    if (!events[0]) return;
    dispatch(updateEvent({ eventId: events[0]._id, eventData: newEvent })).then(
      () => {
        setEditDialogOpen(false);
        dispatch(fetchEventsData());
      }
    );
  };

  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    setNewBanner(file);
  };

  const handleSubmitBanner = () => {
    if (!events[0] || !newBanner) return;

    const formData = new FormData();
    formData.append("banner", newBanner);

    dispatch(
      updateEvent({
        eventId: events[0]._id,
        eventData: formData,
        isFormData: true,
      })
    ).then(() => {
      setNewBanner(null);
      dispatch(fetchEventsData());
    });
  };

  const handleAddSection = () => {
    if (!events[0]) return;

    const formData = new FormData();
    formData.append("image_title_1", newSection.image_title);
    formData.append("image_description_1", newSection.image_description);

    // Append each image file in binary format to FormData
    newSection.images.forEach((file) => {
      formData.append("images", file); // Each image is appended as binary data
    });

    dispatch(
      updateEvent({
        eventId: events[0]._id,
        eventData: formData,
        isFormData: true, // Indicating it's FormData
      })
    ).then(() => {
      // Reset form fields after submission
      setNewSection({ image_title: "", image_description: "", images: [] });
      setNewSectionImages([]);
      setAddSectionDialogOpen(false);
      dispatch(fetchEventsData()); // Fetch updated events data
    });
  };

  const handleNewSectionImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setNewSectionImages(imageUrls);
    setNewSection({ ...newSection, images: files });
  };

  const handleEditSection = (section) => {
    setNewSection({
      image_title: section.image_title,
      image_description: section.image_description,
      images: section.images,
    });
    setSelectedSectionId(section._id); // Set the ID of the section being edited
    setEditSectionDialogOpen(true); // Open the edit section dialog
  };

  const handleUpdateSection = () => {
    if (!events[0] || !selectedSectionId) return;

    const formData = new FormData();
    formData.append("image_title", newSection.image_title);
    formData.append("image_description", newSection.image_description);

    newSection.images.forEach((file) => {
      formData.append("images", file); // Each image is appended as binary data
    });

    dispatch(
      updateEventSection({
        eventId: events[0]._id,
        sectionId: selectedSectionId,
        sectionData: formData,
      })
    ).then(() => {
      setEditSectionDialogOpen(false);
      setNewSection({ image_title: "", image_description: "", images: [] });
      setNewSectionImages([]);
      dispatch(fetchEventsData()); // Fetch updated events data
    });
  };

  const handleDeleteSection = (sectionId) => {
    dispatch(deleteEventSection(sectionId)).then(() => {
      dispatch(fetchEventsData()); // Fetch updated events data after deletion
    });
  };

  if (loading) return <Typography variant="h6">Loading events...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );

  return (
    <div className="p-4">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Events
      </Typography>

      {events.length === 0 ? (
        <>
          <Typography variant="body1">
            No events available. Create one:
          </Typography>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateEvent}
            sx={{
              backgroundColor: "#F68633",
              "&:hover": {
                backgroundColor: "#e0752d",
              },
            }}
          >
            Create Event
          </Button>
        </>
      ) : (
        <>
          {/* Event Title, Description & Banner */}
          <Box display="flex" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {events[0]?.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {events[0]?.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setEditDialogOpen(true)}
              sx={{
                backgroundColor: "#F68633",
                "&:hover": {
                  backgroundColor: "#e0752d",
                },
              }}
            >
              <EditIcon />
            </Button>
          </Box>

          {/* Edit Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
          >
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleUpdateEvent}
                sx={{
                  backgroundColor: "#F68633",
                  "&:hover": {
                    backgroundColor: "#e0752d",
                  },
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Banner Upload */}

          {events[0]?.banner && (
            <img
              src={events[0].banner}
              alt="Event Banner"
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          )}
          <input type="file" onChange={handleBannerUpload} />
          <Button
            variant="contained"
            onClick={handleSubmitBanner}
            sx={{
              backgroundColor: "#F68633",
              "&:hover": {
                backgroundColor: "#e0752d",
              },
            }}
          >
            Upload Banner
          </Button>

          {/* Image Groups Table */}
          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Image Sections
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={() => setAddSectionDialogOpen(true)}
              sx={{
                backgroundColor: "#F68633",
                "&:hover": {
                  backgroundColor: "#e0752d",
                },
              }}
            >
              Add Section
            </Button>
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f1f1f1" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Image Title</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    Image Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Images</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events[0]?.imageGroups?.map((group) => (
                  <TableRow key={group._id}>
                    <TableCell>{group.image_title}</TableCell>
                    <TableCell>{group.image_description}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {group.images?.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={group.image_title}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "5px",
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleEditSection(group)}>
                        <EditIcon />
                      </Button>
                      <Button
                        onClick={() => handleDeleteSection(group._id)} // Delete button
                      >
                        <DeleteIcon color="error" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Section Dialog */}
          <Dialog
            open={addSectionDialogOpen}
            onClose={() => setAddSectionDialogOpen(false)}
          >
            <DialogTitle>Add New Section</DialogTitle>
            <DialogContent>
              <TextField
                label="Image Title"
                fullWidth
                margin="normal"
                onChange={(e) =>
                  setNewSection({ ...newSection, image_title: e.target.value })
                }
              />
              <TextField
                label="Image Description"
                fullWidth
                margin="normal"
                onChange={(e) =>
                  setNewSection({
                    ...newSection,
                    image_description: e.target.value,
                  })
                }
              />
              <input
                type="file"
                multiple
                onChange={handleNewSectionImageUpload}
              />
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                {newSectionImages?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`New Section Image ${index}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSection} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Section Dialog */}
          <Dialog
            open={editSectionDialogOpen}
            onClose={() => setEditSectionDialogOpen(false)}
          >
            <DialogTitle>Edit Section</DialogTitle>
            <DialogContent>
              <TextField
                label="Image Title"
                fullWidth
                margin="normal"
                value={newSection.image_title}
                onChange={(e) =>
                  setNewSection({ ...newSection, image_title: e.target.value })
                }
              />
              <TextField
                label="Image Description"
                fullWidth
                margin="normal"
                value={newSection.image_description}
                onChange={(e) =>
                  setNewSection({
                    ...newSection,
                    image_description: e.target.value,
                  })
                }
              />
              <input
                type="file"
                multiple
                onChange={handleNewSectionImageUpload}
              />
              <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                {newSectionImages?.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Edit Section Image ${index}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditSectionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSection} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <EventVideos />
    </div>
  );
}

export default Events;
