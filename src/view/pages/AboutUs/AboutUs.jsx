import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAboutData,
  saveAboutDataToBackend,
  updateSection,
  deleteSection,
} from "../../redux/slice/aboutSlice";

const AboutUs = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about.data) || [];
  const status = useSelector((state) => state.about.status);
  const [showLoader, setShowLoader] = useState(true);
  const selectedAbout = aboutData.length ? aboutData[0] : null;
  const [bannerImage, setBannerImage] = useState(null);
  const [sections, setSections] = useState([]);
  const [data, setdata] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchAboutData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedAbout) {
      setSections(selectedAbout.sections || []);
      setBannerImage(selectedAbout.banner || null);
    }
  }, [selectedAbout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) setBannerImage(file);
  };

  const handleBannerRemove = () => {
    setBannerImage(null);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  const handleDeleteClick = async (index) => {
    const sectionId = sections[index]._id;
    if (selectedAbout?._id && sectionId) {
      await dispatch(deleteSection({ aboutId: selectedAbout._id, sectionId }));
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, key, value, isNew = false) => {
    const updatedList = isNew ? [...data] : [...sections];
    updatedList[index] = { ...updatedList[index], [key]: value };
    isNew ? setdata(updatedList) : setSections(updatedList);
  };

  const handleImageUpload = (index, event, isNew = false) => {
    const files = Array.from(event.target.files);
    const updatedList = isNew ? [...data] : [...sections];

    // Create a shallow copy of the section to avoid the non-extensible error
    const updatedSection = { ...updatedList[index] };

    updatedSection.images = [...(updatedSection.images || []), ...files];

    updatedList[index] = updatedSection; // Update the list with the modified section

    isNew ? setdata(updatedList) : setSections(updatedList);
  };

  const handleSaveAll = async () => {
    const formData = new FormData();

    if (selectedAbout?._id) formData.append("id", selectedAbout._id);
    if (bannerImage instanceof File) formData.append("banner", bannerImage);

    data.forEach((section, index) => {
      formData.append(`data[${index}][title]`, section.title);
      formData.append(`data[${index}][description]`, section.description);

      if (section.images && section.images.length > 0) {
        section.images.forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      }
    });

    try {
      await dispatch(saveAboutDataToBackend(formData));
      setdata([]);
      setEditingIndex(null);
      dispatch(fetchAboutData());
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleUpdateSection = async (index) => {
    const section = sections[index];

    if (!selectedAbout?._id || !section?._id) {
      console.error("Error: Missing aboutId or sectionId");
      return;
    }

    const formData = new FormData();
    formData.append("title", section.title);
    formData.append("description", section.description);

    if (section.images && section.images.length > 0) {
      section.images.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
    }

    try {
      await dispatch(
        updateSection({
          aboutId: selectedAbout._id,
          sectionId: section._id,
          data: formData,
        })
      );

      setEditingIndex(null);
      dispatch(fetchAboutData());
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleAddNew = () => {
    setdata([...data, { title: "", description: "", images: [] }]);
  };

  if (status === "loading" || showLoader)
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

  if (status === "error")
    return (
      <Typography variant="h6" color="error">
        Error: {status}
      </Typography>
    );

  return (
    <Box>
      <Paper sx={{ borderRadius: 0, boxShadow: 0 }}>
        <>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            About Us
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Stack display="block" direction="row" alignItems="center">
              {bannerImage && (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "2px solid #ddd",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    src={
                      bannerImage && typeof bannerImage === "object"
                        ? URL.createObjectURL(bannerImage)
                        : bannerImage
                    }
                    sx={{ width: "100%", height: "100%", borderRadius: 0 }}
                    variant="square"
                  />
                  <IconButton
                    onClick={handleBannerRemove}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "white",
                      boxShadow: 2,
                      "&:hover": {
                        backgroundColor: "#ff5252",
                        color: "white",
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" color="error" />
                  </IconButton>
                </Box>
              )}
              <Box mt="15px">
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{
                    backgroundColor: "#e0752d",
                    "&:hover": { backgroundColor: "#F68633" },
                    textTransform: "none",
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleBannerUpload}
                  />
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveAll}
                  sx={{
                    ml: 3,
                    backgroundColor: "#e0752d",
                    "&:hover": {
                      backgroundColor: "#F68633",
                    },
                  }}
                >
                  Upload Banner
                </Button>
              </Box>
            </Stack>
          </Box>

          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              sx={{
                backgroundColor: "#F68633",
                "&:hover": {
                  backgroundColor: "#F68633",
                },
                padding: "5px",
              }}
            >
              Add New Section
            </Button>
          </Stack>

          {sections.map((section, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="body1">{section.title}</Typography>
                <Stack direction="row" spacing={1}>
                  {editingIndex === index ? (
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateSection(index)}
                      sx={{
                        ml: 2,
                        backgroundColor: "#F68633",
                        "&:hover": {
                          backgroundColor: "#e0752d",
                        },
                      }}
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton onClick={() => handleEditClick(index)}>
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDeleteClick(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Stack>
              </Stack>

              {editingIndex === index && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={section.title}
                    onChange={(e) =>
                      handleInputChange(index, "title", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  <JoditEditor
                    value={section.description}
                    onChange={(newContent) =>
                      handleInputChange(index, "description", newContent)
                    }
                  />

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, flexWrap: "wrap" }}
                  >
                    {section.image && (
                      <Avatar
                        src={section.image}
                        variant="rounded"
                        sx={{ width: 150, height: 100, borderRadius: 2 }}
                      />
                    )}
                  </Stack>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    style={{ marginTop: "10px" }}
                  />
                </Box>
              )}
            </Box>
          ))}

          {data.map((entry, index) => (
            <Box
              key={index}
              sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <TextField
                fullWidth
                label="Title"
                value={entry.title}
                onChange={(e) =>
                  handleInputChange(index, "title", e.target.value, true)
                }
                sx={{ mb: 2 }}
              />
              <JoditEditor
                value={entry.description}
                onChange={(newContent) =>
                  handleInputChange(index, "description", newContent, true)
                }
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(index, e, true)}
              />
            </Box>
          ))}

          <Button
            variant="contained"
            onClick={handleSaveAll}
            sx={{
              backgroundColor: "#F68633",
              "&:hover": {
                backgroundColor: "#e0752d",
              },
            }}
          >
            <SaveIcon /> Save All
          </Button>
        </>
      </Paper>
    </Box>
  );
};

export default AboutUs;
