import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { Email, Person, Edit } from "@mui/icons-material";

const Profile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{ width: 90, height: 90, margin: "auto", mb: 2 }}
          src="https://via.placeholder.com/150"
          alt="User Avatar"
        />

        <CardContent>
          {/* Name */}
          <Typography
            variant="h5"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Person fontSize="small" />
            Admin
          </Typography>

          {/* Email */}
          <Typography
            variant="body1"
            color="text.secondary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            mt={1}
          >
            <Email fontSize="small" />
            admin@parkhya.net
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Edit Profile Button */}
          <Button
            variant="contained"
            startIcon={<Edit />}
            sx={{
              mt: 1,
              textTransform: "none",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
