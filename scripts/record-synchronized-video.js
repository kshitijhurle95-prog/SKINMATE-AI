const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TIMINGS = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/demo-video/timings.json'), 'utf8'));

async function record() {
  const videoDir = path.join(__dirname, '../assets/demo-video/synced_raw');
  // Clean old raw videos if any
  if (fs.existsSync(videoDir)) {
    fs.rmSync(videoDir, { recursive: true, force: true });
  }
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

  async function syncSection(id, actionFn) {
    const targetMs = TIMINGS[id].durationMs;
    console.log(`Starting section ${id} (target: ${targetMs}ms)...`);
    const start = Date.now();
    await actionFn();
    const elapsed = Date.now() - start;
    const remaining = targetMs - elapsed;
    if (remaining > 0) {
      console.log(`Section ${id} finished in ${elapsed}ms. Padding ${remaining}ms...`);
      await page.waitForTimeout(remaining);
    } else {
      console.log(`Section ${id} took ${elapsed}ms (overrun: ${-remaining}ms)`);
    }
  }

  // --- SECTION 1: Login & Welcome (13.99s) ---
  await syncSection('1_login', async () => {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.count() > 0) {
      await emailInput.fill('anya@skinmate.ai');
      await page.waitForTimeout(800);
    }
    const passInput = page.locator('input[type="password"]');
    if (await passInput.count() > 0) {
      await passInput.fill('skinmate2026');
      await page.waitForTimeout(800);
    }

    const submitBtn = page.locator('button[type="submit"]');
    if (await submitBtn.count() > 0) {
      await submitBtn.click();
      await page.waitForTimeout(2000);
    }
  });

  // --- SECTION 2: Landing Page & Obsidian Dark Mode (18.48s) ---
  await syncSection('2_darkmode', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // Scroll slightly down to showcase value props
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await page.waitForTimeout(3000);

    // Scroll back up to the navbar
    await page.evaluate(() => window.scrollBy({ top: -350, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Click Theme Toggle button for Obsidian Dark Mode transition
    const themeBtn = page.locator('button[title*="Dark Mode"], button[aria-label*="Dark Mode"]');
    if (await themeBtn.count() > 0) {
      await themeBtn.first().click();
      await page.waitForTimeout(4000);
    }
  });

  // --- SECTION 3: AI Facial Skin Scan & Photo Upload (22.10s) ---
  await syncSection('3_scan', async () => {
    await page.click('a[href="/scan"]');
    await page.waitForURL('**/scan', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Scroll down to see upload option
    await page.evaluate(() => window.scrollBy({ top: 120, behavior: 'smooth' }));
    await page.waitForTimeout(1500);

    // Upload user portrait photo
    const demoFacePath = path.join(__dirname, '../public/demo-face.jpg');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(demoFacePath);
    await page.waitForTimeout(3000);

    // Click Start AI Analysis in preview modal
    const analyzeBtn = page.locator('button:has-text("Start AI Analysis"), button:has-text("Analyze")');
    if (await analyzeBtn.count() > 0) {
      await analyzeBtn.first().click();
      await page.waitForTimeout(5000);
    }
  });

  // --- SECTION 4: Skin Intelligence Dashboard & Mask Overlays (19.01s) ---
  await syncSection('4_dashboard', async () => {
    await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // Interact with Mask Layers
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

    // Scroll down to 16-concern breakdown
    await page.evaluate(() => window.scrollBy({ top: 450, behavior: 'smooth' }));
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.scrollBy({ top: -450, behavior: 'smooth' }));
  });

  // --- SECTION 5: Routine Builder & Conflict Guard (20.86s) ---
  await syncSection('5_routine', async () => {
    await page.click('a[href="/routine"]');
    await page.waitForURL('**/routine', { timeout: 10000 });
    await page.waitForTimeout(2500);

    // Toggle Evening Regimen
    const eveningBtn = page.locator('button:has-text("Evening Regimen")');
    if (await eveningBtn.count() > 0) {
      await eveningBtn.click();
      await page.waitForTimeout(2500);
    }

    // Toggle back to Morning Regimen
    const morningBtn = page.locator('button:has-text("Morning Regimen")');
    if (await morningBtn.count() > 0) {
      await morningBtn.click();
      await page.waitForTimeout(2000);
    }

    // Check off step 1
    const stepCheck = page.locator('button[aria-label*="Mark step"]');
    if (await stepCheck.count() > 0) {
      await stepCheck.first().click();
      await page.waitForTimeout(2000);
    }

    // Click Swap product to show alternative solver modal
    const swapBtn = page.locator('button[title="Swap product"], button:has-text("Swap")');
    if (await swapBtn.count() > 0) {
      await swapBtn.first().click();
      await page.waitForTimeout(2500);
      const cancelBtn = page.locator('button:has-text("Cancel")');
      if (await cancelBtn.count() > 0) {
        await cancelBtn.first().click();
        await page.waitForTimeout(1500);
      }
    }
  });

  // --- SECTION 6: Smart Skincare Marketplace (15.07s) ---
  await syncSection('6_marketplace', async () => {
    await page.click('a[href="/products"]');
    await page.waitForURL('**/products', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Click budget preset Under ₹1,000
    const preset1000 = page.locator('button:has-text("Under ₹1,000")');
    if (await preset1000.count() > 0) {
      await preset1000.click();
      await page.waitForTimeout(2000);
    }

    // Click category Cleansers
    const cleansersTab = page.locator('button:has-text("Cleansers")');
    if (await cleansersTab.count() > 0) {
      await cleansersTab.click();
      await page.waitForTimeout(2000);
    }

    // Reset to All Categories
    const allTab = page.locator('button:has-text("All Categories")');
    if (await allTab.count() > 0) {
      await allTab.click();
      await page.waitForTimeout(2000);
    }

    // Scroll down to show product cards
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: 'smooth' }));
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollBy({ top: -350, behavior: 'smooth' }));
  });

  // --- SECTION 7: Conversational AI Skincare Concierge (22.90s) ---
  await syncSection('7_chatbot', async () => {
    // Open Ask AI
    const askAiBtn = page.locator('button:has-text("Ask AI"), button[aria-label*="Assistant"]');
    if (await askAiBtn.count() > 0) {
      await askAiBtn.first().click();
      await page.waitForTimeout(2500);
    }

    // Click suggested chip
    const chipBtn = page.locator('button:has-text("Routine under ₹1,200")');
    if (await chipBtn.count() > 0) {
      await chipBtn.click();
      console.log('Submitted chat prompt, streaming LLM tool caller output...');
      await page.waitForTimeout(8000);
    }

    // Scroll chat thread to review response
    await page.evaluate(() => {
      const drawer = document.querySelector('.overflow-y-auto');
      if (drawer) drawer.scrollTop = drawer.scrollHeight;
    });
    await page.waitForTimeout(4000);
  });

  // --- SECTION 8: Outro & Call to Action (9.84s) ---
  await syncSection('8_outro', async () => {
    await page.waitForTimeout(8000);
  });

  await page.close();
  await context.close();
  await browser.close();

  const files = fs.readdirSync(videoDir).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latestVideo = path.join(videoDir, files[0]);
    const targetVideo = path.join(__dirname, '../assets/demo-video/synced-recording.webm');
    fs.copyFileSync(latestVideo, targetVideo);
    console.log('Synchronized raw video recorded at:', targetVideo);
  }
}

record().catch(err => {
  console.error('Sync Recording error:', err);
  process.exit(1);
});
