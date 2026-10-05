const fs = require('fs');
const path = require('path');

async function run() {
  let xlsx;
  try {
    xlsx = require('xlsx');
  } catch (e) {
    console.error("xlsx module not installed in root, checking node_modules or installing...");
  }

  const excelFile = path.join(__dirname, '..', 'S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls');
  
  if (!xlsx) {
    console.log("Cannot run without xlsx");
    return;
  }

  const workbook = xlsx.readFile(excelFile);
  const sheetName = workbook.SheetNames[0];
  const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  console.log(`Excel total rows: ${excelData.length}`);
  if (excelData.length > 0) {
    console.log("Sample Excel Row keys:", Object.keys(excelData[0]));
    console.log("Sample Excel Row 0:", excelData[0]);
  }
}

run();
