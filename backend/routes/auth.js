const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({
        message: "Login successful",
        user: results[0]
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

module.exports = router;