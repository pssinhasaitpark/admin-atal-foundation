import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import logo from "../../../assets/Images/logo.png";

const Sidebar = ({ isMobile, drawerOpen, toggleDrawer }) => {
  const [activeParent, setActiveParent] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
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
      if (isMobile) toggleDrawer(); // Close drawer in mobile view
    }
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1300,
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
          width: { xs: "75%", sm: 240 },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: { xs: "75%", sm: 240 },
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 68,
          }}
        >
          <img
            src={logo}
            alt="ATAL FOUNDATION Logo"
            style={{ maxWidth: "100%", maxHeight: "40px" }}
          />
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
                  color: activeParent === index ? "#FF7900" : "inherit",
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
