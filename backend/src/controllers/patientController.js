const { Doctor, Appointment, MedicalRecord } = require("../models");
const { Op } = require("sequelize");

exports.getAllDoctors = async (req, res) => {
    const { search } = req.query;

    try {
        const where = {};
        if (search) {
            where[Op.or] = [
                { specialty: { [Op.iLike]: `%${search}%` } },
                { location: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const doctors = await Doctor.findAll({
            where,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            type: "success",
            message: "",
            data: {doctors},
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while fetching doctors",
            data: {error: error.message},
        });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointments: dateFilter } = req.query;
        const doctor = await Doctor.findByPk(id);

        if (!doctor) {
            return res.status(404).json({
                type: "error",
                message: "Doctor not found",
            });
        }

        let appointments = [];
        if (appointments) {
            const date = new Date(decodeURIComponent(dateFilter));

            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            appointments = await Appointment.findAll({
                where: {
                    doctorId: id,
                    status: "Scheduled",
                    date: {
                        [Op.between]: [startOfDay, endOfDay],
                    },
                }
            });
        }

        return res.status(200).json({
            type: "success",
            message: "",
            data: {
                doctor: {
                    ...doctor.toJSON(),
                    appointments
                },
            }
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while fetching doctor",
            data: {error: error.message},
        });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create({
            ...req.body,
            patientId: req.user.id
        });

        return res.status(201).json({
            type: "success",
            message: "Appointment Booked Successfully",
            data: {appointment}
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            type: "error",
            message: "Server error while creating doctor",
            data: {error}
        });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { patientId: req.user.id },
            order: [["date", "ASC"]],
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["id", "name", "specialty", "location", "profilePicture", "bio"]
                }
            ]
        });

        return res.status(200).json({
            type: "success",
            message: "",
            data: { appointments },
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while fetching appointments",
            data: { error: error.message },
        });
    }
};

exports.getMedicalRecords = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { appointments: dateFilter } = req.query;
        const medicalRecords = await MedicalRecord.findAll({
            where: {appointmentId},
             order: [["createdAt", "DESC"]]
        });

        return res.status(200).json({
            type: "success",
            message: "",
            data: {
                medicalRecords
            }
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while fetching doctor",
            data: {error: error.message},
        });
    }
};
