// ============================================================
// AayurFace — Score Stability & Determinism Test
// ============================================================

const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testStability() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const stability = await page.evaluate(() => {
    function createTestCanvas() {
      const c = document.createElement('canvas');
      c.width = 640;
      c.height = 480;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#C8B89E';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#2C3E35';
      ctx.fillRect(200, 150, 240, 180);
      return c;
    }

    const canvas = createTestCanvas();

    function calcSharpness(c) {
      const ctx = c.getContext('2d');
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      const total = c.width * c.height;
      const gray = new Uint8Array(total);
      for (let i = 0; i < total; i++) {
        gray[i] = Math.round(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);
      }
      let sum = 0;
      let sumSq = 0;
      let n = 0;
      for (let y = 1; y < c.height - 1; y++) {
        const row = y * c.width;
        const above = (y - 1) * c.width;
        const below = (y + 1) * c.width;
        for (let x = 1; x < c.width - 1; x++) {
          const center = gray[row + x];
          const lap = gray[above + x] + gray[below + x] + gray[row + x - 1] + gray[row + x + 1] - 4 * center;
          sum += lap;
          sumSq += lap * lap;
          n++;
        }
      }
      const rawVar = n > 0 ? Math.max(0, sumSq / n - (sum / n) * (sum / n)) : 0;
      const k = Math.pow(4.5, 0.75);
      const vPow = Math.pow(rawVar, 0.75);
      return Math.min(100, Math.max(0, Math.round((100 * vPow) / (vPow + k))));
    }

    // Run 10 times
    const runs = [];
    for (let i = 0; i < 10; i++) {
      runs.push(calcSharpness(canvas));
    }

    const allIdentical = runs.every(v => v === runs[0]);

    return {
      runs,
      allIdentical,
      deterministicResult: runs[0]
    };
  });

  console.log('Stability test:', stability);
  await browser.close();
}

testStability().catch(console.error);
