const puppeteer = require('puppeteer-core');

async function runAuthVerification() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const results = [];

  function record(testNum, testName, expected, actual, pass, evidence) {
    results.push({
      testNumber: testNum,
      testName,
      expected,
      actual,
      result: pass ? 'PASS' : 'FAIL',
      evidence
    });
    console.log(`[TEST ${testNum}] ${testName}: ${pass ? 'PASS' : 'FAIL'}`);
    if (!pass) console.log(`  Expected: ${expected}\n  Actual: ${actual}`);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('dialog', async dialog => {
    console.log('[DIALOG DETECTED]', dialog.message());
    await dialog.accept();
  });

  const BASE = 'http://localhost:5173';

  // Helper to clear localStorage
  async function clearStorage() {
    await page.goto(BASE + '/');
    await page.evaluate(() => {
      localStorage.removeItem('aayurface_session');
    });
    await new Promise(r => setTimeout(r, 200));
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Unauthenticated -> / (Landing page loads)
    // -------------------------------------------------------------
    await clearStorage();
    await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const t1Url = page.url();
    const t1Content = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.textContent?.trim() || '';
      const hasSignIn = Array.from(document.querySelectorAll('a, button')).some(el => el.textContent?.includes('Sign In'));
      const hasGetStarted = Array.from(document.querySelectorAll('a, button')).some(el => el.textContent?.includes('Get Started'));
      const session = localStorage.getItem('aayurface_session');
      return { h1, hasSignIn, hasGetStarted, session };
    });
    const t1Pass = t1Url === `${BASE}/` && t1Content.hasSignIn && t1Content.hasGetStarted && !t1Content.session;
    record(
      1,
      'Unauthenticated -> / (Landing Page)',
      'Landing page loads at / without session creation, showing "Sign In" and "Get Started"',
      `URL=${t1Url}, hasSignIn=${t1Content.hasSignIn}, hasGetStarted=${t1Content.hasGetStarted}, session=${t1Content.session}`,
      t1Pass,
      `Heading: "${t1Content.h1.slice(0, 40)}...", Session: null`
    );

    // -------------------------------------------------------------
    // Test 2: Unauthenticated -> /signin (Sign In loads)
    // -------------------------------------------------------------
    await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const t2Url = page.url();
    const t2Content = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Sign In'));
      return { hasEmail: !!emailInput, hasSubmit: !!submitBtn };
    });
    const t2Pass = t2Url === `${BASE}/signin` && t2Content.hasEmail && t2Content.hasSubmit;
    record(
      2,
      'Unauthenticated -> /signin (Sign In Page)',
      'Sign In page loads at /signin with email input and submit button',
      `URL=${t2Url}, hasEmail=${t2Content.hasEmail}, hasSubmit=${t2Content.hasSubmit}`,
      t2Pass,
      `Sign In form rendered cleanly at ${t2Url}`
    );

    // -------------------------------------------------------------
    // Test 3: Unauthenticated -> /register (Register loads)
    // -------------------------------------------------------------
    await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const t3Url = page.url();
    const t3Content = await page.evaluate(() => {
      const emailInput = document.querySelector('input[type="email"]');
      const fullNameInput = document.querySelector('input[name="fullName"]');
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Create Account'));
      return { hasEmail: !!emailInput, hasName: !!fullNameInput, hasSubmit: !!submitBtn };
    });
    const t3Pass = t3Url === `${BASE}/register` && t3Content.hasEmail && t3Content.hasSubmit;
    record(
      3,
      'Unauthenticated -> /register (Register Page)',
      'Register page loads at /register with registration fields',
      `URL=${t3Url}, hasEmail=${t3Content.hasEmail}, hasSubmit=${t3Content.hasSubmit}`,
      t3Pass,
      `Register form rendered cleanly at ${t3Url}`
    );

    // -------------------------------------------------------------
    // Test 4: Unauthenticated -> /dashboard (Redirects to /signin)
    // -------------------------------------------------------------
    await clearStorage();
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const t4Url = page.url();
    const t4Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t4Pass = t4Url === `${BASE}/signin` && !t4Session;
    record(
      4,
      'Unauthenticated -> /dashboard (Protected Redirect)',
      'Redirects to /signin with no demo session created',
      `URL=${t4Url}, session=${t4Session}`,
      t4Pass,
      `ProtectedRoute redirected unauthenticated visit to ${t4Url}`
    );

    // -------------------------------------------------------------
    // Test 5: Unauthenticated -> /scan (Redirects to /signin)
    // -------------------------------------------------------------
    await clearStorage();
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 400));
    const t5Url = page.url();
    const t5Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t5Pass = t5Url === `${BASE}/signin` && !t5Session;
    record(
      5,
      'Unauthenticated -> /scan (Protected Redirect)',
      'Redirects to /signin with no demo session created',
      `URL=${t5Url}, session=${t5Session}`,
      t5Pass,
      `ProtectedRoute redirected unauthenticated visit to ${t5Url}`
    );

    // -------------------------------------------------------------
    // Test 6: Successful login -> redirects to intended destination
    // -------------------------------------------------------------
    // Type credentials: namrata.sen@example.com / Ayur@123
    await page.type('input[type="email"]', 'namrata.sen@example.com', { delay: 20 });
    await page.type('input[type="password"]', 'Ayur@123', { delay: 20 });
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
    const t6Url = page.url();
    const t6Session = await page.evaluate(() => {
      const s = localStorage.getItem('aayurface_session');
      return s ? JSON.parse(s) : null;
    });
    // Note: Since we visited /scan before, location.state.from was /scan, so redirect should be /scan!
    // Or if default, /dashboard. Either way, user is authenticated and inside protected app.
    const t6Pass = (t6Url === `${BASE}/scan` || t6Url === `${BASE}/dashboard`) && t6Session && t6Session.email === 'namrata.sen@example.com';
    record(
      6,
      'Successful Login -> Authenticated App Redirect',
      'User logs in with registered credentials and is redirected to protected destination with session saved',
      `URL=${t6Url}, userEmail=${t6Session?.email}`,
      t6Pass,
      `Session established: user=${t6Session?.full_name}, redirected to: ${t6Url}`
    );

    // Navigate to /dashboard explicitly to verify dashboard access
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------------------------------------
    // Test 7: Authenticated -> /signin (Redirects to /dashboard)
    // -------------------------------------------------------------
    await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t7Url = page.url();
    const t7Pass = t7Url === `${BASE}/dashboard`;
    record(
      7,
      'Authenticated -> /signin (PublicRoute Guard)',
      'Redirects authenticated user to /dashboard',
      `URL=${t7Url}`,
      t7Pass,
      `PublicRoute redirected authenticated user from /signin to ${t7Url}`
    );

    // -------------------------------------------------------------
    // Test 8: Authenticated -> /register (Redirects to /dashboard)
    // -------------------------------------------------------------
    await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t8Url = page.url();
    const t8Pass = t8Url === `${BASE}/dashboard`;
    record(
      8,
      'Authenticated -> /register (PublicRoute Guard)',
      'Redirects authenticated user to /dashboard',
      `URL=${t8Url}`,
      t8Pass,
      `PublicRoute redirected authenticated user from /register to ${t8Url}`
    );

    // -------------------------------------------------------------
    // Test 9: Authenticated -> /scan (Loads scan page)
    // -------------------------------------------------------------
    await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t9Url = page.url();
    const t9HasScan = await page.evaluate(() => {
      return !!document.querySelector('video') || document.body.textContent.includes('Scan') || document.body.textContent.includes('Camera');
    });
    const t9Pass = t9Url === `${BASE}/scan` && t9HasScan;
    record(
      9,
      'Authenticated -> /scan (Protected Route Access)',
      'Scan page loads successfully for authenticated user',
      `URL=${t9Url}, hasScanUI=${t9HasScan}`,
      t9Pass,
      `Scan module accessible for authenticated user at ${t9Url}`
    );

    // -------------------------------------------------------------
    // Test 10: Refresh authenticated /dashboard (Session persists)
    // -------------------------------------------------------------
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t10Url = page.url();
    const t10Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t10Pass = t10Url === `${BASE}/dashboard` && !!t10Session;
    record(
      10,
      'Refresh Authenticated /dashboard (Session Persistence)',
      'Session persists across page reload, remains on /dashboard',
      `URL=${t10Url}, sessionExists=${!!t10Session}`,
      t10Pass,
      `Session persisted after reload at ${t10Url}`
    );

    // -------------------------------------------------------------
    // Test 11: Logout via UI / signOut (Session cleared, redirects to public landing /)
    // -------------------------------------------------------------
    await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    // Find and click sign out button
    const signedOut = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    await new Promise(r => setTimeout(r, 800));
    const t11Url = page.url();
    const t11Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t11Pass = t11Url === `${BASE}/` && t11Session === null;
    record(
      11,
      'Logout via UI / signOut',
      'Clears localStorage session and redirects to public landing /',
      `clickedBtn=${signedOut}, URL=${t11Url}, session=${t11Session}`,
      t11Pass,
      `Sign Out executed, session removed, redirected to ${t11Url}`
    );

    // -------------------------------------------------------------
    // Test 12: Post-logout -> /dashboard (Redirects to /signin)
    // -------------------------------------------------------------
    await page.goto(BASE + '/dashboard', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));
    const t12Url = page.url();
    const t12Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    const t12Pass = (t12Url === `${BASE}/signin` || t12Url === `${BASE}/login`) && !t12Session;
    record(
      12,
      'Post-logout -> /dashboard (Re-entry Blocked)',
      'Direct navigation to /dashboard after logout redirects to /signin',
      `URL=${t12Url}, session=${t12Session}`,
      t12Pass,
      `Protected route access denied post-logout, redirected to ${t12Url}`
    );

    // -------------------------------------------------------------
    // Test 13: Post-logout -> Browser Back (Blocked, stays/redirects to /signin)
    // -------------------------------------------------------------
    // User tries pressing back
    await page.goBack().catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    const t13Url = page.url();
    const t13Session = await page.evaluate(() => localStorage.getItem('aayurface_session'));
    // Must NOT be on /dashboard, must be on /signin or /login or /
    const t13Pass = !t13Url.includes('/dashboard') && (t13Url.includes('/signin') || t13Url.includes('/login') || t13Url === `${BASE}/`) && !t13Session;
    record(
      13,
      'Post-logout -> Browser Back (Back Button Navigation)',
      'Browser back button does not grant access to protected pages',
      `URL=${t13Url}, session=${t13Session}`,
      t13Pass,
      `Protected view blocked upon back button press, on: ${t13Url}`
    );

    // -------------------------------------------------------------
    // Test 14: Direct protected URLs while unauthenticated
    // -------------------------------------------------------------
    const protectedRoutes = ['/home', '/chat', '/history', '/remedies', '/routine', '/progress', '/profile', '/settings'];
    const failures = [];
    for (const route of protectedRoutes) {
      await page.goto(BASE + route, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 300));
      const cur = page.url();
      const sess = await page.evaluate(() => localStorage.getItem('aayurface_session'));
      if (!cur.includes('/signin') && !cur.includes('/login')) {
        failures.push(`${route} -> ${cur}`);
      }
      if (sess) {
        failures.push(`${route} -> created session!`);
      }
    }
    const t14Pass = failures.length === 0;
    record(
      14,
      'Direct Protected URLs while Unauthenticated',
      'All 8 application routes redirect to /signin without creating a session',
      failures.length === 0 ? 'All 8 routes redirected to /signin' : `Failed: ${failures.join(', ')}`,
      t14Pass,
      `Tested routes: ${protectedRoutes.join(', ')}. All redirected to /signin with 0 sessions created.`
    );

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  const passedCount = results.filter(r => r.result === 'PASS').length;
  console.log(`\nVerification Summary: ${passedCount} / ${results.length} tests passed.`);
  console.log(JSON.stringify(results, null, 2));
}

runAuthVerification();
