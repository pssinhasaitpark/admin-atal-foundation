import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubscribers } from "../../redux/slice/subscribersSlice"; // Import the action
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
  Box,
} from "@mui/material";

function Subscribers() {
  const dispatch = useDispatch();
  const {
    data: subscribers,
    loading,
    error,
  } = useSelector((state) => state.subscribers);
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    dispatch(fetchSubscribers());
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

  if (!Array.isArray(subscribers) || subscribers.length === 0)
    return (
      <Typography align="center" mt={4}>
        No subscribers found.
      </Typography>
    );

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: "95%", // ✅ Shrinks width
        // margin: "auto", // ✅ Centers it
        overflowX: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Subscribers
      </Typography>
      <Table sx={{ width: "100%" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              S.No.
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Email
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscribers.map((subscriber, index) => (
            <TableRow
              key={subscriber._id}
              sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{subscriber.email}</TableCell>
              <TableCell>
                {new Date(subscriber.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Subscribers;
