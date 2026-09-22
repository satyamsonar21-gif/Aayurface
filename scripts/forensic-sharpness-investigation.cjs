// ============================================================
// AayurFace — Phase 10 CV Sharpness Forensic Investigation
// Detailed instrumentation of face detection, ROI, and Laplacian metrics
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/forensics');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runForensics() {
  console.log('=== STARTING SHARPNESS FORENSIC INVESTIGATION ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Expose helper to write files from browser context
  await page.exposeFunction('saveDebugImage', (filename, base64Data) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    console.log(`Saved debug image: ${filename}`);
  });

  // Inject a real face generation / canvas test suite
  const results = await page.evaluate(async () => {
    // 1. Create a detailed photorealistic-style face on a 1280x720 canvas
    // including natural skin tone gradients, realistic eyes with iris/pupil, eyebrows,
    // nose contours, realistic lips with vermilion border, and subtle skin pores.
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#D8D0C5';
    ctx.fillRect(0, 0, 1280, 720);

    // Face placement: Centered in 1280x720
    // Face width ~ 380, height ~ 480.
    // Center at (640, 360).
    const faceX = 450;
    const faceY = 120;
    const faceW = 380;
    const faceH = 480;

    // Head base
    const grad = ctx.createRadialGradient(640, 340, 50, 640, 360, 240);
    grad.addColorStop(0, '#E8C5A0');
    grad.addColorStop(0.7, '#D4A373');
    grad.addColorStop(1, '#B07D4B');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(640, 360, 185, 235, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (high frequency hair texture)
    ctx.fillStyle = '#2A1A0A';
    for (let i = 0; i < 40; i++) {
      // Left brow
      ctx.fillRect(520 + i * 2.2, 260 + Math.sin(i / 10) * 8, 2, 8);
      // Right brow
      ctx.fillRect(680 + i * 2.2, 268 - Math.sin(i / 10) * 8, 2, 8);
    }

    // Eyes: sclera, iris, pupil, eyelid lines (sharp edges)
    // Left eye
    ctx.fillStyle = '#FAF6F0';
    ctx.beginPath();
    ctx.ellipse(565, 305, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3D2314';
    ctx.beginPath();
    ctx.arc(565, 305, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0A0502';
    ctx.beginPath();
    ctx.arc(565, 305, 5, 0, Math.PI * 2);
    ctx.fill();
    // Eyelash line
    ctx.strokeStyle = '#150B05';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(565, 305, 30, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Right eye
    ctx.fillStyle = '#FAF6F0';
    ctx.beginPath();
    ctx.ellipse(715, 305, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3D2314';
    ctx.beginPath();
    ctx.arc(715, 305, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0A0502';
    ctx.beginPath();
    ctx.arc(715, 305, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(715, 305, 30, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Nose bridge and nostrils
    ctx.fillStyle = '#B58255';
    ctx.fillRect(636, 320, 8, 55);
    ctx.fillStyle = '#8B5328';
    ctx.beginPath();
    ctx.ellipse(625, 380, 8, 6, 0.2, 0, Math.PI * 2);
    ctx.ellipse(655, 380, 8, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Lips (vermilion border and line)
    ctx.fillStyle = '#B85D55';
    ctx.beginPath();
    ctx.ellipse(640, 445, 42, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5E221E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(600, 445);
    ctx.quadraticCurveTo(640, 452, 680, 445);
    ctx.stroke();

    // Natural skin texture (subtle pore grain across cheeks and forehead)
    for (let y = 200; y < 520; y += 4) {
      for (let x = 490; x < 790; x += 4) {
        const dx = (x - 640) / 160;
        const dy = (y - 360) / 200;
        if (dx * dx + dy * dy < 0.8) {
          const noise = ((x * 17 + y * 31) % 11) - 5;
          ctx.fillStyle = noise > 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }

    // Save full original image
    const fullBase64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    await window.saveDebugImage('01_synthetic_photorealistic_face.jpg', fullBase64);

    // Define face bounding box matching what FaceDetector returns
    const bbox = { x: faceX, y: faceY, width: faceW, height: faceH };

    // Function to calculate Laplacian variance on any subregion
    function getLaplacianVariance(subCanvas, sx, sy, sw, sh) {
      const subCtx = subCanvas.getContext('2d');
      const imgData = subCtx.getImageData(sx, sy, sw, sh);
      const pixels = imgData.data;
      const totalPixels = sw * sh;

      const grayscale = new Uint8Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        grayscale[i] = Math.round(
          0.299 * pixels[i * 4] + 0.587 * pixels[i * 4 + 1] + 0.114 * pixels[i * 4 + 2]
        );
      }

      let sum = 0;
      let sumSq = 0;
      let count = 0;

      for (let y = 1; y < sh - 1; y++) {
        const rowOffset = y * sw;
        const rowAbove = (y - 1) * sw;
        const rowBelow = (y + 1) * sw;

        for (let x = 1; x < sw - 1; x++) {
          const center = grayscale[rowOffset + x];
          const top = grayscale[rowAbove + x];
          const bottom = grayscale[rowBelow + x];
          const left = grayscale[rowOffset + x - 1];
          const right = grayscale[rowOffset + x + 1];

          const lap = top + bottom + left + right - 4 * center;
          sum += lap;
          sumSq += lap * lap;
          count++;
        }
      }

      if (count === 0) return 0;
      const mean = sum / count;
      return Math.max(0, sumSq / count - mean * mean);
    }

    // Measure 1: Current Phase 10 Inset ROI (15% margin)
    const insetX = Math.round(bbox.width * 0.15);
    const insetY = Math.round(bbox.height * 0.15);
    const roiX = bbox.x + insetX;
    const roiY = bbox.y + insetY;
    const roiW = bbox.width - 2 * insetX;
    const roiH = bbox.height - 2 * insetY;

    const varCurrent15Inset = getLaplacianVariance(canvas, roiX, roiY, roiW, roiH);

    // Save visualization of current 15% Inset ROI
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = 1280;
    overlayCanvas.height = 720;
    const oCtx = overlayCanvas.getContext('2d');
    oCtx.drawImage(canvas, 0, 0);

    // Outer Bounding Box (Gold)
    oCtx.strokeStyle = '#C5A059';
    oCtx.lineWidth = 3;
    oCtx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

    // Current 15% Inset ROI (Red)
    oCtx.strokeStyle = '#EF4444';
    oCtx.lineWidth = 3;
    oCtx.strokeRect(roiX, roiY, roiW, roiH);

    const overlayBase64 = overlayCanvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    await window.saveDebugImage('02_roi_comparison_overlay.jpg', overlayBase64);

    // Measure 2: Full Face Bounding Box (0% inset)
    const varFullBbox = getLaplacianVariance(canvas, bbox.x, bbox.y, bbox.width, bbox.height);

    // Measure 3: Eyes & Brow Band (y: 240-340, x: 500-780)
    const varEyesBrowBand = getLaplacianVariance(canvas, 500, 240, 280, 100);

    // Measure 4: Cheeks Only (Smooth Skin) (y: 340-420, x: 500-600)
    const varCheekSmooth = getLaplacianVariance(canvas, 500, 340, 100, 80);

    // Measure 5: Genuinely Blurry Face (apply 10px blur)
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = 1280;
    blurCanvas.height = 720;
    const bCtx = blurCanvas.getContext('2d');
    bCtx.filter = 'blur(10px)';
    bCtx.drawImage(canvas, 0, 0);
    const varBlur15Inset = getLaplacianVariance(blurCanvas, roiX, roiY, roiW, roiH);
    const varBlurFullBbox = getLaplacianVariance(blurCanvas, bbox.x, bbox.y, bbox.width, bbox.height);

    // Measure 6: Slight Focus Softness (apply 2px blur)
    const softCanvas = document.createElement('canvas');
    softCanvas.width = 1280;
    softCanvas.height = 720;
    const sCtx = softCanvas.getContext('2d');
    sCtx.filter = 'blur(2px)';
    sCtx.drawImage(canvas, 0, 0);
    const varSoft15Inset = getLaplacianVariance(softCanvas, roiX, roiY, roiW, roiH);
    const varSoftFullBbox = getLaplacianVariance(softCanvas, bbox.x, bbox.y, bbox.width, bbox.height);

    // Measure 7: Resolution Scaling Effect on Laplacian Variance
    // What happens if the face is 640x360 vs 1280x720?
    const halfCanvas = document.createElement('canvas');
    halfCanvas.width = 640;
    halfCanvas.height = 360;
    const hCtx = halfCanvas.getContext('2d');
    hCtx.drawImage(canvas, 0, 0, 640, 360);
    const varHalfBbox = getLaplacianVariance(
      halfCanvas,
      Math.round(bbox.x / 2),
      Math.round(bbox.y / 2),
      Math.round(bbox.width / 2),
      Math.round(bbox.height / 2)
    );

    return {
      bbox,
      roi15Inset: { x: roiX, y: roiY, width: roiW, height: roiH },
      varCurrent15Inset: Math.round(varCurrent15Inset * 100) / 100,
      varFullBbox: Math.round(varFullBbox * 100) / 100,
      varEyesBrowBand: Math.round(varEyesBrowBand * 100) / 100,
      varCheekSmooth: Math.round(varCheekSmooth * 100) / 100,
      varBlur15Inset: Math.round(varBlur15Inset * 100) / 100,
      varBlurFullBbox: Math.round(varBlurFullBbox * 100) / 100,
      varSoft15Inset: Math.round(varSoft15Inset * 100) / 100,
      varSoftFullBbox: Math.round(varSoftFullBbox * 100) / 100,
      varHalfBbox: Math.round(varHalfBbox * 100) / 100
    };
  });

  console.log('\n=== FORENSIC MEASUREMENTS ===');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'forensic_measurements.json'),
    JSON.stringify(results, null, 2)
  );

  await browser.close();
}

runForensics().catch(console.error);
