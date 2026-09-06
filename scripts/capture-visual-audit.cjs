const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const DIRS = [
  path.resolve('docs/engineering/frontend/visual-audit/phase-06.6'),
  path.resolve('docs/engineering/frontend/visual-audit/screenshots')
];

// Ensure directories exist
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Exact Mandated Viewports (1280 × 720 standard 16:9)
const VIEWPORTS = {
  desktop1280: { width: 1280, height: 720, name: 'desktop-1280' },
  desktop1440: { width: 1440, height: 900, name: 'desktop-1440' },
  tablet768: { width: 768, height: 1024, name: 'tablet-768' },
  mobile375: { width: 375, height: 812, name: 'mobile-375', isMobile: true },
  mobile390: { width: 390, height: 844, name: 'mobile-390', isMobile: true }
};

const consoleLogs = [];
const runtimeErrors = [];
const capturedFiles = [];

async function saveScreenshot(page, filename) {
  for (const dir of DIRS) {
    const filePath = path.join(dir, filename);
    await page.screenshot({ path: filePath, fullPage: false });
  }
  capturedFiles.push(filename);
  console.log(`[CAPTURED] ${filename}`);
}

async function run() {
  console.log('Launching browser for Phase 06.6 Forensic Visual Audit...');
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

  // ==========================================
  // 1. PUBLIC SCREENS (UNAUTHENTICATED)
  // ==========================================
  const publicContext = await browser.createBrowserContext();
  const publicPage = await publicContext.newPage();

  publicPage.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') runtimeErrors.push(msg.text());
  });
  publicPage.on('pageerror', err => runtimeErrors.push(err.toString()));

  console.log('--- Capturing Public Screens ---');
  // 1.1 Landing Page across all 5 viewports
  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await publicPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `01-landing-${vp.name}.png`);
  }

  // 1.2 Login Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await publicPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `02-login-${vp.name}.png`);
  }

  // 1.3 Register Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await publicPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `03-register-${vp.name}.png`);
  }

  // 1.4 Forgot Password Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await publicPage.goto(`${BASE_URL}/forgot-password`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `04-forgot-password-${vp.name}.png`);
  }

  await publicPage.close();

  // ==========================================
  // 2. AUTHENTICATED APPLICATION CONTEXT
  // ==========================================
  const authContext = await browser.createBrowserContext();
  const authPage = await authContext.newPage();

  authPage.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') runtimeErrors.push(msg.text());
  });
  authPage.on('pageerror', err => runtimeErrors.push(err.toString()));

  // Prime authenticated session in localStorage
  await authPage.goto(`${BASE_URL}/`);
  await authPage.evaluate(() => {
    const mockUser = {
      id: 'mock-user-1',
      email: 'namrata.sen@example.com',
      full_name: 'Namrata Sen',
      skin_type: 'dry',
      onboarding_completed: true,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z'
    };
    localStorage.setItem('aayurface_session', JSON.stringify(mockUser));
    localStorage.setItem('aayurface_users', JSON.stringify([mockUser]));
  });

  console.log('--- Capturing Reconstructed Home Dashboard across all 5 viewports ---');
  // 2.1 Home Dashboard across all 5 viewports
  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `05-home-dashboard-${vp.name}.png`);
  }

  // 2.1b Sidebar Collapsed State on Desktop (1280x720)
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const collapseBtn = await authPage.$('button[aria-label="Collapse sidebar"]');
  if (collapseBtn) {
    await collapseBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await saveScreenshot(authPage, '05-home-sidebar-collapsed-desktop-1280.png');
    // Restore sidebar
    const expandBtn = await authPage.$('button[aria-label="Expand sidebar"]');
    if (expandBtn) await expandBtn.click();
    await new Promise(r => setTimeout(r, 300));
  }

  // 2.1c Mobile Navigation More Drawer (375x812)
  await authPage.setViewport({ width: 375, height: 812, isMobile: true });
  await authPage.goto(`${BASE_URL}/home`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const moreBtn = await authPage.$('button[aria-label="Open secondary navigation menu"]');
  if (moreBtn) {
    await moreBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await saveScreenshot(authPage, '05-home-mobile-more-drawer-mobile-375.png');
  }

  console.log('--- Capturing Reconstructed Scan Camera across all 5 viewports & states ---');
  // 2.2 Scan Screen - Viewfinder across all 5 viewports
  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot(authPage, `06-scan-capture-${vp.name}.png`);
  }

  // 2.2b Scan Screen - Ready State (1280x720)
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
  // Wait for deterministic state machine to reach 'ready' (after ~1.8s)
  await new Promise(r => setTimeout(r, 2200));
  await saveScreenshot(authPage, '06-scan-ready-desktop-1280.png');

  // 2.3 Scan Screen - Processing State (1280x720)
  const captureBtn = await authPage.$('button[aria-label="Capture photo for analysis"]');
  if (captureBtn) {
    await captureBtn.click();
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, '07-scan-processing-desktop-1280.png');
  }

  // 2.4 Results Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/results/demo-scan`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `08-results-${vp.name}.png`);
  }

  // 2.5 Library Page (Default All)
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/library`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `09-library-${vp.name}.png`);
  }

  // 2.6 Library Page (Filtered state)
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/library`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await authPage.type('input[type="text"]', 'Neem');
  await new Promise(r => setTimeout(r, 500));
  await saveScreenshot(authPage, '09-library-filter-desktop-1280.png');

  // 2.7 Library Page (Saved tab with corrected mock IDs ['r1', 'r3'])
  await authPage.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const savedBtn = btns.find(b => b.textContent && b.textContent.includes('Saved Rituals'));
    if (savedBtn) savedBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await saveScreenshot(authPage, '09-library-saved-desktop-1280.png');

  console.log('--- Capturing Distinct Remedy Detail Pages (with slug validation) ---');
  // 2.8 Remedy Detail Pages - 3 distinct verified remedies
  // Remedy A: Neem & Turmeric Face Mask
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/library/neem-turmeric-face-mask`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    const titleA = await authPage.$eval('h1', el => el.textContent.trim());
    console.log(`[VERIFIED TITLE] Remedy A: ${titleA}`);
    await saveScreenshot(authPage, `10-remedy-detail-neem-${vp.name}.png`);
  }

  // Remedy B: Kumkumadi Brightening Oil (CORRECTED SLUG)
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/library/kumkumadi-brightening-oil`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  const titleB = await authPage.$eval('h1', el => el.textContent.trim());
  console.log(`[VERIFIED TITLE] Remedy B: ${titleB}`);
  await saveScreenshot(authPage, '10-remedy-detail-kumkumadi-desktop-1280.png');

  // Remedy C: Aloe Vera & Rose Water Toner (CORRECTED SLUG)
  await authPage.goto(`${BASE_URL}/library/aloe-vera-rose-water-toner`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  const titleC = await authPage.$eval('h1', el => el.textContent.trim());
  console.log(`[VERIFIED TITLE] Remedy C: ${titleC}`);
  await saveScreenshot(authPage, '10-remedy-detail-aloe-desktop-1280.png');

  // 2.9 Chat Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `11-chat-${vp.name}.png`);
  }

  // 2.10 Profile Page
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `12-profile-${vp.name}.png`);
  }

  // 2.11 Edit Profile Page
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/profile/edit`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await saveScreenshot(authPage, '13-edit-profile-desktop-1280.png');

  console.log('--- Capturing New Presentation Route Shells ---');
  // 2.12 My History Route Shell
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `14-history-${vp.name}.png`);
  }

  // 2.13 Daily Routine Route Shell
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/routine`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `15-routine-${vp.name}.png`);
  }

  // 2.14 Progress Route Shell
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/progress`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `16-progress-${vp.name}.png`);
  }

  // 2.15 Settings Route Shell
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `17-settings-${vp.name}.png`);
  }

  await authPage.close();
  await browser.close();

  console.log('==============================================');
  console.log(`Forensic Audit Complete! Total Screenshots: ${capturedFiles.length}`);
  console.log(`Runtime Errors: ${runtimeErrors.length}`);
  if (runtimeErrors.length > 0) {
    console.error('Errors encountered:', runtimeErrors);
  }
  console.log('==============================================');
}

run().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
