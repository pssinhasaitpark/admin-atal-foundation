import React, { useEffect, useState } from "react";
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
  Box,
  TablePagination,
} from "@mui/material";

function ContactUs() {
  const dispatch = useDispatch();
  const { contacts, loading, error } = useSelector((state) => state.contact);
  const [showLoader, setShowLoader] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // You can adjust this number

  useEffect(() => {
    dispatch(fetchContactData());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    setPage(0); // Reset to first page when rows per page change
  };

  const displayContacts = contacts.slice(
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
          {displayContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: "center", py: 3 }}>
                No contact inquiries found.
              </TableCell>
            </TableRow>
          ) : (
            displayContacts.map((contact) => {
              const isExpanded = expandedRows[contact._id];

              return (
                <TableRow
                  key={contact._id}
                  sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}
                >
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.contact_no}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: isExpanded ? "none" : 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "300px",
                        }}
                      >
                        {contact.enquiry}
                      </Typography>
                      {contact.enquiry.length > 150 && (
                        <Typography
                          onClick={() => toggleExpand(contact._id)}
                          sx={{
                            color: "primary.main",
                            ml: 1,
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "10px",
                          }}
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="center" width="100%" mt={2}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // You can customize these options
          component="div"
          count={contacts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableContainer>
  );
}

export default ContactUs;
