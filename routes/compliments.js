const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Подключение к базе данных
const dbPath = path.resolve(__dirname, "../mydb.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Успешное подключение к базе данных");
  }
});

// Получить все комплименты
router.get("/", (req, res) => {
  db.all("SELECT * FROM compliments", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ compliments: rows });
  });
});

// Добавить новый комплимент
router.post("/", (req, res) => {
  const { compliment, show } = req.body;

  if (!compliment) {
    return res.status(400).json({ error: "Compliment is required" });
  }

  const showValue = show ? 1 : 0;

  db.run(
    `INSERT INTO compliments (compliment, show) VALUES (?, ?)`,
    [compliment, showValue],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        compliment: { id: this.lastID, compliment, show: !!showValue },
      });
    }
  );
});
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { compliment } = req.body;

  if (!compliment) {
    return res.status(400).json({ error: "Compliment is required" });
  }

  db.run(
    `UPDATE compliments SET compliment = ? WHERE id = ?`,
    [compliment, id],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Compliment updated successfully." });
    }
  );
});

// Обновить поле show
router.put("/show/:id", (req, res) => {
  const { id } = req.params;
  const { show } = req.body;

  db.run(
    `UPDATE compliments SET show = ? WHERE id = ?`,
    [show ? 1 : 0, id],
    function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Show status updated successfully." });
    }
  );
});

module.exports = router;
