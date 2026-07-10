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
const cssRegex = /<link\s+[^>]*href=["']\/?(assets\/[^"']+\.css)["'][^>]*>/g;
let match;
while ((match = cssRegex.exec(htmlContent)) !== null) {
  const cssPath = path.join(distPath, match[1]);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    htmlContent = htmlContent.replace(match[0], `<style>${cssContent}</style>`);
    console.log(`Inlined CSS: ${match[1]}`);
  }
}

// Find and inline JS files
const jsRegex = /<script\s+[^>]*src=["']\/?(assets\/[^"']+\.js)["'][^>]*><\/script>/g;
while ((match = jsRegex.exec(htmlContent)) !== null) {
  const jsPath = path.join(distPath, match[1]);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    htmlContent = htmlContent.replace(match[0], `<script type="module">${jsContent}</script>`);
    console.log(`Inlined JS: ${match[1]}`);
  }
}

// Write the modified index.html back
fs.writeFileSync(htmlFile, htmlContent, 'utf8');
console.log('Successfully inlined all assets into dist/index.html! You can now open this file by double-clicking it.');
