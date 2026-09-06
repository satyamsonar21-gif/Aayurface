const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function runVerification() {
  const EVIDENCE_DIR = path.resolve('scripts/evidence');
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const BASE = 'http://localhost:5173';
  const img1Path = path.resolve('public/images/1.jpg');
  const img2Path = path.resolve('public/images/2.jpg');

  const img1Buffer = fs.readFileSync(img1Path);
  const img2Buffer = fs.readFileSync(img2Path);

  const img1Hash = crypto.createHash('sha256').update(img1Buffer).digest('hex');
  const img2Hash = crypto.createHash('sha256').update(img2Buffer).digest('hex');

  const report = {
    timestamp: new Date().toISOString(),
    inputFiles: {
      image1: { file: 'public/images/1.jpg', size: img1Buffer.length, hash: img1Hash },
      image2: { file: 'public/images/2.jpg', size: img2Buffer.length, hash: img2Hash }
    },
    tests: {}
  };

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('dialog', async d => {
    await d.accept();
  });

  console.log('====================================================');
  console.log('STARTING AAYURFACE ASSESSMENT LIFECYCLE VERIFICATION');
  console.log('====================================================\n');

  // ====================================================
  // SETUP: Clear state
  // ====================================================
  await page.goto(BASE + '/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.clear();
  });

  // ====================================================
  // STEP 1: TEST CASE A & B - Account A (Namrata) with Image 1
  // ====================================================
  console.log('[TEST 1] Logging in as Account A (namrata.sen@example.com)...');
  await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'namrata.sen@example.com');
  await page.type('input[type="password"]', 'Ayur@123');
  await (await page.$('button[type="submit"]')).click();
  await page.waitForFunction(() => !window.location.pathname.includes('/signin'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 600));

  const sessionA = await page.evaluate(() => {
    const s = localStorage.getItem('aayurface_session');
    return s ? JSON.parse(s) : null;
  });
  console.log(`Account A authenticated: id=${sessionA?.id}, email=${sessionA?.email}`);

  // Navigate to Scan
  await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Upload Image 1
  console.log('[TEST 1] Account A uploading Image 1...');
  const fileInputA1 = await page.$('input[type="file"]');
  await fileInputA1.uploadFile(img1Path);
  await new Promise(r => setTimeout(r, 800));

  // Verify preview state
  const previewStateA1 = await page.evaluate(() => {
    return document.body.textContent.includes('Captured Frame') || document.body.textContent.includes('Review Your Capture');
  });

  // Click Continue to Assessment
  console.log('[TEST 1] Account A clicking Continue to Assessment...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
    if (btn) btn.click();
  });
  await page.waitForFunction(() => window.location.pathname.startsWith('/results/'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  const urlA1 = page.url();
  console.log(`Account A navigated to: ${urlA1}`);
  const matchA1 = urlA1.match(/\/results\/([a-zA-Z0-9_-]+)$/);
  const idA1 = matchA1 ? matchA1[1] : null;

  const resultDetailsA1 = await page.evaluate(() => {
    const imgEl = document.querySelector('img[alt="Captured skin observation frame"]');
    const heading = document.querySelector('h1')?.textContent?.trim();
    const isDemoBadge = document.body.textContent.includes('Sample Demonstration Insight');
    return {
      hasImg: !!imgEl,
      imgSrcPrefix: imgEl ? imgEl.src.substring(0, 50) : null,
      imgSrcLength: imgEl ? imgEl.src.length : 0,
      heading,
      isDemoBadge
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-a-result-a.png') });

  report.tests['Test_A_and_B_AccountA'] = {
    userId: sessionA?.id,
    navigatedUrl: urlA1,
    assessmentId: idA1,
    isNotDemoScanUrl: urlA1 !== `${BASE}/results/demo-scan`,
    previewStateReached: previewStateA1,
    hasCapturedImageRendered: resultDetailsA1.hasImg,
    imgSrcLength: resultDetailsA1.imgSrcLength,
    isDemoBadgeAbsent: !resultDetailsA1.isDemoBadge,
    pass: urlA1 !== `${BASE}/results/demo-scan` && !!idA1 && resultDetailsA1.hasImg && !resultDetailsA1.isDemoBadge
  };

  // ====================================================
  // STEP 2: TEST CASE F - Browser Refresh on /results/:idA1
  // ====================================================
  console.log('[TEST 2] Testing Browser Refresh on /results/' + idA1 + '...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const refreshResultA1 = await page.evaluate(() => {
    const imgEl = document.querySelector('img[alt="Captured skin observation frame"]');
    const heading = document.querySelector('h1')?.textContent?.trim();
    return {
      url: window.location.href,
      hasImg: !!imgEl,
      heading,
      isNotFound: document.body.textContent.includes('Observation Record Not Found')
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-f-refresh-a.png') });

  report.tests['Test_F_BrowserRefresh'] = {
    reloadedUrl: refreshResultA1.url,
    stillHasImage: refreshResultA1.hasImg,
    notRevertedToNotFound: !refreshResultA1.isNotFound,
    pass: refreshResultA1.hasImg && !refreshResultA1.isNotFound
  };

  // ====================================================
  // STEP 3: TEST CASE G - Back to /scan and take second scan (idA2)
  // ====================================================
  console.log('[TEST 3] Account A navigating back to /scan for second scan...');
  await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Upload Image 2 for second scan
  const fileInputA2 = await page.$('input[type="file"]');
  await fileInputA2.uploadFile(img2Path);
  await new Promise(r => setTimeout(r, 800));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
    if (btn) btn.click();
  });
  await page.waitForFunction((prevId) => {
    const p = window.location.pathname;
    return p.startsWith('/results/') && !p.endsWith(prevId);
  }, { timeout: 10000 }, idA1);
  await new Promise(r => setTimeout(r, 800));

  const urlA2 = page.url();
  const matchA2 = urlA2.match(/\/results\/([a-zA-Z0-9_-]+)$/);
  const idA2 = matchA2 ? matchA2[1] : null;

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-g-second-scan-a.png') });

  report.tests['Test_G_SecondScanUniqueId'] = {
    firstScanId: idA1,
    secondScanId: idA2,
    idsAreDistinct: idA1 !== idA2,
    pass: !!idA2 && idA1 !== idA2 && urlA2 !== `${BASE}/results/demo-scan`
  };

  // ====================================================
  // STEP 4: TEST CASE D (Part 1) - History for Account A
  // ====================================================
  console.log('[TEST 4] Checking History for Account A...');
  await page.goto(BASE + '/history', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const historyA = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const thumbnails = Array.from(document.querySelectorAll('img[alt="Observation thumbnail"]')).length;
    const viewButtons = Array.from(document.querySelectorAll('button, a')).filter(el => el.textContent && el.textContent.includes('View Observation')).length;
    return {
      textIncludesHistoryCount: text.includes('Recorded Observations (2)'),
      thumbnailCount: thumbnails,
      viewButtonsCount: viewButtons
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-d-history-a.png') });

  report.tests['Test_D_History_AccountA'] = {
    recordedCountMatch: historyA.textIncludesHistoryCount,
    thumbnailCount: historyA.thumbnailCount,
    pass: historyA.textIncludesHistoryCount && historyA.thumbnailCount === 2
  };

  // ====================================================
  // STEP 5: TEST CASE E - Logout Isolation
  // ====================================================
  console.log('[TEST 5] Signing out Account A...');
  await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const postLogoutSession = await page.evaluate(() => {
    return localStorage.getItem('aayurface_session');
  });

  console.log(`Post-logout session is: ${postLogoutSession}`);

  report.tests['Test_E_Logout_Isolation'] = {
    sessionCleared: postLogoutSession === null,
    currentUrl: page.url(),
    pass: postLogoutSession === null
  };

  // ====================================================
  // STEP 6: TEST CASE A & B - Account B with Image 2
  // ====================================================
  console.log('[TEST 6] Registering / Logging in as Account B (userb@example.com)...');
  await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
  await page.type('input[name="fullName"]', 'User B Verified');
  await page.type('input[type="email"]', 'userb_test@example.com');
  await page.type('input[name="password"]', 'Password123');
  await page.type('input[name="confirmPassword"]', 'Password123');
  await (await page.$('button[type="submit"]')).click();
  await page.waitForFunction(() => !window.location.pathname.includes('/register'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  const sessionB = await page.evaluate(() => {
    const s = localStorage.getItem('aayurface_session');
    return s ? JSON.parse(s) : null;
  });
  console.log(`Account B authenticated: id=${sessionB?.id}, email=${sessionB?.email}`);

  // Navigate to Scan
  await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Upload Image 2
  console.log('[TEST 6] Account B uploading Image 2...');
  const fileInputB = await page.$('input[type="file"]');
  await fileInputB.uploadFile(img2Path);
  await new Promise(r => setTimeout(r, 800));

  // Click Continue to Assessment
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
    if (btn) btn.click();
  });
  await page.waitForFunction(() => window.location.pathname.startsWith('/results/'), { timeout: 10000 });
  await new Promise(r => setTimeout(r, 800));

  const urlB = page.url();
  const matchB = urlB.match(/\/results\/([a-zA-Z0-9_-]+)$/);
  const idB = matchB ? matchB[1] : null;

  const resultDetailsB = await page.evaluate(() => {
    const imgEl = document.querySelector('img[alt="Captured skin observation frame"]');
    const heading = document.querySelector('h1')?.textContent?.trim();
    const isDemoBadge = document.body.textContent.includes('Sample Demonstration Insight');
    return {
      hasImg: !!imgEl,
      imgSrcLength: imgEl ? imgEl.src.length : 0,
      heading,
      isDemoBadge
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-a-result-b.png') });

  report.tests['Test_A_and_B_AccountB'] = {
    userId: sessionB?.id,
    navigatedUrl: urlB,
    assessmentId: idB,
    distinctFromAccountAIds: idB !== idA1 && idB !== idA2,
    hasCapturedImageRendered: resultDetailsB.hasImg,
    isNotDemoScanUrl: urlB !== `${BASE}/results/demo-scan`,
    pass: urlB !== `${BASE}/results/demo-scan` && !!idB && idB !== idA1 && resultDetailsB.hasImg
  };

  // ====================================================
  // STEP 7: TEST CASE C - Cross-Account Protection
  // Account B attempts to access Account A's assessment (/results/:idA1)
  // ====================================================
  console.log(`[TEST 7] Account B attempting to access Account A's assessment: /results/${idA1}...`);
  await page.goto(`${BASE}/results/${idA1}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const crossAccountResult = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const hasNotFoundHeading = text.includes('Observation Record Not Found');
    const hasNotAccessibleNotice = text.includes('does not exist or is not accessible from your current account');
    const imgEl = document.querySelector('img[alt="Captured skin observation frame"]');
    return {
      hasNotFoundHeading,
      hasNotAccessibleNotice,
      hasLeakedImage: !!imgEl
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-c-cross-account-denied.png') });

  report.tests['Test_C_CrossAccountProtection'] = {
    targetUrl: `${BASE}/results/${idA1}`,
    accessDeniedAndNotFoundRendered: crossAccountResult.hasNotFoundHeading && crossAccountResult.hasNotAccessibleNotice,
    noImageLeaked: !crossAccountResult.hasLeakedImage,
    pass: crossAccountResult.hasNotFoundHeading && !crossAccountResult.hasLeakedImage
  };

  // ====================================================
  // STEP 8: TEST CASE D (Part 2) - History Isolation for Account B
  // Account B's history must show ONLY 1 observation (Account B's), NOT Account A's
  // ====================================================
  console.log('[TEST 8] Checking History for Account B...');
  await page.goto(BASE + '/history', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const historyB = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const thumbnails = Array.from(document.querySelectorAll('img[alt="Observation thumbnail"]')).length;
    return {
      textIncludesHistoryCount: text.includes('Recorded Observations (1)'),
      thumbnailCount: thumbnails,
      textIncludesUserBEmail: text.includes('userb_test@example.com'),
      textDoesNotIncludeUserAEmail: !text.includes('namrata.sen@example.com')
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-d-history-b.png') });

  report.tests['Test_D_History_Isolation_AccountB'] = {
    recordedCountMatch: historyB.textIncludesHistoryCount,
    thumbnailCountIsOne: historyB.thumbnailCount === 1,
    noAccountADataPresent: historyB.textDoesNotIncludeUserAEmail,
    pass: historyB.textIncludesHistoryCount && historyB.thumbnailCount === 1 && historyB.textDoesNotIncludeUserAEmail
  };

  // ====================================================
  // STEP 9: TEST CASE H - Demo Scan Isolation
  // Direct navigation to /results/demo-scan shows Sample banner
  // ====================================================
  console.log('[TEST 9] Testing Demo Scan Isolation on /results/demo-scan...');
  await page.goto(BASE + '/results/demo-scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const demoScanDetails = await page.evaluate(() => {
    const text = document.body.textContent || '';
    const hasSampleBadge = text.includes('Sample Reference');
    const hasSampleBanner = text.includes('Sample Demonstration Insight');
    const hasDemoWarning = text.includes('does not reflect a live facial capture');
    return {
      hasSampleBadge,
      hasSampleBanner,
      hasDemoWarning
    };
  });

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-h-demo-scan.png') });

  report.tests['Test_H_DemoScanIsolation'] = {
    hasSampleBadge: demoScanDetails.hasSampleBadge,
    hasSampleBanner: demoScanDetails.hasSampleBanner,
    hasDemoWarning: demoScanDetails.hasDemoWarning,
    pass: demoScanDetails.hasSampleBadge && demoScanDetails.hasSampleBanner && demoScanDetails.hasDemoWarning
  };

  // ====================================================
  // STEP 10: TEST CASE I - Negative Tests
  // 1) Non-existent ID -> Not Found
  // 2) Malformed ID -> Not Found
  // 3) Unauthenticated access -> Redirect to /signin
  // ====================================================
  console.log('[TEST 10] Negative test: non-existent ID...');
  await page.goto(BASE + '/results/non-existent-assessment-uuid-999', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const nonExistentDetails = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasNotFoundHeading: text.includes('Observation Record Not Found'),
      notFallenBackToDemo: !text.includes('Sample Demonstration Insight') && !text.includes('Oily Skin with Mild Acne')
    };
  });

  console.log('[TEST 10] Negative test: malformed ID...');
  await page.goto(BASE + '/results/!!!malformed@@@', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const malformedDetails = await page.evaluate(() => {
    const text = document.body.textContent || '';
    return {
      hasNotFoundHeading: text.includes('Observation Record Not Found'),
      notFallenBackToDemo: !text.includes('Sample Demonstration Insight') && !text.includes('Oily Skin with Mild Acne')
    };
  });

  console.log('[TEST 10] Negative test: unauthenticated access to /results/' + idB + '...');
  // Clear session
  await page.evaluate(() => localStorage.removeItem('aayurface_session'));
  await page.goto(`${BASE}/results/${idB}`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  const unauthenticatedUrl = page.url();
  const redirectedToSignIn = unauthenticatedUrl.includes('/signin');

  await page.screenshot({ path: path.join(EVIDENCE_DIR, 'test-i-negative-tests.png') });

  report.tests['Test_I_NegativeTests'] = {
    nonExistentIdNotFound: nonExistentDetails.hasNotFoundHeading && nonExistentDetails.notFallenBackToDemo,
    malformedIdNotFound: malformedDetails.hasNotFoundHeading && malformedDetails.notFallenBackToDemo,
    unauthenticatedRedirectedToSignIn: redirectedToSignIn,
    redirectUrl: unauthenticatedUrl,
    pass: nonExistentDetails.hasNotFoundHeading && malformedDetails.hasNotFoundHeading && redirectedToSignIn
  };

  // ====================================================
  // SUMMARY
  // ====================================================
  const allTestsPassed = Object.values(report.tests).every(t => t.pass === true);
  report.overallStatus = allTestsPassed ? 'PASS' : 'FAIL';

  console.log('\n====================================================');
  console.log(`ALL VERIFICATION TESTS COMPLETED: ${report.overallStatus}`);
  console.log('====================================================');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync('scripts/verification-results.json', JSON.stringify(report, null, 2));

  await browser.close();
}

runVerification().catch(err => {
  console.error('Verification failed with error:', err);
  process.exit(1);
});
