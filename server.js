const express = require("express");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// Path to your Excel file
const filePath = "D:/Youth Meeting Updates/2026/Youth_Details.xlsx";

app.post("/save", (req, res) => {
  const details = req.body;

  // Load existing workbook or create new
  let wb;
  if (fs.existsSync(filePath)) {
    wb = XLSX.readFile(filePath);
  } else {
    wb = XLSX.utils.book_new();
  }

  let ws = wb.Sheets["Youth_Details"];
  let data = ws ? XLSX.utils.sheet_to_json(ws, { header: 1 }) : [];

  // Add header if empty
  if (data.length === 0) {
    data.push([
      "Name",
      "Phone",
      "Location",
      "Studies/Job",
      "Praise/Prayer Points",
      "Attended From",
      "Last Updated"
    ]);
  }

  const workInfo = details.studiesJobType === "Studies" ? details.studiesDetail : details.jobDetail;
  const now = new Date().toLocaleString();

  // Append new row
  data.push([
    (details.title || "") + " " + (details.name || ""),
    details.phone || "",
    details.location || "",
    workInfo || "",
    details.points || "",
    details.attendedFrom || "",
    now
  ]);

  // Write back to sheet
  ws = XLSX.utils.aoa_to_sheet(data);
  wb.Sheets["Youth_Details"] = ws;
  XLSX.writeFile(wb, filePath);

  res.json({ status: "success" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
