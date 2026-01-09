const express = require("express");
const XLSX = require("xlsx");
const cors = require("cors");
const { google } = require("googleapis");

const app = express();
app.use(express.json());
app.use(cors());

// Google Drive setup
const auth = new google.auth.GoogleAuth({
  keyFile: __dirname + "/youth-meating-8404c7028934.json", // service account JSON
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

// Folder ID
const folderId = "1lUXTt7uZfF2H9qJcJaM3Xt193KBUnIu-";

app.post("/saveDetails", async (req, res) => {
  const d = req.body;

  try {
    const currentDate = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Format with Capitalized headers
    const formattedDetails = {
      Title: d.title,
      Name: d.name,
      Phone: d.phone,
      Location: d.location,
      "Studies/Job": d.studiesJobType === "Studies"
        ? `Studying: ${d.studiesDetail}`
        : `Working at: ${d.jobDetail}`,
      "Praise/PrayerPoints": d.points,
      Date: currentDate
    };

    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and name='Youth_Details.xlsx' and trashed=false`,
      fields: "files(id, name)",
    });

    let workbook;
    let existingData = [];

    if (listRes.data.files.length > 0) {
      const fileId = listRes.data.files[0].id;

      const fileRes = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" }
      );

      const buffer = Buffer.from(fileRes.data);
      workbook = XLSX.read(buffer, { type: "buffer" });

      let worksheet = workbook.Sheets["YouthUpdates"];
      if (worksheet) {
        existingData = XLSX.utils.sheet_to_json(worksheet);
      }

      existingData.push(formattedDetails);
      const newSheet = XLSX.utils.json_to_sheet(existingData);
      workbook.Sheets["YouthUpdates"] = newSheet;
      if (!workbook.SheetNames.includes("YouthUpdates")) {
        workbook.SheetNames.push("YouthUpdates");
      }

      const updatedBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
      await drive.files.update({
        fileId,
        media: {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          body: Buffer.from(updatedBuffer),
        },
        resource: {},
        fields: "id",
      });

      console.log("File updated in Drive:", fileId);
    } else {
      workbook = XLSX.utils.book_new();
      existingData.push(formattedDetails);
      const newSheet = XLSX.utils.json_to_sheet(existingData);
      XLSX.utils.book_append_sheet(workbook, newSheet, "YouthUpdates");

      const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

      const fileMetadata = {
        name: "Youth_Details.xlsx",
        parents: [folderId],
      };
      const createRes = await drive.files.create({
        resource: fileMetadata,
        media: {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          body: Buffer.from(buffer),
        },
        fields: "id",
      });
      console.log("File created in Drive:", createRes.data.id);
    }

    res.status(200).send("Details saved successfully in Google Drive!");
  } catch (err) {
    console.error("Drive upload error:", err);
    res.status(500).send("Error saving details: " + (err.message || "Unknown error"));
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});