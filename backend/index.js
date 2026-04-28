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

//Hospital registration form fields inserting
app.post("/register/hospital", (req, res) => {
  const {
    name,
    region,
    address,
    email,
    password,
    phone
  } = req.body;

  const sql = `
    INSERT INTO hospital (
      name, region, address, email, password, phone
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [
      name,
      region,
      address,
      email,
      password,
      phone
    ],
    (err, result) => {
      if (err){
      return res.status(500).json(err);
      }
      res.json({ message: "Hospital registered successfully" });
    }
  );
});

//Blood bank registration form fields inserting
app.post("/register/bloodbank", (req, res) => {
  const {
    name,
    region,
    address,
    email,
    password,
    phone,
    capacity
  } = req.body;

  const sql = `
    INSERT INTO blood_bank (
      name, region, address, email, password, phone, capacity
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql,
    [
      name,
      region,
      address,
      email,
      password,
      phone,
      capacity
    ],
    (err, result) => {
      if (err){
      return res.status(500).json(err);
      }
      res.json({ message: "Blood bank registered successfully" });
    }
  );
});

//Login form with email and password 

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // 1. Check donor
  const donorSql = "SELECT * FROM donor WHERE email = ? AND password = ?";
  db.query(donorSql, [email, password], (err, donorResult) => {
    if (err) return res.status(500).json(err);

    if (donorResult.length > 0) {
      return res.json({
        role: "donor",
        user: donorResult[0]
      });
    }

    // 2. Check hospital
    const hospitalSql = "SELECT * FROM hospital WHERE email = ? AND password = ?";
    db.query(hospitalSql, [email, password], (err2, hospitalResult) => {
      if (err2) return res.status(500).json(err2);

      if (hospitalResult.length > 0) {
        return res.json({
          role: "hospital",
          user: hospitalResult[0]
        });
      }

      // 3. Check blood bank
      const bloodSql = "SELECT * FROM blood_bank WHERE email = ? AND password = ?";
      db.query(bloodSql, [email, password], (err3, bloodResult) => {
        if (err3) return res.status(500).json(err3);

        if (bloodResult.length > 0) {
          return res.json({
            role: "blood_bank",
            user: bloodResult[0]
          });
        }

        // 4. No match
        return res.status(401).json({
          message: "Invalid email or password"
        });
      });
    });
  });
});

//Getting the number of active requests within the same region as the donor
app.get("/requests/count/:region", (req, res) => {
  const { region } = req.params;
  const sql = `SELECT COUNT(*) AS count FROM blood_request WHERE region = ? AND status = 'Sent'`;

  db.query(sql,[region], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ count: result[0].count });
  });
});