const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateThumbnail() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2, // High-DPI 2x for ultra-sharp YouTube rendering
  });

  // Copy template and images to public so they are served via static server or file url
  const htmlPath = path.join(__dirname, 'thumbnail-template.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  // Convert images to base64 so file:// protocol doesn't have cross-origin or path issues
  const logoPath = path.join(__dirname, '../public/skinmate-logo.png');
  const facePath = path.join(__dirname, '../public/demo-face.jpg');

  const logoBase64 = `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`;
  const faceBase64 = `data:image/jpeg;base64,${fs.readFileSync(facePath).toString('base64')}`;

  html = html.replace('src="skinmate-logo.png"', `src="${logoBase64}"`);
  html = html.replace('src="demo-face.jpg"', `src="${faceBase64}"`);

  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const outPath = path.join(__dirname, '../assets/demo-video/youtube-thumbnail.png');
  await page.screenshot({
    path: outPath,
    type: 'png',
  });
  console.log('Saved YouTube thumbnail to:', outPath);

  // Copy to user's Downloads folder
  const userDownloads = path.join(process.env.USERPROFILE, 'Downloads', 'youtube-thumbnail.png');
  fs.copyFileSync(outPath, userDownloads);
  console.log('Copied YouTube thumbnail to Downloads:', userDownloads);

  await browser.close();
}

generateThumbnail().catch(err => {
  console.error('Error generating thumbnail:', err);
  process.exit(1);
});
