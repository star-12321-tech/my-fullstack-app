const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all todos
router.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Add new todo
router.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, results) => {
    if (err) throw err;
    res.json({ id: results.insertId, task, completed: false });
  });
});

// Toggle complete
router.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

// Delete todo
router.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

module.exports = router;