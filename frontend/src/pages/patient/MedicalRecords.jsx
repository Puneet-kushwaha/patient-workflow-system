import React, {useEffect, useState} from 'react';
import {
    Grid, Button, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, Typography
} from '@mui/material';
import { get } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useParams } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function MedicalRecords() {
    const navigate = useNavigate();
    const { appointmentId } = useParams();

    const [data, setData] = useState([]);
    const [appointment, setAppointment] = useState({});

    const getAllAppointments = async () => {
        try{
            const {type, data: {medicalRecords, appointment}} = await get(`/medical-records/${appointmentId}`);
            if(type === "success"){
                setData(medicalRecords);
                setAppointment(appointment);
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

            <Grid component={Paper} elevation={3} className={"p-4 mb-4"}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant={"h5"} className={"mb-3"}>Appointment Details</Typography>
                    </Grid>

                    <Grid item xs={6} md={4} lg={3}>
                        <p className={"font-weight-bold m-0"}>Date: {moment(appointment.date).format("DD MMM YYYY")}</p>
                    </Grid>

                    <Grid item xs={6} md={4} lg={3}>
                        <p className={"font-weight-bold m-0"}>Time Slot: {appointment.time}</p>
                    </Grid>

                    <Grid item xs={6} md={4} lg={3}>
                        <p className={"font-weight-bold m-0"}>Status: {appointment.status}</p>
                    </Grid>
                </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#090909' }}>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "40%" }}>Diagnosis</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "40%" }}>Prescription</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "10%" }}>Date</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "10%" }}>Attachment</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map(medicalRecord => {
                                return <StyledTableRow key={medicalRecord.id}>
                                    <StyledTableCell>{medicalRecord.diagnosis !== "undefined" && medicalRecord.diagnosis}</StyledTableCell>
                                    <StyledTableCell>{medicalRecord.prescription !== "undefined" && medicalRecord.prescription}</StyledTableCell>
                                    <StyledTableCell>{moment(medicalRecord.createdAt).format("DD MMM YYYY")}</StyledTableCell>
                                    <StyledTableCell>
                                        {
                                            medicalRecord.attachments.length > 0 && <Button
                                                size={"small"}
                                                variant={"contained"}
                                                className={"ml-4"}
                                                onClick={() => handleDownload(import.meta.env.VITE_BACKEND_URL + medicalRecord.attachments)}
                                            >
                                                Download
                                            </Button>
                                        }
                                    </StyledTableCell>
                                </StyledTableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
