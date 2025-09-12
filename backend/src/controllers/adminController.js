const { Doctor, Appointment, User } = require("../models");
const fs = require("fs");
const path = require("path");

exports.createDoctor = async (req, res) => {
    try {
        const { name, specialty, location, bio, profilePicture } = req.body;

        let profilePicturePath = "";

        if (profilePicture) {
            const file = profilePicture;
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                return res.status(400).json({
                    type: "error",
                    message: "Only image files are allowed"
                });
            }

            const uploadDir = path.join(__dirname, "..", "..", "uploads", "images", "doctor");

            fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = Date.now() + "-" + file.name;
            const filePath = path.join(uploadDir, fileName);

            fs.copyFileSync(file.path, filePath);
            fs.unlinkSync(file.path);

            profilePicturePath = `/uploads/images/doctor/${fileName}`;
        }

        const doctor = await Doctor.create({
            name,
            specialty,
            location,
            bio,
            profilePicture: profilePicturePath
        });

        return res.status(201).json({
            type: "success",
            message: "Doctor Created Successfully",
            data: {doctor}
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

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            order: [["id", "DESC"]]
        });

        return res.status(200).json({
            type: "success",
            message: "",
            data: {doctors}
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while fetching doctors",
            data: {error: error.message}
        });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, specialty, location, bio, profilePicture } = req.body;

        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({
                type: "error",
                message: "Doctor not found"
            });
        }

        let profilePicturePath = doctor.profilePicture;

        if (profilePicture?.type) {
            const file = profilePicture;
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

            if (!allowedTypes.includes(file.type)) {
                return res.status(400).json({
                    type: "error",
                    message: "Only image files are allowed"
                });
            }

            const uploadDir = path.join(__dirname, "..", "..", "uploads", "images", "doctor");

            fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = Date.now() + "-" + file.name;
            const filePath = path.join(uploadDir, fileName);

            fs.copyFileSync(file.path, filePath);
            fs.unlinkSync(file.path);

            profilePicturePath = `/uploads/images/doctor/${fileName}`;
        }

        await doctor.update({
            name,
            specialty,
            location,
            bio,
            profilePicture: profilePicturePath
        });

        return res.status(200).json({
            type: "success",
            message: "Doctor Updated Successfully",
            data: {doctor}
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while updating doctor",
            data: {error: error.message}
        });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await Doctor.findByPk(id);
        if (!doctor) {
            return res.status(404).json({
                type: "error",
                message: "Doctor not found"
            });
        }

        if (doctor.profilePicture) {
            const filePath = path.join(process.cwd(), doctor.profilePicture);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await doctor.destroy();

        return res.status(200).json({
            type: "success",
            message: "Doctor Deleted Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            type: "error",
            message: "Server error while deleting doctor",
            data: {error: error.message}
        });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            order: [["date", "ASC"]],
            include: [
                {
                    model: Doctor,
                    as: "doctor",
                    attributes: ["id", "name", "specialty", "location", "profilePicture", "bio"]
                },
                {
                    model: User,
                    as: "patient"
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
