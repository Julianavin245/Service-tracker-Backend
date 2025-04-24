// backend/index.js
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// Buat tabel jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    device TEXT,
    issue TEXT,
    status TEXT
  )
`);

// API GET semua servis
app.get("/api/services", (req, res) => {
  db.all("SELECT * FROM services", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API Tambah servis baru
app.post("/api/services", (req, res) => {
  const { name, device, issue, status } = req.body;
  db.run(
    "INSERT INTO services (name, device, issue, status) VALUES (?, ?, ?, ?)",
    [name, device, issue, status],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
