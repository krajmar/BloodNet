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

//Getting the donor's donations

app.get("/donor/donations/:id", (req, res) => {
  const donorId = req.params.id;

  const sql = `
    SELECT 
      d.id AS donation_id,
      d.donation_date,
      d.quantity AS donated_quantity,
      d.status AS donation_status,

      r.id AS request_id,
      r.quantity AS requested_quantity,
      r.blood_type,
      r.urgency_level,
      r.region,

      h.name AS hospital_name

    FROM donation d
    JOIN blood_request r ON d.request_id = r.id
    JOIN hospital h ON r.hospital_id = h.id

    WHERE d.donor_id = ?
  `;

  db.query(sql, [donorId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Getting the donor's medical notes

app.get("/donor/medical_notes/:id", (req, res) => {
  const donorId = req.params.id;

  const sql = `
    SELECT * FROM medical_notes
    WHERE donor_id = ?`;

  db.query(sql, [donorId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Donor adding medical note form fields inserting
app.post("/donor/medical_notes/add_medical_note/:id", (req, res) => {
  const {
    description,
    eligibility_status
  } = req.body;

  const donorId = req.params.id;

  const sql = `
    INSERT INTO medical_notes (
      donor_id, description, date_reported, eligibility_status
    )
    VALUES (?, ?, CURDATE(), ?)
  `;

  db.query(sql,
    [
      donorId,
      description,
      eligibility_status
    ],
    (err, result) => {
      if (err){
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
      }
      res.json({ message: "Medical note inserted successfully" });
    }
  );
});

//Getting the donor's awards

app.get("/donor/awards/:id", (req, res) => {
  const donorId = req.params.id;

  const sql = `
    SELECT * FROM award
    WHERE donor_id = ?`;

  db.query(sql, [donorId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Getting the donor's notifications

app.get("/donor/notifications/:id", (req, res) => {
  const donorId = req.params.id;
  const bloodType = req.query.blood_type;
  const donorRegion = req.query.region;

  const sql = `
    SELECT 
      n.id AS notification_id,
      n.message AS message,

      r.id AS request_id,
      r.quantity AS requested_quantity,
      r.blood_type,
      r.urgency_level,
      r.region,
      r.status AS request_status,
      r.created_at AS date_created,

      h.name AS hospital_name

    FROM notification n
    JOIN blood_request r ON n.request_id = r.id
    JOIN hospital h ON r.hospital_id = h.id

    WHERE r.blood_type = ? AND r.region = ? AND r.status = 'Sent' 
  `;

  db.query(sql, [bloodType, donorRegion], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Updating the donor's personal details 

app.put("/donor/edit-profile/:id", (req, res) => {
  const userId = req.params.id;
  const { email, password, region, phone } = req.body;

  const sql = `
    UPDATE donor 
    SET email = ?, password = ?, region = ?, phone = ? 
    WHERE id = ?`;

  db.query(sql, [email, password, region, phone, userId], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});

//==================================================HOSPITAL=============================================================================

//Getting the number of active requests that the hospital created
app.get("/hospital/active_requests/count/:id", (req, res) => {
  const hospitalId = req.params.id;
  const sql = `SELECT COUNT(*) AS count FROM blood_request WHERE hospital_id = ? AND status = 'Sent'`;

  db.query(sql,[hospitalId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ count: result[0].count });
  });
});

//Getting the date of the last request of the hospital
app.get("/hospital/last_request/:id", (req, res) => {
  const hospitalId = req.params.id;
  const sql = `SELECT created_at AS last_request FROM blood_request WHERE hospital_id = ? ORDER BY created_at DESC LIMIT 1;`;

  db.query(sql,[hospitalId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json({ last_request: result[0].last_request });
  });
});