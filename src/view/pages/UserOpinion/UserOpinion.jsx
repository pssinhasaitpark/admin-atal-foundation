import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOpinions, saveUserOpinions } from "../../redux/slice/userOpinionSlice";

const UserOpinion = () => {
  const dispatch = useDispatch();
  const userOpinionData = useSelector((state) => state.userOpinion) || {};
  const [title, setTitle] = useState("User Opinions");
  const [opinions, setOpinions] = useState([]);
  const [newOpinion, setNewOpinion] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    dispatch(fetchUserOpinions());
  }, [dispatch]);

  useEffect(() => {
    if (userOpinionData) {
      setTitle(userOpinionData.title || "User Opinions");
      setOpinions(userOpinionData.opinions || []);
    }
  }, [userOpinionData]);

  const handleAddOpinion = () => {
    if (newOpinion.trim() !== "") {
      setOpinions([...opinions, newOpinion.trim()]);
      setNewOpinion("");
    }
  };

  const handleDeleteOpinion = (index) => {
    setOpinions(opinions.filter((_, i) => i !== index));
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    if (isEditable) {
      const userOpinionsToSend = {
        title,
        opinions,
      };

      try {
        await dispatch(
          saveUserOpinions({
            id: userOpinionData._id,
            userOpinions: userOpinionsToSend,
          })
        );
      } catch (error) {
        console.error("Error saving/updating data: ", error);
      }
    }

    setIsEditable(!isEditable);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        {title}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleEditSave}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditable}
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 2 }}>
            User Opinions
          </Typography>

          <List>
            {opinions.map((opinion, index) => (
              <ListItem key={index} sx={{ borderBottom: "1px solid #ddd" }}>
                <ListItemText primary={opinion} />
                {isEditable && (
                  <IconButton onClick={() => handleDeleteOpinion(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>

          {isEditable && (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Add Opinion"
                value={newOpinion}
                onChange={(e) => setNewOpinion(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddOpinion}>
                Add
              </Button>
            </Box>
          )}

          <Button type="submit" variant="contained" sx={{ mt: 3 }}>
            {isEditable ? "Save" : "Edit"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default UserOpinion;
