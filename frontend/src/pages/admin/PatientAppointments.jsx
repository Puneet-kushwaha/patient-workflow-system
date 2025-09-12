import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableContainer, TableHead, TableRow, Paper, TableCell, Grid, Button, Tooltip, IconButton} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import DoctorDialog from "../../Dialogs/DoctorDialog";
import { get } from "../../utils/api";
import moment from "moment";

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
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [openDoctorDialog, setOpenDoctorDialog] = useState(false);

    const getAllDoctors = async () => {
        try{
            const {type, data: {appointments}} = await get("/admin/patient-appointments");
            if(type === "success"){
                setAppointments(appointments);
            }
        }catch (e) {
            console.log(e);
        }
    }

    const onCloseDoctorDialog = () => {
        setOpenDoctorDialog(false);
        setSelectedDoctor(undefined);
    };

    useEffect(() => {
        getAllDoctors();
    }, []);

    return (
        <div className={"p-2"}>
            <DoctorDialog open={openDoctorDialog} onClose={onCloseDoctorDialog} selectedDoctor={selectedDoctor} getAllDoctors={getAllDoctors} />

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
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Patient Email</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor Name</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor Specialty</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Doctor location</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Date</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Time</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Status</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff" }}>Notes</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.map((appointment) => {
                            const {doctor, patient, date, time, status, notes} = appointment;
                            return <StyledTableRow key={doctor.name}>
                                <StyledTableCell component="th" scope="row">
                                    {patient.name}
                                </StyledTableCell>
                                <StyledTableCell>{patient.email}</StyledTableCell>
                                <StyledTableCell>{doctor.name}</StyledTableCell>
                                <StyledTableCell>{doctor.specialty}</StyledTableCell>
                                <StyledTableCell>{doctor.location}</StyledTableCell>
                                <StyledTableCell>{moment(date).format("DD-MMM-YYYY")}</StyledTableCell>
                                <StyledTableCell>{time}</StyledTableCell>
                                <StyledTableCell>{status}</StyledTableCell>
                                <StyledTableCell>{notes}</StyledTableCell>
                            </StyledTableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
