const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const DIRS = [
  path.resolve('docs/engineering/frontend/visual-audit/qa'),
  path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/ui-audit')
];

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const VIEWPORTS = {
  desktop1440: { width: 1440, height: 900, name: '1440x900' },
  desktop1280: { width: 1280, height: 720, name: '1280x720' },
  desktop1024: { width: 1024, height: 768, name: '1024x768' },
  tablet768:   { width: 768,  height: 1024, name: '768x1024' },
  mobile390:   { width: 390,  height: 844,  name: '390x844', isMobile: true },
  mobile375:   { width: 375,  height: 812,  name: '375x812', isMobile: true }
};

const capturedFiles = [];
const consoleLogs = [];
const runtimeErrors = [];

async function saveScreenshot(page, filename) {
  for (const dir of DIRS) {
    const filePath = path.join(dir, filename);
    await page.screenshot({ path: filePath, fullPage: false });
  }
  capturedFiles.push(filename);
  console.log(`[CAPTURED] ${filename}`);
}

async function run() {
  console.log('Launching browser for Comprehensive UI Reconstruction QA (UI-19)...');
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

  console.log('\n--- Capturing Public Landing across all 6 viewports ---');
  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await publicPage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `01-landing-${vp.name}.png`);
  }

  console.log('\n--- Capturing Auth Pages (Sign In, Register, Forgot Password) ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await publicPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    
    await publicPage.goto(`${BASE_URL}/signin`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `02-signin-${vp.name}.png`);

    await publicPage.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `03-register-${vp.name}.png`);

    await publicPage.goto(`${BASE_URL}/forgot-password`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(publicPage, `04-forgot-password-${vp.name}.png`);
  }

  console.log('\n--- Capturing 404 Unauthenticated ---');
  await publicPage.setViewport({ width: 1280, height: 720 });
  await publicPage.goto(`${BASE_URL}/non-existent-route-for-qa`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await saveScreenshot(publicPage, `18-notfound-unauth-1280x720.png`);

  await publicPage.close();

  // ==========================================
  // 2. AUTHENTICATED CONTEXT (AayurFace User)
  // ==========================================
  const authContext = await browser.createBrowserContext();
  const authPage = await authContext.newPage();

  authPage.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') runtimeErrors.push(msg.text());
  });
  authPage.on('pageerror', err => runtimeErrors.push(err.toString()));

  // Seed authenticated user and initial empty assessments state
  await authPage.goto(`${BASE_URL}/`);
  const testUser = {
    id: 'user-priya-sharma',
    email: 'priya.sharma@example.com',
    full_name: 'Priya Sharma',
    skin_type: 'Pitta-Vata',
    dosha: 'Pitta-Vata',
    onboarding_completed: true,
    created_at: '2026-02-15T09:00:00.000Z',
    updated_at: '2026-02-15T09:00:00.000Z'
  };

  await authPage.evaluate((u) => {
    localStorage.setItem('aayurface_session', JSON.stringify(u));
    localStorage.setItem('aayurface_users', JSON.stringify([u]));
    localStorage.setItem('aayurface_assessments', JSON.stringify([]));
  }, testUser);

  console.log('\n--- Capturing Authenticated Dashboard (Empty Assessments) across 6 viewports ---');
  for (const [, vp] of Object.entries(VIEWPORTS)) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await saveScreenshot(authPage, `05-dashboard-empty-${vp.name}.png`);
  }

  // Sidebar Collapsed & Mobile More Drawer
  console.log('\n--- Capturing Sidebar Collapsed & Mobile Drawer ---');
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const collapseBtn = await authPage.$('button[aria-label="Collapse sidebar"]');
  if (collapseBtn) {
    await collapseBtn.click();
    await new Promise(r => setTimeout(r, 400));
    await saveScreenshot(authPage, '05-dashboard-sidebar-collapsed-1280x720.png');
    const expandBtn = await authPage.$('button[aria-label="Expand sidebar"]');
    if (expandBtn) await expandBtn.click();
    await new Promise(r => setTimeout(r, 300));
  }

  await authPage.setViewport({ width: 375, height: 812, isMobile: true });
  await authPage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const moreBtn = await authPage.$('button[aria-label="Open secondary navigation menu"]');
  if (moreBtn) {
    await moreBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await saveScreenshot(authPage, '05-dashboard-mobile-more-drawer-375x812.png');
  }

  // Seed a real assessment for Priya Sharma
  const sampleAssessment = {
    id: 'asmt-priya-001',
    user_id: 'user-priya-sharma',
    created_at: '2026-03-01T10:30:00.000Z',
    image_url: '/images/1.jpg',
    skin_type: 'Pitta-Vata Combination',
    primary_dosha: 'Pitta',
    secondary_dosha: 'Vata',
    concerns: [
      { area: 'Cheeks', observation: 'Mild Pitta heat erythema and sensitivity', dosha: 'Pitta' },
      { area: 'T-Zone', observation: 'Slight dryness at outer perimeter indicating Vata influence', dosha: 'Vata' }
    ],
    recommendations: [
      { name: 'Neem & Turmeric Cooling Lepa', category: 'Soothing Facial Paste', duration: '15 mins' },
      { name: 'Sandalwood & Vetiver Hydrosol', category: 'Thermal Pacifier', duration: 'Morning & Night' }
    ],
    dinacharya: [
      { time: 'Morning', practice: 'Wash with lukewarm herbal infusion, apply rose hydrosol' },
      { time: 'Evening', practice: 'Gentle abhyanga with cooled sesame oil or kumkumadi' }
    ]
  };

  await authPage.evaluate((asmt) => {
    localStorage.setItem('aayurface_assessments', JSON.stringify([asmt]));
  }, sampleAssessment);

  console.log('\n--- Capturing Dashboard (Populated Assessments) ---');
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await saveScreenshot(authPage, '05-dashboard-populated-1280x720.png');

  console.log('\n--- Capturing Scan Screen Viewfinder & Ready States ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await saveScreenshot(authPage, `06-scan-viewfinder-${vp.name}.png`);
  }

  // Scan Ready state on Desktop
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2200));
  await saveScreenshot(authPage, '06-scan-ready-1280x720.png');

  console.log('\n--- Capturing Results (Real Assessment & Demo Scan) ---');
  // Real Assessment
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/results/asmt-priya-001`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `07-results-real-${vp.name}.png`);
  }

  // Demo Scan
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/results/demo-scan`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await saveScreenshot(authPage, '07-results-demo-scan-1280x720.png');

  console.log('\n--- Capturing Chat Page ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `08-chat-${vp.name}.png`);
  }

  console.log('\n--- Capturing History Page (Empty & Populated) ---');
  // Populated history
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `09-history-populated-${vp.name}.png`);
  }

  // Empty history
  await authPage.evaluate(() => localStorage.setItem('aayurface_assessments', JSON.stringify([])));
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await saveScreenshot(authPage, '09-history-empty-1280x720.png');

  console.log('\n--- Capturing Remedies Encyclopedia (All & Filtered) ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/library`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `10-library-spotlight-${vp.name}.png`);
  }

  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/library`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await authPage.type('input[type="text"]', 'Neem');
  await new Promise(r => setTimeout(r, 500));
  await saveScreenshot(authPage, '10-library-filtered-1280x720.png');

  console.log('\n--- Capturing Remedy Detail Page ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/library/neem-turmeric-face-mask`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `11-remedy-detail-${vp.name}.png`);
  }

  console.log('\n--- Capturing Daily Routine Page ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/routine`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `12-routine-${vp.name}.png`);
  }

  console.log('\n--- Capturing Progress Longitudinal Reflections Page ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/progress`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `13-progress-${vp.name}.png`);
  }

  console.log('\n--- Capturing Profile & Edit Profile Pages ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `14-profile-${vp.name}.png`);
  }

  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/profile/edit`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await saveScreenshot(authPage, '15-profile-edit-1280x720.png');

  console.log('\n--- Capturing Settings Page ---');
  for (const vp of [VIEWPORTS.desktop1280, VIEWPORTS.mobile375]) {
    await authPage.setViewport({ width: vp.width, height: vp.height, isMobile: !!vp.isMobile });
    await authPage.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await saveScreenshot(authPage, `16-settings-${vp.name}.png`);
  }

  console.log('\n--- Capturing 404 Authenticated Page ---');
  await authPage.setViewport({ width: 1280, height: 720 });
  await authPage.goto(`${BASE_URL}/some-unknown-path`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await saveScreenshot(authPage, '17-notfound-auth-1280x720.png');

  await authPage.close();
  await browser.close();

  console.log('\n==============================================');
  console.log(`UI Reconstruction QA Capture Complete!`);
  console.log(`Total Screenshots Captured: ${capturedFiles.length}`);
  console.log(`Runtime Errors Encountered: ${runtimeErrors.length}`);
  if (runtimeErrors.length > 0) {
    console.error('Errors:', runtimeErrors);
  }
  console.log('==============================================');
}

run().catch(err => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
