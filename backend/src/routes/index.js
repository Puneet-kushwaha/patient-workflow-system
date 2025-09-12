const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const patientController = require("../controllers/patientController");
const auth = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.post("/admin/doctor", auth(["Admin"]), adminController.createDoctor);
router.get("/admin/doctors", auth(["Admin"]), adminController.getAllDoctors);
router.put("/admin/doctor/:id", auth(["Admin"]), adminController.updateDoctor);
router.delete("/admin/doctor/:id", auth(["Admin"]), adminController.deleteDoctor);
router.get("/admin/patient-appointments", auth(["Admin"]), adminController.getAppointments);


router.get("/doctors", auth(["Patient"]), patientController.getAllDoctors);
router.get("/doctor/:id", auth(["Patient"]), patientController.getDoctorById);
router.post("/book-appointment", auth(["Patient"]), patientController.bookAppointment);
router.get("/appointments", auth(["Patient"]), patientController.getAppointments);


module.exports = router;
