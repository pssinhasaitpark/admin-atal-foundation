import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import JoditEditor from "jodit-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAboutData, saveAboutDataToBackend } from "../../redux/slice/aboutSlice";

const AboutUs = () => {
  const dispatch = useDispatch();
  const aboutData = useSelector((state) => state.about.data) || [];
  const editor = useRef(null);

  const [sections, setSections] = useState([]);
  const [newEntries, setNewEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchAboutData());
  }, [dispatch]);

  useEffect(() => {
    if (aboutData.length > 0) {
      setSections(aboutData);
    }
  }, [aboutData]);

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  const handleDeleteClick = (index, type) => {
    if (type === "existing") {
      setSections(sections.filter((_, i) => i !== index));
    } else {
      setNewEntries(newEntries.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, key, value, type) => {
    const updateList = type === "existing" ? [...sections] : [...newEntries];
    updateList[index][key] = value;
    type === "existing" ? setSections(updateList) : setNewEntries(updateList);
  };

  const handleImageUpload = (index, event, type) => {
    const files = Array.from(event.target.files).map((file) => URL.createObjectURL(file));
    const updateList = type === "existing" ? [...sections] : [...newEntries];
    updateList[index].image = [...(updateList[index].image || []), ...files];
    type === "existing" ? setSections(updateList) : setNewEntries(updateList);
  };

  const handleImageRemove = (sectionIndex, imageIndex, type) => {
    const updateList = type === "existing" ? [...sections] : [...newEntries];
    updateList[sectionIndex].image.splice(imageIndex, 1);
    type === "existing" ? setSections(updateList) : setNewEntries(updateList);
  };

  const handleSaveAll = async () => {
    const updatedList = [...sections, ...newEntries];
    setSections(updatedList);
    setNewEntries([]);
    await dispatch(saveAboutDataToBackend({ id: aboutData[0]?._id, aboutData: { data: updatedList } }));
    setEditingIndex(null);
  };

  const handleSaveEdit = () => {
    setEditingIndex(null);
  };

  const handleAddNew = () => {
    setNewEntries([...newEntries, { heading: "", description: "", image: [] }]);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>About Us</Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Existing Data</Typography>
        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">{section.heading}</Typography>
              <Stack direction="row" spacing={1}>
                {editingIndex === index ? (
                  <Button variant="contained" onClick={() => handleSaveEdit(index)}>Save</Button>
                ) : (
                  <IconButton onClick={() => handleEditClick(index)}><EditIcon /></IconButton>
                )}
                <IconButton onClick={() => handleDeleteClick(index, "existing")}><DeleteIcon color="error" /></IconButton>
              </Stack>
            </Stack>
            {editingIndex === index && (
              <Box sx={{ mt: 2 }}>
                <TextField fullWidth label="Heading" value={section.heading} onChange={(e) => handleInputChange(index, "heading", e.target.value, "existing")} sx={{ mb: 2 }} />
                <JoditEditor ref={editor} value={section.description} onChange={(newContent) => handleInputChange(index, "description", newContent, "existing")} />
                <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(index, e, "existing")} />
                <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", mt: 2 }}>
                  {section.image?.map((img, imgIndex) => (
                    <Box key={imgIndex}>
                      <Avatar src={img} sx={{ width: 100, height: 100 }} />
                      <IconButton onClick={() => handleImageRemove(index, imgIndex, "existing")}><DeleteIcon color="error" /></IconButton>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        ))}
        
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>New Data</Typography>
        {newEntries.map((entry, index) => (
          <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
            <TextField fullWidth label="Heading" value={entry.heading} onChange={(e) => handleInputChange(index, "heading", e.target.value, "new")} sx={{ mb: 2 }} />
            <JoditEditor ref={editor} value={entry.description} onChange={(newContent) => handleInputChange(index, "description", newContent, "new")} />
            <input type="file" multiple accept="image/*" onChange={(e) => handleImageUpload(index, e, "new")} />
          </Box>
        ))}
        
        <IconButton onClick={handleAddNew}><AddIcon /></IconButton>
        <Button variant="contained" onClick={handleSaveAll}><SaveIcon /> Save All</Button>
      </Paper>
    </Box>
  );
};

export default AboutUs;
