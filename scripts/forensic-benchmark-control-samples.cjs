// ============================================================
// AayurFace — Control-Sample Sharpness Benchmark
// Testing 8 Deterministic Control Samples across Resolutions & Conditions
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/forensics');

async function runControlSampleBenchmark() {
  console.log('=== RUNNING CONTROL-SAMPLE SHARPNESS BENCHMARK ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const benchmark = await page.evaluate(async () => {
    // Helper to render portrait with controllable parameters:
    // width, height, faceScale, blurPx, brightness, jpegQuality
    function createSampleCanvas({
      width = 1280,
      height = 720,
      faceRadiusX = 150,
      faceRadiusY = 200,
      blurPx = 0,
      brightness = 1.0,
      compressionQuality = null
    }) {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      const ctx = c.getContext('2d');

      const cx = width / 2;
      const cy = height / 2;

      // Background
      ctx.fillStyle = `rgb(${Math.round(214 * brightness)}, ${Math.round(206 * brightness)}, ${Math.round(190 * brightness)})`;
      ctx.fillRect(0, 0, width, height);

      // Person shoulders
      ctx.fillStyle = `rgb(${Math.round(35 * brightness)}, ${Math.round(50 * brightness)}, ${Math.round(40 * brightness)})`;
      ctx.beginPath();
      ctx.moveTo(cx - 300 * (width / 1280), height);
      ctx.quadraticCurveTo(cx, cy + 180 * (height / 720), cx + 300 * (width / 1280), height);
      ctx.fill();

      // Face Base
      ctx.fillStyle = `rgb(${Math.round(200 * brightness)}, ${Math.round(151 * brightness)}, ${Math.round(108 * brightness)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy, faceRadiusX, faceRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = `rgb(${Math.round(28 * brightness)}, ${Math.round(20 * brightness)}, ${Math.round(15 * brightness)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy - faceRadiusY * 0.65, faceRadiusX * 1.08, faceRadiusY * 0.55, 0, Math.PI, 0);
      ctx.fill();

      // Eyebrows
      ctx.fillStyle = `rgb(${Math.round(35 * brightness)}, ${Math.round(24 * brightness)}, ${Math.round(18 * brightness)})`;
      const browW = faceRadiusX * 0.45;
      const browH = faceRadiusY * 0.05;
      ctx.beginPath();
      ctx.roundRect(cx - faceRadiusX * 0.7, cy - faceRadiusY * 0.38, browW, browH, 4);
      ctx.roundRect(cx + faceRadiusX * 0.25, cy - faceRadiusY * 0.38, browW, browH, 4);
      ctx.fill();

      // Eyes
      const eyeW = faceRadiusX * 0.18;
      const eyeH = faceRadiusY * 0.06;
      ctx.fillStyle = `rgb(${Math.round(245 * brightness)}, ${Math.round(245 * brightness)}, ${Math.round(240 * brightness)})`;
      ctx.beginPath();
      ctx.ellipse(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeW, eyeH, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeW, eyeH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Iris & Pupil
      ctx.fillStyle = `rgb(${Math.round(55 * brightness)}, ${Math.round(32 * brightness)}, ${Math.round(20 * brightness)})`;
      ctx.beginPath();
      ctx.arc(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeH * 0.85, 0, Math.PI * 2);
      ctx.arc(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeH * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#050201';
      ctx.beginPath();
      ctx.arc(cx - faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeH * 0.35, 0, Math.PI * 2);
      ctx.arc(cx + faceRadiusX * 0.45, cy - faceRadiusY * 0.22, eyeH * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Nose
      ctx.fillStyle = `rgb(${Math.round(170 * brightness)}, ${Math.round(118 * brightness)}, ${Math.round(78 * brightness)})`;
      ctx.fillRect(cx - 3, cy - faceRadiusY * 0.2, 6, faceRadiusY * 0.26);

      // Lips
      ctx.fillStyle = `rgb(${Math.round(168 * brightness)}, ${Math.round(87 * brightness)}, ${Math.round(78 * brightness)})`;
      ctx.beginPath();
      ctx.ellipse(cx, cy + faceRadiusY * 0.36, faceRadiusX * 0.3, faceRadiusY * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      // Apply blur or optical filter if requested
      const outCanvas = document.createElement('canvas');
      outCanvas.width = width;
      outCanvas.height = height;
      const oCtx = outCanvas.getContext('2d');
      if (blurPx > 0) {
        oCtx.filter = `blur(${blurPx}px)`;
      }
      oCtx.drawImage(c, 0, 0);

      // Apply JPEG compression if requested
      if (compressionQuality !== null) {
        const dataUrl = outCanvas.toDataURL('image/jpeg', compressionQuality);
        const compressedImg = new Image();
        compressedImg.src = dataUrl;
        const compCanvas = document.createElement('canvas');
        compCanvas.width = width;
        compCanvas.height = height;
        compCanvas.getContext('2d').drawImage(outCanvas, 0, 0);
        return compCanvas;
      }

      return outCanvas;
    }

    // Measure raw Laplacian variance on an ROI
    function computeLaplacianRaw(canvas, x, y, w, h) {
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(x, y, w, h);
      const px = imgData.data;
      const count = w * h;
      const gray = new Uint8Array(count);

      for (let i = 0; i < count; i++) {
        gray[i] = Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      }

      let sum = 0;
      let sumSq = 0;
      let n = 0;

      // 2D discrete Laplacian
      for (let row = 1; row < h - 1; row++) {
        const off = row * w;
        const above = (row - 1) * w;
        const below = (row + 1) * w;

        for (let col = 1; col < w - 1; col++) {
          const c = gray[off + col];
          const t = gray[above + col];
          const b = gray[below + col];
          const l = gray[off + col - 1];
          const r = gray[off + col + 1];

          const lap = t + b + l + r - 4 * c;
          sum += lap;
          sumSq += lap * lap;
          n++;
        }
      }

      if (n === 0) return 0;
      const mean = sum / n;
      return Math.max(0, sumSq / n - mean * mean);
    }

    // Now also test Feature-Aware / High-Gradient Quantile sharpness:
    // Instead of being diluted by empty cheek pixels, measure the variance
    // of the top 10% highest Laplacian magnitudes!
    function computeTopQuantileLaplacian(canvas, x, y, w, h) {
      const ctx = canvas.getContext('2d');
      const imgData = ctx.getImageData(x, y, w, h);
      const px = imgData.data;
      const count = w * h;
      const gray = new Uint8Array(count);

      for (let i = 0; i < count; i++) {
        gray[i] = Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      }

      const lapValues = [];

      for (let row = 1; row < h - 1; row++) {
        const off = row * w;
        const above = (row - 1) * w;
        const below = (row + 1) * w;

        for (let col = 1; col < w - 1; col++) {
          const c = gray[off + col];
          const t = gray[above + col];
          const b = gray[below + col];
          const l = gray[off + col - 1];
          const r = gray[off + col + 1];

          const lap = Math.abs(t + b + l + r - 4 * c);
          lapValues.push(lap);
        }
      }

      if (lapValues.length === 0) return 0;
      lapValues.sort((a, b) => b - a);

      // Top 10% edge pixels
      const topCount = Math.max(10, Math.floor(lapValues.length * 0.10));
      let sum = 0;
      for (let i = 0; i < topCount; i++) {
        sum += lapValues[i];
      }
      return sum / topCount;
    }

    // Define 8 Control Samples:
    const samples = [
      { id: 'A', name: 'Genuinely Blurry Face', params: { blurPx: 8 } },
      { id: 'B', name: 'Clearly Sharp Face (Natural Webcam)', params: { blurPx: 0 } },
      { id: 'C', name: 'Moderately Sharp Face (Slight Soft Focus)', params: { blurPx: 1.5 } },
      { id: 'D', name: 'Low-Light but Sharp Face', params: { blurPx: 0, brightness: 0.45 } },
      { id: 'E', name: 'Bright/Backlit Face', params: { blurPx: 0, brightness: 1.35 } },
      { id: 'F', name: 'Compressed Image (JPEG 0.40)', params: { blurPx: 0, compressionQuality: 0.40 } },
      { id: 'G', name: 'Small Face in Frame (Area ~8%)', params: { faceRadiusX: 80, faceRadiusY: 105, blurPx: 0 } },
      { id: 'H', name: 'Large Face in Frame (Area ~40%)', params: { faceRadiusX: 230, faceRadiusY: 290, blurPx: 0 } }
    ];

    const results = [];

    for (const s of samples) {
      const canvas = createSampleCanvas(s.params);
      // Face bounding box:
      const rx = s.params.faceRadiusX || 150;
      const ry = s.params.faceRadiusY || 200;
      const bbox = {
        x: Math.round(640 - rx),
        y: Math.round(360 - ry),
        w: Math.round(rx * 2),
        h: Math.round(ry * 2)
      };

      // Current 15% inset ROI
      const inX = Math.round(bbox.w * 0.15);
      const inY = Math.round(bbox.h * 0.15);
      const roiX = bbox.x + inX;
      const roiY = bbox.y + inY;
      const roiW = bbox.w - 2 * inX;
      const roiH = bbox.h - 2 * inY;

      const rawVariance = computeLaplacianRaw(canvas, roiX, roiY, roiW, roiH);
      const top10Laplacian = computeTopQuantileLaplacian(canvas, roiX, roiY, roiW, roiH);

      // Let's test a standardized canonical normalized score (0-100)
      // Logistic sigmoid mapping that anchors:
      // rawVariance <= 1.5 -> Score < 20 (FAIL: Genuinely Blurry)
      // rawVariance = 4.0  -> Score ~ 45 (WARN: Soft Focus)
      // rawVariance >= 7.0 -> Score >= 65 (PASS: Normal In-Focus Face)
      // rawVariance >= 15  -> Score >= 85 (EXCELLENT: Crisp HD Details)
      // Formula: Score = 100 / (1 + exp(-(rawVariance - 5.0) / 2.5))
      const normalizedScore = Math.round(100 / (1 + Math.exp(-(rawVariance - 5.0) / 2.5)));

      // Current system decision with raw threshold >= 30:
      const currentDecision = rawVariance >= 30 ? 'PASS' : rawVariance >= 20 ? 'WARN' : 'FAIL';

      results.push({
        id: s.id,
        name: s.name,
        rawLaplacianVariance: Math.round(rawVariance * 10) / 10,
        top10EdgeMagnitude: Math.round(top10Laplacian * 10) / 10,
        normalizedScore,
        currentDecision_thresh30: currentDecision
      });
    }

    return results;
  });

  console.log('=== CONTROL SAMPLE BENCHMARK RESULTS ===');
  console.log(JSON.stringify(benchmark, null, 2));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'control_sample_benchmark.json'),
    JSON.stringify(benchmark, null, 2)
  );

  await browser.close();
}

runControlSampleBenchmark().catch(console.error);
