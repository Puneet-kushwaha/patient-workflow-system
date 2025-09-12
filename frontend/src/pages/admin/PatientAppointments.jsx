import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableContainer, TableHead, TableRow, Paper, TableCell, Grid, Button, Tooltip, IconButton} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import PatientAppointmentDialog from "../../Dialogs/PatientAppointmentDialog";
import { get } from "../../utils/api";
import moment from "moment";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

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

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [metaData, setMetaData] = useState({});
    const [openPatientAppointmentDialog, setOpenPatientAppointmentDialog] = useState(false);

    const getAllAppointments = async () => {
        try{
            const {type, data: {appointments}} = await get("/admin/patient-appointments");
            if(type === "success"){
                setAppointments(appointments);
            }
        }catch (e) {
            console.log(e);
        }
    }

    const onClosePatientAppointmentDialog = () => {
        setOpenPatientAppointmentDialog(false);
        setMetaData({});
    };

    useEffect(() => {
        getAllAppointments();
    }, []);

    return (
        <div className={"p-2"}>
            <PatientAppointmentDialog
                open={openPatientAppointmentDialog}
                onClose={onClosePatientAppointmentDialog}
                metaData={metaData}
                getAllAppointments={getAllAppointments}
            />

            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                <Grid item>
                    <h1 className={"custom-text mb-5"}>Patient Appointments</h1>
                </Grid>
            </Grid>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#090909' }}>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Patient Name</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor Name</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor Specialty</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor location</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Date</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Time</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Status</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Notes</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => {
                            const {doctor, patient, date, time, status, notes} = appointment;
                            return <StyledTableRow key={doctor.name}>
                                <StyledTableCell component="th" scope="row">
                                    {patient.name}
                                </StyledTableCell>
                                <StyledTableCell>{doctor.name}</StyledTableCell>
                                <StyledTableCell>{doctor.specialty}</StyledTableCell>
                                <StyledTableCell>{doctor.location}</StyledTableCell>
                                <StyledTableCell>{moment(date).format("DD-MMM-YYYY")}</StyledTableCell>
                                <StyledTableCell>{time}</StyledTableCell>
                                <StyledTableCell>{status}</StyledTableCell>
                                <StyledTableCell>{notes}</StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title="Add Medical Record">
                                        <IconButton
                                            onClick={() => {
                                                setOpenPatientAppointmentDialog(true);
                                                setMetaData({
                                                    appointment,
                                                    appointmentId: appointment.id,
                                                    patientId: patient.id,
                                                    doctorId: doctor.id
                                                });
                                            }}
                                            aria-label="edit" style={{ padding: '6px', color: "green" }}>
                                            <AddIcon fontSize="medium" style={{fontSize: "30px", fontWeight: "bold"}}/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => {}} aria-label="delete" style={{ padding: '6px', color: "#f00" }}>
                                            <DeleteIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
