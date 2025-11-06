const fs = require('fs');
const path = require('path');

// Adjust if your angular.json outputPath differs
const distDir = path.join(__dirname, 'dist', 'game-store');
const indexFile = path.join(distDir, 'index.html');
const fallbackFile = path.join(distDir, '200.html');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory not found:', distDir);
  process.exit(1);
}

if (!fs.existsSync(indexFile)) {
  console.error('index.html not found in dist:', indexFile);
  process.exit(1);
}

try {
  fs.copyFileSync(indexFile, fallbackFile);
  console.log('Copied index.html to 200.html for SPA fallback');
} catch (e) {
  console.error('Failed to copy index.html to 200.html', e);
  process.exit(1);
}
