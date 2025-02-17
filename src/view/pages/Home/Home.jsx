import React, { useState } from "react";
import JoditEditor from "jodit-react";

const Home = () => {
  const [editorContent, setEditorContent] = useState("");

  // Handler to send editor content
  const handleSubmit = () => {
    // In this example, we log the content to the console.
    // In a real-world scenario, you might want to send this to an API.
    console.log("Submitted Content (HTML):", editorContent);

    // Example of sending to a server using fetch (this is just an example):
    // fetch('/api/submit', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ content: editorContent }),
    // })
    //   .then(response => response.json())
    //   .then(data => console.log("Response:", data))
    //   .catch(error => console.error("Error:", error));
  };

  return (
    <>
      <h1>Home</h1>

      <JoditEditor
        value={editorContent}
        onChange={setEditorContent}
        config={{
          readonly: false, // Set to true for readonly mode
          placeholder: "Start writing here...",
        }}
        style={{ width: "100%", minHeight: "300px" }}
      />

      {/* Submit Button */}
      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Submit
      </button>
    </>
  );
};

export default Home;
