import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterRole from "./pages/RegisterRole";
import RegisterDonor from "./pages/RegisterDonor";
import RegisterHospital from "./pages/RegisterHospital";
import RegisterBloodBank from "./pages/RegisterBloodBank";

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
      </Routes>
    </Router>
  );
}

export default App;