import React from "react";
import { Button, AppBar, Toolbar, Typography, Box, Grid } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { post } from "../utils/api";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const navItems = [
        { name: "Doctors", path: "/admin/doctors", roles: ["Admin"] },
        { name: "Patient Appointments", path: "/admin/patient-appointments", roles: ["Admin"] },
        { name: "Doctors", path: "/doctors", roles: ["Patient"] },
        { name: "My Appointments", path: "/my-appointments", roles: ["Patient"] },
    ];

    const logout = async () => {
        try{
            const {type} = await post("/logout");

            if(type === "success"){
                localStorage.clear();
                navigate("/");
            }
        }catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "#059bbc" }}>
                <Toolbar>
                    <Grid container direction="row" sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <Grid>
                            <img
                                className={"img-fluid"}
                                style={{
                                    width: "170px",
                                    height: "50px"
                                }}
                                src={"/images/logo.png"} />
                        </Grid>

                        <Grid>
                            {navItems.map((item) => {
                                if (!item.roles.includes(user?.role)) return null;
                                return (
                                    <Button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            color: location.pathname === item.path ? "#FFD700" : "#fff",
                                            borderBottom:
                                                location.pathname === item.path ? "2px solid #FFD700" : "none",
                                            mx: 1,
                                            outline: "none !important"
                                        }}
                                    >
                                        {item.name}
                                    </Button>
                                );
                            })}
                        </Grid>

                        <Grid>
                            <Button
                                className={"my-3 my-md-0"}
                                onClick={() => logout()}
                                sx={{
                                    backgroundColor: "#e53935",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "#d32f2f",
                                    },
                                    ml: 2,
                                    fontWeight: "bold",
                                }}
                            >
                                Logout
                            </Button>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </>
    );
};

export default Header;
