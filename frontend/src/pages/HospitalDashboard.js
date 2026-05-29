import "../styles/HospitalDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function HospitalDashboard() {

  //const user = JSON.parse(localStorage.getItem("user"));
  const [numberActiveRequests, setNumberActiveRequests] = useState(-1);
  const [lastRequest, setLastRequest] = useState(null);
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

  useEffect(()=>{
    axios
    .get(`http://88.200.63.148:30031/hospital/active_requests/count/${user?.id}`,{
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
    axios
    .get(`http://88.200.63.148:30031/hospital/last_request/${user?.id}`,{
        withCredentials: true
    })
    .then((res) => {
      setLastRequest(res.data.last_request);
    })
    .catch((err) => {
      console.error(err);
    });    
  })

  return (
<body>

    <div className="dashboard-container">
        
        <header className="header">
            <div className="profile-section">
                <div className="avatar-circle" onClick={()=>navigate('/hospital/profile')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#880808" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M3 7v14"></path><path d="M21 7v14"></path><path d="M9 21V11h6v10"></path><path d="M2 3h20"></path></svg>
                </div>
                <div className="user-meta">
                    <h2 className="user-name">{user?.name}</h2>
                    <p className="address">{user?.address}</p>
                </div>
            </div>
            <button className="burger-menu">
                <div className="burger-stack">
                    <div className="line-long"></div>
                    <div className="line-short"></div>
                </div>
            </button>
        </header>

        <main className="content">
            
            <div className="stats-grid">
                <div className="stat-card red-bg">
                    <p className="label">Last Request</p>
                    <p className="value">{new Date(lastRequest).toLocaleDateString()}</p>
                </div>
                <div className="stat-card white-bg">
                    <p className="label muted">Active Requests</p>
                    <p className="value dark">{numberActiveRequests}</p>
                </div>
            </div>

            <div className="feature-grid">
                
                <div className="grid-item" onClick={()=>navigate('/hospital/requests')}>
                    <div className="icon-wrapper red-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#880808" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </div>
                    <div className="item-info">
                        <h3>View/Edit requests</h3>
                        <p>Modify current blood requirements.</p>
                    </div>
                </div>

                <div className="grid-item" onClick={()=>navigate('/hospital/donations')}>
                    <div className="icon-wrapper amber-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B45309" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path></svg>
                    </div>
                    <div className="item-info">
                        <h3>Donations</h3>
                        <p>Track completed donations for your requests.</p>
                    </div>
                </div>

                <div className="grid-item" onClick={()=>navigate('/hospital/profile')}>
                    <div className="icon-wrapper gray-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className="item-info">
                        <h3>Account settings</h3>
                        <p>Make changes to the account details.</p>
                    </div>
                </div>

                <div className="grid-item" onClick={()=>navigate('/hospital/completed_requests')}>
                    <div className="icon-wrapper blue-tint">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    </div>
                    <div className="item-info">
                        <h3>Completed requests</h3>
                        <p>History of fulfilled blood units.</p>
                    </div>
                </div>

            </div>

            <div className="cta-banner" onClick={()=>navigate('/hospital/requests/create-request')}>
                <div className="cta-text">
                    <h4>Create a new request</h4>
                    <p>Broadcast emergency blood needs</p>
                </div>
                <div className="cta-circle">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            </div>
        </main>

        <nav className="navbar">
            <div className="nav-item active">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#880808" stroke="#880808" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Home</span>
            </div>
            <div className="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>
                <span>Map</span>
            </div>
            <div className="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span>History</span>
            </div>
            <div className="nav-item inactive">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Account</span>
            </div>
        </nav>

        <div className="home-indicator"></div>
    </div>

</body>
  );
}

export default HospitalDashboard;