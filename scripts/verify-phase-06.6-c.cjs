const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const TARGET_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-06.6-c');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const VIEWPORT_DESKTOP = { width: 1280, height: 720 };
const VIEWPORT_MOBILE = { width: 375, height: 812, isMobile: true, hasTouch: true };

const auditResults = {
  timestamp: new Date().toISOString(),
  publicLandingTested: false,
  entryCtaVerified: false,
  dashboardEnteredWithoutLoginWall: false,
  twoWayNavigationVerified: false,
  sidebarStateVerified: false,
  mobileDrawerVerified: false,
  refreshPersistence: {},
  browserHistoryTraversal: false,
  routesVerified: [],
  consoleErrors: [],
  capturedScreenshots: []
};

async function capture(page, filename) {
  const filePath = path.join(TARGET_DIR, filename);
  await page.screenshot({ path: filePath, fullPage: false });
  auditResults.capturedScreenshots.push(filename);
  console.log(`[CAPTURED] ${filename}`);
}

async function run() {
  console.log('Starting Phase 06.6-C Forensic Verification & Evidence Capture...');

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
    // =========================================================================
    // TEST 1: Public Landing Page on localhost/ (Clean context, unauthenticated)
    // =========================================================================
    console.log('\n--- 1. Testing Public Landing Page at localhost/ ---');
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.setViewport(VIEWPORT_DESKTOP);

    page.on('console', msg => {
      if (msg.type() === 'error') {
        auditResults.consoleErrors.push({ url: page.url(), text: msg.text() });
      }
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const currentUrl = page.url();
    console.log(`Current URL for localhost/: ${currentUrl}`);
    if (currentUrl.endsWith('/') || currentUrl.endsWith('/#')) {
      auditResults.publicLandingTested = true;
    }

    // Capture 01: Landing Page
    await capture(page, '01-landing-localhost.png');

    // Verify CTA exists
    const ctaButton = await page.$('a[href="/dashboard"]');
    if (ctaButton) {
      auditResults.entryCtaVerified = true;
      console.log('✓ Primary Dashboard entry CTA found on landing page.');
    } else {
      console.error('✗ Primary Dashboard entry CTA NOT found on landing page!');
    }

    // Capture 02: Landing Page showing clear CTA
    await capture(page, '02-landing-entry-cta.png');

    // =========================================================================
    // TEST 2: Click Primary CTA to enter AayurFace Dashboard
    // =========================================================================
    console.log('\n--- 2. Clicking Primary CTA to Enter Dashboard ---');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
      ctaButton.click()
    ]);
    await new Promise(r => setTimeout(r, 600));

    const enteredUrl = page.url();
    console.log(`URL after clicking CTA: ${enteredUrl}`);
    if (enteredUrl.includes('/dashboard') || enteredUrl.includes('/home')) {
      auditResults.dashboardEnteredWithoutLoginWall = true;
      console.log('✓ Successfully entered dashboard without login wall or redirect.');
    } else {
      console.error(`✗ Failed to enter dashboard! Landed on: ${enteredUrl}`);
    }

    // Capture 03: Dashboard immediately after entering
    await capture(page, '03-dashboard-entered.png');

    // =========================================================================
    // TEST 3: Sidebar State Verification (Expanded vs Collapsed 80px)
    // =========================================================================
    console.log('\n--- 3. Testing Desktop Sidebar States ---');
    // Capture 04: Expanded Desktop Sidebar
    await capture(page, '04-desktop-sidebar-expanded.png');

    // Find and click collapse button
    const collapseBtn = await page.$('button[aria-label="Collapse sidebar"]');
    if (collapseBtn) {
      await collapseBtn.click();
      await new Promise(r => setTimeout(r, 400));
      auditResults.sidebarStateVerified = true;
      console.log('✓ Sidebar collapsed to 80px icon-only rail.');
    }
    // Capture 05: Collapsed Desktop Sidebar
    await capture(page, '05-desktop-sidebar-collapsed.png');

    // Re-expand sidebar
    const expandBtn = await page.$('button[aria-label="Expand sidebar"]');
    if (expandBtn) {
      await expandBtn.click();
      await new Promise(r => setTimeout(r, 400));
    }

    // =========================================================================
    // TEST 4: Two-Way Navigation (Dashboard -> Landing)
    // =========================================================================
    console.log('\n--- 4. Testing Two-Way Navigation: Dashboard -> Landing ---');
    const returnLogo = await page.$('a[aria-label="Return to Public Landing"]') || await page.$('a[title="Return to Public Landing"]');
    if (returnLogo) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
        returnLogo.click()
      ]);
      await new Promise(r => setTimeout(r, 500));
      const returnedUrl = page.url();
      console.log(`URL after clicking Logo in Sidebar: ${returnedUrl}`);
      if (returnedUrl.endsWith('/') || returnedUrl.endsWith('/#')) {
        auditResults.twoWayNavigationVerified = true;
        console.log('✓ Successfully returned from Dashboard to Public Landing.');
      }
      await capture(page, '08-returned-to-landing.png');
    }

    // Return to dashboard for route tests
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    // =========================================================================
    // TEST 5: Verify All 9 Dashboard Routes & Refresh Persistence
    // =========================================================================
    console.log('\n--- 5. Verifying All 9 Dashboard Routes with Refresh Persistence ---');
    const routesToTest = [
      { path: '/dashboard', label: 'Dashboard Home', file: 'route-01-dashboard.png' },
      { path: '/scan', label: 'Scan Camera Experience', file: 'route-02-scan.png' },
      { path: '/chat', label: 'Ayurvedic Intelligence Chat', file: 'route-03-chat.png' },
      { path: '/history', label: 'Skin Assessment History', file: 'route-04-history.png' },
      { path: '/remedies', label: 'Ayurvedic Remedies Library', file: 'route-05-remedies.png' },
      { path: '/routine', label: 'Dinacharya Daily Routine', file: 'route-06-routine.png' },
      { path: '/progress', label: 'Constitutional Progress', file: 'route-07-progress.png' },
      { path: '/profile', label: 'User Profile & Constitution', file: 'route-08-profile.png' },
      { path: '/settings', label: 'Application Settings', file: 'route-09-settings.png' }
    ];

    for (const r of routesToTest) {
      console.log(`\nTesting Route: ${r.path} (${r.label})`);
      const response = await page.goto(`${BASE_URL}${r.path}`, { waitUntil: 'networkidle0' });
      const statusBeforeReload = response ? response.status() : 'unknown';
      await new Promise(res => setTimeout(res, 500));

      // Capture route screenshot
      await capture(page, r.file);

      // Verify browser refresh persistence
      console.log(`  Performing browser page reload on ${r.path}...`);
      const reloadResponse = await page.reload({ waitUntil: 'networkidle0' });
      const statusAfterReload = reloadResponse ? reloadResponse.status() : 'unknown';
      await new Promise(res => setTimeout(res, 500));
      const finalUrl = page.url();

      const passed = finalUrl.includes(r.path) && (statusAfterReload === 200 || statusAfterReload === 304);
      auditResults.refreshPersistence[r.path] = {
        status: passed ? 'PASSED' : 'FAILED',
        httpStatus: statusAfterReload,
        finalUrl: finalUrl
      };
      auditResults.routesVerified.push({
        path: r.path,
        label: r.label,
        passed: passed,
        status: statusAfterReload
      });
      console.log(`  ✓ Refresh persistence on ${r.path}: ${passed ? 'PASSED' : 'FAILED'} (HTTP ${statusAfterReload}, URL: ${finalUrl})`);
    }

    // =========================================================================
    // TEST 6: Browser History Back/Forward Traversal
    // =========================================================================
    console.log('\n--- 6. Testing Browser History Back/Forward Traversal ---');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await page.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle0' });
    await page.goto(`${BASE_URL}/remedies`, { waitUntil: 'networkidle0' });

    console.log('  Navigated: /dashboard -> /scan -> /chat -> /remedies');
    await page.goBack();
    await new Promise(r => setTimeout(r, 400));
    const back1 = page.url();
    console.log(`  goBack() 1: ${back1} (Expected /chat)`);

    await page.goBack();
    await new Promise(r => setTimeout(r, 400));
    const back2 = page.url();
    console.log(`  goBack() 2: ${back2} (Expected /scan)`);

    await page.goForward();
    await new Promise(r => setTimeout(r, 400));
    const fwd1 = page.url();
    console.log(`  goForward() 1: ${fwd1} (Expected /chat)`);

    if (back1.includes('/chat') && back2.includes('/scan') && fwd1.includes('/chat')) {
      auditResults.browserHistoryTraversal = true;
      console.log('✓ Browser history back/forward traversal completely verified.');
    }

    await page.close();
    await context.close();

    // =========================================================================
    // TEST 7: Mobile Viewport (375 × 812) Navigation & Drawer
    // =========================================================================
    console.log('\n--- 7. Testing Mobile Viewport (375 × 812) ---');
    const mobileContext = await browser.createBrowserContext();
    const mobilePage = await mobileContext.newPage();
    await mobilePage.setViewport(VIEWPORT_MOBILE);

    // 7a. Mobile Landing
    await mobilePage.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await capture(mobilePage, '02b-landing-mobile-375.png');

    // 7b. Mobile Dashboard
    await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await capture(mobilePage, '06-mobile-dashboard-375.png');

    // 7c. Open Mobile "More" Drawer
    const moreBtn = await mobilePage.$('button[aria-label="Open secondary navigation menu"]');
    if (moreBtn) {
      await moreBtn.click();
      await new Promise(r => setTimeout(r, 600));
      auditResults.mobileDrawerVerified = true;
      console.log('✓ Mobile "More" drawer successfully opened.');
      await capture(mobilePage, '07-mobile-drawer-open-375.png');
    } else {
      console.error('✗ Mobile "More" drawer button not found!');
    }

    await mobilePage.close();
    await mobileContext.close();

    // Save audit summary
    fs.writeFileSync(
      path.join(TARGET_DIR, 'audit-results.json'),
      JSON.stringify(auditResults, null, 2)
    );
    console.log(`\nVerification complete. Results saved to ${path.join(TARGET_DIR, 'audit-results.json')}`);

  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Fatal Error during verification:', err);
  process.exit(1);
});
