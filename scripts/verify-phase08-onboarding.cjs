const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runPhase08Verification() {
  const EVIDENCE_LOCAL = path.resolve('scripts/evidence/phase08');
  const EVIDENCE_ARTIFACT = path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/phase08');

  if (!fs.existsSync(EVIDENCE_LOCAL)) {
    fs.mkdirSync(EVIDENCE_LOCAL, { recursive: true });
  }
  if (!fs.existsSync(EVIDENCE_ARTIFACT)) {
    fs.mkdirSync(EVIDENCE_ARTIFACT, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const BASE = 'http://localhost:5173';
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('dialog', async (dialog) => {
    console.log(`[DIALOG ACCEPTED]: "${dialog.message()}"`);
    await dialog.accept();
  });

  const testResults = [];

  async function takeScreenshot(filename, width = 1280, height = 800) {
    await page.setViewport({ width, height });
    const localPath = path.join(EVIDENCE_LOCAL, filename);
    const artifactPath = path.join(EVIDENCE_ARTIFACT, filename);
    await page.screenshot({ path: localPath, fullPage: false });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`  [SCREENSHOT SAVED]: ${filename} (${width}x${height})`);
  }

  function record(id, name, expected, actual, pass, details) {
    testResults.push({
      id,
      name,
      expected,
      actual,
      status: pass ? 'PASS' : 'FAIL',
      details
    });
    console.log(`\n======================================================`);
    console.log(`[${id}] ${name} => ${pass ? 'PASS' : 'FAIL'}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
    if (details) console.log(`  Details:  ${details}`);
    console.log(`======================================================\n`);
  }

  try {
    console.log('\n=============================================================');
    console.log('STARTING PHASE 08: REAL AUTHENTICATED ONBOARDING E2E AUDIT');
    console.log('=============================================================\n');

    // -------------------------------------------------------------
    // TEST 1: Unauthenticated visitors redirected away from /dashboard & /onboarding
    // -------------------------------------------------------------
    console.log('[STEP 1] Testing unauthenticated access to /dashboard...');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const t1Url = page.url();
    const t1Pass = t1Url.includes('/signin') || t1Url.includes('/login');
    record(
      'PHASE08-01',
      'Unauthenticated /dashboard Access Redirects to /signin',
      'URL includes /signin',
      t1Url,
      t1Pass,
      'Protected route guard enforces strict signin redirection'
    );
    await takeScreenshot('01_unauth_dashboard_redirect.png');

    console.log('[STEP 2] Testing unauthenticated access to /onboarding...');
    await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const t2Url = page.url();
    const t2Pass = t2Url.includes('/signin') || t2Url.includes('/login');
    record(
      'PHASE08-02',
      'Unauthenticated /onboarding Access Redirects to /signin',
      'URL includes /signin',
      t2Url,
      t2Pass,
      'Onboarding route guard requires active session before intake'
    );
    await takeScreenshot('02_unauth_onboarding_redirect.png');

    // -------------------------------------------------------------
    // TEST 3: User Signup & Incomplete Onboarding Gating
    // -------------------------------------------------------------
    const timestamp = Date.now();
    const testEmail = `dev.seeker.${timestamp}@aayurface.local`;
    const testPassword = `Sattva@${timestamp}!`;
    const testFullName = `Priya Sharma`;

    console.log(`[STEP 3] Signing up new seeker: ${testEmail}...`);
    await page.goto(BASE + '/signup', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    // Fill registration form
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    const textInputs = await page.$$('input[type="text"]');
    if (textInputs.length > 0) {
      await textInputs[0].type(testFullName);
    }
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await emailInput.type(testEmail);
    }
    const passwordInputs = await page.$$('input[type="password"]');
    if (passwordInputs.length > 0) {
      await passwordInputs[0].type(testPassword);
      if (passwordInputs.length > 1) {
        await passwordInputs[1].type(testPassword);
      }
    }

    await takeScreenshot('03_signup_form_filled.png');

    // Submit registration
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
    }

    // Wait for post-auth navigation
    console.log('Waiting for post-registration routing...');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    const postSignupUrl = page.url();
    const t3Pass = postSignupUrl.includes('/onboarding');
    record(
      'PHASE08-03',
      'Fresh User Post-Registration Routes Deterministically to /onboarding',
      'URL includes /onboarding',
      postSignupUrl,
      t3Pass,
      `User signed up with onboarding_completed: false redirected directly to /onboarding`
    );
    await takeScreenshot('04_onboarding_step1_welcome.png');

    // -------------------------------------------------------------
    // TEST 4: Attempt to Bypass Onboarding via Direct URL Navigation
    // -------------------------------------------------------------
    console.log('[STEP 4] Attempting to bypass onboarding to /dashboard...');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    const bypassDashboardUrl = page.url();
    const t4aPass = bypassDashboardUrl.includes('/onboarding');

    console.log('[STEP 5] Attempting to bypass onboarding to /scan...');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    const bypassScanUrl = page.url();
    const t4bPass = bypassScanUrl.includes('/onboarding');

    record(
      'PHASE08-04',
      'Incomplete Onboarding Enforces Gating on All App Routes',
      'Direct navigation to /dashboard or /scan redirected back to /onboarding',
      `dashboard => ${bypassDashboardUrl}, scan => ${bypassScanUrl}`,
      t4aPass && t4bPass,
      'ProtectedRoute intercepts incomplete users and forces /onboarding completion'
    );
    await takeScreenshot('05_onboarding_gating_enforced.png');

    // -------------------------------------------------------------
    // TEST 5: Complete Multi-Step Onboarding Flow
    // -------------------------------------------------------------
    console.log('[STEP 6] Executing multi-step onboarding flow...');
    await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Step 1: Click "Begin Intake"
    console.log('Advancing from Step 1 (Welcome) to Step 2 (Identity)...');
    const beginBtn = await page.waitForSelector('button ::-p-text(Begin Intake)', { timeout: 5000 });
    await beginBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('06_onboarding_step2_identity.png');

    // Step 2: Identity & Verified Account
    console.log('Advancing from Step 2 (Identity) to Step 3 (Skin Context)...');
    const continueBtnStep2 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueBtnStep2.click();
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('07_onboarding_step3_skin.png');

    // Step 3: Skin Tendency & Concerns
    console.log('Selecting skin tendency and advancing to Step 4 (Lifestyle)...');
    // Select Normal or Combination skin radio
    const skinButtons = await page.$$('div[role="radiogroup"] button');
    if (skinButtons.length > 2) {
      await skinButtons[2].click(); // Combination
    }
    const continueBtnStep3 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueBtnStep3.click();
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('08_onboarding_step4_lifestyle.png');

    // Step 4: Lifestyle & Dinacharya Rhythms
    console.log('Advancing from Step 4 (Lifestyle) to Step 5 (Consents)...');
    const continueBtnStep4 = await page.waitForSelector('button ::-p-text(Continue)', { timeout: 5000 });
    await continueBtnStep4.click();
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('09_onboarding_step5_consents.png');

    // Step 5: Privacy, Data Sovereignty & Consents
    console.log('Reviewing and advancing from Step 5 to Step 6 (Review)...');
    // Check research consent as well
    const researchCheckbox = await page.$('#consent-research');
    if (researchCheckbox) {
      await researchCheckbox.click();
    }
    const reviewBtn = await page.waitForSelector('button ::-p-text(Review & Confirm)', { timeout: 5000 });
    await reviewBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await takeScreenshot('10_onboarding_step6_review.png');

    // Step 6: Verify Review Content
    const reviewContent = await page.evaluate(() => document.body.innerText);
    const hasFocusNotEstablished = reviewContent.includes('Focus not established');
    const hasSelfReported = reviewContent.includes('Self-Reported');
    record(
      'PHASE08-05',
      'Onboarding Review Truthfully Discloses Constitutional Focus Not Established',
      'Review contains "Focus not established" and "Self-Reported"',
      `Focus not established: ${hasFocusNotEstablished}, Self-Reported: ${hasSelfReported}`,
      hasFocusNotEstablished && hasSelfReported,
      'No fabricated dosha in review intake card'
    );

    // Click "Complete Setup & Enter"
    console.log('Submitting final atomic onboarding setup...');
    const completeSetupBtn = await page.waitForSelector('button ::-p-text(Complete Setup & Enter)', { timeout: 5000 });
    await completeSetupBtn.click();

    // Wait for post-onboarding redirect to /dashboard
    console.log('Waiting for atomic profile creation and redirect to /dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    const postOnboardingUrl = page.url();
    const t5Pass = postOnboardingUrl.includes('/dashboard') || postOnboardingUrl.includes('/home');
    record(
      'PHASE08-06',
      'Atomic Onboarding Completion Persists State and Routes to /dashboard',
      'URL is /dashboard',
      postOnboardingUrl,
      t5Pass,
      'Auth metadata and profile updated; user seamlessly redirected to dashboard'
    );
    await takeScreenshot('11_post_onboarding_dashboard_desktop.png', 1280, 800);
    await takeScreenshot('12_post_onboarding_dashboard_mobile.png', 390, 844);

    // -------------------------------------------------------------
    // TEST 6: Completed User Cannot Re-enter /onboarding
    // -------------------------------------------------------------
    console.log('[STEP 7] Verifying completed user attempting to revisit /onboarding...');
    await page.goto(BASE + '/onboarding', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    const reenterUrl = page.url();
    const t6Pass = reenterUrl.includes('/dashboard');
    record(
      'PHASE08-07',
      'Completed User Blocked from Re-entering /onboarding',
      'Redirected away from /onboarding to /dashboard',
      reenterUrl,
      t6Pass,
      'ProtectedRoute detects onboarding_completed: true and guards against redundant onboarding'
    );

    // -------------------------------------------------------------
    // TEST 7: Settings Page Displays Server-Side Authoritative Consents
    // -------------------------------------------------------------
    console.log('[STEP 8] Verifying Settings page authoritative consents...');
    await page.goto(BASE + '/settings', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await takeScreenshot('13_settings_server_consents.png', 1280, 800);

    const settingsContent = await page.evaluate(() => document.body.innerText);
    const hasCameraConsent = settingsContent.includes('Camera Processing');
    const hasDisclaimerConsent = settingsContent.includes('Educational Terms & Health Disclaimer');
    const hasResearchConsent = settingsContent.includes('Anonymous Botanical Research');

    record(
      'PHASE08-08',
      'Settings Page Displays Server-Side Authoritative Consents',
      'Displays Camera, Disclaimer, and Research consents with versions',
      `Camera: ${hasCameraConsent}, Disclaimer: ${hasDisclaimerConsent}, Research: ${hasResearchConsent}`,
      hasCameraConsent && hasDisclaimerConsent && hasResearchConsent,
      'Authoritative user_consents queried and rendered in Settings'
    );

    // -------------------------------------------------------------
    // TEST 8: Profile Page Displays Truthful Constitutional Status
    // -------------------------------------------------------------
    console.log('[STEP 9] Verifying Profile page constitutional truthfulness...');
    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await takeScreenshot('14_profile_truthful_status.png', 1280, 800);

    const profileContent = await page.evaluate(() => document.body.innerText);
    const hasTruthfulProfile = profileContent.includes('Self-reported') || profileContent.includes('Constitutional focus not established');
    record(
      'PHASE08-09',
      'Profile Page Truthfulness: No Fabricated Dosha',
      'Reflects Self-reported skin tendency and non-fabricated dosha status',
      profileContent.slice(0, 300).replace(/\n/g, ' '),
      hasTruthfulProfile,
      'Prakriti dosha not fabricated without real scan'
    );

    // -------------------------------------------------------------
    // Summary & Output
    // -------------------------------------------------------------
    const passCount = testResults.filter(t => t.status === 'PASS').length;
    const failCount = testResults.filter(t => t.status === 'FAIL').length;
    const allPassed = failCount === 0;

    const report = {
      timestamp: new Date().toISOString(),
      allPassed,
      total: testResults.length,
      passed: passCount,
      failed: failCount,
      testUser: {
        email: testEmail,
        fullName: testFullName,
      },
      results: testResults
    };

    const reportPathLocal = path.resolve('scripts/evidence/phase08/phase08_e2e_report.json');
    const reportPathArtifact = path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/phase08_onboarding_report.json');

    fs.writeFileSync(reportPathLocal, JSON.stringify(report, null, 2));
    fs.writeFileSync(reportPathArtifact, JSON.stringify(report, null, 2));

    console.log('\n=============================================================');
    console.log(`PHASE 08 E2E AUDIT COMPLETE: ${passCount}/${testResults.length} PASSED`);
    console.log(`Report written to: ${reportPathArtifact}`);
    console.log('=============================================================\n');

  } catch (err) {
    console.error('Fatal exception during Phase 08 E2E verification:', err);
  } finally {
    await browser.close();
  }
}

runPhase08Verification();
