import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import {Table, TableBody, TableContainer, TableHead, TableRow, Paper, TableCell, Grid, Button, Tooltip, IconButton} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import DoctorDialog from "../../Dialogs/DoctorDialog";
import { get, del } from "../../utils/api";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";

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

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(undefined);
    const [openDoctorDialog, setOpenDoctorDialog] = useState(false);

    const getAllDoctors = async () => {
        try{
            const {type, data: {doctors}} = await get("/admin/doctors");
            if(type === "success"){
                setDoctors(doctors);
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

    const handleDelete = (doctor) => {
        Swal.fire({
            title: `Are you sure you want to delete Dr. ${doctor.name}?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await del(`/admin/doctor/${doctor.id}`);
                } catch (err) {
                    console.log(err);
                }finally {
                    await getAllDoctors();
                }
            }
        });
    };

    return (
        <div className={"p-2"}>
            <DoctorDialog open={openDoctorDialog} onClose={onCloseDoctorDialog} selectedDoctor={selectedDoctor} getAllDoctors={getAllDoctors} />

            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                <Grid item>
                    <h1 className={"custom-text mb-5"}>Doctors</h1>
                </Grid>

                <Grid>
                    <button
                        className={"custom-btn"}
                        onClick={() => setOpenDoctorDialog(true)}
                    >
                        Create New
                    </button>
                </Grid>
            </Grid>
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650, border: '1px solid #ccc' }} aria-label="customized table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#090909' }}>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "23%" }}>Name</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "23%" }}>Specialty</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "23%" }}>Location</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "23%" }}>Bio</StyledTableCell>
                            <StyledTableCell sx={{ fontWeight: 'bold', color: "#fff", width: "20%" }}>Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {doctors.map((doctor) => (
                            <StyledTableRow key={doctor.name}>
                                <StyledTableCell component="th" scope="row">
                                    {doctor.name}
                                </StyledTableCell>
                                <StyledTableCell>{doctor.specialty}</StyledTableCell>
                                <StyledTableCell>{doctor.location}</StyledTableCell>
                                <StyledTableCell>{doctor.bio}</StyledTableCell>
                                <StyledTableCell>
                                    <Tooltip title="Edit">
                                        <IconButton
                                            onClick={() => {
                                                setOpenDoctorDialog(true);
                                                setSelectedDoctor(doctor);
                                            }}
                                            aria-label="edit" style={{ padding: '6px', color: "orange" }}>
                                            <EditIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDelete(doctor)} aria-label="delete" style={{ padding: '6px', color: "#f00" }}>
                                            <DeleteIcon fontSize="medium" />
                                        </IconButton>
                                    </Tooltip>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
