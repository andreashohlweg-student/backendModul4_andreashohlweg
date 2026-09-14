import express from "express";
import users from "../data/users.json" with { type: "json" };

const app = express();
const PORT = 3000;

app.get("/echo", (req, res) => {
  res.send("Echo");
});

app.get("/hello", (req, res) => {
    res.status(200).json({
    success: true,
    message: "Syntax!",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/greet/:name", (req, res) => {
  const {name} = req.params;
  const lang = req.query.lang;

  const message =
    lang === "en"
      ? `Hello ${name}`
      : `Hallo ${name}`;

  res.json({ message });
});

app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});