const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Koneksi ke database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database');
});

// Inisialisasi tabel (kalau belum ada)
db.run(`
  CREATE TABLE IF NOT EXISTS servis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT,
    perangkat TEXT,
    keluhan TEXT
  )
`);

// Endpoint tambah data
app.post('/api/servis', (req, res) => {
  const { nama, perangkat, keluhan } = req.body;
  db.run(
    'INSERT INTO servis (nama, perangkat, keluhan) VALUES (?, ?, ?)',
    [nama, perangkat, keluhan],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Endpoint ambil semua data servis
app.get('/api/servis', (req, res) => {
  db.all('SELECT * FROM servis', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
