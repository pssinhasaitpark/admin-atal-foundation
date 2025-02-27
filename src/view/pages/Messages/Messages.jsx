import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages } from "../../redux/slice/messageSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;

  if (error)
    return (
      <Alert severity="error" sx={{ margin: "20px", textAlign: "center" }}>
        {error}
      </Alert>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, boxShadow: 2, borderRadius: 2, overflow: "hidden" }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Messages
      </Typography>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
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
                  {new Date(msg.createdAt).toLocaleString()}
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
