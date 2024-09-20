const express = require("express");
const router = express.Router();
const db = require("../app"); // Экспортируем подключение из app.js

// Получить всех пользователей
router.get("/", (req, res) => {
  db.all("SELECT * FROM compliments", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    console.log("Полученные данные из БД:", rows); // Логирование данных
    res.json({ compliments: rows });
  });
});

// Добавить нового пользователя
router.post("/", (req, res) => {
  const { name, email } = req.body;
  db.run(
    `INSERT INTO users (name, email) VALUES (?, ?)`,
    [name, email],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ user: { id: this.lastID, name, email } });
    }
  );
});

module.exports = router;
