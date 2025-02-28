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
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgrammes,
  addProgramme,
  updateProgramme,
  deleteProgramme,
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
  // console.log("Items:", programmes);

  const [selectedCategory, setSelectedCategory] = useState("Education");
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
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    dispatch(fetchProgrammes());
  }, [dispatch]);

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setNewProgramme({ ...newProgramme, category: event.target.value });
    setCategoryBannerPreview(null);
  };

  // Handle category banner upload
  const handleCategoryBannerChange = (e) => {
    const file = e.target.files[0];
    setCategoryBanner(file);
    setCategoryBannerPreview(URL.createObjectURL(file));
  };

  // Handle programme detail image upload
  const handleProgrammeImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProgramme({
      ...newProgramme,
      detailImages: [...newProgramme.detailImages, ...files],
    });

    const previews = files.map((file) => URL.createObjectURL(file));
    setProgrammeImagePreviews([...programmeImagePreviews, ...previews]);
  };

  // Handle form submission (Add / Update Programme)
  const handleSaveProgramme = () => {
    if (
      !newProgramme.title ||
      !newProgramme.description ||
      newProgramme.detailImages.length === 0
    ) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("category", newProgramme.category);
    formData.append("banner", categoryBanner);

    formData.append(
      "details",
      JSON.stringify([
        { title: newProgramme.title, description: newProgramme.description },
      ])
    );

    newProgramme.detailImages.forEach((image) => {
      formData.append("detailImages", image);
    });

    let action;
    if (editingId) {
      formData.append("_id", editingId);
      action = updateProgramme({ id: editingId, formData });
    } else {
      action = addProgramme(formData);
    }

    // Dispatch action and wait for it to complete
    dispatch(action)
      .then(() => {
        dispatch(fetchProgrammes()); // Fetch updated data
        resetForm(); // Reset form fields after success
      })
      .catch((error) => {
        console.error("Error saving programme:", error);
        alert("Failed to save programme. Please try again.");
      });
  };

  // Reset form fields
  const resetForm = () => {
    setNewProgramme({
      title: "",
      description: "",
      category: selectedCategory,
      detailImages: [],
    });
    setProgrammeImagePreviews([]);
    setCategoryBanner(null);
    setShowEditor(false); // Hide editor after saving
  };

  // Edit Programme
  const handleEditProgramme = (programme) => {
    setNewProgramme({
      title: programme.details[0]?.title || "",
      description: programme.details[0]?.description || "",
      category: programme.category,
      detailImages: [],
    });

    setProgrammeImagePreviews(programme.detailImages || []);
    setEditingId(programme._id);
    setShowEditor(true); // Show editor when editing
  };

  // Delete Programme
  const handleDeleteProgramme = (id) => {
    dispatch(deleteProgramme(id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: "bold" }}>
        Our Programmes Admin
      </Typography>

      {/* Category Selection */}
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

      {/* Category Banner Upload */}
      <Box mb={3} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6">Category Banner</Typography>
        <input type="file" onChange={handleCategoryBannerChange} />
        {categoryBannerPreview && (
          <img
            src={categoryBannerPreview}
            alt="Category Banner"
            style={{ width: "10%", height: "auto", marginTop: 10 }}
          />
        )}
      </Box>

      {/* Add/Edit Programme Form */}
      {showEditor && (
        <Box mb={3} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h6">Add / Edit Programme</Typography>
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

          {/* Programme Images Upload */}
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

          <Button
            variant="contained"
            onClick={handleSaveProgramme}
            sx={{
              mt: 2,
              backgroundColor: "#F68633",
              "&:hover": { backgroundColor: "#e0752d" },
            }}
          >
            {editingId ? "Update Programme" : "Add Programme"}
          </Button>
        </Box>
      )}

      {/* Button to Add New Programme */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          resetForm(); // Reset form to add new programme
          setShowEditor(true); // Show editor
        }}
        sx={{
          mb: 2,
          backgroundColor: "#F68633",
          "&:hover": { backgroundColor: "#e0752d" },
        }}
      >
        Add New Programme
      </Button>

      {/* Loading State */}
      {loading && <CircularProgress sx={{ display: "block", mx: "auto" }} />}
      {error && <Typography color="error">Error: {error}</Typography>}

      {/* Filtered Programmes Table */}
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
                      onClick={() => handleDeleteProgramme(programme._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OurProgrammesAdmin;
