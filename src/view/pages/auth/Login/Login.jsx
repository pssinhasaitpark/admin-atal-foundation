import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slice/authslice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useLogin } from "../../../Hooks/useLogin";

import logo from "../../../../assets/Images/logo.png";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useLogin();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const initialValues = { email: "", password: "" };

  const handleSubmit = async (values) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        const { encryptedToken, user_role } = data;

        // console.log("Login Success Data:", data);
        // console.log("User Role:", user_role);

        dispatch(setUser({ token: encryptedToken, userRole: user_role }));

        localStorage.setItem("token", encryptedToken);
        localStorage.setItem("userRole", user_role);

        if (
          user_role &&
          (user_role === "admin" || user_role === "super-admin")
        ) {
          toast.success("Login Successful!", { position: "top-right" });
          setTimeout(() => navigate("/"), 1500);
        } else {
          toast.error("Access denied! Only admins can log in.", {
            position: "top-right",
          });
        }
      },
      onError: () => {
        toast.error("Invalid credentials! Please try again.", {
          position: "top-right",
        });
      },
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "background.paper" }}
    >
      <ToastContainer />
      <Box
        component="div"
        boxShadow={3}
        p={4}
        width="100%"
        maxWidth="400px"
        sx={{ borderRadius: 2 }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
          {/* Logo Image */}
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "150px", maxHeight: "150px" }}
          />
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          Admin Login
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <Box mb={2}>
                <Field
                  as={TextField}
                  name="email"
                  type="email"
                  label="Email"
                  fullWidth
                  variant="outlined"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>

              <Box mb={2}>
                <Field
                  as={TextField}
                  name="password"
                  type="password"
                  label="Password"
                  fullWidth
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#3bb77e",
                  "&:hover": { backgroundColor: "#34a768" },
                }}
                disabled={loginMutation.isLoading}
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}

export default Login;
