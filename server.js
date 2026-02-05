const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const gameListRoutes = require("./routes/gamelist");

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Set it in .env before starting the server.");
  process.exit(1);
}

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/addtolist", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "addtolist.html"));
});

app.use(gameListRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});