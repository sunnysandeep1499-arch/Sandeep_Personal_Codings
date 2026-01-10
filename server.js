const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { addDetailsToExcel } = require("./Creating_Files");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/saveDetails", async (req, res) => {
  try {
    const details = req.body;
    const fileLink = await addDetailsToExcel(details);
    res.status(200).send({ message: "Details saved to Google Drive", link: fileLink });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save details" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
const response = await fetch("https://my-youth-backend.onrender.com/saveDetails", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(details)
});
