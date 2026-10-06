const fs = require('fs');
const path = require('path');

const outsideDir = path.join(__dirname, '..', 'frontend', 'public', 'Outside images');
if (fs.existsSync(outsideDir)) {
  console.log('Outside images contents:', fs.readdirSync(outsideDir));
} else {
  console.log('Outside images directory does not exist.');
}
