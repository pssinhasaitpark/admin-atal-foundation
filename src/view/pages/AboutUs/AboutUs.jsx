// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Stack,
//   IconButton,
//   Avatar,
//   CircularProgress,
// } from "@mui/material";
// import {
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Add as AddIcon,
//   Save as SaveIcon,
//   Upload as UploadIcon,
// } from "@mui/icons-material";
// import JoditEditor from "jodit-react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAboutData,
//   saveAboutDataToBackend,
//   updateSection,
//   deleteSection,
// } from "../../redux/slice/aboutSlice";

// const AboutUs = () => {
//   const dispatch = useDispatch();
//   const aboutData = useSelector((state) => state.about.data) || [];
//   const status = useSelector((state) => state.about.status);
//   const [showLoader, setShowLoader] = useState(true);
//   const selectedAbout = aboutData.length ? aboutData[0] : null;
//   const [bannerImage, setBannerImage] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [data, setdata] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAboutData());
//   }, [dispatch]);

//   useEffect(() => {
//     if (selectedAbout) {
//       setSections(selectedAbout.sections || []);
//       setBannerImage(selectedAbout.banner || null);
//     }
//   }, [selectedAbout]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowLoader(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleBannerUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) setBannerImage(file);
//   };

//   const handleBannerRemove = () => {
//     setBannerImage(null);
//   };

//   const handleEditClick = (index) => {
//     setEditingIndex(index);
//   };

//   const handleDeleteClick = async (index) => {
//     const sectionId = sections[index]._id;
//     if (selectedAbout?._id && sectionId) {
//       await dispatch(deleteSection({ aboutId: selectedAbout._id, sectionId }));
//       setSections(sections.filter((_, i) => i !== index));
//     }
//   };

//   const handleInputChange = (index, key, value, isNew = false) => {
//     const updatedList = isNew ? [...data] : [...sections];
//     updatedList[index] = { ...updatedList[index], [key]: value };
//     isNew ? setdata(updatedList) : setSections(updatedList);
//   };

//   const handleImageUpload = (index, event, isNew = false) => {
//     const files = Array.from(event.target.files);
//     const updatedList = isNew ? [...data] : [...sections];

//     // Create a shallow copy of the section to avoid the non-extensible error
//     const updatedSection = { ...updatedList[index] };

//     updatedSection.images = [...(updatedSection.images || []), ...files];

//     updatedList[index] = updatedSection; // Update the list with the modified section

//     isNew ? setdata(updatedList) : setSections(updatedList);
//   };

//   const handleSaveAll = async () => {
//     const formData = new FormData();

//     if (selectedAbout?._id) formData.append("id", selectedAbout._id);
//     if (bannerImage instanceof File) formData.append("banner", bannerImage);

//     data.forEach((section, index) => {
//       formData.append(`data[${index}][title]`, section.title);
//       formData.append(`data[${index}][description]`, section.description);

//       if (section.images && section.images.length > 0) {
//         section.images.forEach((image) => {
//           if (image instanceof File) {
//             formData.append("images", image);
//           }
//         });
//       }
//     });

//     try {
//       await dispatch(saveAboutDataToBackend(formData));
//       setdata([]);
//       setEditingIndex(null);
//       dispatch(fetchAboutData());
//     } catch (error) {
//       console.error("Error saving data:", error);
//     }
//   };

//   const handleUpdateSection = async (index) => {
//     const section = sections[index];

//     if (!selectedAbout?._id || !section?._id) {
//       console.error("Error: Missing aboutId or sectionId");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", section.title);
//     formData.append("description", section.description);

//     if (section.images && section.images.length > 0) {
//       section.images.forEach((image) => {
//         if (image instanceof File) {
//           formData.append("images", image);
//         }
//       });
//     }

//     try {
//       await dispatch(
//         updateSection({
//           aboutId: selectedAbout._id,
//           sectionId: section._id,
//           data: formData,
//         })
//       );

//       setEditingIndex(null);
//       dispatch(fetchAboutData());
//     } catch (error) {
//       console.error("Error updating section:", error);
//     }
//   };

//   const handleAddNew = () => {
//     setdata([...data, { title: "", description: "", images: [] }]);
//   };

//   if (status === "loading" || showLoader)
//     return (
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="50vh"
//       >
//         <CircularProgress sx={{ color: "#F68633" }} />
//       </Box>
//     );

//   if (status === "error")
//     return (
//       <Typography variant="h6" color="error">
//         Error: {status}
//       </Typography>
//     );

//   return (
//     <Box>
//       <Paper sx={{ borderRadius: 0, boxShadow: 0 }}>
//         <>
//           <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
//             About Us
//           </Typography>

//           <Box sx={{ mb: 3 }}>
//             <Stack display="block" direction="row" alignItems="center">
//               {bannerImage && (
//                 <Box
//                   sx={{
//                     position: "relative",
//                     width: "100%",
//                     height: "300px",
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     border: "2px solid #ddd",
//                     justifyContent: "center",
//                     alignItems: "center",
//                   }}
//                 >
//                   <Avatar
//                     src={
//                       bannerImage && typeof bannerImage === "object"
//                         ? URL.createObjectURL(bannerImage)
//                         : bannerImage
//                     }
//                     sx={{ width: "100%", height: "100%", borderRadius: 0 }}
//                     variant="square"
//                   />
//                   <IconButton
//                     onClick={handleBannerRemove}
//                     sx={{
//                       position: "absolute",
//                       top: 4,
//                       right: 4,
//                       backgroundColor: "white",
//                       boxShadow: 2,
//                       "&:hover": {
//                         backgroundColor: "#ff5252",
//                         color: "white",
//                       },
//                     }}
//                     size="small"
//                   >
//                     <DeleteIcon fontSize="small" color="error" />
//                   </IconButton>
//                 </Box>
//               )}
//               <Box mt="15px">
//                 <Button
//                   variant="contained"
//                   component="label"
//                   startIcon={<UploadIcon />}
//                   sx={{
//                     backgroundColor: "#e0752d",
//                     "&:hover": { backgroundColor: "#F68633" },
//                     textTransform: "none",
//                   }}
//                 >
//                   Choose File
//                   <input
//                     type="file"
//                     hidden
//                     accept="image/*"
//                     onChange={handleBannerUpload}
//                   />
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleSaveAll}
//                   sx={{
//                     ml: 3,
//                     backgroundColor: "#e0752d",
//                     "&:hover": { backgroundColor: "#F68633" },
//                     textTransform: "none",
//                   }}
//                 >
//                   Upload Banner
//                 </Button>
//               </Box>
//             </Stack>
//           </Box>

//           <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
//             <Button
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleAddNew}
//               sx={{
//                 backgroundColor: "#e0752d",
//                 "&:hover": { backgroundColor: "#F68633" },
//                 textTransform: "none",
//               }}
//             >
//               Add New Section
//             </Button>
//           </Stack>

//           {sections.map((section, index) => (
//             <Box
//               key={index}
//               sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
//             >
//               <Stack
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//               >
//                 <Typography variant="body1">{section.title}</Typography>
//                 <Stack direction="row" spacing={1}>
//                   {editingIndex === index ? (
//                     <Button
//                       variant="contained"
//                       onClick={() => handleUpdateSection(index)}
//                       sx={{
//                         backgroundColor: "#e0752d",
//                         "&:hover": { backgroundColor: "#F68633" },
//                         textTransform: "none",
//                       }}
//                     >
//                       Save
//                     </Button>
//                   ) : (
//                     <IconButton onClick={() => handleEditClick(index)}>
//                       <EditIcon />
//                     </IconButton>
//                   )}
//                   <IconButton onClick={() => handleDeleteClick(index)}>
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Stack>
//               </Stack>

//               {editingIndex === index && (
//                 <Box sx={{ mt: 2 }}>
//                   <TextField
//                     fullWidth
//                     label="Title"
//                     value={section.title}
//                     onChange={(e) =>
//                       handleInputChange(index, "title", e.target.value)
//                     }
//                     sx={{ mb: 2 }}
//                   />
//                   <JoditEditor
//                     value={section.description}
//                     onChange={(newContent) =>
//                       handleInputChange(index, "description", newContent)
//                     }
//                   />

//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     sx={{ mt: 2, flexWrap: "wrap" }}
//                   >
//                     {section.image && (
//                       <Avatar
//                         src={section.image}
//                         variant="rounded"
//                         sx={{ width: 150, height: 100, borderRadius: 2 }}
//                       />
//                     )}
//                   </Stack>

//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={(e) => handleImageUpload(index, e)}
//                     style={{ marginTop: "10px" }}
//                   />
//                 </Box>
//               )}
//             </Box>
//           ))}

//           {data.map((entry, index) => (
//             <Box
//               key={index}
//               sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
//             >
//               <TextField
//                 fullWidth
//                 label="Title"
//                 value={entry.title}
//                 onChange={(e) =>
//                   handleInputChange(index, "title", e.target.value, true)
//                 }
//                 sx={{ mb: 2 }}
//               />
//               <JoditEditor
//                 value={entry.description}
//                 onChange={(newContent) =>
//                   handleInputChange(index, "description", newContent, true)
//                 }
//               />
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) => handleImageUpload(index, e, true)}
//               />
//             </Box>
//           ))}

//           <Button
//             variant="contained"
//             onClick={handleSaveAll}
//             sx={{
//               backgroundColor: "#e0752d",
//               "&:hover": { backgroundColor: "#F68633" },
//               textTransform: "none",
//             }}
//           >
//             <SaveIcon /> Save All
//           </Button>
//         </>
//       </Paper>
//     </Box>
//   );
// };

// export default AboutUs;
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
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
  const [bannerPreview, setBannerPreview] = useState(null);
  const [sections, setSections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState({});
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [newSection, setNewSection] = useState({
    title: "",
    description: "",
    image: null,
    images: [],
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionIdToDelete, setSectionIdToDelete] = useState(null);

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

  const handleBannerUpload = async () => {
    if (!bannerImage) return alert("Please select a banner image to upload");

    const formData = new FormData();
    if (selectedAbout?._id) formData.append("id", selectedAbout._id);
    if (bannerImage instanceof File) formData.append("banner", bannerImage);

    try {
      await dispatch(saveAboutDataToBackend(formData));
      setBannerPreview(null);
      dispatch(fetchAboutData());
    } catch (error) {
      console.error("Error saving banner:", error);
    }
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const toggleDescription = (id) => {
    setExpandedDescription((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditClick = (section) => {
    setNewSection({
      title: section.title,
      description: section.description,
      image: section.image || null,
      images: [],
    });
    setSelectedSectionId(section._id);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = (sectionId) => {
    setSectionIdToDelete(sectionId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSection = async () => {
    if (selectedAbout?._id && sectionIdToDelete) {
      await dispatch(
        deleteSection({
          aboutId: selectedAbout._id,
          sectionId: sectionIdToDelete,
        })
      );
      dispatch(fetchAboutData());
    }
    setDeleteDialogOpen(false);
    setSectionIdToDelete(null);
  };

  const resetForm = () => {
    setNewSection({ title: "", description: "", image: null, images: [] });
    setOpenModal(false);
    setEditMode(false);
    setSelectedSectionId(null);
  };

  const handleAddSection = async () => {
    if (!newSection.title || !newSection.description) {
      return alert("Please fill all fields!");
    }

    const formData = new FormData();
    if (selectedAbout?._id) formData.append("id", selectedAbout._id);

    // Use the correct keys for your API
    formData.append("data[0][title]", newSection.title);
    formData.append("data[0][description]", newSection.description);

    if (newSection.image instanceof File) {
      formData.append("images", newSection.image);
    }

    try {
      await dispatch(saveAboutDataToBackend(formData));
      resetForm();
      dispatch(fetchAboutData());
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleUpdateSection = async () => {
    if (!newSection.title || !newSection.description) {
      return alert("Please fill all fields!");
    }

    if (!selectedAbout?._id || !selectedSectionId) {
      console.error("Error: Missing aboutId or sectionId");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedAbout._id);
    formData.append("title", newSection.title);
    formData.append("description", newSection.description);

    if (newSection.image instanceof File) {
      formData.append("images", newSection.image);
    }

    try {
      await dispatch(
        updateSection({
          aboutId: selectedAbout._id,
          sectionId: selectedSectionId,
          data: formData,
        })
      );

      resetForm();
      dispatch(fetchAboutData());
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewSection({
        ...newSection,
        image: file,
      });
    }
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
    <Container
      maxWidth="false"
      sx={{
        "@media (min-width: 600px)": {
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        },
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        About Us
      </Typography>

      {/* Banner Section */}
      {bannerPreview ? (
        <Avatar
          src={bannerPreview}
          sx={{ width: "100%", height: "300px", borderRadius: 2, mb: 2 }}
          variant="square"
        />
      ) : (
        selectedAbout?.banner && (
          <Avatar
            src={selectedAbout.banner}
            sx={{ width: "100%", height: "300px", borderRadius: 2, mb: 2 }}
            variant="square"
          />
        )
      )}

      <Box display="flex" alignItems="center" gap={2} mb={3}>
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
            onChange={handleBannerChange}
          />
        </Button>
        <Button
          variant="contained"
          onClick={handleBannerUpload}
          sx={{
            backgroundColor: "#e0752d",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Upload Banner
        </Button>
      </Box>

      {/* Add New Section Button */}
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenModal(true);
            setEditMode(false);
          }}
          sx={{
            backgroundColor: "#e0752d",
            "&:hover": { backgroundColor: "#F68633" },
            textTransform: "none",
          }}
        >
          Add New Section
        </Button>
      </Box>

      {/* Sections Table */}
      {sections && sections.length > 0 ? (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section._id}>
                  <TableCell>{section.title}</TableCell>
                  <TableCell>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: expandedDescription[section._id]
                          ? section.description
                          : section.description
                          ? `${section.description.substring(0, 50)}...`
                          : "No description available.",
                      }}
                    />
                    <Button
                      onClick={() => toggleDescription(section._id)}
                      sx={{ textTransform: "none", ml: 1 }}
                    >
                      {expandedDescription[section._id]
                        ? "Read Less"
                        : "Read More"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {section.image && (
                      <Avatar
                        src={section.image}
                        variant="rounded"
                        sx={{ width: 100, height: 70, borderRadius: 1 }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleEditClick(section)}
                      sx={{ border: 0 }}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeleteClick(section._id)}
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
      ) : (
        <Typography
          variant="h6"
          color="textSecondary"
          sx={{ my: 4, textAlign: "center" }}
        >
          No sections available. Please add a new section.
        </Typography>
      )}

      {/* Add/Edit Section Dialog */}
      <Dialog
        open={openModal}
        onClose={resetForm}
        fullWidth
        PaperProps={{
          style: { maxWidth: "1000px" },
        }}
      >
        <DialogTitle>
          {editMode ? "Edit Section" : "Add New Section"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            sx={{ mt: 2 }}
            value={newSection.title}
            onChange={(e) =>
              setNewSection({ ...newSection, title: e.target.value })
            }
          />
          <Box sx={{ mt: 2, mb: 2 }}>
            <JoditEditor
              value={newSection.description}
              onChange={(content) =>
                setNewSection({ ...newSection, description: content })
              }
            />
          </Box>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Upload Section Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px", display: "block" }}
          />
          {newSection.image && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">Selected Image:</Typography>
              <Box
                sx={{ position: "relative", display: "inline-block", mt: 1 }}
              >
                <Avatar
                  src={
                    newSection.image instanceof File
                      ? URL.createObjectURL(newSection.image)
                      : newSection.image
                  }
                  variant="rounded"
                  sx={{ width: 100, height: 70, borderRadius: 1 }}
                />
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    backgroundColor: "white",
                    boxShadow: 1,
                    "&:hover": { backgroundColor: "#ff5252" },
                  }}
                  onClick={() => {
                    setNewSection({
                      ...newSection,
                      image: null,
                    });
                  }}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            onClick={editMode ? handleUpdateSection : handleAddSection}
            variant="contained"
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            {editMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this section?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteSection}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AboutUs;
