import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgrammes,
  addProgramme,
  updateProgramme,
  updateSection,
  deleteProgrammeDetail,
  fetchProgrammesByCategory,
} from "../../redux/slice/ourProgrammesSlice";

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

const OurProgrammesAdmin = () => {
  const dispatch = useDispatch();
  const {
    items: programmes,
    loading,
    error,
  } = useSelector((state) => state.programmes);

  const [selectedCategory, setSelectedCategory] = useState(
    "Privileged Children"
  );
  const [categoryBanner, setCategoryBanner] = useState(null);
  const [categoryBannerPreview, setCategoryBannerPreview] = useState(null);
  const [newProgramme, setNewProgramme] = useState({
    title: "",
    description: "",
    category: selectedCategory,
    detailImages: [],
  });
  const [programmeImagePreviews, setProgrammeImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    dispatch(fetchProgrammes());
  }, [dispatch]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setNewProgramme({ ...newProgramme, category: event.target.value });
    setCategoryBannerPreview(null);
    dispatch(fetchProgrammesByCategory(event.target.value));
  };

  const handleCategoryBannerChange = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (!file || !(file instanceof Blob)) {
      console.error("Invalid file selected");
      return;
    }

    if (categoryBannerPreview) {
      URL.revokeObjectURL(categoryBannerPreview);
    }

    const objectURL = URL.createObjectURL(file);
    setCategoryBanner(file);
    setCategoryBannerPreview(objectURL);
    fileInput.value = "";
  };

  const handleProgrammeImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProgramme({
      ...newProgramme,
      detailImages: [...newProgramme.detailImages, ...files],
    });

    const previews = files.map((file) => URL.createObjectURL(file));
    setProgrammeImagePreviews([...programmeImagePreviews, ...previews]);
  };

  const handleSaveBanner = () => {
    if (!categoryBanner) {
      alert("Please upload a banner before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("banner", categoryBanner);
    formData.append("category", selectedCategory); // Include category if needed

    dispatch(
      updateProgramme({ category: selectedCategory, id: editingId, formData })
    )
      .then(() => {
        dispatch(fetchProgrammes());
        setCategoryBanner(null);
        setCategoryBannerPreview(null);
      })
      .catch((error) => {
        console.error("Error saving banner:", error);
        alert("Failed to save banner. Please try again.");
      });
  };

  const handleSaveProgramme = () => {
    const formData = new FormData();
    formData.append("category", newProgramme.category);

    // If title and description are provided, add them to the formData
    if (newProgramme.title && newProgramme.description) {
      formData.append(
        "details",
        JSON.stringify([
          { title: newProgramme.title, description: newProgramme.description },
        ])
      );
    }

    newProgramme.detailImages.forEach((image) => {
      formData.append("detailImages", image);
    });

    if (categoryBanner) {
      formData.append("banner", categoryBanner);
    }

    let action;
    if (editingId && detailId) {
      // If editing a specific section, call updateSection
      action = updateSection({
        category: newProgramme.category,
        id: detailId, // Use detailId for updating the specific detail
        formData,
      });
    } else if (editingId) {
      // If editing the programme itself, call updateProgramme
      action = updateProgramme({
        category: newProgramme.category,
        id: editingId, // Use editingId for updating the programme
        formData,
      });
    } else {
      // If adding a new programme
      action = addProgramme(formData);
    }

    dispatch(action)
      .then(() => {
        dispatch(fetchProgrammes());
        resetForm();
        setDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error saving programme:", error);
        alert("Failed to save programme. Please try again.");
      });
  };

  const resetForm = () => {
    setNewProgramme({
      title: "",
      description: "",
      category: selectedCategory,
      detailImages: [],
    });
    setProgrammeImagePreviews([]);
    setCategoryBanner(null);
    setCategoryBannerPreview(null);
    setDetailId(null); // Reset detail ID
  };

  const handleEditProgramme = (programme) => {
    setNewProgramme({
      title: programme.details[0]?.title || "",
      description: programme.details[0]?.description || "",
      category: programme.category,
      detailImages: [],
    });

    setProgrammeImagePreviews(programme.detailImages || []);
    setEditingId(programme._id);
    setDetailId(programme.details[0]._id); // Set detail ID for updating
    setDialogOpen(true);
  };

  const handleDeleteProgramme = (id) => {
    dispatch(
      deleteProgrammeDetail({ category: selectedCategory, detailId: id })
    )
      .then(() => {
        dispatch(fetchProgrammes());
      })
      .catch((error) => {
        console.error("Error deleting programme:", error);
        alert("Failed to delete programme. Please try again.");
      });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: "bold" }}>
        Our Programmes
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Select Category
      </Typography>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        fullWidth
        sx={{ mb: 2 }}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>

      <Box mb={3}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Upload Banner Button */}
          <Button
            variant="contained"
            component="label"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }}
          >
            Upload Banner
            <input type="file" hidden onChange={handleCategoryBannerChange} />
          </Button>

          {/* Save Banner Button - Only Visible After Upload */}
          {categoryBannerPreview && (
            <Button
              variant="contained"
              onClick={handleSaveBanner}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: "#F68633",
                "&:hover": { backgroundColor: "#e0752d" },
              }}
            >
              Save Banner
            </Button>
          )}
        </Box>

        <Box mt={3}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            {categoryBannerPreview ? "Selected Banner" : "Existing Banner"}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {categoryBannerPreview ? (
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: "hidden",
                  width: 150,
                }}
              >
                <img
                  src={categoryBannerPreview}
                  alt="Category Banner Preview"
                  style={{ width: "100%", height: "auto" }}
                />
              </Card>
            ) : (
              programmes
                .filter(
                  (programme) =>
                    programme.category === selectedCategory && programme.banner
                )
                .map((programme) => (
                  <Card
                    key={programme.id || programme.category}
                    sx={{ borderRadius: 2, boxShadow: 2, overflow: "hidden" }}
                  >
                    <img
                      src={programme.banner}
                      alt={`${programme.category} Banner`}
                      style={{ width: "150px", height: "auto" }}
                    />
                  </Card>
                ))
            )}
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          resetForm();
          setDialogOpen(true);
        }}
        sx={{
          mb: 2,
          backgroundColor: "#F68633",
          "&:hover": { backgroundColor: "#e0752d" },
        }}
      >
        Add New Programme
      </Button>

      {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
      {error && (
        <Typography color="error">
          Error: {typeof error === "object" ? error.message : error}
        </Typography>
      )}

      <TableContainer>
        <Table sx={{ border: "1px solid #ddd" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #ddd" }}>Title</TableCell>
              <TableCell sx={{ border: "1px solid #ddd" }}>
                Description
              </TableCell>
              <TableCell sx={{ border: "1px solid #ddd" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programmes
              .filter((programme) => programme.category === selectedCategory)
              .map((programme) => (
                <TableRow key={programme._id}>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {programme.details[0]?.title || "No Title"}
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ddd" }}
                    dangerouslySetInnerHTML={{
                      __html: programme.details[0]?.description || "",
                    }}
                  />
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    <IconButton onClick={() => handleEditProgramme(programme)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        handleDeleteProgramme(programme.details[0]._id)
                      } // Pass detail ID for deletion
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            width: "1000px",
            maxWidth: "100%",
          },
        }}
      >
        <DialogTitle>
          {editingId ? "Edit Programme" : "Add Programme"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newProgramme.title}
            onChange={(e) =>
              setNewProgramme({ ...newProgramme, title: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <JoditEditor
            value={newProgramme.description}
            onChange={(content) =>
              setNewProgramme({ ...newProgramme, description: content })
            }
          />

          <Typography variant="body1" sx={{ mt: 2 }}>
            Upload Programme Images
          </Typography>
          <input type="file" multiple onChange={handleProgrammeImagesChange} />
          {programmeImagePreviews.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Programme"
              style={{
                width: "50px",
                height: "auto",
                marginTop: 10,
                marginRight: 10,
              }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveProgramme}
            sx={{
              backgroundColor: "#F68633",
              "&:hover": { backgroundColor: "#e0752d" },
            }}
          >
            {editingId ? "Update Programme" : "Add Programme"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OurProgrammesAdmin;
