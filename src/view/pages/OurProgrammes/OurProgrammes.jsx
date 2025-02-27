import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import JoditEditor from "jodit-react";

const categories = [
  "Education",
  "Health",
  "Environment",
  "Women Empowerment",
  "Child Welfare",
];

const exampleData = {
  Education: [
    {
      id: 1,
      title: "Educating Rural India: A Step Towards a Brighter Future",
      description:
        "India’s rapid economic growth has transformed urban landscapes, but rural areas continue to struggle with poverty and a lack of basic education. The disparity between urban and rural education is a major challenge, with millions of children in villages unable to access proper schooling. Despite the government’s vision for Universal Compulsory Primary Education, challenges such as poverty, lack of infrastructure, and the need for child labor prevent many children from receiving an education.Without basic education, these children remain trapped in a cycle of hard labor and low wages, limiting their opportunities for a better future. Education is the key to breaking this cycle, and ATAL FOUNDATION is committed to making quality education accessible to every child in rural India.ATAL FOUNDATION’s Mission for Rural EducationAt ATAL FOUNDATION, we believe that education is a fundamental right and a powerful tool for social change. Our primary mission is to educate thousands of village children who grow up illiterate, empowering them with knowledge and skills that will enable them to lead better lives.To achieve this, we are launching the Village Model School—a pilot initiative that will create a sustainable, high-quality education system tailored for rural communities.",
      image: "",
    },
    {
      id: 2,
      title: "Village Model School: Transforming Rural Education",
      description:
        "The Village Model School is designed to provide primary and secondary education following the National Open School syllabus, ensuring that children receive a recognized and standardized curriculum.Key Focus Areas✔ Technology & Sciences: Introducing children to modern technology and scientific concepts.Hands-on learning experiences to spark curiosity and innovation.Digital literacy programs to prepare students for the future.✔ Health and Hygiene: Educating students on personal hygiene and sanitation.Awareness programs on nutrition, wellness, and preventive healthcare.Regular health check-ups and medical support.✔ Extra-Curricular Activities: Encouraging creativity through art, music, and drama.Skill-based programs to develop confidence and communication abilities.Exposure to new ideas through workshops and community projects.✔ Sports and Games: Promoting physical fitness and team spirit.Access to sports facilities and professional coaching.Opportunities to participate in inter-school competitions.",
      image: "",
    },
  ],
  Health: [
    {
      id: 1,
      title: "Empowering Lives Through Quality Healthcare",
      description:
        "Street and Working Children live and work in extremely unhygienic conditions making them prone to severe skin conditions like scabies. At the same time, as these children live and work on the streets they are susceptible to physical injuries, which often left untreated leads to impairment of body parts. One can see a high incidence of substance use among the children and they are also susceptible to sexually transmitted infections thereby making them fall in the high-risk category of people who could be exposed to HIV. Thus to reduce the problems faced by children and at the same time also create awareness amongst them about hygiene and nutrition, the health care programme was started by Atal Foundation in 2011.ObjectivesTo provide both curative and preventive treatment accessible to the children directly on the streetTo form health cooperative of the children and to empower them to have ownership of the health projectTo increase the awareness level of the children in terms of their health needsTo establish a cadre of child health educatorsPropagating the concept of health cooperative at community and grass root level for collective action in the field of healthTo network with the health professionals in the city as well as the government health care institutionsAdvocate for change in policies on health issues at central, state and local levels, which has direct bearing on children's lives",
    },
  ],
  Livelihood: [
    {
      id: 1,
      title: "Livelihood: Empowering Communities, Transforming Lives",
      description:
        "At ATAL FOUNDATION, we believe that sustainable livelihoods are the key to breaking the cycle of poverty and fostering self-reliance. Our mission is to create opportunities that enable individuals, especially in rural and underprivileged communities, to earn a dignified living through skill development, entrepreneurship, and employment support.Our Approach to Livelihood DevelopmentSkill Development & Vocational TrainingWe provide hands-on training in various trades, including agriculture, handicrafts, tailoring, digital literacy, and more, equipping individuals with market-relevant skills for better employment opportunities.Entrepreneurship & Small Business SupportWe encourage self-employment by offering financial literacy programs, mentorship, and access to micro-financing, helping individuals start and sustain their businesses.Empowering Women & YouthSpecial focus is given to women and youth, ensuring they have equal access to resources, training, and employment, making them active contributors to their families and communities.Sustainable & Rural Livelihood InitiativesWe promote eco-friendly practices such as organic farming, dairy farming, and other sustainable income-generation activities that contribute to environmental conservation and economic growth.",
    },
  ],
};

const OurProgrammesAdmin = () => {
  const [selectedCategory, setSelectedCategory] = useState("Education");
  const [programmes, setProgrammes] = useState(exampleData["Education"] || []);
  const [newProgramme, setNewProgramme] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Handle Category Change
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setProgrammes(exampleData[category] || []);
  };

  // Add or Update Programme
  const handleSaveProgramme = () => {
    if (!newProgramme.title || !newProgramme.description) return;

    if (editingId !== null) {
      setProgrammes((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...newProgramme } : p))
      );
      setEditingId(null);
    } else {
      setProgrammes((prev) => [...prev, { id: Date.now(), ...newProgramme }]);
    }

    setNewProgramme({ title: "", description: "", image: "" });
  };

  // Edit Programme
  const handleEditProgramme = (programme) => {
    setNewProgramme(programme);
    setEditingId(programme.id);
  };

  // Delete Programme
  const handleDeleteProgramme = (id) => {
    setProgrammes((prev) => prev.filter((p) => p.id !== id));
  };

  // Toggle Description View
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 2, fontWeight: "bold" }}>
        Our Programmes Admin
      </Typography>

      {/* Category Selector */}
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        displayEmpty
        fullWidth
        sx={{ mb: 3 }}
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>

      {/* CRUD Form */}
      <Box mb={3} p={2} sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
        <Typography variant="h6">Add / Edit Programme</Typography>
        <TextField
          fullWidth
          label="Title"
          value={newProgramme.title}
          onChange={(e) =>
            setNewProgramme({ ...newProgramme, title: e.target.value })
          }
          sx={{ mt: 2 }}
        />
        <JoditEditor
          value={newProgramme.description}
          onChange={(content) =>
            setNewProgramme({ ...newProgramme, description: content })
          }
          config={{
            placeholder: "Enter programme description...",
            minHeight: 200,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSaveProgramme}
          sx={{
            mt: 2,
            backgroundColor: "#F68633",
            "&:hover": { backgroundColor: "#e0752d" },
          }}
        >
          {editingId ? "Update Programme" : "Add Programme"}
        </Button>
      </Box>

      {/* Programmes List */}
      <List>
        {programmes.map((programme) => {
          const isExpanded = expandedId === programme.id;
          const shortDescription =
            programme.description.length > 100
              ? programme.description.substring(0, 100) + "..."
              : programme.description;

          return (
            <React.Fragment key={programme.id}>
              <ListItem
                alignItems="flex-start"
                sx={{ display: "flex", gap: 2 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6">{programme.title}</Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                          __html: isExpanded
                            ? programme.description
                            : shortDescription,
                        }}
                        sx={{ whiteSpace: "pre-line", wordWrap: "break-word" }}
                      />
                      {programme.description.length > 100 && (
                        <Button
                          onClick={() => toggleExpand(programme.id)}
                          size="small"
                          sx={{ textTransform: "none", mt: 1 }}
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </Button>
                      )}
                    </>
                  }
                  sx={{ pr: 5 }} // Adds right padding to separate text from icons
                />
                <ListItemSecondaryAction sx={{ ml: 3 }}>
                  <IconButton onClick={() => handleEditProgramme(programme)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteProgramme(programme.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default OurProgrammesAdmin;
