import React, { useEffect, useState, useCallback } from "react";
import JoditEditor from "jodit-react";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Grid,
  IconButton,
  Divider,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Tooltip,
  useTheme,
  Fade,
} from "@mui/material";
import {
  Edit,
  Delete,
  Save,
  Add,
  Close,
  Image as ImageIcon,
  ArrowBack,
} from "@mui/icons-material";
import {
  School,
  LocalHospital,
  Work,
  Wc,
  ChildCare,
  Public,
  Business,
  Favorite,
} from "@mui/icons-material";
import debounce from "lodash.debounce";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProgrammes,
  addProgramme,
  updateProgramme,
  deleteProgramme,
} from "../../redux/slice/ourProgrammesSlice";

const categories = [
  { text: "Education", icon: <School />, key: "education" },
  { text: "Healthcare", icon: <LocalHospital />, key: "healthcare" },
  { text: "Livelihood", icon: <Work />, key: "livelihood" },
  {
    text: "Girl Child & Women Empowerment",
    icon: <Wc />,
    key: "girl_child_women",
  },
  {
    text: "Privileged Children",
    icon: <ChildCare />,
    key: "privileged_children",
  },
  { text: "Civic-Driven Change", icon: <Public />, key: "civic_change" },
  {
    text: "Social Entrepreneurship",
    icon: <Business />,
    key: "social_entrepreneurship",
  },
  {
    text: "Special Support Programme",
    icon: <Favorite />,
    key: "special_support",
  },
  {
    text: "Special Interventions",
    icon: <Favorite />,
    key: "special_interventions",
  },
];

function OurProgrammes() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.programmes);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  // Fetch programmes when the category is selected
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchProgrammes(selectedCategory));
    }
  }, [selectedCategory, dispatch]);

  // Handle Category Selection
  const handleCategorySelect = (key) => {
    setSelectedCategory(key);
    setEditingItem(null);
    setFormData({ id: null, title: "", description: "", image: "" });
    setIsFormOpen(false);
    setActiveTab(0);
  };

  // Handle Tab Change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Open Form for new item
  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({ id: null, title: "", description: "", image: "" });
    setIsFormOpen(true);
  };

  // Handle Edit Click
  const handleEdit = (item) => {
    setEditingItem(item.id);
    setFormData(item);
    setIsFormOpen(true);
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };

  // Handle Delete
  const handleDelete = () => {
    if (confirmDelete) {
      dispatch(deleteProgramme(confirmDelete));
      setConfirmDelete(null);
    }
  };

  // Handle Save
  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    if (editingItem) {
      // Update Existing Item
      dispatch(updateProgramme(formData));
    } else {
      // Add New Item
      dispatch(addProgramme({ ...formData, id: Date.now() }));
    }

    setFormData({ id: null, title: "", description: "", image: "" });
    setEditingItem(null);
    setIsFormOpen(false);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Debounced handler
  const debouncedHandleChange = useCallback(
    debounce((content) => {
      setFormData((prev) => ({ ...prev, description: content }));
    }, 500),
    []
  );

  // Handle Description Change
  const handleDescriptionChange = (content) => {
    debouncedHandleChange(content);
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    if (!items.length) {
      setSelectedCategory(null);
    }
  };

  // Get Current Category Name
  const getCurrentCategoryName = () => {
    return categories.find((cat) => cat.key === selectedCategory)?.text || "";
  };

  return (
    <Container maxWidth="xlg">
      {!selectedCategory ? (
        // Category Selection View
        <Paper elevation={3} sx={{ p: 4, mt: 3, borderRadius: 2 }}>
          <Typography
            variant="h4"
            mb={4}
            fontWeight="bold"
            color="black"
            align="left"
          >
            Our Programmes
          </Typography>

          <Typography variant="h5" mb={3} fontWeight="medium">
            Select a Category to Manage
          </Typography>

          <Grid container spacing={3}>
            {categories.map(({ text, icon, key }) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Card
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => handleCategorySelect(key)}
                >
                  <Box sx={{ fontSize: 45, color: "primary.main", mb: 2 }}>
                    {icon}
                  </Box>
                  <Typography variant="h6" align="center">
                    {text}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    mt={1}
                  >
                    {items.length || 0} items
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ) : (
        // Category Management View
        <Fade in={true}>
          <Box my={3}>
            <Box mb={4} display="flex" alignItems="center">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setSelectedCategory(null)}
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              <Typography variant="h4" color="primary" fontWeight="medium">
                {getCurrentCategoryName()}
              </Typography>
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="View Items" />
              <Tab label="Manage Items" />
            </Tabs>

            {activeTab === 0 ? (
              // View Items Tab
              <Box>
                {items.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      No items found in this category
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddNew}
                      sx={{ mt: 2 }}
                    >
                      Add First Item
                    </Button>
                  </Paper>
                ) : (
                  <Grid container spacing={3}>
                    {items.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {item.image ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={item.image}
                              alt={item.title}
                              sx={{ objectFit: "cover" }}
                            />
                          ) : (
                            <Box
                              sx={{
                                height: 200,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.100",
                              }}
                            >
                              <ImageIcon
                                sx={{ fontSize: 60, color: "grey.400" }}
                              />
                            </Box>
                          )}
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                              sx={{
                                mt: 1,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            ) : (
              // Manage Items Tab
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">
                    {items.length} {items.length === 1 ? "Item" : "Items"} in
                    This Category
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddNew}
                  >
                    Add New Item
                  </Button>
                </Box>

                {items.length === 0 ? (
                  <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      No items to manage
                    </Typography>
                  </Paper>
                ) : (
                  <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
                    {items.map((item, index) => (
                      <React.Fragment key={item.id}>
                        {index > 0 && <Divider />}
                        <Box
                          p={2}
                          display="flex"
                          alignItems="center"
                          sx={{
                            transition: "background-color 0.2s",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              mr: 2,
                              borderRadius: 1,
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  height: "100%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "grey.200",
                                }}
                              >
                                <ImageIcon sx={{ color: "grey.400" }} />
                              </Box>
                            )}
                          </Box>

                          <Box flexGrow={1}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {item.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.description.replace(/<[^>]*>/g, "")}
                            </Typography>
                          </Box>

                          <Box>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(item)}
                                size="small"
                                sx={{ mx: 0.5 }}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteConfirm(item.id)}
                                size="small"
                                sx={{ mx: 0.5 }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </React.Fragment>
                    ))}
                  </Paper>
                )}
              </Box>
            )}

            {/* Add/Edit Form Dialog */}
            <Dialog
              open={isFormOpen}
              onClose={handleCloseForm}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {editingItem ? "Edit Item" : "Add New Item"}
                  <IconButton onClick={handleCloseForm} size="small">
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  required
                />

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Description:
                </Typography>
                <JoditEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  config={{
                    buttons: [
                      "bold",
                      "italic",
                      "underline",
                      "|",
                      "ul",
                      "ol",
                      "|",
                      "link",
                      "source",
                    ],
                  }}
                />

                <Box mt={3} mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    Image:
                  </Typography>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          border: "1px dashed",
                          borderColor: "grey.300",
                          borderRadius: 1,
                          p: 1,
                          height: 150,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          mb: { xs: 2, md: 0 },
                        }}
                      >
                        {formData.image ? (
                          <img
                            src={formData.image}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "120px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <>
                            <ImageIcon
                              sx={{ fontSize: 40, color: "grey.400", mb: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              No image selected
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<ImageIcon />}
                      >
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </Button>

                      {formData.image && (
                        <Button
                          variant="text"
                          color="error"
                          onClick={() =>
                            setFormData({ ...formData, image: "" })
                          }
                          sx={{ ml: 2 }}
                        >
                          Remove
                        </Button>
                      )}

                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                        mt={1}
                      >
                        Recommended size: 1200x800 pixels (3:2 ratio)
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>

              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleCloseForm} color="inherit">
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={!formData.title.trim()}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
              open={confirmDelete !== null}
              onClose={() => setConfirmDelete(null)}
            >
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this item? This action cannot
                  be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setConfirmDelete(null)} color="inherit">
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Fade>
      )}
    </Container>
  );
}

export default OurProgrammes;
