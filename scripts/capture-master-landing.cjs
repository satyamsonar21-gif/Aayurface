const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5174';

const TARGET_DIR = path.resolve('C:\\Users\\HP\\.gemini\\antigravity\\brain\\521594aa-c5c4-4e59-b2f7-92d2f55d809c\\screenshots');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'landing-desktop-1440x900', width: 1440, height: 900 },
  { name: 'landing-desktop-1280x720', width: 1280, height: 720 },
  { name: 'landing-tablet-1024x768', width: 1024, height: 768 },
  { name: 'landing-tablet-portrait-768x1024', width: 768, height: 1024 },
  { name: 'landing-mobile-390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'landing-mobile-compact-375x812', width: 375, height: 812, isMobile: true, hasTouch: true }
];

async function run() {
  console.log('Starting Master Landing Page Visual Verification & Screenshot Capture...');

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

  const consoleErrors = [];

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      const page = await browser.newPage();
      await page.setViewport(vp);

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push({ viewport: vp.name, text: msg.text() });
          console.error(`[Console Error][${vp.name}]:`, msg.text());
        }
      });

      await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 600));

      // Auto-scroll down and back to trigger all Framer Motion whileInView animations
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 40);
        });
      });
      await new Promise(r => setTimeout(r, 400));

      // Capture Hero Viewport
      const heroPath = path.join(TARGET_DIR, `${vp.name}-hero.png`);
      await page.screenshot({ path: heroPath, fullPage: false });
      console.log(`[Captured] ${vp.name}-hero.png`);

      // Capture Full Page
      const fullPath = path.join(TARGET_DIR, `${vp.name}-full.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log(`[Captured] ${vp.name}-full.png`);

      // If desktop 1440, also check link anchors and section elements
      if (vp.name === 'landing-desktop-1440x900') {
        const sections = [
          'what-is-aayurface',
          'philosophy',
          'beyond-selfie',
          'how-it-works',
          'scan-experience',
          'ayurvedic-intelligence',
          'prakriti',
          'methodology',
          'confidence',
          'product-preview',
          'research',
          'faq'
        ];

        for (const s of sections) {
          const el = await page.$(`#${s}`);
          if (el) {
            const secPath = path.join(TARGET_DIR, `section-${s}.png`);
            await el.screenshot({ path: secPath });
            console.log(`[Captured Section] #${s}`);
          } else {
            console.warn(`[Missing Section Anchor] #${s}`);
          }
        }
      }

      await page.close();
    }

    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error(JSON.stringify(consoleErrors, null, 2));
    } else {
      console.log('Zero console errors detected across all viewports!');
    }

  } catch (err) {
    console.error('Error during visual capture:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
