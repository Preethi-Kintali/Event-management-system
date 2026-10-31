const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const targetExtensions = ['.md', '.html', '.ts', '.tsx', '.cjs', '.mjs', '.js', '.json'];
const excludeDirs = ['node_modules', '.git', '.output', '.tanstack', '.wrangler', 'dist', 'uploads'];

function replaceInText(content) {
  let updated = content;
  
  // Specific phrases first
  updated = updated.replace(/Ascent Platform/g, 'Eventura Platform');
  updated = updated.replace(/Eventora Platform/g, 'Eventura Platform');
  updated = updated.replace(/ascent-platform/g, 'eventura-platform');
  updated = updated.replace(/eventora-platform/g, 'eventura-platform');
  updated = updated.replace(/Eventora Enterprise/g, 'Eventura Enterprise');
  updated = updated.replace(/Ascent Enterprise/g, 'Eventura Enterprise');
  updated = updated.replace(/ascent_db/g, 'eventura_db');
  updated = updated.replace(/admin@ascent\.dev/g, 'admin@eventura.dev');
  updated = updated.replace(/admin@eventora\.edu/g, 'admin@eventura.edu');
  updated = updated.replace(/eventora\.edu/g, 'eventura.edu');
  updated = updated.replace(/https:\/\/eventora\.com/g, 'https://eventura.com');
  
  // Word boundaries for Ascent / Eventora
  updated = updated.replace(/\bAscent\b/g, 'Eventura');
  updated = updated.replace(/\bEventora\b/g, 'Eventura');

  return updated;
}

let modifiedFilesCount = 0;

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludeDirs.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (targetExtensions.includes(ext) && file !== 'rename-to-eventura.cjs' && file !== 'bun.lock' && file !== 'package-lock.json') {
        try {
          const original = fs.readFileSync(fullPath, 'utf8');
          const modified = replaceInText(original);
          if (modified !== original) {
            fs.writeFileSync(fullPath, modified, 'utf8');
            modifiedFilesCount++;
            console.log(`Updated: ${path.relative(projectRoot, fullPath)}`);
          }
        } catch (err) {
          console.error(`Error processing ${fullPath}:`, err.message);
        }
      }
    }
  }
}

console.log('=== STARTING BULK RENAMING TO EVENTURA ===');
walkDir(projectRoot);
console.log(`\nSuccessfully updated ${modifiedFilesCount} files to Eventura!`);
