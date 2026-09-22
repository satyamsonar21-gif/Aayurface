// ============================================================
// AayurFace — Test Proposed Normalization Curve on All Control Samples
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testProposedNormalization() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const evaluation = await page.evaluate(() => {
    // Normalization formula:
    // Score(V) = round(100 * (V^0.75) / (V^0.75 + 4.5^0.75))
    function normalizeSharpnessScore(rawVariance) {
      if (rawVariance <= 0) return 0;
      const k = Math.pow(4.5, 0.75); // ~3.0906
      const vPow = Math.pow(rawVariance, 0.75);
      return Math.min(100, Math.max(0, Math.round((100 * vPow) / (vPow + k))));
    }

    // Test a range of raw variance values:
    const testPoints = [
      { raw: 0.2, label: 'Extreme motion blur / out of focus' },
      { raw: 0.8, label: 'Heavy blur (6-8px Gaussian)' },
      { raw: 1.5, label: 'Clear optical blur (3-4px Gaussian)' },
      { raw: 3.5, label: 'Marginal focus / soft focus' },
      { raw: 5.0, label: 'Baseline acceptable face clarity' },
      { raw: 8.0, label: 'User real-world capture sample' },
      { raw: 12.0, label: 'Clean normal in-focus webcam portrait' },
      { raw: 25.0, label: 'Crisp webcam portrait with fine brows' },
      { raw: 80.0, label: 'High contrast sharp camera photo' },
      { raw: 350.0, label: 'Studio camera / edge-dense image' }
    ];

    return testPoints.map(p => {
      const score = normalizeSharpnessScore(p.raw);
      let status = 'PASS';
      if (score < 30) status = 'FAIL';
      else if (score < 50) status = 'WARN';

      return {
        rawVariance: p.raw,
        normalizedScore: score,
        status,
        description: p.label
      };
    });
  });

  console.log('=== NORMALIZATION EVALUATION TABLE ===');
  console.table(evaluation);

  await browser.close();
}

testProposedNormalization().catch(console.error);
