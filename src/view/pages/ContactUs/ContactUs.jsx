import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactData } from "../../redux/slice/contactusSlice";
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

function ContactUs() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(fetchContactData());
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
      sx={{ mt: 3, boxShadow: 3, borderRadius: 2, overflow: "hidden" }}
    >
      <Typography
        variant="h6"
        sx={{ p: 2, textAlign: "left", fontWeight: "bold" }}
      >
        Contact Inquiries
      </Typography>

      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact No.</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Messages</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                No contact inquiries found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow
                key={contact._id}
                sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
              >
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.contact_no}</TableCell>
                <TableCell>{contact.enquiry}</TableCell>
                <TableCell>
                  {new Date(contact.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ContactUs;
