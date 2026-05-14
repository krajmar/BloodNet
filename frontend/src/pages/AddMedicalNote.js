import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AddMedicalNote.css";

function AddMedicalNote() {

  const [error, setError] = useState("");
  //const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    illness: "",
    eligibility_status: ""
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   const submit = async () => {
  if (!form.description || !form.eligibility_status) {
    setError("Error: Empty field");
    return;
  }

  setError(""); // clear error if OK

  try {
    await axios.post(
      `http://88.200.63.148:3001/donor/medical_notes/add_medical_note/${user?.id}`,
      form,{
        withCredentials: true
      }
    );
    alert("Medical note added successfully!");
  } catch (err) {
    console.error(err);
    alert("Error adding medical note.");
  }
};

  return (
    <div class="notifications-container">
    <header class="page-header">
        <button class="back-btn" onClick={()=>navigate('/donor/medical_notes')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Add New Medical Note</h1>
    </header>

        <div className="form-wrapper">

  <div className="form-card">

    <div className="form-group">
      <label>Description</label>
      <textarea
        name="description"
        placeholder="Describe the medical condition..."
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Eligibility Status</label>
      <select name="eligibility_status" onChange={handleChange}>
        <option value="">Select status</option>
        <option value="True">Eligible</option>
        <option value="False">Not eligible</option>
      </select>
    </div>

    {error && (
      <div className="error-box">
        {error}
      </div>
    )}

    <button className="login-btn" onClick={submit}>
      Add medical note
    </button>

  </div>

</div>

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

    <div class="home-bar"></div>

      </div>
  );
}

export default AddMedicalNote;