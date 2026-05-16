import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRole from "./pages/RegisterRole";
import RegisterDonor from "./pages/RegisterDonor";
import RegisterHospital from "./pages/RegisterHospital";
import RegisterBloodBank from "./pages/RegisterBloodBank";
import DonorDashboard from "./pages/DonorDashboard";
import DonorDonations from "./pages/DonorDonations";
import MedicalNotesDashboard from "./pages/MedicalNotesDashboard";
import AddMedicalNote from "./pages/AddMedicalNote";
import DonorAwardsDashboard from "./pages/DonorAwardsDashboard";
import DonorNotifications from "./pages/DonorNotifications";
import DonorProfile from "./pages/DonorProfile";
import DonorEditProfile from "./pages/DonorEditProfile";

import HospitalDashboard from "./pages/HospitalDashboard";
import HospitalDonations from "./pages/HospitalDonations";
import HospitalCompletedRequests from "./pages/HospitalCompletedRequests";
import HospitalProfile from "./pages/HospitalProfile";
import HospitalEditProfile from "./pages/HospitalEditProfile";
import HospitalRequests from "./pages/HospitalRequests";
import HospitalEditRequest from "./pages/HospitalEditRequest";
import HospitalCreateRequest from "./pages/HospitalCreateRequest";

import BloodBankDashboard from "./pages/BloodBankDashboard";
import BloodBankNotifications from "./pages/BloodBankNotifications";
import BloodBankAwardsDashboard from "./pages/BloodBankAwardsDashboard";
import BloodBankDonations from "./pages/BloodBankDonations";
import BloodBankProfile from "./pages/BloodBankProfile";
import BloodBankEditProfile from "./pages/BloodBankEditProfile";
import BloodBankBloodInventories from "./pages/BloodBankBloodInventories";
import BloodBankEditBloodInventory from "./pages/BloodBankEditBloodInventory";

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
        <Route path="/donor/notifications" element={<DonorNotifications />} />
        <Route path="/donor/profile" element={<DonorProfile />} />
        <Route path="/donor/edit-profile" element={<DonorEditProfile />} />

        <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        <Route path="/hospital/donations" element={<HospitalDonations />} />
        <Route path="/hospital/completed_requests" element={<HospitalCompletedRequests />} />
        <Route path="/hospital/profile" element={<HospitalProfile />} />
        <Route path="/hospital/edit-profile" element={<HospitalEditProfile />} />
        <Route path="/hospital/requests" element={<HospitalRequests />} />
        <Route path="/hospital/requests/edit-request/:id" element={<HospitalEditRequest />} />
        <Route path="/hospital/requests/create-request" element={<HospitalCreateRequest />} />

        <Route path="/bloodbank/dashboard" element={<BloodBankDashboard />} />
        <Route path="/bloodbank/notifications" element={<BloodBankNotifications />} />
        <Route path="/bloodbank/awards" element={<BloodBankAwardsDashboard />} />
        <Route path="/bloodbank/donations" element={<BloodBankDonations />} />
        <Route path="/bloodbank/profile" element={<BloodBankProfile />} />
        <Route path="/bloodbank/edit-profile" element={<BloodBankEditProfile />} />
        <Route path="/bloodbank/blood_inventories" element={<BloodBankBloodInventories />} />
        <Route path="/bloodbank/blood_inventories/edit-blood-inventory/:id" element={<BloodBankEditBloodInventory />} />
      </Routes>
    </Router>
  );
}

export default App;