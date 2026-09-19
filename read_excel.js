const fs = require('fs');
try {
  const xlsx = require('xlsx');
  const workbook = xlsx.readFile('e:\\Brand website\\S_listing--ui--group_096e58cf19cd42d6_1909-233006_default.xls');
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  console.log(JSON.stringify(data.slice(0, 5), null, 2));
} catch (e) {
  console.error("Error or xlsx not installed:", e.message);
}
