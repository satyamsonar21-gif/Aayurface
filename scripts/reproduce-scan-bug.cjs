const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function reproduceBug() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const BASE = 'http://localhost:5173';
  const imgAPath = path.resolve('public/images/1.jpg');
  const imgBPath = path.resolve('public/images/2.jpg');

  const imgABuffer = fs.readFileSync(imgAPath);
  const imgBBuffer = fs.readFileSync(imgBPath);

  const imgAHash = crypto.createHash('sha256').update(imgABuffer).digest('hex');
  const imgBHash = crypto.createHash('sha256').update(imgBBuffer).digest('hex');

  const report = {
    imageA: {
      file: 'public/images/1.jpg',
      sizeBytes: imgABuffer.length,
      hashSha256: imgAHash
    },
    imageB: {
      file: 'public/images/2.jpg',
      sizeBytes: imgBBuffer.length,
      hashSha256: imgBHash
    },
    accountA: {},
    accountB: {},
    comparison: {}
  };

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('dialog', async d => {
    await d.accept();
  });

  const networkRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (!url.includes('.js') && !url.includes('.css') && !url.includes('.ico') && !url.includes('.jpg') && !url.includes('.png')) {
      networkRequests.push({ url, method: req.method() });
    }
  });

  // ==========================================
  // RUN ACCOUNT A FLOW
  // ==========================================
  console.log('[STEP 1] Running Account A flow...');
  await page.goto(BASE + '/');
  await page.evaluate(() => localStorage.removeItem('aayurface_session'));

  // Login Account A
  await page.goto(BASE + '/signin', { waitUntil: 'networkidle0' });
  await page.type('input[type="email"]', 'namrata.sen@example.com');
  await page.type('input[type="password"]', 'Ayur@123');
  await (await page.$('button[type="submit"]')).click();
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 600));

  const sessionA = await page.evaluate(() => {
    const s = localStorage.getItem('aayurface_session');
    return s ? JSON.parse(s) : null;
  });

  // Navigate to Scan
  await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Upload Image A
  const fileInputA = await page.$('input[type="file"]');
  await fileInputA.uploadFile(imgAPath);
  await new Promise(r => setTimeout(r, 800));

  // Verify preview state reached
  const previewStateA = await page.evaluate(() => {
    return document.body.textContent.includes('Captured Frame') || document.body.textContent.includes('Review Your Capture');
  });

  // Record captured image in React state / DOM if any
  const capturedDataUrlA = await page.evaluate(() => {
    const img = document.querySelector('img[alt="Captured skin observation frame"]');
    return img ? img.src : null;
  });

  const capturedDataUrlAHash = capturedDataUrlA ? crypto.createHash('sha256').update(capturedDataUrlA).digest('hex') : null;

  // Clear network log before continue
  networkRequests.length = 0;

  // Click "Continue to Assessment"
  const continueBtnA = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));

  const resultUrlA = page.url();
  const resultDataA = await page.evaluate(() => {
    const heading = document.querySelector('h1')?.textContent?.trim();
    const scanIdLabel = document.querySelector('.text-caption.text-text-tertiary')?.textContent?.trim();
    const badges = Array.from(document.querySelectorAll('.font-display.text-2xl, .font-display.text-xl')).map(el => el.textContent?.trim());
    const textSnippet = document.body.textContent;
    const hasOilyAcne = textSnippet.includes('Oily Skin with Mild Acne');
    const hasPitta45 = textSnippet.includes('45%') && textSnippet.includes('Pitta');
    const hasNeem = textSnippet.includes('Neem Face Wash');
    const localStorageKeys = Object.keys(localStorage);
    return { heading, scanIdLabel, badges, hasOilyAcne, hasPitta45, hasNeem, localStorageKeys };
  });

  report.accountA = {
    userId: sessionA?.id,
    userEmail: sessionA?.email,
    inputUploaded: 'public/images/1.jpg',
    inputHash: imgAHash,
    previewStateReached: previewStateA,
    capturedDataUrlHash: capturedDataUrlAHash,
    continueClicked: continueBtnA,
    networkRequestsOnContinue: [...networkRequests],
    navigatedUrl: resultUrlA,
    resultData: resultDataA
  };

  // Sign out
  await page.goto(BASE + '/profile', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // ==========================================
  // RUN ACCOUNT B FLOW
  // ==========================================
  console.log('[STEP 2] Running Account B flow...');
  await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
  await page.type('input[name="fullName"]', 'Test User B');
  await page.type('input[type="email"]', 'userb@example.com');
  await page.type('input[name="password"]', 'Password123');
  await page.type('input[name="confirmPassword"]', 'Password123');
  await (await page.$('button[type="submit"]')).click();
  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));

  const sessionB = await page.evaluate(() => {
    const s = localStorage.getItem('aayurface_session');
    return s ? JSON.parse(s) : null;
  });

  // Navigate to Scan
  await page.goto(BASE + '/scan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));

  // Upload Image B
  const fileInputB = await page.$('input[type="file"]');
  await fileInputB.uploadFile(imgBPath);
  await new Promise(r => setTimeout(r, 800));

  const previewStateB = await page.evaluate(() => {
    return document.body.textContent.includes('Captured Frame') || document.body.textContent.includes('Review Your Capture');
  });

  const capturedDataUrlB = await page.evaluate(() => {
    const img = document.querySelector('img[alt="Captured skin observation frame"]');
    return img ? img.src : null;
  });

  const capturedDataUrlBHash = capturedDataUrlB ? crypto.createHash('sha256').update(capturedDataUrlB).digest('hex') : null;

  // Clear network log before continue
  networkRequests.length = 0;

  // Click "Continue to Assessment"
  const continueBtnB = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Continue to Assessment'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));

  const resultUrlB = page.url();
  const resultDataB = await page.evaluate(() => {
    const heading = document.querySelector('h1')?.textContent?.trim();
    const scanIdLabel = document.querySelector('.text-caption.text-text-tertiary')?.textContent?.trim();
    const badges = Array.from(document.querySelectorAll('.font-display.text-2xl, .font-display.text-xl')).map(el => el.textContent?.trim());
    const textSnippet = document.body.textContent;
    const hasOilyAcne = textSnippet.includes('Oily Skin with Mild Acne');
    const hasPitta45 = textSnippet.includes('45%') && textSnippet.includes('Pitta');
    const hasNeem = textSnippet.includes('Neem Face Wash');
    const localStorageKeys = Object.keys(localStorage);
    return { heading, scanIdLabel, badges, hasOilyAcne, hasPitta45, hasNeem, localStorageKeys };
  });

  report.accountB = {
    userId: sessionB?.id,
    userEmail: sessionB?.email,
    inputUploaded: 'public/images/2.jpg',
    inputHash: imgBHash,
    previewStateReached: previewStateB,
    capturedDataUrlHash: capturedDataUrlBHash,
    continueClicked: continueBtnB,
    networkRequestsOnContinue: [...networkRequests],
    navigatedUrl: resultUrlB,
    resultData: resultDataB
  };

  // ==========================================
  // COMPARISON FORENSICS
  // ==========================================
  report.comparison = {
    differentUsers: sessionA?.id !== sessionB?.id,
    differentUserIds: { userA: sessionA?.id, userB: sessionB?.id },
    differentInputHashes: imgAHash !== imgBHash,
    differentCapturedFrameHashes: capturedDataUrlAHash !== capturedDataUrlBHash,
    sameDestinationUrl: resultUrlA === resultUrlB,
    destinationUrl: resultUrlA,
    sameHeading: resultDataA.heading === resultDataB.heading,
    headingValue: resultDataA.heading,
    sameScanIdLabel: resultDataA.scanIdLabel === resultDataB.scanIdLabel,
    scanIdLabelValue: resultDataA.scanIdLabel,
    sameDoshaPitta: resultDataA.hasPitta45 && resultDataB.hasPitta45,
    sameRemedyNeem: resultDataA.hasNeem && resultDataB.hasNeem,
    networkRequestsSentOnContinueCount: {
      accountA: report.accountA.networkRequestsOnContinue.length,
      accountB: report.accountB.networkRequestsOnContinue.length
    },
    bugReproduced: (imgAHash !== imgBHash) && (resultUrlA === resultUrlB) && (resultDataA.heading === resultDataB.heading)
  };

  await browser.close();

  console.log('\n==========================================');
  console.log('FORENSIC REPRODUCTION RESULT:');
  console.log('==========================================');
  console.log(JSON.stringify(report, null, 2));

  fs.writeFileSync('scripts/reproduction-results.json', JSON.stringify(report, null, 2));
}

reproduceBug().catch(err => console.error('Reproduction script error:', err));
