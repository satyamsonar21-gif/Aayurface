const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/auth_restoration_evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runE2E() {
  console.log('============================================================');
  console.log('AAYURFACE — CANONICAL AUTH & NAVIGATION WORKFLOW RESTORATION');
  console.log('REAL BROWSER E2E VERIFICATION SUITE');
  console.log('============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const BASE = 'http://localhost:5173';
  const report = {
    timestamp: new Date().toISOString(),
    tests: [],
    screenshots: []
  };

  function record(id, title, expected, actual, pass, notes = '') {
    const item = { id, title, expected, actual, pass: Boolean(pass), notes };
    report.tests.push(item);
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${title}`);
    if (!pass) {
      console.log(`   Expected: ${expected}`);
      console.log(`   Actual:   ${actual}`);
    }
  }

  async function takeScreenshot(page, filename, width = 1280, height = 800) {
    await page.setViewport({ width, height });
    const fullPath = path.join(EVIDENCE_DIR, filename);
    await page.screenshot({ path: fullPath, fullPage: false });
    report.screenshots.push({ filename, path: fullPath, viewport: `${width}x${height}` });
    console.log(`📸 Screenshot captured: ${filename} (${width}x${height})`);
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Open fresh browser & Navigate /
    console.log('[STEP 1] Navigating to http://localhost:5173/ as fresh visitor...');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Confirm landing page
    const url1 = page.url();
    const landingHeading = await page.$eval('h1, h2', el => el.textContent).catch(() => '');
    record(
      'AUTH-01',
      'Fresh Visitor Reaches Public Landing Page',
      'URL is / and Landing headline is visible',
      `URL: ${url1}, Heading snippet: ${landingHeading.substring(0, 30)}`,
      url1 === BASE + '/' || url1 === BASE
    );

    // Confirm no session
    const storageKeys = await page.evaluate(() => Object.keys(localStorage));
    const authKeys = storageKeys.filter(k => k.startsWith('sb-') || k.includes('auth') || k.includes('session'));
    record(
      'AUTH-02',
      'Fresh Visitor Has No Active Authentication Session',
      'Zero auth keys in localStorage',
      `Found keys: ${authKeys.join(', ') || 'None'}`,
      authKeys.length === 0
    );

    await takeScreenshot(page, '01_public_landing.png');

    // Step 2: Click Sign In from header
    console.log('[STEP 2] Clicking Sign In link from landing header...');
    const signInLink = await page.$('header a[href="/signin"]');
    if (signInLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        signInLink.click()
      ]);
    }
    const signinUrl = page.url();
    record(
      'AUTH-04',
      'Explicit Sign In Link Routes to /signin',
      'URL includes /signin',
      signinUrl,
      signinUrl.includes('/signin')
    );
    await takeScreenshot(page, '02_sign_in.png');

    // Step 3: Return to landing and click Get Started / Create Account
    console.log('[STEP 3] Returning to landing and clicking Get Started / Register...');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    const registerLink = await page.$('header a[href="/register"]');
    if (registerLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        registerLink.click()
      ]);
    }
    const registerUrl = page.url();
    record(
      'AUTH-05',
      'Explicit Create Account Link Routes to /register',
      'URL includes /register',
      registerUrl,
      registerUrl.includes('/register')
    );
    await takeScreenshot(page, '03_create_account.png');

    // Step 4: Register a real test account
    const timestamp = Date.now();
    const testEmail = `dev_verify_${timestamp}@aayurface.local`;
    const testPassword = `Sattva@${timestamp}!`;
    const testFullName = `Dr. Vikramaditya`;

    console.log(`[STEP 4] Registering new seeker: ${testEmail}...`);
    await page.waitForSelector('#register-email', { timeout: 5000 });
    await page.type('#register-email', testEmail);
    await page.type('#register-password', testPassword);
    await page.type('#register-confirmPassword', testPassword);

    const registerSubmit = await page.$('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }),
      registerSubmit.click()
    ]);
    await new Promise(r => setTimeout(r, 1000));

    const postRegisterUrl = page.url();
    record(
      'AUTH-10',
      'New User Registration Routes Deterministically to /onboarding',
      'URL includes /onboarding',
      postRegisterUrl,
      postRegisterUrl.includes('/onboarding')
    );

    // Verify uncompleted user attempting /dashboard is bounced to /onboarding
    console.log('[STEP 4B] Verifying incomplete user cannot bypass to /dashboard...');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const bypassDashUrl = page.url();
    record(
      'AUTH-11',
      'Incomplete User Cannot Access /dashboard (Bounces to /onboarding)',
      'URL redirected back to /onboarding',
      bypassDashUrl,
      bypassDashUrl.includes('/onboarding')
    );

    // Return to /onboarding
    await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Capture Step 1
    await takeScreenshot(page, '04_onboarding_step1.png');

    // Step 5: Advance Step 1 -> Step 2 (Identity)
    console.log('[STEP 5] Advancing Step 1 to Step 2 (Identity)...');
    const beginBtn = await page.waitForSelector('button ::-p-text(Begin Intake)', { timeout: 5000 });
    await beginBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.waitForSelector('#onboarding-fullname', { timeout: 5000 });
    await page.type('#onboarding-fullname', testFullName);
    await takeScreenshot(page, '05_onboarding_step2.png');

    // Step 6: Advance Step 2 -> Step 3 (Skin Baseline)
    console.log('[STEP 6] Advancing Step 2 to Step 3 (Skin Baseline)...');
    const continueStep2 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep2.click();
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot(page, '06_onboarding_step3.png');

    // Step 7: Advance Step 3 -> Step 4 (Lifestyle)
    console.log('[STEP 7] Selecting skin type and advancing to Step 4 (Lifestyle)...');
    const skinButtons = await page.$$('div[role="radiogroup"] button');
    if (skinButtons.length > 2) {
      await skinButtons[2].click(); // Combination
    }
    const continueStep3 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep3.click();
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot(page, '07_onboarding_step4.png');

    // Step 8: Advance Step 4 -> Step 5 (Privacy & Consent)
    console.log('[STEP 8] Advancing Step 4 to Step 5 (Privacy & Consent)...');
    const continueStep4 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep4.click();
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot(page, '08_onboarding_step5.png');

    // Step 9: Advance Step 5 -> Step 6 (Review)
    console.log('[STEP 9] Checking consents and advancing to Step 6 (Review)...');
    const researchCheckbox = await page.$('#consent-research');
    if (researchCheckbox) {
      await researchCheckbox.click();
    }
    const reviewBtn = await page.waitForSelector('button ::-p-text(Review & Confirm)', { timeout: 5000 });
    await reviewBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot(page, '09_onboarding_step6.png');

    // Step 10: Complete Step 6 & Enter Dashboard
    console.log('[STEP 10] Submitting atomic onboarding setup & entering Dashboard...');
    const completeSetupBtn = await page.waitForSelector('button ::-p-text(Complete Setup & Enter)', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      completeSetupBtn.click()
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const dashboardUrl = page.url();
    record(
      'AUTH-13',
      'Completed Onboarding Enters Authenticated Dashboard',
      'URL is /dashboard',
      dashboardUrl,
      dashboardUrl.includes('/dashboard')
    );
    await takeScreenshot(page, '10_authenticated_dashboard.png');

    // Step 11: Sign Out from Dashboard Sidebar
    console.log('[STEP 11] Executing Sign Out from Sidebar...');
    const sidebarSignOutBtn = await page.waitForSelector('button ::-p-text(Sign Out)', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
      sidebarSignOutBtn.click()
    ]);
    await new Promise(r => setTimeout(r, 1500));

    const postLogoutUrl = page.url();
    const storageAfterLogout = await page.evaluate(() => Object.keys(localStorage));
    const tokenAfterLogout = storageAfterLogout.filter(k => k.includes('auth-token'));

    record(
      'AUTH-19',
      'Sign Out Invalidates Real Session & Navigates to /',
      'URL is / and auth token cleared from localStorage',
      `URL: ${postLogoutUrl}, Auth tokens remaining: ${tokenAfterLogout.length}`,
      (postLogoutUrl === BASE + '/' || postLogoutUrl === BASE) && tokenAfterLogout.length === 0
    );
    await takeScreenshot(page, '11_logout_public_landing.png');

    // Step 12: Attempt to return to /dashboard after logout
    console.log('[STEP 12] Attempting to access /dashboard post-logout...');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const postLogoutDashAttemptUrl = page.url();

    record(
      'AUTH-21',
      'Post-Logout Protected /dashboard Access Redirects to /signin',
      'URL includes /signin',
      postLogoutDashAttemptUrl,
      postLogoutDashAttemptUrl.includes('/signin')
    );
    await takeScreenshot(page, '12_protected_route_after_logout_signin.png');

    // Step 13: Attempt to return to /scan after logout
    console.log('[STEP 13] Attempting to access /scan post-logout...');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const postLogoutScanUrl = page.url();
    record(
      'AUTH-22',
      'Post-Logout Protected /scan Access Redirects to /signin',
      'URL includes /signin',
      postLogoutScanUrl,
      postLogoutScanUrl.includes('/signin')
    );

    // Step 14: Browser Back button test after logout
    console.log('[STEP 14] Testing Browser Back button after logout...');
    await page.goBack({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    const backUrl = page.url();
    const isBackProtectedContentRendered = await page.$('aside, [aria-label="Mobile Navigation"]').then(el => !!el).catch(() => false);
    record(
      'AUTH-23',
      'Browser Back After Logout Cannot Restore Usable Protected State',
      'ProtectedRoute rejects restored history; no authenticated layout rendered',
      `URL: ${backUrl}, Sidebar rendered: ${isBackProtectedContentRendered}`,
      !isBackProtectedContentRendered
    );

    // Step 15: Existing user login flow
    console.log('[STEP 15] Testing explicit Sign In for existing completed user...');
    await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#login-email', { timeout: 5000 });
    await page.type('#login-email', testEmail);
    await page.type('#login-password', testPassword);
    const loginSubmit = await page.$('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      loginSubmit.click()
    ]);
    await new Promise(r => setTimeout(r, 1500));

    const existingLoginUrl = page.url();
    record(
      'AUTH-14',
      'Existing Completed User Sign-In Routes Straight to /dashboard',
      'URL is /dashboard',
      existingLoginUrl,
      existingLoginUrl.includes('/dashboard')
    );

    // Final clean-up sign out
    const finalSignOut = await page.$('button ::-p-text(Sign Out)');
    if (finalSignOut) {
      await finalSignOut.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n=== REAL BROWSER E2E COMPLETE ===');
    const allPassed = report.tests.every(t => t.pass);
    console.log(`Result: ${allPassed ? 'ALL PASS' : 'SOME FAILED'} (${report.tests.filter(t => t.pass).length}/${report.tests.length})`);
    
    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'canonical_auth_restoration_report.json'),
      JSON.stringify(report, null, 2)
    );

  } catch (err) {
    console.error('E2E Exception:', err);
  } finally {
    await browser.close();
  }
}

runE2E();
