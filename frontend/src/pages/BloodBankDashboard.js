import "../styles/BloodBankDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function BloodBankDashboard() {

  //const user = JSON.parse(localStorage.getItem("user"));
  const [numberActiveRequests, setNumberActiveRequests] = useState(-1);
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [totalDonations, setTotalDonations] = useState(-1);
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

  useEffect(()=>{
    if(!user?.region) return;
    axios
    .get(`http://88.200.63.148:30031/bloodbank/requests/count/${user?.region}`,{
        withCredentials: true
    })
    .then((res) => {
      setNumberActiveRequests(res.data.count);
    })
    .catch((err) => {
      console.error(err);
    });    
  })

  useEffect(()=>{
    if(!user?.id) return;
    axios
    .get(`http://88.200.63.148:30031/bloodbank/last_donation/${user?.id}`,{
        withCredentials: true
    })
    .then((res) => {
      setLastDonationDate(res.data.last_donation_date);
    })
    .catch((err) => {
      console.error(err);
    });    
  })

  useEffect(()=>{
    if(!user?.id) return;
    axios
    .get(`http://88.200.63.148:30031/bloodbank/total_donations/${user?.id}`,{
        withCredentials: true
    })
    .then((res) => {
      setTotalDonations(res.data.total_donations);
    })
    .catch((err) => {
      console.error(err);
    });    
  })

  return (
<body>

    <div class="dashboard-container">
        
        <header class="header">
            <div class="profile-section">
                <div class="avatar-circle" onClick={()=>navigate('/bloodbank/profile')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#880808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M3 7v14"></path><path d="M21 7v14"></path><path d="M9 21V11h6v10"></path><path d="M2 3h20"></path></svg>
                </div>
                <div class="user-meta">
                    <h2 class="user-name">{user?.name}</h2>
                    <p class="address">{user?.address}</p>
                </div>
            </div>
            <button class="burger-menu">
                <div class="burger-stack">
                    <div class="line-long"></div>
                    <div class="line-short"></div>
                </div>
            </button>
        </header>

        <main class="content">
            
            <div class="stats-grid">
                <div class="stat-card red-bg">
                    <p class="label">Last Donation</p>
                    <p class="value">{new Date(lastDonationDate).toLocaleDateString()}</p>
                </div>
                <div class="stat-card white-bg">
                    <p class="label muted">Total Donations</p>
                    <p class="value dark">{totalDonations}</p>
                </div>
            </div>

            <div class="feature-grid">
                
                <div class="grid-item" onClick={()=>navigate('/bloodbank/notifications')}>
                    <div class="icon-wrapper red-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#880808" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    </div>
                    <div class="item-info">
                        <h3>Notifications</h3>
                        <p>Urgent requests and system updates.</p>
                    </div>
                </div>

                <div class="grid-item" onClick={()=>navigate('/bloodbank/awards')}>
                    <div class="icon-wrapper amber-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                    </div>
                    <div class="item-info">
                        <h3>Awards</h3>
                        <p>View your badges and achievements.</p>
                    </div>
                </div>

                <div class="grid-item" onClick={()=>navigate('/bloodbank/donations')}>
                    <div class="icon-wrapper amber-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
                    </div>
                    <div class="item-info">
                        <h3>Donations</h3>
                        <p>History of your blood contributions.</p>
                    </div>
                </div>

                <div class="grid-item" onClick={()=>navigate('/bloodbank/blood_inventories')}>
                    <div class="icon-wrapper blue-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14.5 2 14.5 7.5 20 7.5"></polyline></svg>
                    </div>
                    <div class="item-info">
                        <h3>Blood Inventories</h3>
                        <p>How much blood of each type do we have?</p>
                    </div>
                </div>

            </div>

            <div class="cta-banner">
                <div class="cta-text">
                    <h4>Find Blood Drive</h4>
                    <p>{numberActiveRequests} events near you today</p>
                </div>
                <div class="cta-circle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </div>
        </main>

        <nav class="navbar">
            <div class="nav-item active">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#880808" stroke="#880808" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Home</span>
            </div>
            <div class="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
                <span>Map</span>
            </div>
            <div class="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>History</span>
            </div>
            <div class="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Account</span>
            </div>
        </nav>

        <div class="home-indicator"></div>
    </div>

</body>
  );
}

export default BloodBankDashboard;