import fs from 'fs';
import path from 'path';

const distPath = path.resolve('dist');
const htmlFile = path.join(distPath, 'index.html');

if (!fs.existsSync(htmlFile)) {
  console.error('Error: dist/index.html not found. Build the project first.');
  process.exit(1);
}

let htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Find and inline CSS files
const cssRegex = /<link\s+[^>]*href=["'](?:\.\/|\/)?(assets\/[^"']+\.css)["'][^>]*>/g;
htmlContent = htmlContent.replace(cssRegex, (match, cssFile) => {
  const cssPath = path.join(distPath, cssFile);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    console.log(`Inlined CSS: ${cssFile}`);
    return `<style>${cssContent}</style>`;
  }
  return match;
});

// Find and inline JS files
const jsRegex = /<script\s+[^>]*src=["'](?:\.\/|\/)?(assets\/[^"']+\.js)["'][^>]*><\/script>/g;
htmlContent = htmlContent.replace(jsRegex, (match, jsFile) => {
  const jsPath = path.join(distPath, jsFile);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    console.log(`Inlined JS: ${jsFile}`);
    return `<script type="module">${jsContent}</script>`;
  }
  return match;
});

// Write the modified index.html back
fs.writeFileSync(htmlFile, htmlContent, 'utf8');
console.log('Successfully inlined all assets into dist/index.html! You can now open this file by double-clicking it.');
