import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <div className="home-card">

        <div className="logo-section">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
            <path d="M30 0C30 0 60 25.1429 60 51.4286C60 67.2081 46.5685 80 30 80C13.4315 80 0 67.2081 0 51.4286C0 25.1429 30 0 30 0Z" fill="#880808"/>
          </svg>

          <h1>BloodNet</h1>
          <h4>
            Connecting donors, hospitals and blood banks for blood requests
          </h4>
        </div>

        <div className="button-section">
          <button onClick={() => navigate("/login")} className="primary-btn">
            Login
          </button>

          <button onClick={() => navigate("/register")} className="secondary-btn">
            Register
          </button>
        </div>

      </div>

    </div>
  );
}

export default Home;