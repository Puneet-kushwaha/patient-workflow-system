import React, {useEffect, useState} from 'react';
import {
    Grid,
    Card, CardHeader, CardContent,
    Avatar, Typography, TextField
} from '@mui/material';
import { get } from "../../utils/api";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

export default function Doctors() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const getAllDoctors = async () => {
            try{
                const {type, data: {doctors}} = await get(`/doctors?search=${encodeURIComponent(search)}`);
                if(type === "success"){
                    setDoctors(doctors);
                }
            }catch (e) {
                console.log(e);
            }
        }

        getAllDoctors();
    }, [debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    return (
        <div className={"p-2"}>

            <Grid container justifyContent={"space-between"} alignItems={"start"}>
                <Grid item>
                    <h1 className={"custom-text mb-5"}>Doctors</h1>
                </Grid>

                <Grid item xs={3}>
                    <TextField
                        fullWidth
                        label="Search Doctors"
                        name="search"
                        placeholder="Search doctors by specialty or location"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Grid spacing={3} container>
                {
                    doctors.map(doctor => {
                        return <Grid item xs={4} className={"px-4 w"} display="flex" alignItems="stretch">
                            <Card style={{cursor: "pointer", width: "100%"}} onClick={() => navigate(`/doctor/${doctor.id}`)}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            className={""}
                                            src={import.meta.env.VITE_BACKEND_URL + doctor.profilePicture}
                                            sx={{ width: "100px", height: "100px", bgcolor: "#c9c7c7" }}
                                        >R</Avatar>
                                    }
                                    title={<h4 className={"custom-text"}>{doctor.name}</h4>}
                                    subheader={
                                        <>
                                            <Typography variant="body1">{doctor.specialty}</Typography>
                                            <Typography variant="body1">{doctor.location}</Typography>
                                        </>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="h6" color="text.secondary">
                                        {doctor.bio}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
        </div>
    );
}
