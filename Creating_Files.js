// Creating_Files.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const XLSX = require("xlsx");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Google Drive Auth
const auth = new google.auth.GoogleAuth({
  keyFile: "youth-meating-8404c7028934.json", // path to your JSON key file
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

async function addDetailsToExcel(details) {
  const fileName = `youth_details_${new Date().toISOString().split("T")[0]}.xlsx`;
  const submittedAt = new Date().toLocaleString();

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet([
    {
      Title: details.title,
      Name: details.name,
      Phone: details.phone,
      Location: details.location,
      "Studies/Job":
        details.studiesJobType === "Studies"
          ? `Studying: ${details.studiesDetail}`
          : `Working at: ${details.jobDetail}`,
      Points: details.points,
      SubmittedAt: submittedAt,
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

  // Write to buffer and save locally
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  fs.writeFileSync(fileName, buffer);

  // Upload to Google Drive
  const drive = google.drive({ version: "v3", auth: await auth.getClient() });

  const fileMetadata = {
    name: fileName,
    parents: ["1lUXTt7uZfF2H9qJcJaM3Xt193KBUnIu-"], // ✅ Your folder ID
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: fs.createReadStream(fileName),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  console.log("✅ File uploaded:", response.data.webViewLink);
  return response.data.webViewLink;
}

// API endpoint
app.post("/saveDetails", async (req, res) => {
  try {
    const details = req.body;
    const fileLink = await addDetailsToExcel(details);
    res.status(200).send({ status: "success", link: fileLink });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: "Failed to save details" });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
