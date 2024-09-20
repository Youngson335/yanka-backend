const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, "./mydb.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Успешное подключение к базе данных SQLite");

    // Создание таблицы пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )`);

    // Создание таблицы комплиментов
    db.run(
      `CREATE TABLE IF NOT EXISTS compliments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      compliment TEXT NOT NULL,
      show INTEGER DEFAULT 0
    )`,
      (err) => {
        if (err) {
          console.error("Ошибка создания таблицы:", err.message);
        } else {
          // Проверка на наличие данных
          db.get(
            "SELECT COUNT(*) as count FROM compliments",
            [],
            (err, row) => {
              if (err) {
                console.error("Ошибка запроса:", err.message);
              } else if (row.count === 0) {
                // Добавление начальных комплиментов
                const initialCompliments = [
                  "Отличная работа!",
                  "Ты великолепен!",
                  "Супер!",
                ];

                const stmt = db.prepare(
                  "INSERT INTO compliments (compliment, show) VALUES (?, ?)"
                );
                initialCompliments.forEach((compliment) => {
                  stmt.run(compliment, 0, (err) => {
                    if (err) {
                      console.error(
                        "Ошибка добавления комплимента:",
                        err.message
                      );
                    } else {
                      console.log("Добавлен комплимент:", compliment);
                    }
                  });
                });
                stmt.finalize();
              }
            }
          );
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

const complimentsRouter = require("./routes/compliments");
app.use("/compliments", complimentsRouter);

module.exports = db;
