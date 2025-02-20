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
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.message);

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  if (loading)
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
      <Alert severity="error" sx={{ margin: "20px" }}>
        {error}
      </Alert>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}
    >
      <Typography
        variant="h5"
        sx={{ p: 2, textAlign: "center", fontWeight: "bold" }}
      >
        Messages
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Name
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Email
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Message
            </TableCell>
            <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
              Created At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((msg) => (
              <TableRow
                key={msg._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}
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
