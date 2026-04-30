import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRole from "./pages/RegisterRole";
import RegisterDonor from "./pages/RegisterDonor";
import RegisterHospital from "./pages/RegisterHospital";
import RegisterBloodBank from "./pages/RegisterBloodBank";
import DonorDashboard from "./pages/DonorDashboard";
import DonorDonations from "./pages/DonorDonations";
import HospitalDashboard from "./pages/HospitalDashboard";
import BloodBankDashboard from "./pages/BloodBankDashboard";
import MedicalNotesDashboard from "./pages/MedicalNotesDashboard";
import AddMedicalNote from "./pages/AddMedicalNote";
import DonorAwardsDashboard from "./pages/DonorAwardsDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterRole />} />
        <Route path="/register/donor" element={<RegisterDonor />} />
        <Route path="/register/hospital" element={<RegisterHospital />} />
        <Route path="/register/bloodbank" element={<RegisterBloodBank />} />

        <Route path="/donor/dashboard" element={<DonorDashboard />} />
        <Route path="/donor/donations" element={<DonorDonations />} />
        <Route path="/donor/medical_notes" element={<MedicalNotesDashboard />} />
        <Route path="/donor/medical_notes/add_medical_note" element={<AddMedicalNote />} />
        <Route path="/donor/awards" element={<DonorAwardsDashboard />} />

        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/blood_bank/dashboard" element={<BloodBankDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;