import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        "http://88.200.63.148:3001/login",
        form
      );

      const role = res.data.role;

      if (role === "donor") navigate("/donor/dashboard");
      else if (role === "hospital") navigate("/hospital/dashboard");
      else if (role === "blood_bank") navigate("/bloodbank/dashboard");

    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="logo-section">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
            <path d="M30 0C30 0 60 25.1429 60 51.4286C60 67.2081 46.5685 80 30 80C13.4315 80 0 67.2081 0 51.4286C0 25.1429 30 0 30 0Z" fill="#880808"/>
          </svg>

          <h1>BloodNet</h1>
          <h4>
            Connecting donors, hospitals and blood banks for blood requests
          </h4>
        </div>

        <div className="login-form">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

        </div>

        <button className="login-btn" onClick={submit}>
          Log In
        </button>

      </div>
    </div>
  );
}

export default Login;