import { useState } from "react";
import axios from "axios";
import "../styles/RegisterDonor.css";

function RegisterDonor() {
  const [form, setForm] = useState({
    name: "",
    date_of_birth: "",
    age: "",
    sex: "",
    blood_type: "",
    region: "",
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
        "http://88.200.63.148:3001/register/donor",
        form
      );
      alert("Donor registered successfully!");
    } catch (err) {
      console.error(err);
      alert("Error registering donor");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h1>Register as Donor</h1>

        <div className="form-grid">

          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />

          <input type="date" name="date_of_birth" onChange={handleChange} />

          <input type="number" name="age" placeholder="Age" onChange={handleChange} />

          <select name="sex" onChange={handleChange}>
            <option value="">Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select name="blood_type" onChange={handleChange}>
            <option value="">Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <input type="text" name="region" placeholder="Region" onChange={handleChange} />

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

export default RegisterDonor;