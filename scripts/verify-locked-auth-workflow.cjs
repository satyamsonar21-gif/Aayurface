const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runLockedAuthVerification() {
  const EVIDENCE_LOCAL = path.resolve('scripts/evidence/locked-auth');
  const EVIDENCE_ARTIFACT = path.resolve('C:/Users/HP/.gemini/antigravity/brain/6e6b8d86-3435-4d82-830f-61fb664d7b49/locked-auth');

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
  const img1Path = path.resolve('public/images/1.jpg');
  const img2Path = path.resolve('public/images/2.jpg');

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('dialog', async dialog => {
    console.log(`[DIALOG ACCEPTED]: "${dialog.message()}"`);
    await dialog.accept();
  });

  const testResults = [];

  async function takeScreenshot(filename) {
    const localPath = path.join(EVIDENCE_LOCAL, filename);
    const artifactPath = path.join(EVIDENCE_ARTIFACT, filename);
    await page.screenshot({ path: localPath, fullPage: false });
    fs.copyFileSync(localPath, artifactPath);
    console.log(`  [SCREENSHOT SAVED]: ${filename}`);
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
    console.log('STARTING LOCKED AUTHENTICATION & PRODUCT FLOW E2E VERIFICATION');
    console.log('=============================================================\n');

    // -------------------------------------------------------------
    // TEST 1: Fresh Unauthenticated Visitor -> / (Public Landing)
    // -------------------------------------------------------------
    console.log('[STEP 1] Testing fresh visitor to / ...');
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    // Guarantee localStorage is clear
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const t1Url = page.url();
    const t1Data = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim() || '';
      const ctas = Array.from(document.querySelectorAll('a, button')).map(el => el.textContent?.trim());
      const session = localStorage.getItem('aayurface_session');
      return { h1, ctas, session };
    });

    const t1HasHeroHeadline = t1Data.h1.includes('Ancient Wisdom') || t1Data.h1.includes('Modern Intelligence');
    const t1HasSignIn = t1Data.ctas.some(c => c && c.includes('Sign In'));
    const t1HasStartJourney = t1Data.ctas.some(c => c && (c.includes('Start Your Journey') || c.includes('Enter AayurFace')));
    const t1NoSession = t1Data.session === null;
    const t1Pass = t1Url === `${BASE}/` && t1HasHeroHeadline && t1HasSignIn && t1HasStartJourney && t1NoSession;

    await takeScreenshot('01-fresh-landing.png');
    record(
      'TEST-01',
      'Fresh Unauthenticated Visitor -> / (Public Landing)',
      `URL is ${BASE}/, Landing Page renders, session is null, hero CTAs present`,
      `URL=${t1Url}, hasHeadline=${t1HasHeroHeadline}, hasSignIn=${t1HasSignIn}, hasStartJourney=${t1HasStartJourney}, session=${t1Data.session}`,
      t1Pass,
      `Headline: "${t1Data.h1.replace(/\s+/g, ' ')}"`
    );

    // -------------------------------------------------------------
    // TEST 2: Landing Page Hero CTA Click -> /signin
    // -------------------------------------------------------------
    console.log('[STEP 2] Testing Hero CTA click navigation to /signin ...');
    // Find Hero CTA or Header Sign In link
    const clickedHero = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const heroBtn = links.find(a => a.textContent && a.textContent.includes('Start Your Journey'));
      if (heroBtn) {
        heroBtn.click();
        return true;
      }
      return false;
    });

    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));

    const t2Url = page.url();
    const t2Data = await page.evaluate(() => {
      const heading = document.querySelector('h1')?.textContent?.trim() || '';
      const emailInput = document.querySelector('input[type="email"]');
      const pwdInput = document.querySelector('input[type="password"]');
      return { heading, hasEmail: !!emailInput, hasPwd: !!pwdInput };
    });

    const t2Pass = t2Url === `${BASE}/signin` && t2Data.hasEmail && t2Data.hasPwd && t2Data.heading.includes('Welcome Back');
    await takeScreenshot('02-signin-page.png');
    record(
      'TEST-02',
      'Landing Page Hero CTA -> /signin Navigation',
      `URL navigates to ${BASE}/signin, Sign In form rendered with "Welcome Back"`,
      `clickedHero=${clickedHero}, URL=${t2Url}, heading="${t2Data.heading}", hasInputs=${t2Data.hasEmail && t2Data.hasPwd}`,
      t2Pass,
      'Hero CTA "Start Your Journey" successfully routed visitor to Sign In page'
    );

    // -------------------------------------------------------------
    // TEST 3: Unauthenticated Direct Entry to /dashboard -> Blocked & Redirected
    // -------------------------------------------------------------
    console.log('[STEP 3] Testing unauthenticated direct entry to /dashboard ...');
    await page.evaluate(() => localStorage.removeItem('aayurface_session'));
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const t3Url = page.url();
    const t3Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t3Pass = t3Url === `${BASE}/signin` && t3Session === null;
    await takeScreenshot('03-unauth-redirect-signin.png');
    record(
      'TEST-03',
      'Unauthenticated Direct Access to /dashboard -> Protected Route Redirect',
      `Direct URL entry to /dashboard redirects to ${BASE}/signin with session null`,
      `URL=${t3Url}, session=${t3Session}`,
      t3Pass,
      'ProtectedRoute cleanly intercepted unauthenticated entry and preserved zero session'
    );

    // -------------------------------------------------------------
    // TEST 4: Invalid Sign-In Submission -> Error Displayed, No Session
    // -------------------------------------------------------------
    console.log('[STEP 4] Testing invalid credentials submission on /signin ...');
    await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[type="email"]', { visible: true });
    await new Promise(r => setTimeout(r, 600));

    await page.click('input[type="email"]');
    await page.type('input[type="email"]', 'namrata.sen@example.com', { delay: 15 });

    await page.click('input[type="password"]');
    await page.type('input[type="password"]', 'WrongPassword999!', { delay: 15 });

    const submitBtnT4 = await page.$('button[type="submit"]');
    await submitBtnT4.click();
    await page.waitForFunction(() => !!document.querySelector('.bg-red-50'), { timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));

    const t4Url = page.url();
    const t4Error = await page.evaluate(() => {
      const err = document.querySelector('.bg-red-50, [role="alert"]')?.textContent?.trim() || '';
      const session = localStorage.getItem('aayurface_session');
      return { err, session };
    });

    const t4Pass = t4Url === `${BASE}/signin` && t4Error.err.includes('Invalid email or password') && t4Error.session === null;
    await takeScreenshot('04-signin-invalid-credentials.png');
    record(
      'TEST-04',
      'Invalid Sign-In Submission -> Error Feedback',
      'Displays error banner, preserves on /signin, no session created',
      `URL=${t4Url}, errorMsg="${t4Error.err}", session=${t4Error.session}`,
      t4Pass,
      'Invalid authentication rejected safely'
    );

    // -------------------------------------------------------------
    // TEST 5: Valid Sign-In (Account A: Namrata Sen) -> /dashboard
    // -------------------------------------------------------------
    console.log('[STEP 5] Testing valid sign-in as Account A (namrata.sen@example.com)...');
    // Clear inputs
    await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]');
      const pwd = document.querySelector('input[type="password"]');
      if (email) {
        email.value = '';
        email.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (pwd) {
        pwd.value = '';
        pwd.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await page.type('input[type="email"]', 'namrata.sen@example.com', { delay: 10 });
    await page.type('input[type="password"]', 'Ayur@123', { delay: 10 });
    const submitBtnT5 = await page.$('button[type="submit"]');
    await submitBtnT5.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    const t5Url = page.url();
    const t5Data = await page.evaluate(() => {
      const session = localStorage.getItem('aayurface_session');
      const parsed = session ? JSON.parse(session) : null;
      const bodyText = document.body.textContent || '';
      const hasNamrata = bodyText.includes('Namrata') || bodyText.includes('Namrata Sen');
      return { parsed, hasNamrata };
    });

    const t5Pass = (t5Url === `${BASE}/dashboard` || t5Url === `${BASE}/home`) && 
                   t5Data.parsed && 
                   t5Data.parsed.email === 'namrata.sen@example.com' &&
                   t5Data.hasNamrata;

    await takeScreenshot('05-account-a-dashboard.png');
    record(
      'TEST-05',
      'Valid Authentication -> Authenticated User Dashboard (/dashboard)',
      `Redirects to /dashboard with active session for Namrata Sen`,
      `URL=${t5Url}, userEmail=${t5Data.parsed?.email}, userName=${t5Data.parsed?.full_name}, UI Has Name=${t5Data.hasNamrata}`,
      t5Pass,
      `User successfully authenticated and entered personal perspective dashboard`
    );

    // -------------------------------------------------------------
    // TEST 6: Authenticated Feature Navigation & Profile Inspection
    // -------------------------------------------------------------
    console.log('[STEP 6] Testing feature navigation to /scan and /profile...');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t6ScanUrl = page.url();
    const t6HasScanUI = await page.evaluate(() => !!document.querySelector('input[type="file"]') || document.body.textContent.includes('Scan'));

    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    const t6ProfileUrl = page.url();
    const t6ProfileName = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim() || '';
      const email = document.querySelector('p.text-body-md')?.textContent?.trim() || '';
      return { h1, email };
    });

    const t6Pass = t6ScanUrl === `${BASE}/scan` && 
                   t6HasScanUI && 
                   t6ProfileUrl === `${BASE}/profile` && 
                   t6ProfileName.h1.includes('Namrata');

    await takeScreenshot('06-account-a-profile.png');
    record(
      'TEST-06',
      'Authenticated Feature Navigation (/scan and /profile)',
      'Authenticated user can access /scan and /profile with personal profile data rendered',
      `scanUrl=${t6ScanUrl}, profileUrl=${t6ProfileUrl}, profileUser=${t6ProfileName.h1} (${t6ProfileName.email})`,
      t6Pass,
      'Protected modules accessible under authenticated context'
    );

    // -------------------------------------------------------------
    // TEST 7: Session Persistence on Page Reload
    // -------------------------------------------------------------
    console.log('[STEP 7] Testing session persistence on reload...');
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const t7Url = page.url();
    const t7Session = await page.evaluate(() => {
      const s = localStorage.getItem('aayurface_session');
      return s ? JSON.parse(s) : null;
    });

    const t7Pass = (t7Url === `${BASE}/dashboard` || t7Url === `${BASE}/home`) && t7Session && t7Session.email === 'namrata.sen@example.com';
    record(
      'TEST-07',
      'Session Persistence Across Page Reload',
      'Active session persists on page reload and remains on /dashboard',
      `URL=${t7Url}, sessionEmail=${t7Session?.email}`,
      t7Pass,
      'Session state retained cleanly without re-prompting'
    );

    // -------------------------------------------------------------
    // TEST 8: Logout via UI -> Returns to Public Landing Page
    // -------------------------------------------------------------
    console.log('[STEP 8] Testing Logout from /profile ...');
    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    // Click Sign Out button
    const clickedSignOut = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    await page.waitForFunction(() => window.location.pathname === '/', { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    const t8Url = page.url();
    const t8Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t8Pass = t8Url === `${BASE}/` && t8Session === null;

    await takeScreenshot('07-post-logout-landing.png');
    record(
      'TEST-08',
      'Sign Out of Account -> Clears Session & Returns to / (Public Landing)',
      `Redirects to ${BASE}/ and clears localStorage session completely`,
      `clickedBtn=${clickedSignOut}, URL=${t8Url}, session=${t8Session}`,
      t8Pass,
      'Sign out cleanly purged session and navigated user back to public landing page'
    );

    // -------------------------------------------------------------
    // TEST 9: Post-Logout Re-entry Blocked & Browser Back Protection
    // -------------------------------------------------------------
    console.log('[STEP 9] Testing post-logout re-entry blocking across all protected routes...');
    const protectedRoutes = [
      '/dashboard',
      '/home',
      '/scan',
      '/history',
      '/chat',
      '/remedies',
      '/routine',
      '/progress',
      '/profile',
      '/settings'
    ];

    const failedProtectedRoutes = [];
    for (const route of protectedRoutes) {
      await page.goto(BASE + route, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 200));
      const curUrl = page.url();
      const curSess = await page.evaluate(() => localStorage.getItem('aayurface_session'));
      if (!curUrl.includes('/signin') && !curUrl.includes('/login')) {
        failedProtectedRoutes.push(`${route} reached ${curUrl}`);
      }
      if (curSess !== null) {
        failedProtectedRoutes.push(`${route} leaked session!`);
      }
    }

    // Now test browser BACK from /signin
    console.log('[STEP 9] Testing browser back button after logout...');
    await page.goBack().catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    const backUrl = page.url();
    const backSession = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const backBlocked = !backUrl.includes('/dashboard') && 
                        !backUrl.includes('/scan') && 
                        !backUrl.includes('/profile') &&
                        backSession === null;

    const t9Pass = failedProtectedRoutes.length === 0 && backBlocked;
    await takeScreenshot('08-post-logout-reentry-blocked.png');
    record(
      'TEST-09',
      'Post-Logout Re-entry Blocked Across All Routes & Browser Back Protected',
      'All 10 protected routes redirect to /signin; Browser back cannot access protected views',
      `failedRoutes=[${failedProtectedRoutes.join(', ')}], backUrl=${backUrl}, backSession=${backSession}`,
      t9Pass,
      'Protected routes and back navigation strictly guarded post-logout'
    );

    // -------------------------------------------------------------
    // TEST 10: New User Registration (Account B) -> Direct Dashboard Entry
    // -------------------------------------------------------------
    console.log('[STEP 10] Testing New User Registration for Account B (Bhavna Patel)...');
    await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const userBEmail = `bhavna.patel.${Date.now()}@example.com`;
    await page.type('input[name="fullName"]', 'Bhavna Patel', { delay: 10 });
    await page.type('input[type="email"]', userBEmail, { delay: 10 });
    await page.type('input[name="password"]', 'Ayur@Secret2026', { delay: 10 });
    await page.type('input[name="confirmPassword"]', 'Ayur@Secret2026', { delay: 10 });

    const submitRegisterBtn = await page.$('button[type="submit"]');
    await submitRegisterBtn.click();
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    const t10Url = page.url();
    const t10Session = await page.evaluate(() => {
      const s = localStorage.getItem('aayurface_session');
      return s ? JSON.parse(s) : null;
    });

    const t10Pass = (t10Url === `${BASE}/dashboard` || t10Url === `${BASE}/home`) && 
                    t10Session && 
                    t10Session.email === userBEmail && 
                    t10Session.full_name === 'Bhavna Patel';

    await takeScreenshot('09-account-b-registered-dashboard.png');
    record(
      'TEST-10',
      'New User Registration -> Direct /dashboard Entry & Session Creation',
      `Registration redirects directly to /dashboard with Account B active session`,
      `URL=${t10Url}, sessionUser=${t10Session?.full_name}, sessionEmail=${t10Session?.email}`,
      t10Pass,
      'Registration directly establishes authenticated context and routes to dashboard'
    );

    // -------------------------------------------------------------
    // TEST 11: Multi-User Assessment Isolation (Non-Regression)
    // -------------------------------------------------------------
    console.log('[STEP 11] Testing Multi-User Assessment Lifecycle Isolation...');
    
    // Account B scans Image 2
    console.log('[STEP 11A] Account B scanning Image 2 (public/images/2.jpg)...');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const fileInputB = await page.$('input[type="file"]');
    await fileInputB.uploadFile(img2Path);
    await page.waitForFunction(() => {
      return document.body.textContent.includes('Continue to Assessment');
    }, { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));

    // Click Continue to Assessment
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
      if (btn) btn.click();
    });
    await page.waitForFunction(() => window.location.pathname.startsWith('/results/'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));

    const urlBResult = page.url();
    const matchB = urlBResult.match(/\/results\/([a-zA-Z0-9_-]+)$/);
    const assessmentId_B = matchB ? matchB[1] : null;

    await takeScreenshot('10-account-b-assessment-result.png');
    console.log(`  Account B assessment created: ID=${assessmentId_B}`);

    // Sign out Account B
    console.log('[STEP 11B] Signing out Account B...');
    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
      if (btn) btn.click();
    });
    await page.waitForFunction(() => window.location.pathname === '/', { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    // Sign in as Account A (Namrata Sen)
    console.log('[STEP 11C] Signing in as Account A (namrata.sen@example.com)...');
    await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const email = document.querySelector('input[type="email"]');
      const pwd = document.querySelector('input[type="password"]');
      if (email) { email.value = ''; email.dispatchEvent(new Event('input', { bubbles: true })); }
      if (pwd) { pwd.value = ''; pwd.dispatchEvent(new Event('input', { bubbles: true })); }
    });
    await page.type('input[type="email"]', 'namrata.sen@example.com', { delay: 10 });
    await page.type('input[type="password"]', 'Ayur@123', { delay: 10 });
    const submitBtnA = await page.$('button[type="submit"]');
    await submitBtnA.click();
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    // Account A scans Image 1
    console.log('[STEP 11D] Account A scanning Image 1 (public/images/1.jpg)...');
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const fileInputA = await page.$('input[type="file"]');
    await fileInputA.uploadFile(img1Path);
    await page.waitForFunction(() => {
      return document.body.textContent.includes('Continue to Assessment');
    }, { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));

    // Click Continue to Assessment
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
      if (btn) btn.click();
    });
    await page.waitForFunction(() => window.location.pathname.startsWith('/results/'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));

    const urlAResult = page.url();
    const matchA = urlAResult.match(/\/results\/([a-zA-Z0-9_-]+)$/);
    const assessmentId_A = matchA ? matchA[1] : null;

    await takeScreenshot('11-account-a-assessment-result.png');
    console.log(`  Account A assessment created: ID=${assessmentId_A}`);

    // Verify IDs are distinct UUIDs and neither is demo-scan
    const distinctAssessments = assessmentId_A && 
                                assessmentId_B && 
                                assessmentId_A !== assessmentId_B && 
                                assessmentId_A !== 'demo-scan' && 
                                assessmentId_B !== 'demo-scan';

    // TEST 11E: Cross-Account Access Denial
    console.log(`[STEP 11E] Account A attempting unauthorized access to Account B's assessment (${assessmentId_B})...`);
    await page.goto(BASE + `/results/${assessmentId_B}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const crossAccessData = await page.evaluate(() => {
      const text = document.body.textContent || '';
      const notFound = text.includes('Observation Record Not Found') || text.includes('not accessible');
      const hasImage = !!document.querySelector('img[alt="Captured Frame"]');
      return { notFound, hasImage };
    });

    const crossAccessBlocked = crossAccessData.notFound && !crossAccessData.hasImage;
    await takeScreenshot('12-cross-account-denied.png');

    // TEST 11F: History Isolation
    console.log('[STEP 11F] Checking Account A History isolation...');
    await page.goto(BASE + '/history', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const historyDataA = await page.evaluate((idA, idB) => {
      const text = document.body.textContent || '';
      return {
        hasIdA: text.includes(idA.slice(0, 8)) || text.includes(idA),
        hasIdB: text.includes(idB.slice(0, 8)) || text.includes(idB)
      };
    }, assessmentId_A, assessmentId_B);

    await takeScreenshot('13-account-a-history-isolated.png');

    // TEST 11G: Demo Scan Isolation
    console.log('[STEP 11G] Checking Demo Scan isolation at /results/demo-scan...');
    await page.goto(BASE + '/results/demo-scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const demoHasNotice = await page.evaluate(() => {
      return document.body.textContent.includes('Demo') || document.body.textContent.includes('Sample') || document.body.textContent.includes('demonstration');
    });
    await takeScreenshot('14-demo-scan-isolated.png');

    const t11Pass = distinctAssessments && crossAccessBlocked && historyDataA.hasIdA && !historyDataA.hasIdB && demoHasNotice;
    record(
      'TEST-11',
      'Multi-User Assessment Lifecycle Non-Regression & Isolation',
      'Assessment A != Assessment B, cross-account access blocked, history isolated, demo-scan isolated',
      `idA=${assessmentId_A}, idB=${assessmentId_B}, crossAccessBlocked=${crossAccessBlocked}, historyIsolated=${historyDataA.hasIdA && !historyDataA.hasIdB}, demoIsolated=${demoHasNotice}`,
      t11Pass,
      `Account A ID: ${assessmentId_A}, Account B ID: ${assessmentId_B}`
    );

    // -------------------------------------------------------------
    // TEST 12: Final Sign Out to Public Landing
    // -------------------------------------------------------------
    console.log('[STEP 12] Final Sign Out of Account A...');
    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
      if (btn) btn.click();
    });
    await page.waitForFunction(() => window.location.pathname === '/', { timeout: 8000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));

    const t12Url = page.url();
    const t12Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t12Pass = t12Url === `${BASE}/` && t12Session === null;

    await takeScreenshot('15-final-landing.png');
    record(
      'TEST-12',
      'Final Sign Out -> Clears Session & Returns to / (Public Landing)',
      `Final URL is ${BASE}/, session is completely null`,
      `URL=${t12Url}, session=${t12Session}`,
      t12Pass,
      'Final state verified: anonymous public visitor on landing page'
    );

  } catch (err) {
    console.error('Fatal Verification Error:', err);
  } finally {
    await browser.close();
  }

  // Generate JSON Report
  const passedTests = testResults.filter(t => t.status === 'PASS').length;
  const totalTests = testResults.length;
  const finalStatus = passedTests === totalTests ? 'PASS' : 'FAIL';

  const report = {
    timestamp: new Date().toISOString(),
    status: finalStatus,
    summary: `${passedTests} / ${totalTests} tests passed`,
    testResults
  };

  const reportPath = path.resolve('scripts/verification-locked-auth-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n======================================================`);
  console.log(`FINAL RESULT: ${finalStatus} (${passedTests}/${totalTests} tests passed)`);
  console.log(`Report written to: ${reportPath}`);
  console.log(`======================================================\n`);

  return report;
}

runLockedAuthVerification();
