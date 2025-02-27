import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Event,
  PhotoLibrary,
  PersonAdd,
  Chat,
  ContactPhone,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandLess,
  ExpandMore,
  Business,
  Subscriptions,
  ConnectWithoutContact,
} from "@mui/icons-material";
import logo from "../../../assets/Images/logo.png";

const Sidebar = ({ isMobile, drawerOpen, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);
  const [programmesOpen, setProgrammesOpen] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Events", icon: <Event />, path: "/events" },
    { text: "Gallery", icon: <PhotoLibrary />, path: "/gallery" },
    { text: "About Us", icon: <PersonAdd />, path: "/aboutus" },
    { text: "Our Programmes", icon: <Business />, path: "/ourProgrammes" },
    { text: "Subscribers", icon: <Subscriptions />, path: "/subscribers" },
    { text: "Contact Enquires", icon: <ContactPhone />, path: "/contactus" },
    { text: "Message", icon: <Chat />, path: "/message" },
    {
      text: "Social Media",
      icon: <ConnectWithoutContact />,
      path: "/socialMedia",
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = menuItems.findIndex((item) =>
      currentPath.startsWith(item.path)
    );

    if (currentPath === "/") {
      setActiveParent(0);
      navigate("/dashboard");
    } else {
      setActiveParent(activeIndex !== -1 ? activeIndex : null);
    }
  }, [location.pathname, navigate]);

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 68,
          }}
        >
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="ATAL FOUNDATION Logo"
              style={{ maxWidth: "100%", maxHeight: "65px", cursor: "pointer" }}
            />
          </Link>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleParentClick(index, item)}
                sx={{
                  backgroundColor:
                    activeParent === index ? "#eafaf1" : "transparent",
                  "&:hover": { backgroundColor: "#eafaf1" },
                }}
              >
                <ListItemIcon
                  sx={{ color: activeParent === index ? "#FF7900" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.dropdown &&
                  (programmesOpen ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {item.dropdown && (
                <Collapse in={programmesOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child, idx) => (
                      <ListItem
                        button
                        sx={{ pl: 4 }}
                        key={idx}
                        onClick={() => navigate(child.path)}
                      >
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
