import {useNavigate} from "react-router-dom";
import "../styles/RegisterRole.css";

function RegisterRole(){
    const navigate = useNavigate();

    return(
        <div className="register-container">

      <div className="register-card">

        <div className="header-section">
          <h1>Create Account</h1>
          <h4>Select your role to continue</h4>
        </div>

        <div className="role-section">

          <button
            className="role-btn"
            onClick={() => navigate("/register/donor")}
          >
            Donor
          </button>

          <button
            className="role-btn"
            onClick={() => navigate("/register/hospital")}
          >
            Hospital
          </button>

          <button
            className="role-btn"
            onClick={() => navigate("/register/bloodbank")}
          >
            Blood Bank
          </button>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

      </div>

    </div>
    )
}

export default RegisterRole;