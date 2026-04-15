const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database
const db = new sqlite3.Database('./database.db');

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL
)
`);

// GET projects
app.get('/projects', (req, res) => {
    db.all("SELECT * FROM projects ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// ADD project
app.post('/projects', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Missing data" });
    }

    db.run(
        "INSERT INTO projects (title, description) VALUES (?, ?)",
        [title, description],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                id: this.lastID,
                title,
                description
            });
        }
    );
});

// DELETE project
app.delete('/projects/:id', (req, res) => {
    db.run(
        "DELETE FROM projects WHERE id = ?",
        [req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Deleted successfully" });
        }
    );
});

// Start server
app.listen(5050, () => {
    console.log("🚀 Server running on http://localhost:5050");
});