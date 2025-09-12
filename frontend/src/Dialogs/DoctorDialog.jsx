import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Avatar,
} from "@mui/material";
import { post, put } from "../utils/api";

const DoctorDialog = ({ open, onClose, selectedDoctor, getAllDoctors }) => {
    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        location: "",
        bio: "",
        profilePicture: null,
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setError("Only image files are allowed.");
                setFormData((prev) => ({ ...prev, profilePicture: null }));
                setPreview(null);
                return;
            }
            setError("");
            setFormData((prev) => ({ ...prev, profilePicture: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!formData.name || !formData.specialty || !formData.location || !formData.bio || (!formData.profilePicture && !selectedDoctor)) {
            setError("All required fields must be filled.");
            return;
        }
        setError("");

        const dataToSend = new FormData();
        dataToSend.append("name", formData.name);
        dataToSend.append("specialty", formData.specialty);
        dataToSend.append("location", formData.location);
        dataToSend.append("bio", formData.bio);
        dataToSend.append("profilePicture", formData.profilePicture);

        try {
            const apiFn = selectedDoctor ? put : post;
            const url = selectedDoctor ? `/admin/doctor/${selectedDoctor.id}` : "/admin/doctor";
            await apiFn(url, dataToSend, true);

            onClose();

        } catch (err) {
            console.log(err);
        } finally {
            setFormData({
                name: "",
                specialty: "",
                location: "",
                bio: "",
                profilePicture: null,
            });
            await getAllDoctors();
            setPreview(null);
        }
    };

    useEffect(() => {
        if(selectedDoctor){
            setFormData({
                ...selectedDoctor,
                profilePicture: null
            });

            setPreview(import.meta.env.VITE_BACKEND_URL + selectedDoctor.profilePicture);
        }else{
            setPreview(null);
            setError("");
        }
    }, [selectedDoctor]);

    return (
        <Dialog open={open} onClose={() => {
            onClose();
            setError("");
            if(selectedDoctor)
                setFormData({
                    name: "",
                    specialty: "",
                    location: "",
                    bio: "",
                    profilePicture: null,
                });
            setPreview(null);
        }} fullWidth>
            <DialogTitle>
                <Grid container justifyContent={"space-between"} alignItems={"center"}>
                    <Grid item>
                        <h3 className={"custom-text mb-2"}>{selectedDoctor ? "Update Doctor" : "Add New Doctor"}</h3>
                    </Grid>

                    <Grid item>
                        <h3 className={"custom-text p-2"} onClick={onClose} style={{cursor: "pointer"}}>X</h3>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2}>
                    {error && (
                        <Grid item xs={12}>
                            <p style={{ color: "red", fontSize: 14, margin: 0 }}>{error}</p>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={9}>
                                <Button fullWidth variant="outlined" component="label">
                                    Upload Profile Picture *
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={{ mt: 2 }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
                                <Avatar
                                    src={preview || "/default-profile.png"}
                                    alt="Preview"
                                    sx={{ width: 100, height: 100 }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Specialty"
                            name="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            required
                        />
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

export default DoctorDialog;
