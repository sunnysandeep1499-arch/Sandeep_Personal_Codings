const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

const filePath = "D:/Projects/Sandeep_Personal_Codings/Youth_Details.xlsx";

app.post("/save", (req, res) => {
  const details = req.body;

  let wb;
  if (fs.existsSync(filePath)) {
    wb = XLSX.readFile(filePath);
  } else {
    wb = XLSX.utils.book_new();
  }

  let ws = wb.Sheets["Youth_Details"];
  let data = ws ? XLSX.utils.sheet_to_json(ws, { header: 1 }) : [];

  if (data.length === 0) {
    data.push([
      "Name", "Phone", "Location", "Studies/Job",
      "Praise/Prayer Points", "Attended From", "Last Updated"
    ]);
  }

  const workInfo = details.studiesJobType === "Studies" ? details.studiesDetail : details.jobDetail;
  const now = new Date().toLocaleString();

  const fullName = (details.title || "") + " " + (details.name || "");

  // Check if row exists
  let updated = false;
  for (let i = 1; i < data.length; i++) {
    if (
      data[i][0] === fullName &&
      data[i][1] === details.phone &&
      data[i][2] === details.location
    ) {
      // Update existing row
      data[i][3] = workInfo || "";
      data[i][4] = details.points || "";
      data[i][5] = details.attendedFrom || "";
      data[i][6] = now;
      updated = true;
      break;
    }
  }

  if (!updated) {
    // Append new row
    data.push([
      fullName,
      details.phone || "",
      details.location || "",
      workInfo || "",
      details.points || "",
      details.attendedFrom || "",
      now
    ]);
  }

  ws = XLSX.utils.aoa_to_sheet(data);
  wb.Sheets["Youth_Details"] = ws;
  XLSX.writeFile(wb, filePath);

  res.json({ status: "success", updated });
});

// Endpoint to get all names for dropdown
app.get("/names", (req, res) => {
  if (!fs.existsSync(filePath)) return res.json([]);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets["Youth_Details"];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
  const names = data.slice(1).map(row => row[0]); // skip header
  res.json(names);
});

// Endpoint to get details by name
app.get("/details/:name", (req, res) => {
  const name = req.params.name;
  if (!fs.existsSync(filePath)) return res.json({});
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets["Youth_Details"];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const headers = data[0];
  const row = data.find(r => r[0] === name);
  if (!row) return res.json({});

  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);
  res.json(obj);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
