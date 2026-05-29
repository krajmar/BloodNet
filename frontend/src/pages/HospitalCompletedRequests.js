import "../styles/HospitalCompletedRequests.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function HospitalCompletedRequests(){

    //const user = JSON.parse(localStorage.getItem("user"));
    const [completedRequests, setCompletedRequests] = useState([]);
    const navigate = useNavigate();
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

    useEffect(() => {
        if (!user?.id) return;

        axios
            .get(`http://88.200.63.148:30031/hospital/completed_requests/${user.id}`,{
                withCredentials: true
            })
            .then((res) => {
            setCompletedRequests(res.data);
            })
            .catch((err) => console.error(err));
        }, [user?.id]);

    return(
        <div className="notifications-container">
    <header className="page-header">
        <button className="back-btn" onClick={()=>navigate('/hospital/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Completed Requests</h1>
    </header>

    <main className="notifications-list">
        
        {completedRequests.map((c) => (
            <div className="notification-card urgent">
            <div className="card-header">
                <div className="hospital-meta">
                    <h2>{c.hospital_name}</h2>
                    <p className="location-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {c.region}
                    </p>
                </div>
                <div className="blood-type-square high-urgency">
                    <span className="type-label">TYPE</span>
                    <span className="type-value">{c.blood_type}</span>
                </div>
            </div>

            <div className="details-grid">
                <div className="detail-item">
                    <label>Required Qty</label>
                    <p>{c.requested_quantity}</p>
                </div>
                <div className="detail-item">
                    <label>Urgency</label>
                    <p className="urgency-text">{c.urgency_level}</p>
                </div>
                <div className="detail-item">
                    <label>Status</label>
                    <span className="status-done">{c.status}</span>
                </div>
                <div className="detail-item">
                    <label>Request Date</label>
                    <p className="date-text">{new Date(c.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
        ))}


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
        <div className="menu-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#880808" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>History</span>
        </div>
        <div className="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Account</span>
        </div>
    </nav>

    <div className="home-bar"></div>
</div>
    )
}

/*CARD MESSAGE
<div className="card-message">
                <label>Message</label>
                <p>"Immediate need for A+ whole blood for emergency surgery. Your contribution can save a life today."</p>
            </div>*/

export default HospitalCompletedRequests;