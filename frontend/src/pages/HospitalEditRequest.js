import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import "../styles/HospitalEditRequest.css";

function HospitalEditRequest() {

  const [error, setError] = useState("");
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  useEffect(() => {

    axios.get(
        "http://88.200.63.148:30031/me",
        {
        withCredentials: true
        }
    )
    .then((res) => {
        setUser(res.data);
    })
    .catch((err) => {
        console.error(err);
    });

    }, []);

  const { id } = useParams();

  const [form, setForm] = useState({
    blood_type: "",
    quantity: "",
    urgency_level: "",
    status: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    axios
      .get(`http://88.200.63.148:30031/hospital/request/${id}`,{
        withCredentials: true
      })
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const submit = async () => {
      if (!form.blood_type || !form.quantity || !form.urgency_level || !form.status) {
      setError("Error: Empty field");
      return;
    }

    setError("");
    try {
      await axios.put(
        `http://88.200.63.148:30031/hospital/request/${id}`,
        form,
        {
          withCredentials: true
        }
      );

      alert("Request updated!");

    navigate('/hospital/requests');
    } catch (err) {
      console.error(err);
    }
  };

  return (
  <div className="notifications-container">

    <div className="form-card">

      <header className="page-header">
        <button
          className="back-btn"
          onClick={() => navigate('/hospital/requests')}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <h1>Edit Request</h1>
      </header>
        <main className="notifications-list">
      <div className="login-form">

      <div className="form-group">
        <label>Blood type</label>
        <select
          name="blood_type"
          onChange={handleChange}
          value={form.blood_type}
          className="blood-select"
        >
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
        </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Urgency level</label>
        <select
          name="urgency_level"
          value={form.urgency_level}
          onChange={handleChange}
          className="blood-select"
        >
          <option value="">Urgency Level</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
        </select>
        </div>

      <div className="form-group">
        <label>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="blood-select"
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Sent">Sent</option>
          <option value="Successful">Successful</option>
        </select>
      </div>

        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}

        <button className="login-btn" onClick={submit}>
          Save Changes
        </button>

      </div>
        </main>
        <nav class="bottom-menu">
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
        </div>
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
            <span>Requests</span>
        </div>
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>History</span>
        </div>
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Account</span>
        </div>
    </nav>
    </div>

  </div>
);
}

export default HospitalEditRequest;