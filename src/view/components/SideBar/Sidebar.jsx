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
  Collapse,
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
  ExpandLess,
  ExpandMore,
  School,
  LocalHospital,
  Work,
  Wc,
  ChildCare,
  Public,
  Business,
  Favorite,
 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/Images/logo.png";

const Sidebar = ({ isMobile, drawerOpen, toggleDrawer }) => {
  const [activeParent, setActiveParent] = useState(null);
  const [programmesOpen, setProgrammesOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Events", icon: <Event />, path: "/events" },
    { text: "Gallery", icon: <PhotoLibrary />, path: "/gallery" },
    { text: "About Us", icon: <People />, path: "/aboutus" },
    { text: "Members", icon: <Groups />, path: "/members" },
    { text: "Supporter Speak", icon: <RecordVoiceOver />, path: "/supportspeak" },
    { text: "User Opinion", icon: <Comment />, path: "/useropinion" },
    { text: "Registration", icon: <AppRegistration />, path: "/registration" },
    { text: "Message", icon: <Chat />, path: "/message" },
    { text: "Contact Us", icon: <ContactPhone />, path: "/contactus" },
    {
      text: "Our Programmes",
      icon: <Business />, // Generic icon
      dropdown: true,
      children: [
        { text: "Education", icon: <School />, path: "/programmes/education" },
        { text: "Healthcare", icon: <LocalHospital />, path: "/programmes/healthcare" },
        { text: "Livelihood", icon: <Work />, path: "/programmes/livelihood" },
        { text: "Girl Child & Women Empowerment", icon: <Wc />, path: "/programmes/girl-child-women-empowerment" },
        { text: "Privileged Children", icon: <ChildCare />, path: "/programmes/privileged-children" },
        { text: "Civic-Driven Change", icon: <Public />, path: "/programmes/civic-driven-change" },
        { text: "Social Entrepreneurship", icon: <Business />, path: "/programmes/social-entrepreneurship" },
        { text: "Special Support Programme", icon: <Favorite />, path: "/programmes/special-support-programme" },
        { text: "Special Interventions", icon: <Favorite />, path: "/programmes/special-interventions" },
      ],
    },
  ];

  const handleParentClick = (index, item) => {
    if (item.dropdown) {
      setProgrammesOpen(!programmesOpen);
    } else {
      setActiveParent(index);
      navigate(item.path);
      if (isMobile) toggleDrawer();
    }
  };

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={toggleDrawer}
          sx={{ position: "absolute", top: "10px", left: "10px", zIndex: 1300 }}
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
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 68 }}>
          <img src={logo} alt="ATAL FOUNDATION Logo" style={{ maxWidth: "100%", maxHeight: "40px" }} />
        </Box>
        <Divider />

        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleParentClick(index, item)}
                sx={{
                  backgroundColor: activeParent === index ? "#eafaf1" : "transparent",
                  "&:hover": { backgroundColor: "#eafaf1" },
                }}
              >
                <ListItemIcon sx={{ color: activeParent === index ? "#FF7900" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.dropdown && (programmesOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {item.dropdown && (
                <Collapse in={programmesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, idx) => (
                      <ListItem button sx={{ pl: 4 }} key={idx} onClick={() => navigate(child.path)}>
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;