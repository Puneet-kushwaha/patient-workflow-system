import React, {useEffect, useState} from 'react';
import {
    Grid, Typography, TextField, Button
} from '@mui/material';
import { get, post } from "../../utils/api";
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export default function SingleDoctor() {
    const { id } = useParams();
    const [doctor, setDoctor] = useState({});
    const [slotDateTime, setSlotDateTime] = useState({
        date: dayjs(),
        time: null,
        notes: null
    });

    const getDoctor = async () => {
        try{
            let url = `/doctor/${id}`;
            if (slotDateTime?.date) {
                url += `?appointments=${encodeURIComponent(slotDateTime.date)}`;
            }

            const {type, data: {doctor}} = await get(url);
            if(type === "success"){
                setDoctor(doctor);
            }
        }catch (e) {
            console.log(e);
        }
    }

    const bookSlot = async () => {
        try{
            if(!slotDateTime.date)
                return toast.error("Please Select Appointment Date");

            if(!slotDateTime.time)
                return toast.error("Please Select Time Slot");

            await post("/book-appointment", {
                doctorId: doctor.id,
                ...slotDateTime
            });
        }catch (e) {
            console.log(e);
        }finally {
            getDoctor();
        }
    };

    useEffect(() => {
        getDoctor();
    }, [slotDateTime.date]);

    return (
        <div className={"p-2"}>
            <Grid container justifyContent={"space-between"} alignItems={"center"}>
                <Grid item>
                    <h1 className={"custom-text mb-4"}>Doctor Details</h1>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <img
                        style={{
                            width: "460px",
                            height: "460px",
                        }}
                        src={import.meta.env.VITE_BACKEND_URL + doctor.profilePicture} />
                </Grid>

                <Grid item xs={8}>
                    <div>
                        <h4 className={"custom-text mt-4"}>Name</h4>
                        <Typography variant={"h6"}>{doctor.name}</Typography>
                    </div>

                    <div>
                        <h4 className={"custom-text mt-4"}>Specialty</h4>
                        <Typography variant={"h6"}>{doctor.specialty}</Typography>
                    </div>

                    <div>
                        <h4 className={"custom-text mt-4"}>Location</h4>
                        <Typography variant={"h6"}>{doctor.location}</Typography>
                    </div>

                    <div>
                        <h4 className={"custom-text mt-4"}>Bio</h4>
                        <Typography variant={"h6"}>{doctor.bio}</Typography>
                    </div>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h2 className={"custom-text mt-5 mb-1"}>Book Appointment</h2>
                </Grid>

                <Grid item xs={3}>
                    <h5 className={"mb-3"}>Select Date</h5>
                    <DatePicker
                        className={"w-100"}
                        label="Select Appointment Date"
                        value={slotDateTime?.date}
                        onChange={(newValue) => setSlotDateTime({...slotDateTime, date: newValue})}
                        minDate={dayjs()}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />

                    <TextField
                        className={"mt-3"}
                        fullWidth
                        multiline
                        minRows={5}
                        label="Notes"
                        name="notes"
                        value={slotDateTime?.notes}
                        onChange={(e) => setSlotDateTime({...slotDateTime, notes: e.target.value})}
                    />
                </Grid>

                <Grid item xs={9}>
                    <h5 className={"mb-3"}>Select Time Slot</h5>
                    <Grid container spacing={3}>
                        {
                            [
                                "9 AM - 10 AM",
                                "10 AM - 11 AM",
                                "11 AM - 12 PM",
                                "12 PM - 1 PM",
                                "1 PM - 2 PM",
                                "2 PM - 3 PM",
                                "3 PM - 4 PM",
                                "4 PM - 5 PM",
                                "5 PM - 6 PM",
                                "6 PM - 7 PM"
                            ].map(time => {
                                return <Grid item xs={3}>
                                    {
                                        <Button
                                            className="p-3"
                                            fullWidth
                                            variant={time === slotDateTime.time ? "contained" : "outlined"}
                                            disabled={doctor.appointments?.map(s => s.time).includes(time)}
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "bold",
                                            }}
                                            onClick={() =>
                                                setSlotDateTime((prev) => ({
                                                    ...prev,
                                                    time: prev.time === time ? null : time,
                                                }))
                                            }
                                        >
                                            {time}
                                        </Button>
                                    }
                                </Grid>
                            })
                        }

                        <Grid item>
                            <button
                                className={"custom-btn ml-5"}
                                onClick={() => bookSlot()}
                            >
                                Confirm Booking
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
