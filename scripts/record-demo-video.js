const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function record() {
  const videoDir = path.join(__dirname, '../assets/demo-video/raw');
  fs.mkdirSync(videoDir, { recursive: true });

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: videoDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  console.log('--- 1. Login Screen ---');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Type demo credentials smoothly
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.count() > 0) {
    await emailInput.fill('anya@skinmate.ai');
    await page.waitForTimeout(500);
  }
  const passInput = page.locator('input[type="password"]');
  if (await passInput.count() > 0) {
    await passInput.fill('skinmate2026');
    await page.waitForTimeout(600);
  }

  // Click Submit
  const submitBtn = page.locator('button[type="submit"]');
  if (await submitBtn.count() > 0) {
    await submitBtn.click();
    await page.waitForTimeout(1500);
  }

  console.log('--- 2. Landing Page & Dark Mode Toggle ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Smooth scroll down hero
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy({ top: -400, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  // Click theme toggle button to switch to obsidian dark mode
  const themeBtn = page.locator('button[title*="Dark Mode"], button[aria-label*="Dark Mode"]');
  if (await themeBtn.count() > 0) {
    await themeBtn.first().click();
    await page.waitForTimeout(3000);
  }

  console.log('--- 3. AI Facial Skin Scan Page ---');
  await page.click('a[href="/scan"]');
  await page.waitForURL('**/scan', { timeout: 10000 });
  await page.waitForTimeout(2500);

  // Scroll slightly to view options
  await page.evaluate(() => window.scrollBy({ top: 150, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  // Upload user portrait demo image
  const demoFacePath = path.join(__dirname, '../public/demo-face.jpg');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(demoFacePath);
  console.log('Uploaded user face photo');
  await page.waitForTimeout(3000);

  // Preview is open, click Analyze Photo
  const analyzeBtn = page.locator('button:has-text("Start AI Analysis"), button:has-text("Analyze")');
  if (await analyzeBtn.count() > 0) {
    await analyzeBtn.first().click();
    console.log('Clicked Start AI Analysis, waiting for processing...');
    await page.waitForTimeout(5000);
  }

  console.log('--- 4. Skin Intelligence Dashboard ---');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  // Interact with Mask Visualizer layers
  const poreBtn = page.locator('button:has-text("Visible Pores"), button:has-text("Pores")');
  if (await poreBtn.count() > 0) {
    await poreBtn.first().click();
    await page.waitForTimeout(2500);
  }

  const textureBtn = page.locator('button:has-text("Texture"), button:has-text("Skin Texture")');
  if (await textureBtn.count() > 0) {
    await textureBtn.first().click();
    await page.waitForTimeout(2500);
  }

  // Scroll down to 16 concerns
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.scrollBy({ top: -500, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  console.log('--- 5. Routine Builder & Conflict Guard ---');
  await page.click('a[href="/routine"]');
  await page.waitForURL('**/routine', { timeout: 10000 });
  await page.waitForTimeout(3500);

  // Toggle Evening Regimen
  const eveningBtn = page.locator('button:has-text("Evening Regimen")');
  if (await eveningBtn.count() > 0) {
    await eveningBtn.click();
    await page.waitForTimeout(2500);
  }
  const morningBtn = page.locator('button:has-text("Morning Regimen")');
  if (await morningBtn.count() > 0) {
    await morningBtn.click();
    await page.waitForTimeout(2500);
  }

  // Check off step 1
  const stepCheck = page.locator('button[aria-label*="Mark step"]');
  if (await stepCheck.count() > 0) {
    await stepCheck.first().click();
    await page.waitForTimeout(2000);
  }

  // Open Swap Modal
  const swapBtn = page.locator('button[title="Swap product"], button:has-text("Swap")');
  if (await swapBtn.count() > 0) {
    await swapBtn.first().click();
    await page.waitForTimeout(2500);
    // Close modal or select
    const cancelBtn = page.locator('button:has-text("Cancel")');
    if (await cancelBtn.count() > 0) {
      await cancelBtn.first().click();
      await page.waitForTimeout(1500);
    }
  }

  console.log('--- 6. Smart Skincare Marketplace ---');
  await page.click('a[href="/products"]');
  await page.waitForURL('**/products', { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Click budget preset "Under ₹1,000"
  const preset1000 = page.locator('button:has-text("Under ₹1,000")');
  if (await preset1000.count() > 0) {
    await preset1000.click();
    await page.waitForTimeout(2500);
  }

  // Click category tab "Cleansers"
  const cleansersTab = page.locator('button:has-text("Cleansers")');
  if (await cleansersTab.count() > 0) {
    await cleansersTab.click();
    await page.waitForTimeout(2500);
  }

  // Reset to All
  const allTab = page.locator('button:has-text("All Categories")');
  if (await allTab.count() > 0) {
    await allTab.click();
    await page.waitForTimeout(2000);
  }

  // Scroll through products
  await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.scrollBy({ top: -400, behavior: 'smooth' }));
  await page.waitForTimeout(2000);

  console.log('--- 7. Conversational AI Skincare Concierge ---');
  // Open Ask AI Chat
  const askAiBtn = page.locator('button:has-text("Ask AI"), button[aria-label*="Assistant"]');
  if (await askAiBtn.count() > 0) {
    await askAiBtn.first().click();
    await page.waitForTimeout(3000);
  }

  // Click a suggested chip or type a question
  const chipBtn = page.locator('button:has-text("Routine under ₹1,200")');
  if (await chipBtn.count() > 0) {
    await chipBtn.click();
    console.log('Sent prompt via chip, waiting for Groq LLM tool calling response...');
    await page.waitForTimeout(7000);
  } else {
    const chatInput = page.locator('input[placeholder*="Ask about skincare"]');
    if (await chatInput.count() > 0) {
      await chatInput.fill('Recommend a budget routine under ₹1,500 for oily skin');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(7000);
    }
  }

  // Scroll through chat response
  await page.waitForTimeout(4000);

  console.log('--- 8. Final Scene & Outro ---');
  await page.waitForTimeout(4000);

  await page.close();
  await context.close();
  await browser.close();

  // Find the saved video file in raw directory
  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestVideo = path.join(videoDir, files[0]);
    const targetVideo = path.join(__dirname, '../assets/demo-video/screen-recording.webm');
    fs.copyFileSync(latestVideo, targetVideo);
    console.log('Video recorded successfully at:', targetVideo);
  }
}

record().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
