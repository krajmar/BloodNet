import "../styles/BloodBankAwardsDashboard.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


function BloodBankAwardsDashboard(){

    //const user = JSON.parse(localStorage.getItem("user"));
    const [awards, setAwards] = useState([]);
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

        axios.get(
          `http://88.200.63.148:30031/bloodbank/check-awards/${user.id}`,
          {
            withCredentials: true
          }
        )
        .then(() => {

          return axios.get(
            `http://88.200.63.148:30031/bloodbank/awards/${user.id}`,
            {
              withCredentials: true
            }
          );

        })
        .then((res) => {
          setAwards(res.data);
        })
        .catch((err) => {
          console.error(err);
        });

}, [user]);

    return(
        <div className="notifications-container">
    <header className="page-header">
        <button className="back-btn" onClick={()=>navigate('/bloodbank/dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Awards</h1>
    </header>

    <main className="notifications-list">
        {awards.map((a) => {

        const awardType = a.name?.toLowerCase(); // "gold", "silver", "bronze"

  return (
      <div className={`award-card-${awardType}`} key={a.id}>

      <div className="award-glow"></div>

      <div className="award-row">

      <div className={`award-icon-${awardType}`}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B45309"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="6"></circle>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
        </svg>
      </div>

      <div className="award-content">

        <h2 className="award-title">{a.name} Award</h2>

        <p className="award-text">
          {a.description}
        </p>

        <div className="award-date">
          <span className="date-label">Date Awarded</span>
          <p className="date-value">{new Date(a.date_awarded).toLocaleDateString()}</p>
        </div>
        </div>
      </div>

    </div>
  );
})}

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
        <div className="menu-item inactive">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Account</span>
        </div>
    </nav>

    <div className="home-bar"></div>
</div>
    )
}

export default BloodBankAwardsDashboard;