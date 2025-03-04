import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventsData,
  createEvent,
  updateEvent,
} from "../../redux/slice/eventSlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function Events() {
  const dispatch = useDispatch();
  const { events, status, error } = useSelector((state) => state.events);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openBannerDialog, setOpenBannerDialog] = useState(false);
  const [openAddEventDialog, setOpenAddEventDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
  });
  const [bannerFile, setBannerFile] = useState(null);
  // console.log("events:", events);

  useEffect(() => {
    dispatch(fetchEventsData());
  }, [dispatch]);

  // Handle creating a new event
  const handleOpenAddEventDialog = () => {
    setEventData({ title: "", description: "" });
    setOpenAddEventDialog(true);
  };

  // Open dialog for updating title and description
  const handleOpenEditDialog = (event) => {
    setCurrentEvent(event);
    setEventData({
      title: event.title,
      description: event.description,
    });
    setOpenEditDialog(true);
  };

  // Open dialog for uploading banner
  const handleOpenBannerDialog = (event) => {
    setCurrentEvent(event);
    setOpenBannerDialog(true);
  };

  // Handle updating the title and description
  const handleUpdateEvent = () => {
    if (currentEvent) {
      const updatedData = {
        ...eventData,
      };
      dispatch(
        updateEvent({ eventId: currentEvent._id, eventData: updatedData })
      );
      setOpenEditDialog(false);
    }
  };

  // Handle file change for banner
  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  // Handle saving the banner
  const handleSaveBanner = async () => {
    if (!bannerFile) return alert("Please select a banner image to upload");

    const formData = new FormData();
    formData.append("banner", bannerFile); // Ensure "banner" matches your backend field

    try {
      const response = await dispatch(
        updateEvent({
          eventId: currentEvent._id,
          eventData: formData, // Send FormData directly
          isFormData: true, // Custom flag to handle multipart data in the slice
        })
      );

      if (response.error) {
        throw new Error("Failed to upload banner");
      }

      setOpenBannerDialog(false);
      setBannerFile(null); // Reset banner file after upload
    } catch (error) {
      console.error("Error uploading banner:", error);
    }
  };

  // Handle input changes for title and description
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle adding a new event
  const handleAddEvent = async () => {
    try {
      await dispatch(updateEvent(eventData));
      setOpenAddEventDialog(false); // Close dialog after adding
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>

      {events.length === 0 ? (
        <Typography variant="body1">No events available.</Typography>
      ) : (
        events.map((event) => (
          <div key={event._id} style={{ marginBottom: "20px" }}>
            <Box
              display="flex"
              alignItems="center"
              sx={{ mb: 2 }} // Adds some spacing below
            >
              {/* Left Side: Title & Description */}
              <Box>
                <Typography variant="h5" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {event.description}
                </Typography>
              </Box>

              {/* Right Side: Edit and Upload Banner Buttons */}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenEditDialog(event)}
                sx={{ mx: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleOpenBannerDialog(event)}
              >
                Upload Banner
              </Button>
            </Box>
            {/* Event Banner */}
            {event.banner && (
              <img
                src={event.banner}
                alt="Event Banner"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenAddEventDialog}
            >
              Add Event
            </Button>
            {/* Image Groups Table */}
            {Array.isArray(event.imageGroups) &&
              event.imageGroups.length > 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image Title</TableCell>
                        <TableCell>Image Description</TableCell>
                        <TableCell>Images</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {event.imageGroups.map((group) => (
                        <TableRow key={group._id}>
                          <TableCell>{group.image_title}</TableCell>
                          <TableCell>{group.image_description}</TableCell>
                          <TableCell>
                            {Array.isArray(group.images) &&
                              group.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={group.image_title}
                                  style={{ width: "100px", margin: "5px" }}
                                />
                              ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
          </div>
        ))
      )}
      {/* Dialog for Adding New Event */}
      <Dialog
        open={openAddEventDialog}
        onClose={() => setOpenAddEventDialog(false)}
      >
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={eventData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={eventData.description}
            onChange={handleInputChange}
          />
          <input
            accept="image/*"
            style={{ display: "block", marginTop: "10px" }}
            type="file"
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddEventDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="primary">
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for Updating Title and Description */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Update Title and Description</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={eventData.title}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={eventData.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEvent} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for Uploading Banner */}
      <Dialog
        open={openBannerDialog}
        onClose={() => setOpenBannerDialog(false)}
      >
        <DialogTitle>Upload Banner</DialogTitle>
        <DialogContent>
          <input
            accept="image/*"
            style={{ display: "block", marginBottom: "10px" }}
            type="file"
            onChange={handleFileChange}
          />
          {bannerFile && (
            <Typography variant="body2">
              Selected File: {bannerFile.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBannerDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveBanner} color="primary">
            Save Banner
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Events;
