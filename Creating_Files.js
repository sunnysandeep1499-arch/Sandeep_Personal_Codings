// Creating_Files.js
const fs = require("fs");
const XLSX = require("xlsx");
const { google } = require("googleapis");

// Authenticate with service account
const auth = new google.auth.GoogleAuth({
  keyFile: "youth-meating-8404c7028934.json", // path to your JSON key file
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

async function addDetailsToExcel(details) {
  const fileName = `youth_details_${new Date().toISOString().split("T")[0]}.xlsx`;

  // Create workbook
  let workbook = XLSX.utils.book_new();
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
    },
  ]);

  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");

  // Write to buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  // Upload to Google Drive
  const drive = google.drive({ version: "v3", auth: await auth.getClient() });

  const fileMetadata = {
    name: fileName,
    parents: ["1lUXTt7uZfF2H9qJcJaM3Xt193KBUnIu-"], // folder ID
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: Buffer.from(buffer),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: "id, webViewLink",
  });

  console.log("✅ File uploaded:", response.data.webViewLink);
  return response.data.webViewLink;
}

module.exports = { addDetailsToExcel };
