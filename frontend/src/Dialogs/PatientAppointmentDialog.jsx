import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    Slide,
    MenuItem,
    FormControl,
    Select,
    InputLabel
} from "@mui/material";
import { post, put } from "../utils/api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const PatientAppointmentDialog = ({ open, onClose, metaData, getAllAppointments }) => {
    const [formData, setFormData] = useState({
        diagnosis: "",
        prescription: "",
        attachments: null,
        status: metaData?.appointment?.status
    });
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError("");

        const dataToSend = new FormData();
        dataToSend.append("diagnosis", formData.diagnosis);
        dataToSend.append("prescription", formData.prescription);
        dataToSend.append("attachments", file);
        dataToSend.append("patientId", metaData?.patientId);
        dataToSend.append("doctorId", metaData?.doctorId);
        dataToSend.append("appointmentId", metaData?.appointmentId);
        dataToSend.append("status", formData?.status);

        try {
            await post("/admin/add-medical-record", dataToSend, true);

            onClose();

        } catch (err) {
            console.log(err);
        } finally {
            setFormData({
                diagnosis: "",
                prescription: "",
                attachments: null
            });
            await getAllAppointments();
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if(metaData?.appointmentId && metaData?.doctorId && metaData?.patientId){
            setFormData({
                ...metaData,
                attachments: null,
                appointment: null,
                status: metaData?.appointment?.status
            });

            setPreviewUrl(import.meta.env.VITE_BACKEND_URL + metaData.appointment?.attachments);
        }else{
            setPreviewUrl(null);
            setError("");
        }
    }, [metaData]);

    return (
        <Dialog
            maxWidth="md"
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            open={open}
            onClose={() => {
                onClose();
                setError("");
                if(metaData)
                    setFormData({
                        diagnosis: "",
                        prescription: "",
                        attachments: null
                    });
                setPreviewUrl(null);
            }}
            fullWidth
        >
            <DialogTitle>
                <Grid container justifyContent={"space-between"} alignItems={"center"}>
                    <Grid item>
                        <h3 className={"custom-text"}>Add Medical Record</h3>
                    </Grid>

                    <Grid item>
                        <h3 className={"custom-text p-2"} onClick={onClose} style={{cursor: "pointer"}}>X</h3>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent className={""}>
                <Grid container spacing={2}>
                    {error && (
                        <Grid item xs={12}>
                            <p style={{ color: "red", fontSize: 14, margin: 0 }}>{error}</p>
                        </Grid>
                    )}

                    <Grid item xs={12} lg={6}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={5}
                            label="Diagnosis"
                            name="diagnosis"
                            value={formData.diagnosis || ""}
                            onChange={handleChange}
                            sx={{mt: 1}}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={5}
                            label="Prescription"
                            name="prescription"
                            value={formData.prescription || ""}
                            onChange={handleChange}
                            sx={{mt: 1}}
                        />
                    </Grid>

                    <Grid item xs={12} lg={6} className={"mt-lg-1"}>
                        <Button fullWidth variant="outlined" component="label">
                            Attachments
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <FormControl size="small" className={"w-100"}>
                            <InputLabel id="demo-select-small-label">Status</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={formData?.status || ""}
                                label="Status"
                                name={"status"}
                                onChange={handleChange}
                            >
                                <MenuItem value={"Scheduled"}>Scheduled</MenuItem>
                                <MenuItem value={"Completed"}>Completed</MenuItem>
                                <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style={{ marginTop: "12px" }}>
                        {file ? (
                            file.type === "application/pdf" ? (
                                <embed
                                    src={previewUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="200px"
                                />
                            ) : file.type.startsWith("image/") ? (
                                <img
                                    src={previewUrl}
                                    alt={file.name}
                                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                                />
                            ) : (
                                <Typography>{file.name}</Typography>
                            )
                        ) : (
                            <Typography color="textSecondary">No file selected</Typography>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <button
                    type={"button"}
                    className={"custom-btn"}
                    onClick={handleSubmit}
                >
                    Save
                </button>
            </DialogActions>
        </Dialog>
    );
};

export default PatientAppointmentDialog;
