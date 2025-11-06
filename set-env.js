const fs = require('fs');
const path = require('path');

const backendUrl = process.env.BACKEND_API_URL || process.env.BACKEND_URL || 'https://loja-jogo.onrender.com';

const targetDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const content = `export const environment = {
  production: true,
  apiUrl: '${backendUrl.replace(/\\/g, '\\')}'
};\n`;

fs.writeFileSync(path.join(targetDir, 'environment.prod.ts'), content, { encoding: 'utf8' });
console.log('Wrote src/environments/environment.prod.ts with API URL:', backendUrl);
