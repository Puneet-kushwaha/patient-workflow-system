import React  from 'react'
import './App.css'
import {Routes, Route} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDoctors from "./pages/admin/Doctors";
import AdminPatientAppointments from "./pages/admin/PatientAppointments";
import PatientDoctors from "./pages/patient/Doctors";
import PatientSingleDoctor from "./pages/patient/SingleDoctor";
import MedicalRecords from "./pages/patient/MedicalRecords";
import MyAppointments from "./pages/patient/MyAppointments";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
    return (
        <>
            <Routes>
                <Route path={"/"} element={<Login />}/>

                <Route
                    element={
                        <ProtectedRoute role="Admin">
                            <ProtectedLayout role="Admin" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin/doctors" element={<AdminDoctors />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute role="Admin">
                            <ProtectedLayout role="Admin" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/admin/patient-appointments" element={<AdminPatientAppointments />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute role="Patient">
                            <ProtectedLayout role="Patient" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/doctors" element={<PatientDoctors />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute role="Patient">
                            <ProtectedLayout role="Patient" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/doctor/:id" element={<PatientSingleDoctor />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute role="Patient">
                            <ProtectedLayout role="Patient" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/medical-records/:appointmentId" element={<MedicalRecords />} />
                </Route>

                <Route
                    element={
                        <ProtectedRoute role="Patient">
                            <ProtectedLayout role="Patient" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/my-appointments" element={<MyAppointments />} />
                </Route>
            </Routes>
        </>
    )
}

export default App;
