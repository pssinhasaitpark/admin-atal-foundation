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
  IconButton,
  TablePagination,
} from "@mui/material";

function Messages() {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.message);
  const [showLoader, setShowLoader] = useState(true);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust this number

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayMessages = messages.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
          {displayMessages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ p: 2 }}>
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            displayMessages.map((msg) => (
              <TableRow
                key={msg._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
              >
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell>
                  {msg.message.length > 100 ? (
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: expandedRows[msg._id] ? "none" : 3,
                          WebkitBoxOrient: "vertical",
                          display: "-webkit-box",
                        }}
                      >
                        {msg.message}
                      </Typography>
                      <IconButton
                        onClick={() => toggleExpand(msg._id)}
                        sx={{
                          color: "primary.main",
                          ml: 1,
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "10px",
                        }}
                      >
                        {expandedRows[msg._id] ? "Show Less" : "Show More"}
                      </IconButton>
                    </Box>
                  ) : (
                    msg.message
                  )}
                </TableCell>
                <TableCell>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" width="100%" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={messages.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

export default Messages;
