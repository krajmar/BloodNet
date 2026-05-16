import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import "../styles/BloodBankEditBloodInventory.css";

function BloodBankEditBloodInventory() {

  const [error, setError] = useState("");
  const navigate = useNavigate();
  //const user = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  useEffect(() => {

    axios.get(
        "http://88.200.63.148:3001/me",
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
    quantity: ""
  });

  const [blood_bank_blood_type, setBloodBankBloodType] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    axios
      .get(`http://88.200.63.148:3001/bloodbank/blood_inventory/${id}`,{
        withCredentials: true
      })
      .then((res) => {
        setForm(res.data);
        setBloodBankBloodType(res.data.blood_type);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const submit = async () => {
      if (!form.quantity_available) {
      setError("Error: Empty field");
      return;
    }

    setError("");
    try {
      await axios.put(
        `http://88.200.63.148:3001/bloodbank/blood_inventory/${id}`,
        form,
        {
          withCredentials: true
        }
      );

      alert("Inventory updated!");

    navigate('/bloodbank/blood_inventories');
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
          onClick={() => navigate('/bloodbank/blood_inventories')}
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

        <h1>Edit Blood Inventory</h1>
      </header>
        <main className="notifications-list">
      <div className="login-form">

      <div class="blood-type-square high-urgency">
            <span class="type-label">TYPE</span>
            <span class="type-value">{blood_bank_blood_type}</span>
     </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          name="quantity_available"
          placeholder="Quantity"
          value={form.quantity_available}
          onChange={handleChange}
        />
      </div>

        {error && (
          <div className="error-box">
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

export default BloodBankEditBloodInventory;