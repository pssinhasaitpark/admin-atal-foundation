import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import { History, Work, School, Star } from "@mui/icons-material";

const Dashboard = () => {
  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#333" }}
      >
        Admin Dashboard - Atal Bihari Vajpayee
      </Typography>

      {/* Overview Cards - Replacing Grid with Box Flex */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "space-between",
        }}
      >
        {[
          {
            title: "Prime Minister",
            value: "3 Terms",
            icon: <Work sx={{ fontSize: 40, color: "#ff9800" }} />,
          },
          {
            title: "Political Career",
            value: "50+ Years",
            icon: <History sx={{ fontSize: 40, color: "#4caf50" }} />,
          },
          {
            title: "Books & Poems",
            value: "10+",
            icon: <School sx={{ fontSize: 40, color: "#2196f3" }} />,
          },
          {
            title: "Awards",
            value: "Bharat Ratna, Padma Vibhushan",
            icon: <Star sx={{ fontSize: 40, color: "#e91e63" }} />,
          },
        ].map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 calc(25% - 24px)",
              minWidth: "220px",
              boxShadow: 5,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: "white",
            }}
          >
            <CardContent>
              {item.icon}
              <Typography variant="h6" sx={{ mt: 1 }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Biography Section */}
      <Paper
        sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
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
        sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
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

      {/* Political Career Timeline */}
      <Paper
        sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Political Career Timeline
        </Typography>
        <List>
          {[
            { year: "1996", event: "First Term as Prime Minister (13 days)" },
            {
              year: "1998-2004",
              event: "Second & Third Term as Prime Minister",
            },
            { year: "1977-1979", event: "Minister of External Affairs" },
            { year: "1980", event: "BJP Co-Founder & First President" },
            { year: "1957", event: "Elected to Lok Sabha for the First Time" },
          ].map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={item.event} secondary={item.year} />
              </ListItem>
              {index < 4 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Policies Section */}
      <Paper
        sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: "white", boxShadow: 3 }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Major Policies
        </Typography>
        <List>
          {[
            "Pradhan Mantri Gram Sadak Yojana",
            "Sarva Shiksha Abhiyan",
            "National Highway Development Project",
            "Prevention of Terrorism Act (2002)",
            "Economic Liberalization",
          ].map((policy, index) => (
            <ListItem key={index}>
              <ListItemText primary={policy} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard;
