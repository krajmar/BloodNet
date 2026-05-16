import "../styles/BloodBankBloodInventories.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function BloodBankBloodInventories(){

    //const user = JSON.parse(localStorage.getItem("user"));
    const [completedRequests, setCompletedRequests] = useState([]);
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
            .get(`http://88.200.63.148:3001/bloodbank/blood_inventories/${user.id}`,{
                withCredentials: true
            })
            .then((res) => {
            setCompletedRequests(res.data);
            })
            .catch((err) => console.error(err));
        }, [user?.id]);

    return(
        <div class="notifications-container">
    <header class="page-header">
        <button class="back-btn" onClick={()=>navigate('/bloodbank/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Blood Inventories</h1>
    </header>

    <main class="notifications-list">
        
        {completedRequests.map((c) => (
            <div class="notification-card-req urgent">
            <div class="card-header">
                <div class="hospital-meta">
                    <h2>{c.blood_bank_name}</h2>
                    <p class="location-tag">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {c.region}
                    </p>
                </div>
                <div class="blood-type-square high-urgency">
                    <span class="type-label">TYPE</span>
                    <span class="type-value">{c.blood_type}</span>
                </div>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <label>Quantity</label>
                    <p class="urgency-text">{c.quantity}</p>
                </div>
            </div>
            <button className="edit-btn" onClick={() => navigate(`/bloodbank/blood_inventories/edit-blood-inventory/${c.blood_inventory_id}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit Blood Inventory
            </button>
        </div>
        ))}


    </main>

    <nav class="bottom-menu">
        <div class="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span>Home</span>
        </div>
        <div class="menu-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#880808" stroke="#880808" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
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


export default BloodBankBloodInventories;