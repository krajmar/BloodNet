import "../styles/MedicalNotesDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function MedicalNotesDashboard(){

    //const user = JSON.parse(localStorage.getItem("user"));
    const [medical_notes, setMedicalNotes] = useState([]);
    const navigate = useNavigate();
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

    useEffect(() => {
        if (!user?.id) return;

        axios
            .get(`http://88.200.63.148:3001/donor/medical_notes/${user.id}`,{
              withCredentials: true
            })
            .then((res) => {
            setMedicalNotes(res.data);
            })
            .catch((err) => console.error(err));
        }, [user]);

    return(
        <div class="notifications-container">
    <header class="page-header">
        <button class="back-btn" onClick={()=>navigate('/donor/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Medical Notes</h1>
    </header>

    <main class="notifications-list">
        {medical_notes.map((m) => {
  const isEligible = m.eligibility_status === "True";

  return (
    <div
      key={m.id}
      className={`note-card ${isEligible ? "green" : "red"}`}
    >
      {/* TOP */}
      <div className="note-header">
        <div className={`icon ${isEligible ? "green-bg-med-notes" : "red-bg-med-notes"}`}>
          {isEligible ? "✔" : "⚠"}
        </div>

        <div className="date">
          <p className="label">Reported On</p>
          <p className="value">
            {new Date(m.date_reported).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="note-body">
        <h2>ILLNESS / CONDITION</h2>
        <p>
          {m.description}
        </p>
      </div>

      {/* STATUS */}
      <div className="note-status">
        <span className={isEligible ? "status-green" : "status-red"}>
          {isEligible
            ? "Eligible for donations"
            : "Not eligible for donations"}
        </span>
      </div>
    </div>
  );
})}

        <button className="login-btn" onClick={()=>navigate('/donor/medical_notes/add_medical_note')}>
          Add New Medical Note
        </button>
    </main>

    <nav class="bottom-menu">
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
        </div>
        <div class="menu-item active">
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

    <div class="home-bar"></div>
</div>
    )
}

export default MedicalNotesDashboard;