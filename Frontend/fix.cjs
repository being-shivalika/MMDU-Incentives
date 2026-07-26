const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src/pages');

let changed = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Calculate relative path to src/shared/components
  const fileDir = path.dirname(file);
  const targetDir = path.join('src', 'shared', 'components');
  let relPath = path.relative(fileDir, targetDir).replace(/\\/g, '/');
  
  // Fix any previously replaced wrong paths
  content = content.replace(/['"].*?shared\/components\/(.*?)['"]/g, `"${relPath}/$1"`);
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
    console.log('Fixed ' + file + ' -> using ' + relPath);
  }
});
console.log('Total files fixed: ' + changed);
