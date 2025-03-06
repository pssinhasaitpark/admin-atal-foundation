import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNews,
  createNews,
  updateNews,
  deleteNews,
} from "../../redux/slice/newsPageSlice";
import {
  Container,
  Typography,
  TextField,
  Box,
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
  DialogContentText,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit,
  Add as AddIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news);
  const [open, setOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    headline: "",
    description: "",
    image: null,
  });

  // For Delete Confirmation Dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Fetch news on component mount
  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  // For handling the news data
  useEffect(() => {
    if (news && editingNews) {
      setFormData({
        headline: editingNews.headline,
        description: editingNews.description || "",
        image: null,
      });
    }
  }, [news, editingNews]);

  const handleOpen = (newsItem = null) => {
    if (newsItem) {
      // Editing existing news
      setEditingNews(newsItem);
      setFormData({
        headline: newsItem.headline,
        description: newsItem.description || "",
        image: null, // New image upload optional
      });
    } else {
      // Creating new news
      setEditingNews(null);
      setFormData({ headline: "", description: "", image: null });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingNews(null);
    setFormData({ headline: "", description: "", image: null });
  };

  const handleDeleteOpen = (newsItem) => {
    setNewsToDelete(newsItem);
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setNewsToDelete(null);
  };

  const handleDelete = async () => {
    if (newsToDelete) {
      await dispatch(deleteNews(newsToDelete._id)).unwrap();
      dispatch(fetchNews());
      handleDeleteClose();
    }
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image input
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async () => {
    if (!formData.headline || !formData.description) {
      alert("Please enter all fields!");
      return;
    }

    const data = new FormData();
    data.append("headline", formData.headline);
    data.append("description", formData.description);
    if (formData.image) data.append("images", formData.image);

    if (editingNews) {
      // Update existing news
      await dispatch(
        updateNews({ newsId: editingNews._id, formData: data })
      ).unwrap();
    } else {
      // Create new news
      await dispatch(createNews(data)).unwrap();
    }

    dispatch(fetchNews());
    handleClose();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

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
      <Typography
        variant="h4"
        align="left"
        gutterBottom
        sx={{ mb: 2, fontWeight: "bold" }}
      >
        News
      </Typography>

      {!Array.isArray(news) || news.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <Typography variant="h6" gutterBottom>
            No news available
          </Typography>
          <Button
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            Create News
          </Button>
        </Box>
      ) : (
        <>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{
              backgroundColor: "#e0752d",
              "&:hover": { backgroundColor: "#F68633" },
              textTransform: "none",
            }}
          >
            Add News
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Headline</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {news.map((newsItem) => (
                  <TableRow key={newsItem._id}>
                    <TableCell>{newsItem.headline}</TableCell>

                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: newsItem.description,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {newsItem.images?.length > 0 && (
                        <img
                          src={newsItem.images[0]}
                          alt={newsItem.headline}
                          style={{ width: "100px", height: "auto" }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box display="flex">
                        <Button onClick={() => handleOpen(newsItem)}>
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => handleDeleteOpen(newsItem)}
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" color="error" />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Create/Update News Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingNews ? "Edit News" : "Create News"}</DialogTitle>
        <DialogContent>
          <TextField
            name="headline"
            label="Headline"
            fullWidth
            margin="dense"
            value={formData.headline}
            onChange={handleChange}
          />

          {/* Jodit Editor for Description */}
          <JoditEditor
            value={formData.description}
            onChange={(newContent) =>
              setFormData((prev) => ({ ...prev, description: newContent }))
            }
            config={{
              readonly: false,
              placeholder: "Enter the description here...",
            }}
            style={{ marginTop: "10px" }}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editingNews ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this news item? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NewsPage;
