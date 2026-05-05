//import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
//import axios from "axios";
import "../styles/DonorProfile.css";

function DonorProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  /*const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`http://88.200.63.148:3001/donor/profile/${user.id}`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [user?.id]);*/

  const isEligible = user?.eligibility_status === "True";

  return (
      <div className="profile-container">
    <header className="page-header">
        <button className="back-btn" onClick={()=>navigate('/donor/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Personal details</h1>
    </header>

      <main className="profile-content">
        <div className="profile-hero">
          <div className="avatar-box">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#880808" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2>{user?.name || "Loading..."}</h2>
          <span className={`eligibility-pill ${isEligible ? 'eligible' : 'not-eligible'}`}>
            {isEligible ? "Eligible for Donation" : "Not Eligible"}
          </span>
        </div>

        <div className="info-list">
          <div className="info-row"><span>Date of Birth</span><p>{new Date(user?.date_of_birth).toLocaleDateString()}</p></div>
          <div className="info-row"><span>Sex</span><p>{user?.sex}</p></div>
          <div className="info-row"><span>Blood Type</span><p className="blood-type">{user?.blood_type}</p></div>
          <div className="info-row"><span>Region</span><p>{user?.region}</p></div>
          <div className="info-row"><span>Email</span><p>{user?.email}</p></div>
          <div className="info-row"><span>Phone</span><p>{user?.phone}</p></div>
          <div className="info-row last-donation"><span>Last Donation</span><p>{new Date(user?.last_donation_date).toLocaleDateString()}</p></div>
        </div>

        <button className="edit-btn" onClick={() => navigate('/donor/edit-profile')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Edit Information
        </button>
      </main>

      <nav className="bottom-menu">
        <div className="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
        </div>
        <div className="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
            <span>Requests</span>
        </div>
        <div className="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>History</span>
        </div>
        <div className="menu-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="880808" stroke="#880808" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Account</span>
        </div>
    </nav>
    </div>
  );
}

export default DonorProfile;