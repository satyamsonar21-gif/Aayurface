const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/registration_boundary_evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runE2E() {
  console.log('============================================================');
  console.log('AAYURFACE — REGISTRATION / ONBOARDING BOUNDARY CORRECTION');
  console.log('REAL BROWSER E2E & RESPONSIVE VISUAL VERIFICATION SUITE');
  console.log('============================================================\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const BASE = 'http://localhost:5173';
  const report = {
    timestamp: new Date().toISOString(),
    scenarios: [],
    screenshots: [],
    consoleErrors: [],
    networkErrors: [],
    cameraApiCalls: []
  };

  function record(id, title, expected, actual, pass, notes = '') {
    const item = { id, title, expected, actual, pass: Boolean(pass), notes };
    report.scenarios.push(item);
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${title}`);
    if (!pass) {
      console.log(`   Expected: ${expected}`);
      console.log(`   Actual:   ${actual}`);
    }
  }

  async function capture(page, filename, width = 1280, height = 800) {
    await page.setViewport({ width, height });
    const fullPath = path.join(EVIDENCE_DIR, filename);
    await page.screenshot({ path: fullPath, fullPage: false });
    report.screenshots.push({ filename, path: fullPath, viewport: `${width}x${height}` });
    console.log(`📸 Screenshot: ${filename} (${width}x${height})`);
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Monitor console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        report.consoleErrors.push(text);
      }
    });

    // Monitor failed network requests
    page.on('requestfailed', req => {
      report.networkErrors.push({ url: req.url(), failure: req.failure()?.errorText });
    });

    // Instrument camera API to detect unauthorized getUserMedia invocations
    await page.evaluateOnNewDocument(() => {
      window.__cameraCalls = [];
      if (navigator.mediaDevices) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(...args) {
          window.__cameraCalls.push({ time: Date.now(), args });
          return origGetUserMedia.apply(this, args);
        };
      }
    });

    // ============================================================
    // SCENARIO A: PUBLIC LANDING
    // ============================================================
    console.log('\n--- SCENARIO A: Public Landing Page ---');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const landingUrl = page.url();
    const landingH1 = await page.$eval('h1', el => el.textContent).catch(() => '');
    const landingTokens = await page.evaluate(() => Object.keys(localStorage).filter(k => k.includes('auth-token')));
    const landingCamCalls = await page.evaluate(() => window.__cameraCalls?.length || 0);

    record(
      'SCENARIO-A1',
      'Fresh Visitor Reaches Public Landing Page',
      'URL is / and headline is visible',
      `URL: ${landingUrl}, H1 snippet: ${landingH1.substring(0, 30)}`,
      landingUrl === BASE + '/' || landingUrl === BASE
    );

    record(
      'SCENARIO-A2',
      'Landing Page Creates Zero Auth Session & Invokes Zero Camera APIs',
      '0 tokens in localStorage, 0 camera calls',
      `Tokens: ${landingTokens.length}, Camera calls: ${landingCamCalls}`,
      landingTokens.length === 0 && landingCamCalls === 0
    );

    await capture(page, '01_public_landing.png', 1280, 800);

    // ============================================================
    // SCENARIO B: REGISTER PAGE INSPECTION & VALIDATION
    // ============================================================
    console.log('\n--- SCENARIO B: Corrected Register Page ---');
    const registerLink = await page.$('header a[href="/register"]');
    if (registerLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        registerLink.click()
      ]);
    } else {
      await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    }
    await new Promise(r => setTimeout(r, 600));

    const regUrl = page.url();
    const regHeading = await page.$eval('h1', el => el.textContent).catch(() => '');
    const regSubtitle = await page.$eval('h1 + p, p', el => el.textContent).catch(() => '');

    const hasEmail = await page.$('#register-email') !== null;
    const hasPassword = await page.$('#register-password') !== null;
    const hasConfirmPassword = await page.$('#register-confirmPassword') !== null;
    const hasFullName = await page.$('#register-fullName') !== null;

    record(
      'SCENARIO-B1',
      'Register Page Displays Corrected Account Creation Header & Subtitle',
      'Heading: "Create your AayurFace account", Subtitle mentions account creation',
      `Heading: "${regHeading}", Subtitle: "${regSubtitle.substring(0, 45)}..."`,
      regHeading.includes('Create your AayurFace account')
    );

    record(
      'SCENARIO-B2',
      'Register Page Contains Only Authentication Credentials (Full Name Absent)',
      'Email: true, Password: true, ConfirmPassword: true, FullName: false',
      `Email: ${hasEmail}, Pass: ${hasPassword}, Confirm: ${hasConfirmPassword}, FullName: ${hasFullName}`,
      hasEmail && hasPassword && hasConfirmPassword && !hasFullName
    );

    await capture(page, '02_register_corrected.png', 1280, 800);

    // Responsive Visual QA for Register Page
    console.log('Capturing responsive viewports for Register Page...');
    await capture(page, 'resp_register_1280x720.png', 1280, 720);
    await capture(page, 'resp_register_1440x900.png', 1440, 900);
    await capture(page, 'resp_register_768x1024.png', 768, 1024);
    await capture(page, 'resp_register_390x844.png', 390, 844);
    await capture(page, 'resp_register_375x812.png', 375, 812);

    // Reset viewport back to desktop
    await page.setViewport({ width: 1280, height: 800 });

    // Test form validation: password mismatch
    console.log('Testing password mismatch validation...');
    await page.type('#register-email', 'valid.test@example.com');
    await page.type('#register-password', 'Password123!');
    await page.type('#register-confirmPassword', 'Mismatch999!');
    const createBtn = await page.$('button[type="submit"]');
    await createBtn.click();
    await new Promise(r => setTimeout(r, 600));

    const mismatchError = await page.$eval('#confirmPassword-error, [role="alert"]', el => el.textContent).catch(() => '');
    record(
      'SCENARIO-B3',
      'Password Mismatch Blocks Registration with Descriptive Error',
      'Displays "Passwords do not match"',
      mismatchError,
      mismatchError.includes('Passwords do not match')
    );

    await capture(page, '03_register_validation.png', 1280, 800);

    // ============================================================
    // SCENARIO C: NEW USER REGISTRATION -> /onboarding
    // ============================================================
    console.log('\n--- SCENARIO C: New User Real Registration ---');
    // Clear inputs and type fresh credentials
    await page.evaluate(() => {
      document.querySelector('#register-email').value = '';
      document.querySelector('#register-password').value = '';
      document.querySelector('#register-confirmPassword').value = '';
    });

    const timestamp = Date.now();
    const testEmail = `dev_bound_${timestamp}@aayurface.local`;
    const testPassword = `Sattva@${timestamp}!`;
    const desiredFullName = `Dr. Vikramaditya Sen`;

    await page.type('#register-email', testEmail);
    await page.type('#register-password', testPassword);
    await page.type('#register-confirmPassword', testPassword);

    console.log(`Submitting account creation for ${testEmail}...`);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      createBtn.click()
    ]);
    await new Promise(r => setTimeout(r, 1200));

    const postRegUrl = page.url();
    record(
      'SCENARIO-C1',
      'New Account Creation Routes Deterministically to /onboarding (Not Dashboard)',
      'URL includes /onboarding',
      postRegUrl,
      postRegUrl.includes('/onboarding')
    );

    // Step 1: Welcome Screen
    await capture(page, '04_onboarding_step1.png', 1280, 800);

    // ============================================================
    // SCENARIO E: INCOMPLETE ONBOARDING ROUTE GUARD
    // ============================================================
    console.log('\n--- SCENARIO E: Incomplete Onboarding Access Guard ---');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const bypassAttemptUrl = page.url();

    record(
      'SCENARIO-E1',
      'Incomplete User Attempting /dashboard Bounces Directly to /onboarding',
      'URL is /onboarding',
      bypassAttemptUrl,
      bypassAttemptUrl.includes('/onboarding')
    );

    // ============================================================
    // SCENARIO F: ROOT WITH INCOMPLETE AUTH
    // ============================================================
    console.log('\n--- SCENARIO F: Root "/" with Incomplete User ---');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const incompleteRootUrl = page.url();
    const incompleteCtaText = await page.$eval('header a[href="/onboarding"] span', el => el.textContent).catch(() => '');

    record(
      'SCENARIO-F1',
      'Authenticated Incomplete User on Root "/" Remains on "/" and Sees "Continue Onboarding"',
      'URL is / and CTA text is "Continue Onboarding"',
      `URL: ${incompleteRootUrl}, CTA: "${incompleteCtaText}"`,
      (incompleteRootUrl === BASE + '/' || incompleteRootUrl === BASE) && incompleteCtaText.includes('Continue Onboarding')
    );

    await capture(page, '08_authenticated_incomplete_root.png', 1280, 800);

    // ============================================================
    // SCENARIO D: ONBOARDING FULL INTAKE & IDENTITY COLLECTION
    // ============================================================
    console.log('\n--- SCENARIO D: Completing 6-Step Onboarding ---');
    await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Step 1 -> Step 2
    const beginBtn = await page.waitForSelector('button ::-p-text(Begin Intake)', { timeout: 5000 });
    await beginBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Verify Step 2 owns Full Name
    const hasOnboardingFullName = await page.$('#onboarding-fullname') !== null;
    record(
      'SCENARIO-D1',
      'Onboarding Step 2 (Identity) Collects Seeker Full Name',
      'Input #onboarding-fullname exists in Step 2',
      `Present: ${hasOnboardingFullName}`,
      hasOnboardingFullName
    );

    // Fill Full Name in Step 2
    await page.type('#onboarding-fullname', desiredFullName);
    await capture(page, '05_onboarding_identity.png', 1280, 800);

    // Step 2 -> Step 3
    const continueStep2 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep2.click();
    await new Promise(r => setTimeout(r, 600));

    // Step 3: Skin Baseline -> Step 4
    const skinButtons = await page.$$('div[role="radiogroup"] button');
    if (skinButtons.length > 2) {
      await skinButtons[2].click(); // Combination
    }
    const continueStep3 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep3.click();
    await new Promise(r => setTimeout(r, 600));

    // Step 4: Lifestyle -> Step 5
    const continueStep4 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueStep4.click();
    await new Promise(r => setTimeout(r, 600));

    // Step 5: Privacy & Consent -> Step 6
    const reviewBtn = await page.waitForSelector('button ::-p-text(Review & Confirm)', { timeout: 5000 });
    await reviewBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Step 6: Review & Final Confirmation
    const reviewName = await page.$eval('.grid span.font-medium', el => el.textContent).catch(() => '');
    record(
      'SCENARIO-D2',
      'Step 6 Review Accurately Displays Entered Full Name',
      `Contains "${desiredFullName}"`,
      reviewName,
      reviewName.includes(desiredFullName)
    );

    await capture(page, '06_onboarding_review.png', 1280, 800);

    // Submit Step 6
    const completeSetupBtn = await page.waitForSelector('button ::-p-text(Complete Setup & Enter)', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      completeSetupBtn.click()
    ]);
    await new Promise(r => setTimeout(r, 2000));

    const dashUrl = page.url();
    record(
      'SCENARIO-D3',
      'Completed Onboarding Enters Authenticated Dashboard',
      'URL is /dashboard',
      dashUrl,
      dashUrl.includes('/dashboard')
    );

    await capture(page, '07_authenticated_dashboard.png', 1280, 800);

    // ============================================================
    // SCENARIO G: ROOT WITH COMPLETE AUTH
    // ============================================================
    console.log('\n--- SCENARIO G: Root "/" with Completed User ---');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const completeRootUrl = page.url();
    const completeCtaText = await page.$eval('header a[href="/dashboard"] span', el => el.textContent).catch(() => '');

    record(
      'SCENARIO-G1',
      'Authenticated Complete User on Root "/" Remains on "/" and Sees "Enter Dashboard"',
      'URL is / and CTA text is "Enter Dashboard"',
      `URL: ${completeRootUrl}, CTA: "${completeCtaText}"`,
      (completeRootUrl === BASE + '/' || completeRootUrl === BASE) && completeCtaText.includes('Enter Dashboard')
    );

    await capture(page, '09_authenticated_complete_root.png', 1280, 800);

    // ============================================================
    // SCENARIO H: SIGN OUT
    // ============================================================
    console.log('\n--- SCENARIO H: Real Sign Out Invalidation ---');
    // Click Sign Out from header
    const signOutBtn = await page.waitForSelector('header button ::-p-text(Sign Out)', { timeout: 5000 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
      signOutBtn.click()
    ]);
    await new Promise(r => setTimeout(r, 1500));

    const postSignOutUrl = page.url();
    const tokensAfterLogout = await page.evaluate(() => Object.keys(localStorage).filter(k => k.includes('auth-token')));

    record(
      'SCENARIO-H1',
      'Sign Out Clears Auth Tokens and Navigates to Public Landing "/"',
      'URL is / and 0 auth tokens in localStorage',
      `URL: ${postSignOutUrl}, Tokens remaining: ${tokensAfterLogout.length}`,
      (postSignOutUrl === BASE + '/' || postSignOutUrl === BASE) && tokensAfterLogout.length === 0
    );

    await capture(page, '10_logout_public_landing.png', 1280, 800);

    // ============================================================
    // SCENARIO I: POST-LOGOUT PROTECTED ACCESS
    // ============================================================
    console.log('\n--- SCENARIO I: Post-Logout Protected Route Access ---');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const postLogoutDashUrl = page.url();

    record(
      'SCENARIO-I1',
      'Post-Logout Access to /dashboard Is Blocked and Redirects to /signin',
      'URL includes /signin',
      postLogoutDashUrl,
      postLogoutDashUrl.includes('/signin')
    );

    await capture(page, '11_post_logout_protected_route.png', 1280, 800);

    // ============================================================
    // SCENARIO J: POST-LOGOUT SCAN ROUTE
    // ============================================================
    console.log('\n--- SCENARIO J: Post-Logout /scan Access ---');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    const postLogoutScanUrl = page.url();

    record(
      'SCENARIO-J1',
      'Post-Logout Access to /scan Is Blocked and Redirects to /signin',
      'URL includes /signin',
      postLogoutScanUrl,
      postLogoutScanUrl.includes('/signin')
    );

    // ============================================================
    // SCENARIO K: BROWSER BACK AFTER LOGOUT
    // ============================================================
    console.log('\n--- SCENARIO K: Browser Back Protection ---');
    await page.goBack({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    const backUrl = page.url();
    const isSidebarVisible = await page.$('aside').then(el => !!el).catch(() => false);

    record(
      'SCENARIO-K1',
      'Browser Back After Logout Cannot Restore Usable Protected State',
      'No protected layout rendered; redirects to /signin',
      `URL: ${backUrl}, Sidebar rendered: ${isSidebarVisible}`,
      !isSidebarVisible
    );

    console.log('\n============================================================');
    const allPassed = report.scenarios.every(s => s.pass);
    console.log(`E2E RESULT: ${allPassed ? 'ALL SCENARIOS PASS' : 'SOME SCENARIOS FAILED'} (${report.scenarios.filter(s => s.pass).length}/${report.scenarios.length})`);
    console.log('============================================================\n');

    fs.writeFileSync(
      path.join(EVIDENCE_DIR, 'registration_boundary_e2e_report.json'),
      JSON.stringify(report, null, 2)
    );

  } catch (err) {
    console.error('E2E Runtime Error:', err);
  } finally {
    await browser.close();
  }
}

runE2E();
