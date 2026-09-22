// ============================================================
// AayurFace — Public Landing Page Elite Visual QA & Audit Script
// Puppeteer-Core + Real Google Chrome
// Viewports: 1440x900, 1280x720, 390x844, 375x812
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/landing-redesign');
const BRAIN_DIR = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\6e6b8d86-3435-4d82-830f-61fb664d7b49';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop-1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'desktop-1280x720', width: 1280, height: 720, isMobile: false },
  { name: 'mobile-390x844', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'mobile-375x812', width: 375, height: 812, isMobile: true, hasTouch: true }
];

async function runVisualAudit() {
  console.log('[Visual QA] Launching Chrome from:', CHROME_PATH);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1440,900'
    ]
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    viewports: {},
    images: [],
    consoleErrors: [],
    overflowAudit: {},
    headingAudit: []
  };

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n[Visual QA] Testing viewport: ${vp.name} (${vp.width}x${vp.height})`);
      const page = await browser.newPage();
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.error(`[Console Error][${vp.name}]`, msg.text());
          auditReport.consoleErrors.push({ viewport: vp.name, text: msg.text() });
        }
      });

      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.hasTouch || false,
        deviceScaleFactor: 2
      });

      await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });

      // Auto-scroll down the page to trigger all lazy-loaded images and animations
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
          }, 60);
        });
      });

      // Wait a moment for Framer Motion transitions and images to settle
      await new Promise(r => setTimeout(r, 1500));

      // 1. Check Horizontal Overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.offsetWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const maxScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
        const hasOverflow = maxScrollWidth > docWidth;
        return {
          docWidth,
          maxScrollWidth,
          hasOverflow,
          diff: maxScrollWidth - docWidth
        };
      });
      console.log(`[Visual QA][${vp.name}] Overflow Check:`, overflow);
      auditReport.overflowAudit[vp.name] = overflow;

      // 2. Full-page screenshot
      const fullpagePath = path.join(OUTPUT_DIR, `landing-${vp.name}-fullpage.png`);
      await page.screenshot({ path: fullpagePath, fullPage: true });
      console.log(`[Visual QA] Captured fullpage screenshot: ${fullpagePath}`);

      // Copy to brain artifacts for display
      const brainFullpagePath = path.join(BRAIN_DIR, `landing_${vp.name.replace(/-/g, '_')}_fullpage.png`);
      fs.copyFileSync(fullpagePath, brainFullpagePath);

      // 3. First viewport screenshot (fold impact)
      const heroPath = path.join(OUTPUT_DIR, `landing-${vp.name}-hero-fold.png`);
      await page.screenshot({ path: heroPath, fullPage: false });
      console.log(`[Visual QA] Captured fold screenshot: ${heroPath}`);

      const brainHeroPath = path.join(BRAIN_DIR, `landing_${vp.name.replace(/-/g, '_')}_hero_fold.png`);
      fs.copyFileSync(heroPath, brainHeroPath);

      // If mobile, test menu opening
      if (vp.isMobile) {
        try {
          const menuBtn = await page.$('button[aria-label*="navigation menu"]');
          if (menuBtn) {
            await menuBtn.click();
            await new Promise(r => setTimeout(r, 400));
            const menuOpenPath = path.join(OUTPUT_DIR, `landing-${vp.name}-menu-open.png`);
            await page.screenshot({ path: menuOpenPath, fullPage: false });
            console.log(`[Visual QA] Captured mobile menu screenshot: ${menuOpenPath}`);
            const brainMenuPath = path.join(BRAIN_DIR, `landing_${vp.name.replace(/-/g, '_')}_menu_open.png`);
            fs.copyFileSync(menuOpenPath, brainMenuPath);
          }
        } catch (e) {
          console.warn('[Visual QA] Mobile menu toggle warning:', e.message);
        }
      }

      // 4. Audit images & headings on desktop-1440
      if (vp.name === 'desktop-1440x900') {
        const imageDetails = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(img => ({
            src: img.src,
            alt: img.alt,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            complete: img.complete,
            displayedWidth: img.clientWidth,
            displayedHeight: img.clientHeight
          }));
        });
        auditReport.images = imageDetails;

        const headingDetails = await page.evaluate(() => {
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'));
          return headings.map(h => ({
            tag: h.tagName.toLowerCase(),
            text: h.textContent?.trim().slice(0, 80)
          }));
        });
        auditReport.headingAudit = headingDetails;
      }

      auditReport.viewports[vp.name] = {
        fullpageScreenshot: fullpagePath,
        foldScreenshot: heroPath,
        overflow
      };

      await page.close();
    }

    console.log('\n[Visual QA] Summary of Loaded Images:');
    auditReport.images.forEach((img, i) => {
      console.log(`  ${i + 1}. [${img.complete && img.naturalWidth > 0 ? 'LOADED' : 'FAILED'}] ${img.alt.slice(0, 40)}... (${img.naturalWidth}x${img.naturalHeight})`);
    });

    console.log('\n[Visual QA] Summary of Headings:');
    auditReport.headingAudit.slice(0, 10).forEach(h => {
      console.log(`  <${h.tag}>: ${h.text}`);
    });

    console.log('\n[Visual QA] Console Errors Count:', auditReport.consoleErrors.length);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'visual-audit-report.json'),
      JSON.stringify(auditReport, null, 2),
      'utf8'
    );
    console.log('\n[Visual QA] Visual audit report saved successfully!');

  } catch (err) {
    console.error('[Visual QA] Fatal error during visual QA:', err);
  } finally {
    await browser.close();
  }
}

runVisualAudit();
