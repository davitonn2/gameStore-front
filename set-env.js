const fs = require('fs');
const path = require('path');

const backendUrl = process.env.apiUrl || process.env.API_URL || process.env.BACKEND_API_URL || process.env.BACKEND_URL || 'http://localhost:8080';
const authUrl = process.env.authUrl || process.env.AUTH_URL || process.env.AUTHURL || '';

const targetDir = path.join(__dirname, 'src', 'environments');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const content = `export const environment = {
  production: true,
  apiUrl: ${JSON.stringify(backendUrl)},
  authUrl: ${JSON.stringify(authUrl)}
};\n`;

fs.writeFileSync(path.join(targetDir, 'environment.prod.ts'), content, { encoding: 'utf8' });
console.log('Wrote src/environments/environment.prod.ts with API URL:', backendUrl);
