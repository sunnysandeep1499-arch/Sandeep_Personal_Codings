// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is alive!");
});

// saveDetails route
app.post("/saveDetails", (req, res) => {
  console.log("Received:", req.body);
  res.status(200).send("Details saved successfully!");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});