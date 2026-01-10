// Creating_Files.js
const fs = require("fs");
const XLSX = require("xlsx");

function addDetailsToExcel(details) {
  const filePath = "Youth_Details.xlsx";

  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
    workbook.SheetNames.push("Sheet1");
    workbook.Sheets["Sheet1"] = XLSX.utils.aoa_to_sheet([[
      "Title", "Name", "Phone", "Location", "Studies/Job", "Points"
    ]]);
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert details into a row
  const newRow = {
    Title: details.title,
    Name: details.name,
    Phone: details.phone,
    Location: details.location,
    "Studies/Job": details.studiesJobType === "Studies"
      ? `Studying: ${details.studiesDetail}`
      : `Working at: ${details.jobDetail}`,
    Points: details.points
  };

  // Append row
  XLSX.utils.sheet_add_json(sheet, [newRow], { skipHeader: true, origin: -1 });

  // Save file
  XLSX.writeFile(workbook, filePath);
}

module.exports = { addDetailsToExcel };
