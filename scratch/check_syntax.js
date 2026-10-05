const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const content = fs.readFileSync(file, 'utf8');

try {
  const testCode = content.replace(/export const/g, 'const');
  new Function(testCode)();
  console.log("SYNTAX VALIDATION PASSED! No errors in products.js");
} catch (e) {
  console.error("SYNTAX ERROR:", e.message);
  console.error("Stack:", e.stack);
}
