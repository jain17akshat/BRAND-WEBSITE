const fs = require('fs');
const xlsx = require('xlsx');

try {
  const workbook = xlsx.readFile('e:\\Brand website\\S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls');
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  
  const productsMap = {};
  
  data.forEach(row => {
    const sku = row['Seller SKU Id'];
    if (sku) {
      const taxCodeStr = row['Tax Code'] || '';
      // Extract numeric value from "GST_18"
      const taxRate = parseInt(taxCodeStr.replace(/[^0-9]/g, ''), 10) || 0;
      
      productsMap[sku] = {
        title: row['Product Title'],
        hsn: String(row['Harmonized System Nomenclature - HSN'] || ''),
        tax: taxRate
      };
    }
  });

  const outputPath = 'e:\\Brand website\\backend\\data\\products_tax.json';
  fs.writeFileSync(outputPath, JSON.stringify(productsMap, null, 2));
  console.log(`Successfully wrote ${Object.keys(productsMap).length} products to ${outputPath}`);
} catch (e) {
  console.error("Error generating products JSON:", e.message);
}
