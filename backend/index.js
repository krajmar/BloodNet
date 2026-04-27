const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BloodNet API running");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

app.get("/test-db", (req, res) => {
  db.query("SELECT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Database connected successfully!");
  });
});


//Donor registration form fields inserting
app.post("/register/donor", (req, res) => {
  const {
    name,
    date_of_birth,
    age,
    sex,
    blood_type,
    region,
    email,
    password,
    phone
  } = req.body;

  const sql = `
    INSERT INTO donor (
      name, date_of_birth, age, sex,
      blood_type, region, email, password, phone,
      last_donation_date, total_donations
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 0)
  `;

  db.query(sql,
    [
      name,
      date_of_birth,
      age,
      sex,
      blood_type,
      region,
      email,
      password,
      phone
    ],
    (err, result) => {
      if (err){
      return res.status(500).json(err);
      }
      res.json({ message: "Donor registered successfully" });
    }
  );
});