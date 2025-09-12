import React, {useEffect, useState} from 'react';
import {
    Grid,
    Card, CardHeader, CardContent,
    Avatar, Typography, Stack, Button, Chip
} from '@mui/material';
import { get } from "../../utils/api";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function MyAppointments() {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);

    const getAllAppointments = async () => {
        try{
            const {type, data: {appointments}} = await get(`/appointments`);
            if(type === "success"){
                setAppointments(appointments);
            }
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAllAppointments();
    }, []);

    return (
        <div className={"p-2"}>

            <Grid container justifyContent={"space-between"} alignItems={"start"}>
                <Grid item>
                    <h1 className={"custom-text mb-5"}>Appointments</h1>
                </Grid>
            </Grid>

            {
                appointments.length === 0 && <h4 className={"text-center"}>No Records Found</h4>
            }

            <Grid spacing={3} container>
                {
                    appointments.map(appointment => {
                        const doctor = appointment.doctor || {};
                        return <Grid item xs={12} md={6} lg={4} className={"px-md-4"} display="flex" alignItems="stretch">
                            <Card style={{cursor: "pointer"}}>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={import.meta.env.VITE_BACKEND_URL + doctor.profilePicture}
                                            sx={{ width: "70px", height: "70px", bgcolor: red[500] }}
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
                                    <Grid container justifyContent={"space-between"}>
                                        <Grid item>
                                            <div>
                                                <Typography variant={"h6"}>Date</Typography>
                                                <h6 className={"custom-text mb-4"}>{moment(appointment.date).format("DD MMM YYYY")}</h6>
                                            </div>
                                        </Grid>

                                        <Grid item>
                                            <div>
                                                <Typography variant={"h6"}>Time Slot</Typography>
                                                <h6 className={"custom-text mb-4"}>{appointment.time}</h6>
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container justifyContent={"space-between"}>
                                        <Grid item>
                                            <div>
                                                <Typography variant={"h6"}>Status</Typography>
                                                <Stack direction="row" spacing={1}>
                                                    <Chip label={appointment.status}
                                                          color={
                                                              appointment.status === "Completed" ? "success" :
                                                                  appointment.status === "Scheduled" ? "primary" :
                                                                      appointment.status === "Cancelled" ? "error" : undefined
                                                          }
                                                    />
                                                </Stack>
                                            </div>
                                        </Grid>

                                        <Grid item>
                                            <div>
                                                <Typography variant={"h6"}>Notes</Typography>
                                                <h6 className={"custom-text mb-4"}>{appointment.notes}</h6>
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <div className={"text-center mt-4"}>
                                        <button
                                            className={"custom-btn"}
                                            onClick={() => navigate(`/medical-records/${appointment.id}`)}
                                        >
                                            View Medical Records
                                        </button>
                                    </div>

                                </CardContent>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
        </div>
    );
}
