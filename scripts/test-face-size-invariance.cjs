// ============================================================
// AayurFace — Face Size Invariance Test with Canonical ROI Rescaling
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testFaceSizeInvariance() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const stabilityTest = await page.evaluate(() => {
    // Renders the exact same person at 3 different face sizes (distances from camera):
    // 1. Small face: radius 75 (width 150px, occupies ~6% of frame)
    // 2. Medium face: radius 150 (width 300px, occupies ~22% of frame)
    // 3. Large face: radius 250 (width 500px, occupies ~55% of frame)

    function renderPersonAtScale(faceRadiusX, faceRadiusY, blurPx = 0) {
      const c = document.createElement('canvas');
      c.width = 1280;
      c.height = 720;
      const ctx = c.getContext('2d');
      const cx = 640;
      const cy = 360;

      // Background
      ctx.fillStyle = '#D6CEBE';
      ctx.fillRect(0, 0, 1280, 720);

      // Shoulders
      ctx.fillStyle = '#1D2A24';
      ctx.beginPath();
      ctx.moveTo(cx - faceRadiusX * 2.2, 720);
      ctx.quadraticCurveTo(cx, cy + faceRadiusY * 1.0, cx + faceRadiusX * 2.2, 720);
      ctx.fill();

      // Face
      ctx.fillStyle = '#C8976C';
      ctx.beginPath();
      ctx.ellipse(cx, cy, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.fillStyle = '#221914';
      ctx.beginPath();
      ctx.roundRect(cx - faceRadiusX * 0.7, cy - faceRadiusY * 0.38, faceRadiusX * 0.45, faceRadiusY * 0.05, 4);
      ctx.roundRect(cx + faceRadiusX * 0.25, cy - faceRadiusY * 0.38, faceRadiusX * 0.45, faceRadiusY * 0.05, 4);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#EDE8E0';
      ctx.beginPath();
      ctx.ellipse(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusX * 0.18, faceRadiusY * 0.06, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusX * 0.18, faceRadiusY * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();

      // Irises
      ctx.fillStyle = '#3A2215';
      ctx.beginPath();
      ctx.arc(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusY * 0.05, 0, Math.PI * 2);
      ctx.arc(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusY * 0.05, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#080402';
      ctx.beginPath();
      ctx.arc(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusY * 0.02, 0, Math.PI * 2);
      ctx.arc(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, faceRadiusY * 0.02, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = '#B07B50';
      ctx.fillRect(cx - 3, cy - faceRadiusY * 0.2, 6, faceRadiusY * 0.26);

      // Lips
      ctx.fillStyle = '#A8574E';
      ctx.beginPath();
      ctx.ellipse(cx, cy + faceRadiusY * 0.36, faceRadiusX * 0.3, faceRadiusY * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      if (blurPx > 0) {
        const blurC = document.createElement('canvas');
        blurC.width = 1280;
        blurC.height = 720;
        const bCtx = blurC.getContext('2d');
        bCtx.filter = `blur(${blurPx}px)`;
        bCtx.drawImage(c, 0, 0);
        return blurC;
      }

      return c;
    }

    // Function to calculate sharpness with canonical downscaling (capped at max 256px)
    function calculateCanonicalFaceSharpness(canvas, roiX, roiY, roiW, roiH) {
      const CANONICAL_MAX_DIM = 256;
      let targetW = roiW;
      let targetH = roiH;
      let srcCanvas = canvas;
      let sx = roiX;
      let sy = roiY;

      // Downscale oversized ROIs to 256px canonical dimension (Never upscale low-res)
      if (roiW > CANONICAL_MAX_DIM || roiH > CANONICAL_MAX_DIM) {
        const scale = CANONICAL_MAX_DIM / Math.max(roiW, roiH);
        targetW = Math.max(16, Math.round(roiW * scale));
        targetH = Math.max(16, Math.round(roiH * scale));

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
        }
      }

      if (n === 0) return { rawVariance: 0, normalizedScore: 0 };
      const mean = sum / n;
      const rawVariance = Math.max(0, sumSq / n - mean * mean);

      // Normalization formula:
      // Score = 100 * (V^0.75) / (V^0.75 + 4.5^0.75)
      const k = Math.pow(4.5, 0.75);
      const vPow = Math.pow(rawVariance, 0.75);
      const normalizedScore = Math.min(100, Math.max(0, Math.round((100 * vPow) / (vPow + k))));

      return {
        rawVariance: Math.round(rawVariance * 10) / 10,
        normalizedScore,
        canonicalDimensions: `${targetW}x${targetH}`
      };
    }

    const testScales = [
      { name: 'Small Face (radius 75, ~150px)', rx: 75, ry: 100 },
      { name: 'Medium Face (radius 150, ~300px)', rx: 150, ry: 200 },
      { name: 'Large Face (radius 250, ~500px)', rx: 250, ry: 330 }
    ];

    const output = [];

    for (const s of testScales) {
      // In-focus version
      const sharpCanvas = renderPersonAtScale(s.rx, s.ry, 0);
      const bbox = { x: 640 - s.rx, y: 360 - s.ry, w: s.rx * 2, h: s.ry * 2 };
      const roiX = bbox.x + Math.round(bbox.w * 0.15);
      const roiY = bbox.y + Math.round(bbox.h * 0.15);
      const roiW = bbox.w - 2 * Math.round(bbox.w * 0.15);
      const roiH = bbox.h - 2 * Math.round(bbox.h * 0.15);

      const sharpRes = calculateCanonicalFaceSharpness(sharpCanvas, roiX, roiY, roiW, roiH);

      // Blurry version (4px blur)
      const blurCanvas = renderPersonAtScale(s.rx, s.ry, 4);
      const blurRes = calculateCanonicalFaceSharpness(blurCanvas, roiX, roiY, roiW, roiH);

      output.push({
        size: s.name,
        originalRoiDimensions: `${roiW}x${roiH}`,
        canonicalDimensions: sharpRes.canonicalDimensions,
        sharpRaw: sharpRes.rawVariance,
        sharpScore: sharpRes.normalizedScore,
        blurRaw: blurRes.rawVariance,
        blurScore: blurRes.normalizedScore
      });
    }

    return output;
  });

  console.log('=== FACE SIZE INVARIANCE RESULTS ===');
  console.table(stabilityTest);

  await browser.close();
}

testFaceSizeInvariance().catch(console.error);
