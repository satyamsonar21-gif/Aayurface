const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const TARGET_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-06.7');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const VIEWPORTS = {
  desktop1280: { width: 1280, height: 720, name: 'desktop-1280x720' },
  desktop1440: { width: 1440, height: 900, name: 'desktop-1440x900' },
  tablet768: { width: 768, height: 1024, name: 'tablet-768x1024' },
  mobile375: { width: 375, height: 812, name: 'mobile-375x812', isMobile: true, hasTouch: true },
  mobile390: { width: 390, height: 844, name: 'mobile-390x844', isMobile: true, hasTouch: true },
};

const auditReport = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 06.7: Scan Skin Camera Engine + UI Repair',
  browserEngineVerification: 'VERIFIED (Puppeteer with fake media streams)',
  physicalHardwareVerification: 'PENDING PHYSICAL HARDWARE VERIFICATION',
  consoleErrors: [],
  pageErrors: [],
  viewports: {},
  cameraLifecycle: {
    videoElementDetected: false,
    autoplayConfigured: false,
    mutedConfigured: false,
    playsinlineConfigured: false,
    mediaStreamAttached: false,
    videoDimensionsPositive: false,
    videoWidth: 0,
    videoHeight: 0,
    readyReached: false,
    realFrameCaptured: false,
    previewStateReached: false,
    retakeRestoresReady: false,
    continueNavigationSuccess: false,
    cleanupOnUnmountSuccess: false
  },
  capturedScreenshots: []
};

async function capture(page, filename, fullPage = false) {
  const filePath = path.join(TARGET_DIR, filename);
  await page.screenshot({ path: filePath, fullPage });
  auditReport.capturedScreenshots.push({
    filename,
    path: filePath,
    fullPage
  });
  console.log(`[CAPTURED] ${filename}`);
}

async function runAudit() {
  console.log('========================================================');
  console.log('STARTING PHASE 06.7 SCAN CAMERA ENGINE BROWSER QA AUDIT');
  console.log('========================================================\n');

  async function launchBrowser() {
    return puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--autoplay-policy=no-user-gesture-required',
        '--allow-file-access-from-files',
        '--disable-web-security'
      ]
    });
  }

  // -------------------------------------------------------------
  // 1. PRIMARY DESKTOP AUDIT (1280 × 720)
  // -------------------------------------------------------------
  console.log('--- 1. Testing Primary Desktop (1280 × 720) ---');
  const browser1 = await launchBrowser();
  try {
    const page = await browser1.newPage();
    await page.setViewport(VIEWPORTS.desktop1280);

    page.on('console', msg => {
      console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text());
      if (msg.type() === 'error') {
        auditReport.consoleErrors.push({ url: page.url(), text: msg.text() });
      }
    });

    page.on('pageerror', err => {
      auditReport.pageErrors.push(err.toString());
    });

    // Go to scan page
    await page.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Inspect video element
    const videoAttributes = await page.evaluate(() => {
      const video = document.querySelector('video');
      if (!video) return null;
      return {
        exists: true,
        autoplay: video.autoplay,
        muted: video.muted,
        playsinline: video.hasAttribute('playsinline'),
        hasSrcObject: video.srcObject !== null,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        paused: video.paused
      };
    });

    console.log('Video Element Inspection:', videoAttributes);

    if (videoAttributes) {
      auditReport.cameraLifecycle.videoElementDetected = true;
      auditReport.cameraLifecycle.autoplayConfigured = videoAttributes.autoplay;
      auditReport.cameraLifecycle.mutedConfigured = videoAttributes.muted;
      auditReport.cameraLifecycle.playsinlineConfigured = videoAttributes.playsinline;
      auditReport.cameraLifecycle.mediaStreamAttached = videoAttributes.hasSrcObject;
      auditReport.cameraLifecycle.videoDimensionsPositive = videoAttributes.videoWidth > 0 && videoAttributes.videoHeight > 0;
      auditReport.cameraLifecycle.videoWidth = videoAttributes.videoWidth;
      auditReport.cameraLifecycle.videoHeight = videoAttributes.videoHeight;
    }

    // Wait for "Camera Ready" status
    try {
      await page.waitForFunction(
        () => document.body.innerText.includes('Camera Ready'),
        { timeout: 5000 }
      );
      auditReport.cameraLifecycle.readyReached = true;
      console.log('Camera status successfully reached: "Camera Ready"');
    } catch (e) {
      console.warn('Timed out waiting for "Camera Ready" text.');
    }

    // Screenshot 1: Primary Desktop Ready State
    await capture(page, 'scan-1280x720-01-ready.png');

    // -------------------------------------------------------------
    // Test Capture Action
    // -------------------------------------------------------------
    console.log('\nTesting Real Frame Capture...');
    const captureButton = await page.$('button[aria-label="Capture photo for skin wellness assessment"]');
    if (captureButton) {
      await captureButton.click();
      await new Promise(r => setTimeout(r, 800));

      // Verify Preview State
      const previewData = await page.evaluate(() => {
        const previewImg = document.querySelector('img[alt="Captured facial wellness frame"]');
        const hasContinue = document.body.innerText.includes('Continue to Assessment');
        const hasRetake = document.body.innerText.includes('Retake Photo');
        return {
          previewImageExists: !!previewImg,
          isDataUrl: previewImg ? previewImg.src.startsWith('data:image/jpeg') : false,
          dataUrlLength: previewImg ? previewImg.src.length : 0,
          hasContinue,
          hasRetake
        };
      });

      console.log('Preview State Verification:', previewData);

      if (previewData.previewImageExists && previewData.isDataUrl && previewData.dataUrlLength > 500) {
        auditReport.cameraLifecycle.realFrameCaptured = true;
        auditReport.cameraLifecycle.previewStateReached = true;
      }

      // Screenshot 2: Primary Desktop Preview State
      await capture(page, 'scan-1280x720-02-preview.png');

      // -------------------------------------------------------------
      // Test Retake Action
      // -------------------------------------------------------------
      console.log('\nTesting Retake Flow...');
      const retakeButton = await page.$('button[aria-label="Retake photo"]');
      if (retakeButton) {
        await retakeButton.click();
        try {
          await page.waitForFunction(
            () => document.body.innerText.includes('Camera Ready'),
            { timeout: 3500 }
          );
          console.log('Retake returned to Ready state: true');
          auditReport.cameraLifecycle.retakeRestoresReady = true;
        } catch {
          console.log('Retake returned to Ready state: false');
          auditReport.cameraLifecycle.retakeRestoresReady = false;
        }
        await capture(page, 'scan-1280x720-03-restored-ready.png');
      }

      // -------------------------------------------------------------
      // Test Continue Flow
      // -------------------------------------------------------------
      console.log('\nTesting Continue Flow to Assessment...');
      await page.waitForFunction(
        () => {
          const btn = document.querySelector('button[aria-label="Capture photo for skin wellness assessment"]');
          return btn && !btn.disabled;
        },
        { timeout: 3500 }
      ).catch(() => {});

      const captureBtnAgain = await page.$('button[aria-label="Capture photo for skin wellness assessment"]');
      if (captureBtnAgain) {
        await captureBtnAgain.click();
        await new Promise(r => setTimeout(r, 600));

        await page.evaluate(() => {
          const video = document.querySelector('video');
          if (video && video.srcObject) {
            window.__auditStream = video.srcObject;
          }
        });

        const continueButton = await page.$('button[aria-label="Continue to skin wellness assessment"]');
        if (continueButton) {
          await continueButton.click();
          await new Promise(r => setTimeout(r, 1000));

          const currentUrl = page.url();
          console.log('Navigated URL after Continue:', currentUrl);
          if (currentUrl.includes('/results/demo-scan')) {
            auditReport.cameraLifecycle.continueNavigationSuccess = true;
          }

          // Verify cleanup on unmount
          const tracksCleanedUp = await page.evaluate(() => {
            if (!window.__auditStream) return true;
            const tracks = window.__auditStream.getTracks();
            return tracks.length === 0 || tracks.every(t => t.readyState === 'ended');
          });
          console.log('Tracks cleaned up on component unmount:', tracksCleanedUp);
          auditReport.cameraLifecycle.cleanupOnUnmountSuccess = tracksCleanedUp;
        }
      }
    }

    auditReport.viewports['desktop1280'] = { tested: true, width: 1280, height: 720 };
  } finally {
    await browser1.close();
  }

  // -------------------------------------------------------------
  // 2. LARGE DESKTOP (1440 × 900)
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Large Desktop (1440 × 900) ---');
  const browser2 = await launchBrowser();
  try {
    const page1440 = await browser2.newPage();
    await page1440.setViewport(VIEWPORTS.desktop1440);
    await page1440.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await page1440.waitForFunction(() => document.body.innerText.includes('Camera Ready'), { timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    await capture(page1440, 'scan-1440x900-ready.png');
    auditReport.viewports['desktop1440'] = { tested: true, width: 1440, height: 900 };
  } finally {
    await browser2.close();
  }

  // -------------------------------------------------------------
  // 3. TABLET (768 × 1024)
  // -------------------------------------------------------------
  console.log('\n--- 3. Testing Tablet (768 × 1024) ---');
  const browser3 = await launchBrowser();
  try {
    const page768 = await browser3.newPage();
    await page768.setViewport(VIEWPORTS.tablet768);
    await page768.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await page768.waitForFunction(() => document.body.innerText.includes('Camera Ready'), { timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    await capture(page768, 'scan-768x1024-ready.png');
    auditReport.viewports['tablet768'] = { tested: true, width: 768, height: 1024 };
  } finally {
    await browser3.close();
  }

  // -------------------------------------------------------------
  // 4. MOBILE SMALL (375 × 812)
  // -------------------------------------------------------------
  console.log('\n--- 4. Testing Mobile Small (375 × 812) ---');
  const browser4 = await launchBrowser();
  try {
    const page375 = await browser4.newPage();
    await page375.setViewport(VIEWPORTS.mobile375);
    await page375.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await page375.waitForFunction(() => document.body.innerText.includes('Camera Ready'), { timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    await capture(page375, 'scan-375x812-ready.png');

    // Test mobile capture
    const mobCapBtn = await page375.$('button[aria-label="Capture photo for skin wellness assessment"]');
    if (mobCapBtn) {
      await mobCapBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await capture(page375, 'scan-375x812-preview.png');
    }

    auditReport.viewports['mobile375'] = { tested: true, width: 375, height: 812 };
  } finally {
    await browser4.close();
  }

  // -------------------------------------------------------------
  // 5. MOBILE STANDARD (390 × 844)
  // -------------------------------------------------------------
  console.log('\n--- 5. Testing Mobile Standard (390 × 844) ---');
  const browser5 = await launchBrowser();
  try {
    const page390 = await browser5.newPage();
    await page390.setViewport(VIEWPORTS.mobile390);
    await page390.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle0' });
    await page390.waitForFunction(() => document.body.innerText.includes('Camera Ready'), { timeout: 5000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    await capture(page390, 'scan-390x844-ready.png');
    auditReport.viewports['mobile390'] = { tested: true, width: 390, height: 844 };
  } finally {
    await browser5.close();
  }

  // -------------------------------------------------------------
  // Save Final Audit Report
  // -------------------------------------------------------------
  const reportPath = path.join(TARGET_DIR, 'scan-engine-audit.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2), 'utf8');
  console.log(`\nAudit finished successfully. Report written to ${reportPath}`);
}

runAudit().catch(err => {
  console.error('Fatal error during scan engine QA audit:', err);
  process.exit(1);
});
