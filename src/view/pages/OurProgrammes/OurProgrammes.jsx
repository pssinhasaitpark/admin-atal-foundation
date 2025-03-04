import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgrammesByCategory,
  updateProgramme,
  updateSection,
  deleteProgrammeDetail,
} from "../../redux/slice/ourProgrammesSlice";
import {
  MenuItem,
  Select,
  FormControl,
  // InputLabel,
  Typography,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CardMedia,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";

const categories = [
  "Education",
  "Healthcare",
  "Livelihood",
  "Girl Child & Women Empowerment",
  "Privileged Children",
  "Civic Driven Change",
  "Social Entrepreneurship",
  "Special Support ourProgramme",
  "Special Interventions",
];

function OurProgrammes() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [openModal, setOpenModal] = useState(false);
  const [newProgramme, setNewProgramme] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [banner, setBanner] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedDetailId, setSelectedDetailId] = useState(null);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // State for existing images
  const [showLoader, setShowLoader] = useState(true);
  const dispatch = useDispatch();
  const {
    items: programmes,
    loading,
    error,
  } = useSelector((state) => state.programmes);

  useEffect(() => {
    dispatch(fetchProgrammesByCategory(selectedCategory));
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

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

  const handleAddProgramme = async () => {
    if (!newProgramme.title || !newProgramme.description) {
      return alert("Please fill all fields!");
    }

    const formData = new FormData();
    formData.append("details[0][title]", newProgramme.title);
    formData.append("details[0][description]", newProgramme.description);
    if (newProgramme.image) formData.append("detailImages", newProgramme.image);

    await dispatch(updateProgramme({ category: selectedCategory, formData }));
    resetForm();
  };

  const handleEditProgramme = async () => {
    if (!newProgramme.title || !newProgramme.description) {
      return alert("Please fill all fields!");
    }

    const formData = new FormData();
    formData.append("title", newProgramme.title);
    formData.append("description", newProgramme.description);

    if (newProgramme.image) {
      formData.append("detailImages", newProgramme.image);
    }

    // Include images to remove in the payload
    if (imagesToRemove.length > 0) {
      formData.append("removeImages", JSON.stringify(imagesToRemove));
    }

    await dispatch(
      updateSection({
        category: selectedCategory,
        id: selectedDetailId,
        formData,
      })
    );
    resetForm();
  };

  const resetForm = () => {
    setNewProgramme({ title: "", description: "", image: null });
    setOpenModal(false);
    setEditMode(false);
    setSelectedDetailId(null);
    setImagesToRemove([]);
    setExistingImages([]); // Reset existing images
  };

  const handleBannerUpload = async () => {
    if (!banner) return alert("Please select a banner image to upload");
    const formData = new FormData();
    formData.append("banner", banner);

    await dispatch(updateProgramme({ category: selectedCategory, formData }));
    setBanner(null);
  };

  const handleEditClick = (detail) => {
    setNewProgramme({
      title: detail.title,
      description: detail.description,
      image: null,
    });
    setSelectedDetailId(detail._id);
    setEditMode(true);
    setOpenModal(true);
    setImagesToRemove([]);
    setExistingImages(detail.images.map((img) => img.url)); // Set existing images for editing
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveImage = (imageUrl) => {
    // Update existing images state
    setExistingImages((prev) => prev.filter((url) => url !== imageUrl));

    // Update images to remove state
    setImagesToRemove((prev) => {
      if (prev.includes(imageUrl)) {
        return prev.filter((url) => url !== imageUrl);
      }
      return [...prev, imageUrl];
    });
  };

  const handleDeleteDetail = async (detailId) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await dispatch(
        deleteProgrammeDetail({ category: selectedCategory, detailId })
      );
    }
  };

  return (
    <Container maxWidth="xlg" sx={{ p: 0 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Our Programmes
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Typography variant="p" sx={{ mb: 2 }}>
          Select Category:
        </Typography>
        {/* <InputLabel>Select Category</InputLabel> */}
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <CircularProgress />}
      {error && <Typography color="error">Error: {error}</Typography>}

      {!loading &&
        !error &&
        Array.isArray(programmes) &&
        programmes.length === 0 && (
          <Typography variant="h6" color="textSecondary">
            No data available for this category.
          </Typography>
        )}

      {Array.isArray(programmes) &&
        programmes.length > 0 &&
        programmes[0]?.banner && (
          <CardMedia
            component="img"
            height="300"
            image={programmes[0].banner}
            alt="Banner"
            sx={{ mb: 2, borderRadius: 2 }}
          />
        )}

      <Box display="flex" alignItems="center" gap={2}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setBanner(e.target.files[0])}
        />
        <Button
          variant="contained"
          onClick={handleBannerUpload}
          sx={{
            backgroundColor: "#faa36c",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Upload Banner
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
          }}
          sx={{
            backgroundColor: "#F68633",
            "&:hover": { backgroundColor: "#faa36c" },
            textTransform: "none",
          }}
        >
          Add Section
        </Button>
      </Box>

      {Array.isArray(programmes) && programmes.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Images</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programmes[0]?.details?.map((detail) => (
                <TableRow key={detail._id}>
                  <TableCell>{detail.title}</TableCell>
                  <TableCell>
                    {expandedDescription[detail._id]
                      ? detail.description
                      : `${detail.description.substring(0, 50)}...`}
                    <Button
                      onClick={() => toggleDescription(detail._id)}
                      sx={{ ml: 1 }}
                    >
                      {expandedDescription[detail._id]
                        ? "Show Less"
                        : "Show More"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {detail.images?.map((img) => (
                      <div
                        key={img._id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img
                          src={img.url}
                          alt="Programme"
                          width="100"
                          style={{ marginRight: "5px", borderRadius: "5px" }}
                        />
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditClick(detail)}
                      sx={{ border: 0 }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeleteDetail(detail._id)} // Add delete button
                      sx={{ ml: 1, border: 0 }}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={openModal}
        onClose={resetForm}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" }, // Set your desired width here
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Programme" : "Add New Programme"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 2 }}
            value={newProgramme.title}
            onChange={(e) =>
              setNewProgramme({ ...newProgramme, title: e.target.value })
            }
          />
          <JoditEditor
            value={newProgramme.description}
            onChange={(content) =>
              setNewProgramme({ ...newProgramme, description: content })
            }
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Upload Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProgramme({ ...newProgramme, image: e.target.files[0] })
            }
            style={{ marginTop: "10px", display: "block" }} // Added display block for better layout
          />
          {editMode && existingImages.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Existing Images:</Typography>
              {existingImages.map((imgUrl) => (
                <div
                  key={imgUrl}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "5px",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt="Existing Programme"
                    width="100"
                    style={{ marginRight: "5px", borderRadius: "5px" }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleRemoveImage(imgUrl)}
                    sx={{ border: 0 }}
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </Button>
                </div>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            onClick={editMode ? handleEditProgramme : handleAddProgramme}
            variant="contained"
            sx={{
              backgroundColor: "#F68633",
              "&:hover": { backgroundColor: "#faa36c" },
              textTransform: "none",
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default OurProgrammes;
