const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'GlassAkahnd');
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !/-\d+w\.webp$/i.test(f));
  console.log('Files in GlassAkahnd:', files);
}
