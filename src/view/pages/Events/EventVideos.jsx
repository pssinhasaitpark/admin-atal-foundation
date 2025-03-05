import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEventVideoData,
  updateEventVideo,
} from "../../redux/slice/eventVideoSlice";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
function EventVideos() {
  const dispatch = useDispatch();

  const { eventVideos, status, error } = useSelector(
    (state) => state.eventVideos
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [eventData, setEventData] = useState({
    video_title: "",
    video_description: "",
  });

  const [newVideoFile, setNewVideoFile] = useState(null);

  useEffect(() => {
    dispatch(fetchEventVideoData());
  }, [dispatch]);

  const handleEditClick = () => {
    if (eventVideos.length > 0) {
      setEventData({
        video_title: eventVideos[0].video_title,
        video_description: eventVideos[0].video_description,
      });
      setEditDialogOpen(true);
    }
  };

  const handleUpdateEventVideo = () => {
    if (eventVideos.length > 0) {
      const eventId = eventVideos[0]._id;
      dispatch(updateEventVideo({ eventId, eventData }));
      setEditDialogOpen(false);
    }
  };

  const handleAddVideo = () => {
    if (newVideoFile) {
      const formData = new FormData();
      formData.append("videos", newVideoFile);

      const eventId = eventVideos[0]._id;
      dispatch(updateEventVideo({ eventId, eventData: formData }));

      setAddDialogOpen(false);
      setNewVideoFile(null);
    } else {
      console.error("No video file selected");
    }
  };

  const handleDeleteEventVideo = (videoUrl) => {
    if (eventVideos.length > 0) {
      const eventId = eventVideos[0]._id;
      const payload = {
        remove_videos: [videoUrl],
      };
      dispatch(updateEventVideo({ eventId, eventData: payload }));
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Event Videos
      </Typography>

      {status === "loading" && <CircularProgress />}
      {error && (
        <Typography color="error">
          {error.message || "An error occurred while fetching videos."}
        </Typography>
      )}

      {/* Display video title and description outside the table */}
      {eventVideos.length > 0 && (
        <Box marginBottom="20px">
          <Typography variant="h6" gutterBottom>
            {eventVideos[0].video_title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {eventVideos[0].video_description}
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleEditClick}>
            Edit
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddDialogOpen(true)}
            sx={{ marginLeft: "10px" }}
          >
            Add Video
          </Button>
        </Box>
      )}

      {/* Video List in Table Format */}
      <Typography variant="h6" gutterBottom>
        Video List:
      </Typography>

      {eventVideos && eventVideos.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Videos</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "300px" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventVideos[0].videos.map((url, index) => (
                <TableRow key={index}>
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
                      <source src={url} type="video/mp4" />
                    </video>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDeleteEventVideo(url)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No event videos available</Typography>
      )}

      {/* Edit Video Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Video Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Video Title"
            variant="outlined"
            value={eventData.video_title}
            onChange={(e) =>
              setEventData({ ...eventData, video_title: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Video Description"
            variant="outlined"
            value={eventData.video_description}
            onChange={(e) =>
              setEventData({ ...eventData, video_description: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateEventVideo} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Video</DialogTitle>
        <DialogContent>
          <TextField
            type="file"
            accept="video/*"
            onChange={(e) => setNewVideoFile(e.target.files[0])}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddVideo} color="primary">
            Add Video
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EventVideos;
