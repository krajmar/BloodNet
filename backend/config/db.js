const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "88.200.63.148",
  user: "studenti",
  password: "S039C8R7",
  database: "SISIII2026_89231110"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

module.exports = db;