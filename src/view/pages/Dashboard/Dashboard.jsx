import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSubscribersCount,
  fetchInquiriesCount,
  fetchMessagesCount,
  fetchEventsCount,
} from "../../redux/slice/dashboardSlice";
import {
  Box,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { History, Email, Event, People } from "@mui/icons-material";
import banner from "../../../assets/Images/BannerImg.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    totalSubscribers,
    totalInquiries,
    totalMessages,
    totalEvents,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSubscribersCount());
    dispatch(fetchInquiriesCount());
    dispatch(fetchMessagesCount());
    dispatch(fetchEventsCount());
  }, [dispatch]);

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 4 }}>
      {/* Banner Image */}
      <Box
        sx={{
          width: "100%",
          height: 350,
          backgroundImage: `url(${banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", p: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#333" }}>
          Admin Dashboard - Atal Bihari Vajpayee
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mx: 4, mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      {/* Dynamic Stats Section */}
      <Box sx={{ px: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {[
            {
              title: "Total Subscribers",
              value: totalSubscribers,
              icon: <People sx={{ fontSize: 40, color: "#ff9800" }} />,
            },
            {
              title: "Total Inquiries",
              value: totalInquiries,
              icon: <Email sx={{ fontSize: 40, color: "#4caf50" }} />,
            },
            {
              title: "Total Messages",
              value: totalMessages,
              icon: <History sx={{ fontSize: 40, color: "#2196f3" }} />,
            },
            {
              title: "Total Events & Programs",
              value: totalEvents,
              icon: <Event sx={{ fontSize: 40, color: "#e91e63" }} />,
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ textAlign: "center", p: 3, boxShadow: 3 }}>
                {item.icon}
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {loading ? <CircularProgress size={24} /> : item.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Biography Section */}
      <Paper
        sx={{ p: 4, mx: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Biography
        </Typography>
        <Typography color="textSecondary">
          Atal Bihari Vajpayee (25 December 1924 – 16 August 2018) was an Indian
          politician, poet, and statesman who served as the Prime Minister of
          India for three terms. He was one of the co-founders of the Bharatiya
          Janata Party (BJP) and a member of the Rashtriya Swayamsevak Sangh
          (RSS). He was awarded the Bharat Ratna, India's highest civilian
          award, in 2015.
        </Typography>
      </Paper>

      {/* Key Achievements */}
      <Paper
        sx={{
          p: 4,
          mx: 4,
          mt: 4,
          borderRadius: 3,
          bgcolor: "white",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Key Achievements
        </Typography>
        <List>
          {[
            "Pokhran-II Nuclear Tests (1998)",
            "Golden Quadrilateral Highway Project",
            "Lahore Summit",
            "First PM to speak in Hindi at UN",
            "Economic Reforms & Privatization",
          ].map((achievement, index) => (
            <ListItem key={index}>
              <ListItemText primary={achievement} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;
