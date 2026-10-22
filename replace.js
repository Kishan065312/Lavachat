const fs = require('fs');
const file = 'src/screens/SVIPScreen.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\.svg'\)/g, `.png')`).replace(/\.svg\"\)/g, `.png")`);
fs.writeFileSync(file, content);
console.log('Replaced .svg with .png in SVIPScreen.js');
