const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// 1. Load Master Excel / CSV data
// Primary source: build_json.js table (56 products) and S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls
const buildJsonPath = path.join(__dirname, '../build_json.js');
const buildJsonContent = fs.readFileSync(buildJsonPath, 'utf8');

// Parse markdown table from build_json.js
const masterList = [];
const lines = buildJsonContent.split('\n');
let tableStarted = false;
for (const rawLine of lines) {
  const line = rawLine.trim();
  if (line.includes('|  # | Product')) {
    tableStarted = true;
    continue;
  }
  if (tableStarted && line.startsWith('|')) {
    const cols = line.split('|').map(c => c.trim());
    if (cols.length >= 6 && !cols[1].includes('-:')) {
      const index = cols[1];
      const title = cols[2];
      const sku = cols[3];
      const hsn = cols[4];
      const gstStr = cols[5];
      let gstRate = parseInt(gstStr.replace('%', '').trim(), 10);
      let rawGst = gstStr;
      
      masterList.push({
        num: index,
        title,
        sku,
        hsn,
        gstRate,
        rawGst,
        taxCode: gstStr.includes('5') ? 'GST_5' : (gstStr.includes('18') ? 'GST_18' : (gstStr.includes('3') ? 'GST_3' : gstStr))
      });
    }
  }
}

console.log(`Loaded ${masterList.length} products from Master List.`);

// Load Flipkart Excel file if exists for additional reference
let excelDataMap = {};
try {
  const excelPath = path.join(__dirname, '../S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls');
  if (fs.existsSync(excelPath)) {
    const wb = xlsx.readFile(excelPath);
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const sku = r['Seller SKU Id'];
      if (sku) {
        excelDataMap[sku] = r;
      }
    }
    console.log(`Loaded ${Object.keys(excelDataMap).length} rows from Excel listing file.`);
  }
} catch (e) {
  console.log(`Excel load notice: ${e.message}`);
}

// 2. Load Frontend Products
let frontendProducts = [];
try {
  const feProductsPath = path.join(__dirname, '../frontend/src/data/products.js');
  const feContent = fs.readFileSync(feProductsPath, 'utf8');
  // We will parse or evaluate frontend products
  // Extract json-like structures or use regex / simple parsing
  fs.writeFileSync(path.join(__dirname, 'fe_content_dump.js'), feContent);
} catch (e) {
  console.log(`Frontend load error: ${e.message}`);
}

// Write auditing script to process everything
