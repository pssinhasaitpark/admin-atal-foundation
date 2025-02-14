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
  Collapse,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  RateReview,
  Info,
  OtherHouses,
  VolunteerActivism,
  BarChart,
  Settings,
  Label,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
} from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

const Sidebar = () => {
  const [activeParent, setActiveParent] = useState(null);
  const [activeChild, setActiveChild] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },

    {
      text: "Home",
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      text: "About Us",
      icon: <Info />,
      path: "/aboutus",
      subItems: [
        { text: "Our Soul", path: "/aboutus/our-soul" },
        { text: "Our Presence", path: "/aboutus/our-presence" },
        { text: "People Behind", path: "/aboutus/people-behind" },
      ],
    },
    { text: "Vision", icon: <RateReview />, path: "/vision" },
    { text: "Mission", icon: <BarChart />, path: "/mission" },
    {
      text: "Our Programmes",
      icon: <VolunteerActivism />,
      path: "/programmes",
      subItems: [
        { text: "Education", path: "/programmes/education" },
        { text: "Healthcare", path: "/programmes/healthcare" },
        { text: "Livelihood", path: "/programmes/livelihood" },
        {
          text: "Girl Child & Women Empowerment",
          path: "/programmes/empowerment",
        },
        {
          text: "Privileged Children",
          path: "/programmes/privileged-children",
        },
        { text: "Outreach", path: "/programmes/outreach" },
        {
          text: "Civic Driven Change",
          path: "/programmes/civic-driven-change",
        },
        {
          text: "Social Entrepreneurship",
          path: "/programmes/social-entrepreneurship",
        },
        {
          text: "Special Support Programme",
          path: "/programmes/support-programme",
        },
        {
          text: "Special Interventions",
          path: "/programmes/special-interventions",
        },
      ],
    },
    {
      text: "Get Involved",
      icon: <OtherHouses />,
      path: "/involved",
      subItems: [
        { text: "Registration", path: "/involved/registration" },
        { text: "Members", path: "/involved/members" },
        { text: "Supporters Speak", path: "/involved/supporters-speak" },
      ],
    },
    { text: "Gallery", icon: <BarChart />, path: "/gallery" },
    { text: "Message", icon: <BarChart />, path: "/message" },
  ];

  const settingsItems = [
    { text: "Setting Sample 1", path: "/settings/setingsample1" },
    { text: "Setting Sample 2", path: "/settings/setingsample1" },
  ];

  const handleParentClick = (index, item) => {
    setActiveParent(index);
    setActiveChild(null);
    setExpandedIndex(expandedIndex === index ? null : index);

    if (item.path) {
      navigate(item.path);
    }
  };

  const handleChildClick = (parentIndex, childIndex, childItem) => {
    setActiveParent(parentIndex);
    setActiveChild(`${parentIndex}-${childIndex}`);
    if (childItem.path) {
      navigate(childItem.path);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSettingsClick = () => {
    setSettingsOpen(!settingsOpen);
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
          <MenuIcon />
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
          <Typography variant="h6" sx={{ fontWeight: "bold" }}></Typography>
          <Typography variant="body2" color="textSecondary">
            ATAL FOUNDATION अटल फाऊण्डेशन
          </Typography>
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
                  sx={{
                    color: activeParent === index ? "#3bb77e" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: activeParent === index ? "#3bb77e" : "inherit",
                      fontWeight: activeParent === index ? "bold" : "normal",
                    },
                  }}
                />
                {item.subItems &&
                  (expandedIndex === index ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem
                        button
                        key={`${index}-${subIndex}`}
                        onClick={() =>
                          handleChildClick(index, subIndex, subItem)
                        }
                        sx={{
                          pl: 6,
                          backgroundColor:
                            activeChild === `${index}-${subIndex}`
                              ? "#eafaf1"
                              : "transparent",
                          "&:hover": { backgroundColor: "#eafaf1" },
                        }}
                      >
                        <ListItemText
                          primary={subItem.text}
                          sx={{
                            "& .MuiTypography-root": {
                              color:
                                activeChild === `${index}-${subIndex}`
                                  ? "#3bb77e"
                                  : "inherit",
                              fontWeight:
                                activeChild === `${index}-${subIndex}`
                                  ? "bold"
                                  : "normal",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem
            button
            onClick={handleSettingsClick}
            sx={{
              backgroundColor: settingsOpen ? "#eafaf1" : "transparent",
              "&:hover": { backgroundColor: "#eafaf1" },
            }}
          >
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                "& .MuiTypography-root": {
                  color: settingsOpen ? "#3bb77e" : "inherit",
                  fontWeight: settingsOpen ? "bold" : "normal",
                },
              }}
            />
            {settingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() =>
                    handleParentClick(menuItems.length + index, item)
                  }
                  sx={{
                    pl: 2,
                    backgroundColor:
                      activeParent === menuItems.length + index
                        ? "#eafaf1"
                        : "transparent",
                    "&:hover": { backgroundColor: "#eafaf1" },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      "& .MuiTypography-root": {
                        color:
                          activeParent === menuItems.length + index
                            ? "#3bb77e"
                            : "inherit",
                        fontWeight:
                          activeParent === menuItems.length + index
                            ? "bold"
                            : "normal",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>

          <ListItem
            button
            onClick={() =>
              handleParentClick(
                menuItems.length + settingsItems.length,
                settingsItems[1]
              )
            }
            sx={{
              backgroundColor:
                activeParent === menuItems.length + settingsItems.length
                  ? "#eafaf1"
                  : "transparent",
              "&:hover": { backgroundColor: "#eafaf1" },
            }}
          >
            <ListItemIcon>
              <Label />
            </ListItemIcon>
            <ListItemText
              primary="Starter Page"
              sx={{
                "& .MuiTypography-root": {
                  color:
                    activeParent === menuItems.length + settingsItems.length
                      ? "#3bb77e"
                      : "inherit",
                  fontWeight:
                    activeParent === menuItems.length + settingsItems.length
                      ? "bold"
                      : "normal",
                },
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
