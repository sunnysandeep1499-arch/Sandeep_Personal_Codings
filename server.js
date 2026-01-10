const express = require("express");
const bodyParser = require("body-parser");
const { addDetailsToExcel } = require("./Creating_Files");

const app = express();
app.use(bodyParser.json());

app.post("/saveDetails", (req, res) => {
  try {
    const details = req.body;
    addDetailsToExcel(details);
    res.status(200).send({ message: "Details saved to Excel" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save details" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
