import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/slice/messageSlice";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@mui/material";

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.message);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000); // Ensure loader runs for at least one full round

    return () => clearTimeout(timer);
  }, []);

  if (loading || showLoader)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: 0, borderRadius: 0, overflow: "hidden" }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Messages
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ p: 2 }}>
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow
                key={msg._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>{msg.message}</TableCell>
                <TableCell>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Messages;
