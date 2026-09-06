const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const TARGET_DIR = path.resolve('docs/engineering/frontend/visual-audit/landing-rebuild');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const VIEWPORTS = {
  desktop1280: { width: 1280, height: 720, name: 'desktop-1280x720' },
  desktop1440: { width: 1440, height: 900, name: 'desktop-1440x900' },
  tablet768: { width: 768, height: 1024, name: 'tablet-768x1024' },
  mobile375: { width: 375, height: 812, name: 'mobile-375x812', isMobile: true, hasTouch: true },
  mobile390: { width: 390, height: 844, name: 'mobile-390x844', isMobile: true, hasTouch: true }
};

const auditReport = {
  timestamp: new Date().toISOString(),
  consoleErrors: [],
  capturedScreenshots: [],
  linkVerifications: {},
  viewportsTested: []
};

async function capture(page, filename, fullPage = false) {
  const filePath = path.join(TARGET_DIR, filename);
  await page.screenshot({ path: filePath, fullPage });
  auditReport.capturedScreenshots.push(filename);
  console.log(`[CAPTURED] ${filename} (fullPage=${fullPage})`);
}

async function run() {
  console.log('Starting Public Landing Page UI-Only Rebuild Visual Verification...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--disable-web-security'
    ]
  });

  try {
    // -------------------------------------------------------------
    // 1. DESKTOP 1280 × 720 (Mandated Primary Standard)
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Desktop 1280 × 720 ---');
    const page1280 = await browser.newPage();
    await page1280.setViewport(VIEWPORTS.desktop1280);

    page1280.on('console', msg => {
      if (msg.type() === 'error') {
        auditReport.consoleErrors.push({ url: page1280.url(), text: msg.text() });
      }
    });

    await page1280.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // 1a. Hero viewport
    await capture(page1280, 'landing-1280x720-01-hero.png');

    // 1b. Scroll to Second Section (Rooted in Tradition)
    await page1280.evaluate(() => document.getElementById('about')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await capture(page1280, 'landing-1280x720-02-second-section.png');

    // 1c. Scroll to Journey Section
    await page1280.evaluate(() => document.getElementById('journey')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await capture(page1280, 'landing-1280x720-03-journey.png');

    // 1d. Scroll to Methodology Section
    await page1280.evaluate(() => document.getElementById('how-it-works')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await capture(page1280, 'landing-1280x720-04-methodology.png');

    // 1e. Scroll to Ayurveda Section
    await page1280.evaluate(() => document.getElementById('ayurveda')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await capture(page1280, 'landing-1280x720-05-ayurveda.png');

    // 1f. Scroll to Final CTA & Footer
    await page1280.evaluate(() => document.getElementById('contact')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 500));
    await capture(page1280, 'landing-1280x720-06-cta-footer.png');

    // 1g. Full Page 1280
    await capture(page1280, 'landing-1280x720-fullpage.png', true);
    auditReport.viewportsTested.push(VIEWPORTS.desktop1280.name);
    await page1280.close();

    // -------------------------------------------------------------
    // 2. DESKTOP 1440 × 900
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Desktop 1440 × 900 ---');
    const page1440 = await browser.newPage();
    await page1440.setViewport(VIEWPORTS.desktop1440);
    await page1440.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await capture(page1440, 'landing-1440x900-hero.png');
    await capture(page1440, 'landing-1440x900-fullpage.png', true);
    auditReport.viewportsTested.push(VIEWPORTS.desktop1440.name);
    await page1440.close();

    // -------------------------------------------------------------
    // 3. TABLET 768 × 1024
    // -------------------------------------------------------------
    console.log('\n--- 3. Testing Tablet 768 × 1024 ---');
    const page768 = await browser.newPage();
    await page768.setViewport(VIEWPORTS.tablet768);
    await page768.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await capture(page768, 'landing-768x1024-hero.png');
    await capture(page768, 'landing-768x1024-fullpage.png', true);
    auditReport.viewportsTested.push(VIEWPORTS.tablet768.name);
    await page768.close();

    // -------------------------------------------------------------
    // 4. MOBILE 375 × 812
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Mobile 375 × 812 ---');
    const page375 = await browser.newPage();
    await page375.setViewport(VIEWPORTS.mobile375);
    await page375.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await capture(page375, 'landing-375x812-hero.png');

    // Test Mobile Menu open
    const menuBtn = await page375.$('button[aria-label="Open navigation menu"]');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise(r => setTimeout(r, 400));
      await capture(page375, 'landing-375x812-menu-open.png');
      await menuBtn.click(); // close menu
      await new Promise(r => setTimeout(r, 300));
    }
    await capture(page375, 'landing-375x812-fullpage.png', true);
    auditReport.viewportsTested.push(VIEWPORTS.mobile375.name);
    await page375.close();

    // -------------------------------------------------------------
    // 5. MOBILE 390 × 844
    // -------------------------------------------------------------
    console.log('\n--- 5. Testing Mobile 390 × 844 ---');
    const page390 = await browser.newPage();
    await page390.setViewport(VIEWPORTS.mobile390);
    await page390.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    await capture(page390, 'landing-390x844-hero.png');
    await capture(page390, 'landing-390x844-fullpage.png', true);
    auditReport.viewportsTested.push(VIEWPORTS.mobile390.name);
    await page390.close();

    // Save report json
    fs.writeFileSync(
      path.join(TARGET_DIR, 'landing-rebuild-report.json'),
      JSON.stringify(auditReport, null, 2)
    );
    console.log(`\nVerification complete. Visual evidence saved to ${TARGET_DIR}`);

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Fatal error during capture:', err);
  process.exit(1);
});
