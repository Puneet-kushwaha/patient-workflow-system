import React, {useEffect, useState} from 'react';
import {
    Grid,
    Card, CardHeader, CardContent,
    Avatar, Typography, TextField, Button
} from '@mui/material';
import { get } from "../../utils/api";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useParams } from "react-router-dom";

export default function MedicalRecords() {
    const navigate = useNavigate();
    const { appointmentId } = useParams();

    const [data, setData] = useState([]);

    const getAllAppointments = async () => {
        try{
            const {type, data: {medicalRecords}} = await get(`/medical-records/${appointmentId}`);
            if(type === "success"){
                setData(medicalRecords);
            }
        }catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAllAppointments();
    }, []);

    const handleDownload = (fileUrl) => {
        const link = document.createElement("a");
        link.href = fileUrl;

        link.setAttribute("download","attachment");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={"p-2"}>

            <Grid container justifyContent={"space-between"} alignItems={"start"}>
                <Grid item>
                    <h1 className={"custom-text mb-5"}>Medical Records</h1>
                </Grid>
            </Grid>

            {
                data.length === 0 && <h4 className={"text-center"}>No Records Found</h4>
            }

            <Grid spacing={3} container>
                {
                    data.map(medicalRecord => {
                        return <Grid item xs={12} display="flex" alignItems="stretch">
                            <Card style={{cursor: "pointer", width: "100%"}}>
                                <CardContent>
                                    <Grid container justifyContent={""}>
                                        {
                                            medicalRecord.diagnosis !== "undefined" && <Grid item xs={12}>
                                                <div className={"d-flex"}>
                                                    <Typography className={"custom-text"} variant={"h5"}>Diagnosis - </Typography>
                                                    <Typography className={"ml-3"} variant={"h5"}>{medicalRecord.diagnosis || ""}</Typography>
                                                </div>
                                            </Grid>
                                        }

                                        {
                                            medicalRecord.prescription !== "undefined" && <Grid item xs={12}>
                                                <div className={"d-flex"}>
                                                    <Typography className={"custom-text"} variant={"h5"}>Prescription - </Typography>
                                                    <Typography className={"ml-3"} variant={"h5"}>{medicalRecord.prescription || ""}</Typography>
                                                </div>
                                            </Grid>
                                        }
                                    </Grid>

                                    <Grid item xs={12}>
                                        <div className={"d-flex"}>
                                            <Typography className={"custom-text"} variant={"h5"}>Date - {moment(medicalRecord.createdAt).format("DD MMM YYYY")}</Typography>
                                            {
                                                medicalRecord.attachments.length > 0 && <Button
                                                    size={"small"}
                                                    variant={"contained"}
                                                    className={"ml-4"}
                                                    onClick={() => handleDownload(import.meta.env.VITE_BACKEND_URL + medicalRecord.attachments)}
                                                >
                                                    Download Attachment
                                                </Button>
                                            }
                                        </div>
                                    </Grid>

                                </CardContent>
                            </Card>
                        </Grid>
                    })
                }
            </Grid>
        </div>
    );
}
