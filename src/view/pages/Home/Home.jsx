import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { Box, Typography, Button } from "@mui/material";

const Home = () => {
  const editor = useRef(null);
  const [editorContent, setEditorContent] = useState("");

  // Handler to send editor content
  const handleSubmit = () => {
    console.log("Submitted Content (HTML):", editorContent);
  };

  return (
    <Box >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Home
      </Typography>

      <JoditEditor
        ref={editor}
        value={editorContent}
        onChange={(content) => setEditorContent(content)}
        config={{
          readonly: false, // Set to true for readonly mode
          placeholder: "Start writing here...",
        }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Home;
