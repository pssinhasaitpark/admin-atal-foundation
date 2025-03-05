import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNews } from "../../redux/slice/newsPageSlice"; // Adjust the import path as necessary
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const NewsPage = () => {
  const dispatch = useDispatch();
  const { news, loading, error } = useSelector((state) => state.news); // Adjust the state path as necessary

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  // Defensive check to ensure news is an array
  if (!Array.isArray(news) || news.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6">No news available</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xlg" sx={{ p: 0 }}>
      <Typography variant="h4" gutterBottom>
        News
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Headline</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((newsItem) => (
              <TableRow key={newsItem._id}>
                <TableCell>{newsItem.headline}</TableCell>
                <TableCell>{newsItem.description}</TableCell>
                <TableCell>
                  {newsItem.images.length > 0 && (
                    <img
                      src={newsItem.images[0]} // Display the first image
                      alt={newsItem.headline}
                      style={{ width: "100px", height: "auto" }} // Adjust size as needed
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default NewsPage;
