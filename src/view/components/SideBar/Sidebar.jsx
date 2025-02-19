import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  Home,
  Event,
  PhotoLibrary,
  People,
  Groups,
  RecordVoiceOver,
  Comment,
  AppRegistration,
  Chat,
  ContactPhone,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

const Sidebar = () => {
  const [activeParent, setActiveParent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Events", icon: <Event />, path: "/events" },
    { text: "Gallery", icon: <PhotoLibrary />, path: "/gallery" },
    { text: "People Behind", icon: <People />, path: "/peoplebehind" },
    { text: "Members", icon: <Groups />, path: "/members" },
    {
      text: "Supporter Speak",
      icon: <RecordVoiceOver />,
      path: "/supportspeak",
    },
    { text: "User Opinion", icon: <Comment />, path: "/useropinion" },
    { text: "Registration", icon: <AppRegistration />, path: "/registration" },
    { text: "Message", icon: <Chat />, path: "/message" },
    { text: "Contact Us", icon: <ContactPhone />, path: "/contactus" },
  ];

  const handleParentClick = (index, item) => {
    setActiveParent(index);
    if (item.path) {
      navigate(item.path);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            top: "10px",
            zIndex: 1300,
            right: drawerOpen ? "10px" : "inherit",
            left: drawerOpen ? "inherit" : "10px",
          }}
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        anchor="left"
        open={isMobile ? drawerOpen : true}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="textSecondary">
            ATAL FOUNDATION अटल फाऊण्डेशन
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleParentClick(index, item)}
              sx={{
                backgroundColor:
                  activeParent === index ? "#eafaf1" : "transparent",
                "&:hover": { backgroundColor: "#eafaf1" },
              }}
            >
              <ListItemIcon
                sx={{
                  color: activeParent === index ? "#3bb77e" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
