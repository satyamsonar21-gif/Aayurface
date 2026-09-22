// ============================================================
// AayurFace — Phase 10 Forensic Root Cause Script for Sharpness = 8
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/forensics');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runDiagnosis() {
  console.log('=== RUNNING IN-BROWSER DIAGNOSIS OF SHARPNESS CALCULATION ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Navigate to app so Vite has compiled all modules
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  // Now we can import the exact app code directly via Vite!
  const diagnosis = await page.evaluate(async () => {
    // Dynamically import the exact engine modules
    const { analyzeFaceROIQuality, FACE_QUALITY_THRESHOLDS_V1 } = await import('/src/lib/cv/faceQuality.ts');
    const { DeterministicRasterFaceProvider } = await import('/src/lib/cv/providers/deterministicRasterProvider.ts');
    const { BrowserMediaPipeFaceProvider } = await import('/src/lib/cv/providers/mediaPipeProvider.ts');

    // Create a real webcam portrait canvas (1280x720)
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Soft neutral room background (simulating real indoor room)
    ctx.fillStyle = '#C2B8A3';
    ctx.fillRect(0, 0, 1280, 720);

    // Natural skin base for person
    // Typical Indian/South Asian complexion: warm golden wheat / caramel
    // RGB around (195, 145, 105) -> Y ~ 155
    const skinColor = '#C39169';

    // Face oval
    ctx.fillStyle = skinColor;
    ctx.beginPath();
    ctx.ellipse(640, 340, 160, 210, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft forehead gradient
    const foreGrad = ctx.createLinearGradient(640, 150, 640, 270);
    foreGrad.addColorStop(0, '#B38159');
    foreGrad.addColorStop(1, skinColor);
    ctx.fillStyle = foreGrad;
    ctx.beginPath();
    ctx.ellipse(640, 210, 140, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark hair
    ctx.fillStyle = '#1C1510';
    ctx.beginPath();
    ctx.ellipse(640, 190, 175, 90, 0, Math.PI, 0);
    ctx.fill();

    // Eyebrows
    ctx.fillStyle = '#231812';
    ctx.fillRect(530, 270, 80, 12);
    ctx.fillRect(670, 270, 80, 12);

    // Eyes
    ctx.fillStyle = '#F5F5F0';
    ctx.beginPath();
    ctx.ellipse(570, 305, 28, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(710, 305, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2B1A10';
    ctx.beginPath();
    ctx.arc(570, 305, 12, 0, Math.PI * 2);
    ctx.arc(710, 305, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050201';
    ctx.beginPath();
    ctx.arc(570, 305, 5, 0, Math.PI * 2);
    ctx.arc(710, 305, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#A8764E';
    ctx.fillRect(636, 310, 8, 55);
    ctx.beginPath();
    ctx.ellipse(628, 365, 7, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(652, 365, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Lips
    ctx.fillStyle = '#9E5048';
    ctx.beginPath();
    ctx.ellipse(640, 420, 46, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Now test both providers:
    const rasterProvider = new DeterministicRasterFaceProvider();
    const rasterOutput = await rasterProvider.detect(canvas);

    const mpProvider = new BrowserMediaPipeFaceProvider();
    let mpOutput = null;
    try {
      mpOutput = await mpProvider.detect(canvas);
    } catch (e) {
      mpOutput = { error: e.message };
    }

    // Now analyze with analyzeFaceROIQuality for raster detected face
    let rasterFaceMetrics = null;
    if (rasterOutput.faces.length > 0) {
      rasterFaceMetrics = analyzeFaceROIQuality(canvas, rasterOutput.faces[0]);
    }

    // Now analyze with analyzeFaceROIQuality for MP detected face if available
    let mpFaceMetrics = null;
    if (mpOutput && mpOutput.faces && mpOutput.faces.length > 0) {
      mpFaceMetrics = analyzeFaceROIQuality(canvas, mpOutput.faces[0]);
    }

    return {
      rasterDetected: rasterOutput.faces.length,
      rasterFaceBbox: rasterOutput.faces[0]?.boundingBox,
      rasterFaceMetrics,
      mpDetected: mpOutput?.faces?.length || 0,
      mpError: mpOutput?.error,
      mpFaceBbox: mpOutput?.faces?.[0]?.boundingBox,
      mpFaceMetrics,
      thresholds: FACE_QUALITY_THRESHOLDS_V1
    };
  });

  console.log('Diagnosis Result:');
  console.log(JSON.stringify(diagnosis, null, 2));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'diagnosis_result.json'),
    JSON.stringify(diagnosis, null, 2)
  );

  await browser.close();
}

runDiagnosis().catch(console.error);
