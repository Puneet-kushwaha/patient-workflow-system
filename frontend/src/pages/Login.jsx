import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  InputAdornment
} from "@mui/material";
import { post } from "../utils/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {data} = await post("/login", { email, password });

      if (data.user.role === "Admin") {
        navigate("/admin/doctors");
      } else if (data.user.role === "Patient") {
        navigate("/doctors");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <Grid container sx={{ minHeight: "100vh" }} alignItems={"center"}>
          <Grid xs={7} style={{
            backgroundImage: `url(/images/doctor-bg.jpg)`,
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}></Grid>
          <Grid xs={5} className={""}>
            <div className={"text-center"}>
              <img
                  className={"mb-3"}
                  style={{
                    width: "170px",
                    height: "50px"
                  }}
                  src={"/images/logo.png"} />
              <h1 className={"custom-text mb-4 text-center"}>Patient Workflow System</h1>

              <Typography variant="h4" align="center" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" align="center" sx={{ mb: 4, color: "text.secondary" }}>
                Please login to your account
              </Typography>

              <div className={"px-5"}>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }} className={"px-5"}>
                  <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="email"
                      value={email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
                  <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      value={password || ""}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                        ),
                      }}
                  />
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
                      disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                  </Button>
                </Box>
              </div>
            </div>
          </Grid>
        </Grid>
      </>
  );
};

export default Login;
