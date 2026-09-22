// ============================================================
// AayurFace — Visual QA State Capture Script
// Generates Real Screenshots for Section 15 Mandate
// Desktop (1280x720) & Mobile (390x844) for PASS and FAIL
// ============================================================

const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/forensics');
const FIXTURES_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/fixtures');

const USER_A = {
  id: 'user-namrata-sen',
  email: 'namrata.sen@example.com',
  full_name: 'Namrata Sen',
  avatar_url: null,
  skin_type: 'combination',
  dosha: 'vata',
  onboarding_completed: true,
  created_at: '2026-01-15T00:00:00.000Z',
  updated_at: '2026-01-15T00:00:00.000Z',
};

async function seedUserSession(page, user) {
  await page.evaluate((u) => {
    const sessionPayload = {
      access_token: 'fake-jwt-token-phase10',
      refresh_token: 'fake-refresh-token',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: u.id,
        email: u.email,
        user_metadata: {
          full_name: u.full_name,
          onboarding_completed: u.onboarding_completed,
          skin_type: u.skin_type,
          dosha: u.dosha
        }
      }
    };
    localStorage.setItem('sb-ikshvfkeumusnnufadiy-auth-token', JSON.stringify(sessionPayload));
    localStorage.setItem('aayurface_session', JSON.stringify(u));
  }, user);
}

async function captureVisualStates() {
  console.log('Launching browser for Visual QA State Capture...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--autoplay-policy=no-user-gesture-required',
      '--disable-web-security'
    ]
  });

  try {
    const viewports = [
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
    ];

    for (const vp of viewports) {
      console.log(`\nCapturing states for viewport: ${vp.name} (${vp.width}x${vp.height})`);

      // 1. PASS State
      const pagePass = await browser.newPage();
      await pagePass.setViewport(vp);
      await pagePass.goto(BASE_URL, { waitUntil: 'networkidle2' });
      await seedUserSession(pagePass, USER_A);
      await pagePass.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle2' });

      // Wait for camera to be ready
      await pagePass.waitForFunction(
        () => {
          const v = document.querySelector('video');
          return v && v.readyState >= 2 && v.videoWidth > 0;
        },
        { timeout: 15000 }
      );

      // Upload valid face fixture
      const fileInputPass = await pagePass.waitForSelector('input[type="file"]');
      await fileInputPass.uploadFile(path.join(FIXTURES_DIR, 'synthetic_face_valid.jpg'));

      // Wait for analysis to complete and review UI to appear
      await pagePass.waitForFunction(() => {
        const text = document.body.innerText;
        const isAnalyzing = text.includes('Analyzing…') || text.includes('Evaluating Image & Face Quality…') || text.includes('Checking image quality…');
        const hasPreview = text.includes('Continue to Assessment') || text.includes('Continue Anyway') || text.includes('Quality & Face Verified');
        return !isAnalyzing && hasPreview;
      }, { timeout: 15000 });

      // Verify no misleading claims
      const passText = await pagePass.evaluate(() => document.body.innerText);
      const passHasMotionClaim = passText.toLowerCase().includes('affected by motion') || passText.toLowerCase().includes('motion detected');
      console.log(`[${vp.name}] PASS State - No false motion claim: ${!passHasMotionClaim}`);

      const passScreenshotPath = path.join(OUTPUT_DIR, `ui_state_pass_${vp.name}_${vp.width}x${vp.height}.png`);
      await pagePass.screenshot({ path: passScreenshotPath, fullPage: false });
      console.log(`Saved screenshot: ${passScreenshotPath}`);
      await pagePass.close();

      // 2. FAIL State (Blurry Face)
      const pageFail = await browser.newPage();
      await pageFail.setViewport(vp);
      await pageFail.goto(BASE_URL, { waitUntil: 'networkidle2' });
      await seedUserSession(pageFail, USER_A);
      await pageFail.goto(`${BASE_URL}/scan`, { waitUntil: 'networkidle2' });

      // Wait for camera to be ready
      await pageFail.waitForFunction(
        () => {
          const v = document.querySelector('video');
          return v && v.readyState >= 2 && v.videoWidth > 0;
        },
        { timeout: 15000 }
      );

      const fileInputFail = await pageFail.waitForSelector('input[type="file"]');
      await fileInputFail.uploadFile(path.join(FIXTURES_DIR, 'blurry_face.jpg'));

      // Wait for analysis to complete and rejection UI to appear
      await pageFail.waitForFunction(() => {
        const text = document.body.innerText;
        const isAnalyzing = text.includes('Analyzing…') || text.includes('Evaluating Image & Face Quality…') || text.includes('Checking image quality…');
        const hasRejection = text.includes('Correction') || text.includes('Improvement') || text.includes('Required') || text.includes('Needs Correction');
        return !isAnalyzing && hasRejection;
      }, { timeout: 15000 });

      // Verify fail UI details
      const failEvaluation = await pageFail.evaluate(() => {
        const text = document.body.innerText;
        const continueBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Continue'));
        const retakeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Retake'));
        const hasMotionClaim = text.toLowerCase().includes('affected by motion') || text.toLowerCase().includes('motion detected');
        const showsScore = text.includes('/100');
        const showsClearExplanation = text.includes('Face details are not clear enough');

        return {
          isContinueDisabled: continueBtn ? (continueBtn.disabled || continueBtn.getAttribute('aria-disabled') === 'true') : true,
          hasRetakeButton: !!retakeBtn,
          hasMotionClaim,
          showsScore,
          showsClearExplanation
        };
      });

      console.log(`[${vp.name}] FAIL State details:`, failEvaluation);

      const failScreenshotPath = path.join(OUTPUT_DIR, `ui_state_fail_${vp.name}_${vp.width}x${vp.height}.png`);
      await pageFail.screenshot({ path: failScreenshotPath, fullPage: false });
      console.log(`Saved screenshot: ${failScreenshotPath}`);
      await pageFail.close();
    }

    console.log('\nAll Visual QA screenshots successfully captured!');
  } finally {
    await browser.close();
  }
}

captureVisualStates().catch(err => {
  console.error('Error during Visual QA State Capture:', err);
  process.exit(1);
});
