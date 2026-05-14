import { useState } from "react";
import axios from "axios";
import "../styles/RegisterHospital.css";

function RegisterHospital() {
  const [form, setForm] = useState({
    name: "",
    region: "",
    address: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    try {
      await axios.post(
        "http://88.200.63.148:3001/register/hospital",
        {
        withCredentials: true,
        form
        }
      );
      alert("Hospital registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Error registering hospital");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>Register as Hospital</h1>

        <div className="form-grid">

          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />

          <input type="text" name="region" placeholder="Region" onChange={handleChange} />

          <input type="text" name="address" placeholder="Address" onChange={handleChange} />

          <input type="email" name="email" placeholder="Email" onChange={handleChange} />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} />

          <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} />

        </div>

        <button className="submit-btn" onClick={submit}>
          Register
        </button>

      </div>
    </div>
  );
}

export default RegisterHospital;