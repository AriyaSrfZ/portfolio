// Usage: node career/render.mjs <input.html> <output.pdf>
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [inp, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.resolve(inp));
await page.waitForTimeout(400);
const overflow = await page.evaluate(() => {
  const m = document.querySelector('main'), p = document.querySelector('.page');
  return m && p ? Math.round(m.getBoundingClientRect().bottom - p.getBoundingClientRect().bottom) : 0;
});
await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await browser.close();
console.log(overflow > 0 ? `WARNING: content overflows the page by ${overflow}px, trim it` : 'fits on one page');
