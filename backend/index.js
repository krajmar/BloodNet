const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const cookieParser = require("cookie-parser");
const app = express();

//app.use(cors());
app.use(cors({
  origin: "http://88.200.63.148:30032",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("BloodNet API running");
});

app.listen(30031, "0.0.0.0", () => {
  console.log("Server running on port 30031");
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
        console.error("SQL ERROR:", err);
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

    /*if (donorResult.length > 0) {
      return res.json({
        role: "donor",
        user: donorResult[0]
      });
    }*/

      if (donorResult.length > 0) {

      res.cookie("userId", donorResult[0].id, {
        httpOnly: true
      });

      res.cookie("role", "donor", {
        httpOnly: true
      });

      return res.json({
        role: "donor"
      });
    }

    // 2. Check hospital
    const hospitalSql = "SELECT * FROM hospital WHERE email = ? AND password = ?";
    db.query(hospitalSql, [email, password], (err2, hospitalResult) => {
      if (err2) return res.status(500).json(err2);

      /*if (hospitalResult.length > 0) {
        return res.json({
          role: "hospital",
          user: hospitalResult[0]
        });
      }*/

        if (hospitalResult.length > 0) {

        res.cookie("userId", hospitalResult[0].id, {
          httpOnly: true
        });

        res.cookie("role", "hospital", {
          httpOnly: true
        });

        return res.json({
          role: "hospital"
        });
      }

      // 3. Check blood bank
      const bloodSql = "SELECT * FROM blood_bank WHERE email = ? AND password = ?";
      db.query(bloodSql, [email, password], (err3, bloodResult) => {
        if (err3) return res.status(500).json(err3);

        /*if (bloodResult.length > 0) {
          return res.json({
            role: "blood_bank",
            user: bloodResult[0]
          });
        }*/

          if (bloodResult.length > 0) {

          res.cookie("userId", bloodResult[0].id, {
            httpOnly: true
          });

          res.cookie("role", "blood_bank", {
            httpOnly: true
          });

          return res.json({
            role: "blood_bank"
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

//ROUTE "ME" FOR GETTING THE DETAILS OF THE LOGGED USER

app.get("/me", (req, res) => {

  const userId = req.cookies.userId;
  const role = req.cookies.role;

  if (!userId || !role) {
    return res.status(401).json({
      message: "Not logged in"
    });
  }

  const table =
    role === "donor"
      ? "donor"
      : role === "hospital"
      ? "hospital"
      : "blood_bank";

  const sql = `SELECT * FROM ${table} WHERE id = ?`;

  db.query(sql, [userId], (err, result) => {

    if (err)
      return res.status(500).json(err);

    res.json(result[0]);

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

//Getting the number of total donations of the donor
app.get("/donor/total_donations/count/:id", (req, res) => {
  const donorId = req.params.id;
  const sql = `SELECT COUNT(*) AS count FROM donation WHERE donor_id = ? AND status = 'Successful'`;

  db.query(sql,[donorId], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ count: result[0].count });
  });
});

//Getting the last donation date of the donor
app.get("/donor/last_donation_date/:id", (req, res) => {

  const donorId = req.params.id;

  const sql = `
    SELECT donation_date AS last_donation_date
    FROM donation
    WHERE donor_id = ? AND status = 'Successful'
    ORDER BY donation_date DESC
    LIMIT 1
  `;

  db.query(sql, [donorId], (err, result) => {

    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    // No donations found
    if (result.length === 0) {
      return res.json({
        last_donation_date: null
      });
    }

    res.json({
      last_donation_date: result[0].last_donation_date
    });

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

      const statusSql = `UPDATE donor SET eligibility_status = ? WHERE id = ?`;
      db.query(statusSql,
    [
      eligibility_status,
      donorId
    ],
    (err, result) => {
      if (err){
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
      }
    });   

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


// Automatically generate donor awards
app.get("/donor/check-awards/:id", (req, res) => {

  const donorId = req.params.id;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM donation
    WHERE donor_id = ? AND status = 'Successful'
  `;

  db.query(countSql, [donorId], (err, result) => {

    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    const totalDonations = result[0].total;

    const awards = [];

if (totalDonations >= 5) {
  awards.push({
    name: "Bronze",
    description: "For the milestone of reaching 5 donations"
  });
}

if (totalDonations >= 10) {
  awards.push({
    name: "Silver",
    description: "For the milestone of reaching 10 donations"
  });
}

if (totalDonations >= 20) {
  awards.push({
    name: "Gold",
    description: "For the milestone of reaching 20 donations"
  });
}

    awards.forEach((award) => {

      const checkSql = `
        SELECT * FROM award
        WHERE donor_id = ? AND name = ?
      `;

      db.query(checkSql, [donorId, award.name], (checkErr, checkResult) => {

        if (checkErr) {
          console.error(checkErr);
          return;
        }

        // Award doesn't exist yet
        if (checkResult.length === 0) {

          const insertSql = `
            INSERT INTO award (
              donor_id,
              name,
              description,
              date_awarded
            )
            VALUES (?, ?, ?, CURDATE())
          `;

          db.query(insertSql, [donorId, award.name, award.description], (insertErr) => {

            if (insertErr) {
              console.error(insertErr);
            }

          });
        }
      });
    });

    res.json({
      message: "Awards checked successfully"
    });

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

    if (result.length === 0) {
      return res.json({
        last_request: null
      });
    }

    res.json({ last_request: result[0].last_request });
  });
});

//Getting the hospital's donations

app.get("/hospital/donations/:id", (req, res) => {
  const hospitalId = req.params.id;

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

      c.name AS donor_name,
      b.name AS blood_bank_name,

      h.name AS hospital_name

    FROM donation d
    JOIN blood_request r ON d.request_id = r.id
    LEFT JOIN donor c 
      ON d.donor_id = c.id

    LEFT JOIN blood_bank b 
      ON d.blood_bank_id = b.id 
    JOIN hospital h ON r.hospital_id = h.id

    WHERE r.hospital_id = ?
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Getting the hospital's completed requests

app.get("/hospital/completed_requests/:id", (req, res) => {
  const hospitalId = req.params.id;

  const sql = `
    SELECT 

      r.id AS request_id,
      r.quantity AS requested_quantity,
      r.blood_type,
      r.urgency_level,
      r.status,
      r.region,
      r.created_at,

      h.name AS hospital_name

    FROM blood_request r
    JOIN hospital h ON r.hospital_id = h.id

    WHERE r.hospital_id = ? AND r.status = 'Successful'
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Updating the hospital's personal details 

app.put("/hospital/edit-profile/:id", (req, res) => {
  const hospitalId = req.params.id;
  const { email, password, region, address, phone } = req.body;

  const sql = `
    UPDATE hospital 
    SET email = ?, password = ?, region = ?, address = ?, phone = ? 
    WHERE id = ?`;

  db.query(sql, [email, password, region, address, phone, hospitalId], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});

//Getting the hospital's requests

app.get("/hospital/requests/:id", (req, res) => {
  const hospitalId = req.params.id;

  const sql = `
    SELECT 

      r.id AS request_id,
      r.quantity AS requested_quantity,
      r.blood_type,
      r.urgency_level,
      r.status,
      r.region,
      r.created_at,

      h.name AS hospital_name

    FROM blood_request r
    JOIN hospital h ON r.hospital_id = h.id

    WHERE r.hospital_id = ? AND r.status = 'Sent'
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// Get one request for editing the requests of the hospital
app.get("/hospital/request/:id", (req, res) => {

  const hospitalId = req.params.id;

  const sql = `
    SELECT *
    FROM blood_request
    WHERE id = ?
  `;

  db.query(sql, [hospitalId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});

// Update hospital's request
app.put("/hospital/request/:id", (req, res) => {
  const hospitalId = req.params.id;
  const blood_type = req.body.blood_type;
  const address = req.body.address;
  const quantity = req.body.quantity;
  const urgency_level = req.body.urgency_level;
  const status = req.body.status;

  const sql = `
    UPDATE blood_request
    SET blood_type = ?, quantity = ?, urgency_level = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [blood_type, quantity, urgency_level, status, hospitalId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Request updated successfully"
      });
    }
  );
});

//Hospital creating a new request and adding notifications for the donors and blood banks
app.post("/hospital/requests/create-request/:id", (req, res) => {

  const {
    blood_type,
    quantity,
    urgency_level,
    message,
    region
  } = req.body;

  const hospitalId = req.params.id;

  const sql = `
    INSERT INTO blood_request (
      hospital_id,
      blood_type,
      quantity,
      urgency_level,
      region,
      status,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, 'Sent', CURDATE())
  `;

  db.query(
    sql,
    [
      hospitalId,
      blood_type,
      quantity,
      urgency_level,
      region
    ],
    (err, result) => {

      if (err) {
        console.error("SQL ERROR:", err);
        return res.status(500).json(err);
      }

      const requestId = result.insertId;

      // =========================
      // FIND MATCHING DONORS
      // =========================

      const donorSql = `
        SELECT id
        FROM donor
        WHERE blood_type = ? AND region = ?
      `;

      db.query(
        donorSql,
        [blood_type, region],
        (donorErr, donors) => {

          if (donorErr) {
            console.error(donorErr);
            return res.status(500).json(donorErr);
          }

          // Create notification for every donor
          donors.forEach((donor) => {

            const notificationSql = `
              INSERT INTO notification (
                recipient_donor_id,
                request_id,
                message,
                sent_at
              )
              VALUES (?, ?, ?, NOW())
            `;

            db.query(
              notificationSql,
              [
                donor.id,
                requestId,
                message
              ]
            );
          });

        }
      );

      // =========================
      // FIND MATCHING BLOOD BANKS
      // =========================

      const bloodBankSql = `
        SELECT id
        FROM blood_bank
        WHERE region = ?
      `;

      db.query(
        bloodBankSql,
        [region],
        (bbErr, bloodBanks) => {

          if (bbErr) {
            console.error(bbErr);
            return res.status(500).json(bbErr);
          }

          bloodBanks.forEach((bank) => {

            const notificationSql = `
              INSERT INTO notification (
                recipient_blood_bank_id,
                request_id,
                message,
                sent_at
              )
              VALUES (?, ?, ?, NOW())
            `;

            db.query(
              notificationSql,
              [
                bank.id,
                requestId,
                message
              ]
            );
          });

        }
      );

      res.json({
        message: "New request created successfully"
      });

    }
  );
});

//==================================BLOOD BANK ==========================================

//Getting the number of active requests within the same region as the blood bank
app.get("/bloodbank/requests/count/:region", (req, res) => {
  const { region } = req.params;
  const sql = `SELECT COUNT(*) AS count FROM blood_request WHERE region = ? AND status = 'Sent'`;

  db.query(sql,[region], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json({ count: result[0].count });
  });
});

//Getting the date of the last donation of the bloodbank
app.get("/bloodbank/last_donation/:id", (req, res) => {
  const bloodBankId = req.params.id;
  const sql = `SELECT donation_date AS last_donation_date FROM donation WHERE blood_bank_id = ? ORDER BY donation_date DESC LIMIT 1;`;

  db.query(sql,[bloodBankId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json({
        last_request: null
      });
    }

    res.json({ last_donation_date: result[0].last_donation_date });
  });
});

//Getting the number of the total donations of the bloodbank
app.get("/bloodbank/total_donations/:id", (req, res) => {
  const bloodBankId = req.params.id;
  const sql = `SELECT COUNT (*) AS total_donations FROM donation WHERE blood_bank_id = ?;`;

  db.query(sql,[bloodBankId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.json({
        last_request: null
      });
    }

    res.json({ total_donations: result[0].total_donations });
  });
});

//Getting the blood bank's notifications

app.get("/bloodbank/notifications/:id", (req, res) => {
  const bloodBankId = req.params.id;
  const bloodBankRegion = req.query.region;

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

    WHERE r.region = ? AND r.status = 'Sent' 
  `;

  db.query(sql, [bloodBankRegion], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Getting the Blood bank's awards

app.get("/bloodbank/awards/:id", (req, res) => {
  const bloodBankId = req.params.id;

  const sql = `
    SELECT * FROM award
    WHERE blood_bank_id = ?`;

  db.query(sql, [bloodBankId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// Automatically generate bloodbank awards
app.get("/bloodbank/check-awards/:id", (req, res) => {

  const bloodBankId = req.params.id;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM donation
    WHERE blood_bank_id = ? AND status = 'Successful'
  `;

  db.query(countSql, [bloodBankId], (err, result) => {

    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }

    const totalDonations = result[0].total;

    const awards = [];

if (totalDonations >= 5) {
  awards.push({
    name: "Bronze",
    description: "For the milestone of reaching 5 donations"
  });
}

if (totalDonations >= 10) {
  awards.push({
    name: "Silver",
    description: "For the milestone of reaching 10 donations"
  });
}

if (totalDonations >= 20) {
  awards.push({
    name: "Gold",
    description: "For the milestone of reaching 20 donations"
  });
}

    awards.forEach((award) => {

      const checkSql = `
        SELECT * FROM award
        WHERE blood_bank_id = ? AND name = ?
      `;

      db.query(checkSql, [bloodBankId, award.name], (checkErr, checkResult) => {

        if (checkErr) {
          console.error(checkErr);
          return;
        }

        // Award doesn't exist yet
        if (checkResult.length === 0) {

          const insertSql = `
            INSERT INTO award (
              blood_bank_id,
              name,
              description,
              date_awarded
            )
            VALUES (?, ?, ?, CURDATE())
          `;

          db.query(insertSql, [bloodBankId, award.name, award.description], (insertErr) => {

            if (insertErr) {
              console.error(insertErr);
            }

          });
        }
      });
    });

    res.json({
      message: "Awards checked successfully"
    });

  });

});

//Getting the Blood bank's donations

app.get("/bloodbank/donations/:id", (req, res) => {
  const bloodBankId = req.params.id;

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

    WHERE d.blood_bank_id = ?
  `;

  db.query(sql, [bloodBankId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

//Updating the Blood bank's personal details 

app.put("/bloodbank/edit-profile/:id", (req, res) => {
  const bloodBankId = req.params.id;
  const { email, password, region, address, capacity, phone } = req.body;

  const sql = `
    UPDATE blood_bank 
    SET email = ?, password = ?, region = ?, address = ?, capacity = ?, phone = ? 
    WHERE id = ?`;

  db.query(sql, [email, password, region, address, capacity, phone, bloodBankId], (err, result) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ error: "Database update failed" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});

//Getting the blood bank's blood inventories

app.get("/bloodbank/blood_inventories/:id", (req, res) => {
  const bloodBankId = req.params.id;

  const sql = `
    SELECT 

      r.id AS blood_inventory_id,
      r.blood_type,
      r.quantity_available AS quantity,

      b.name AS blood_bank_name,
      b.region

    FROM blood_inventory r
    JOIN blood_bank b ON r.blood_bank_id = b.id

    WHERE b.id = ?
  `;

  db.query(sql, [bloodBankId], (err, result) => {
    if (err){ 
      console.error("SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});


// Get one blood inventory for editing the blood inventories of the blood bank
app.get("/bloodbank/blood_inventory/:id", (req, res) => {

  const bloodInventoryId = req.params.id;

  const sql = `
    SELECT *
    FROM blood_inventory
    WHERE id = ?
  `;

  db.query(sql, [bloodInventoryId], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
});

// Update blood bank's blood inventory
app.put("/bloodbank/blood_inventory/:id", (req, res) => {
  const quantity = req.body.quantity_available;
  const bloodInventoryId = req.params.id;

  const sql = `
    UPDATE blood_inventory
    SET quantity_available = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [quantity, bloodInventoryId],
    (err, result) => {
      if (err){ 
         console.error("SQL ERROR:", err);
        return res.status(500).json(err);        
      }
      res.json({
        message: "Blood inventory updated successfully"
      });
    }
  );
});