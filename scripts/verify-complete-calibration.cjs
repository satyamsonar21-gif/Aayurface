// ============================================================
// AayurFace — Complete Calibration Verification Script
// Testing new calibration against all 8 control samples + edge cases
// ============================================================

const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyCompleteCalibration() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const testResults = await page.evaluate(() => {
    function computeCalibratedFaceSharpness(canvas, roiX, roiY, roiW, roiH) {
      const CANONICAL_MAX_DIM = 256;
      let targetW = roiW;
      let targetH = roiH;
      let srcCanvas = canvas;
      let sx = roiX;
      let sy = roiY;

      // Canonical downscaling (never upscale)
      if (roiW > CANONICAL_MAX_DIM || roiH > CANONICAL_MAX_DIM) {
        const s = CANONICAL_MAX_DIM / Math.max(roiW, roiH);
        targetW = Math.max(16, Math.round(roiW * s));
        targetH = Math.max(16, Math.round(roiH * s));

        const canonicalCanvas = document.createElement('canvas');
        canonicalCanvas.width = targetW;
        canonicalCanvas.height = targetH;
        const cCtx = canonicalCanvas.getContext('2d', { willReadFrequently: true });
        cCtx.imageSmoothingEnabled = true;
        cCtx.imageSmoothingQuality = 'high';
        cCtx.drawImage(canvas, roiX, roiY, roiW, roiH, 0, 0, targetW, targetH);

        srcCanvas = canonicalCanvas;
        sx = 0;
        sy = 0;
      }

      const ctx = srcCanvas.getContext('2d', { willReadFrequently: true });
      const imgData = ctx.getImageData(sx, sy, targetW, targetH);
      const px = imgData.data;
      const count = targetW * targetH;
      const gray = new Uint8Array(count);

      for (let i = 0; i < count; i++) {
        gray[i] = Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      }

      let sum = 0;
      let sumSq = 0;
      let n = 0;
      const lapMagnitudes = [];

      for (let y = 1; y < targetH - 1; y++) {
        const row = y * targetW;
        const above = (y - 1) * targetW;
        const below = (y + 1) * targetW;

        for (let x = 1; x < targetW - 1; x++) {
          const c = gray[row + x];
          const t = gray[above + x];
          const b = gray[below + x];
          const l = gray[row + x - 1];
          const r = gray[row + x + 1];

          const lap = t + b + l + r - 4 * c;
          sum += lap;
          sumSq += lap * lap;
          n++;
          lapMagnitudes.push(Math.abs(lap));
        }
      }

      if (n === 0) return { rawVariance: 0, top10Magnitude: 0, sharpnessScore: 0, status: 'FAIL' };

      const mean = sum / n;
      const rawVariance = Math.max(0, sumSq / n - mean * mean);

      // Top 10% edge magnitude
      lapMagnitudes.sort((a, b) => b - a);
      const topCount = Math.max(10, Math.floor(lapMagnitudes.length * 0.10));
      let topSum = 0;
      for (let i = 0; i < topCount; i++) {
        topSum += lapMagnitudes[i];
      }
      const top10Magnitude = topSum / topCount;

      // Effective variance: blends whole-ROI variance with salient feature edge strength
      // Prevents smooth skin from dragging an in-focus face into failure
      const effectiveVariance = Math.max(rawVariance, top10Magnitude * 0.9);

      // Calibrated score mapping (0 - 100)
      const k = Math.pow(4.5, 0.75); // ~3.09
      const vPow = Math.pow(effectiveVariance, 0.75);
      const sharpnessScore = Math.min(100, Math.max(0, Math.round((100 * vPow) / (vPow + k))));

      // Status evaluation:
      // FAIL: score < 30 (effectiveVariance < ~1.8)
      // WARN: score 30 - 49 (effectiveVariance 1.8 - 4.2)
      // PASS: score >= 50 (effectiveVariance >= 4.2)
      let status = 'PASS';
      if (sharpnessScore < 30 || rawVariance < 1.2) {
        status = 'FAIL';
      } else if (sharpnessScore < 50) {
        status = 'WARN';
      }

      return {
        rawVariance: Math.round(rawVariance * 10) / 10,
        top10Magnitude: Math.round(top10Magnitude * 10) / 10,
        effectiveVariance: Math.round(effectiveVariance * 10) / 10,
        sharpnessScore,
        status
      };
    }

    // Helper to generate portrait canvas
    function createPortrait({ blurPx = 0, faceRadius = 150, brightness = 1.0 }) {
      const c = document.createElement('canvas');
      c.width = 1280;
      c.height = 720;
      const ctx = c.getContext('2d');
      const cx = 640;
      const cy = 360;

      ctx.fillStyle = `rgb(${Math.round(214 * brightness)}, ${Math.round(206 * brightness)}, ${Math.round(190 * brightness)})`;
      ctx.fillRect(0, 0, 1280, 720);

      // Shoulders
      ctx.fillStyle = `rgb(${Math.round(35 * brightness)}, ${Math.round(50 * brightness)}, ${Math.round(40 * brightness)})`;
      ctx.beginPath();
      ctx.moveTo(cx - faceRadius * 2.2, 720);
      ctx.quadraticCurveTo(cx, cy + faceRadius * 1.0, cx + faceRadius * 2.2, 720);
      ctx.fill();

      // Face
      ctx.fillStyle = `rgb(${Math.round(200 * brightness)}, ${Math.round(151 * brightness)}, ${Math.round(108 * brightness)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, faceRadius, faceRadius * 1.33, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.fillStyle = `rgb(${Math.round(35 * brightness)}, ${Math.round(24 * brightness)}, ${Math.round(18 * brightness)})`;
      ctx.beginPath();
      ctx.roundRect(cx - faceRadius * 0.7, cy - faceRadius * 0.5, faceRadius * 0.45, faceRadius * 0.07, 4);
      ctx.roundRect(cx + faceRadius * 0.25, cy - faceRadius * 0.5, faceRadius * 0.45, faceRadius * 0.07, 4);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#EDE8E0';
      ctx.beginPath();
      ctx.ellipse(cx - faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.18, faceRadius * 0.08, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.18, faceRadius * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Irises
      ctx.fillStyle = '#3A2215';
      ctx.beginPath();
      ctx.arc(cx - faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.065, 0, Math.PI * 2);
      ctx.arc(cx + faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.065, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#080402';
      ctx.beginPath();
      ctx.arc(cx - faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.025, 0, Math.PI * 2);
      ctx.arc(cx + faceRadius * 0.45, cy - faceRadius * 0.28, faceRadius * 0.025, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#B07B50';
      ctx.fillRect(cx - 3, cy - faceRadius * 0.25, 6, faceRadius * 0.35);

      // Lips
      ctx.fillStyle = '#A8574E';
      ctx.beginPath();
      ctx.ellipse(cx, cy + faceRadius * 0.48, faceRadius * 0.3, faceRadius * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      if (blurPx > 0) {
        const out = document.createElement('canvas');
        out.width = 1280;
        out.height = 720;
        const oCtx = out.getContext('2d');
        oCtx.filter = `blur(${blurPx}px)`;
        oCtx.drawImage(c, 0, 0);
        return out;
      }
      return c;
    }

    const testCases = [
      { id: '1', name: 'Genuinely Blurry (8px Gaussian blur)', blurPx: 8, faceRadius: 150, expected: 'FAIL' },
      { id: '2', name: 'Motion Blurry (4px Gaussian blur)', blurPx: 4, faceRadius: 150, expected: 'FAIL' },
      { id: '3', name: 'Subtle Softness (2px Gaussian blur)', blurPx: 2, faceRadius: 150, expected: 'WARN' },
      { id: '4', name: 'Normal In-Focus Real Webcam Face (User scenario)', blurPx: 0, faceRadius: 150, expected: 'PASS' },
      { id: '5', name: 'Large In-Focus Face (Radius 240, ~40% frame)', blurPx: 0, faceRadius: 240, expected: 'PASS' },
      { id: '6', name: 'Small In-Focus Face (Radius 85, ~10% frame)', blurPx: 0, faceRadius: 85, expected: 'PASS' },
      { id: '7', name: 'Low Light In-Focus Face', blurPx: 0, faceRadius: 150, brightness: 0.5, expected: 'PASS' }
    ];

    return testCases.map(tc => {
      const c = createPortrait({ blurPx: tc.blurPx, faceRadius: tc.faceRadius, brightness: tc.brightness });
      const r = tc.faceRadius;
      const bbox = { x: 640 - r, y: 360 - r * 1.33, w: r * 2, h: r * 2.66 };
      const inX = Math.round(bbox.w * 0.15);
      const inY = Math.round(bbox.h * 0.15);
      const roiX = bbox.x + inX;
      const roiY = bbox.y + inY;
      const roiW = bbox.w - 2 * inX;
      const roiH = bbox.h - 2 * inY;

      const res = computeCalibratedFaceSharpness(c, roiX, roiY, roiW, roiH);

      return {
        id: tc.id,
        name: tc.name,
        rawVariance: res.rawVariance,
        top10EdgeMag: res.top10Magnitude,
        sharpnessScore: res.sharpnessScore,
        decision: res.status,
        expected: tc.expected,
        matches: res.status === tc.expected
      };
    });
  });

  console.log('=== CALIBRATION VERIFICATION RESULTS ===');
  console.table(testResults);

  await browser.close();
}

verifyCompleteCalibration().catch(console.error);
