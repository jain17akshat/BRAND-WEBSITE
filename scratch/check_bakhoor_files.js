const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'Bakhoor sticks');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  console.log('Files in Bakhoor sticks folder:', files);
}
