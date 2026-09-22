// ============================================================
// AayurFace — Mathematical Laplacian Scaling & Face ROI Comparison
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testLaplacianMathematics() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  const results = await page.evaluate(async () => {
    // Let's create two images:
    // Image A: Natural soft human portrait (natural skin, clear eyes, clear nose, clear lips, clear chin)
    // Image B: Slightly blurry version (e.g. slight movement or 3px blur)
    // Image C: Genuinely blurry version (10px blur)

    function createPortraitCanvas() {
      const c = document.createElement('canvas');
      c.width = 1280;
      c.height = 720;
      const ctx = c.getContext('2d');

      // Realistic indoor lighting
      ctx.fillStyle = '#EDE8DF';
      ctx.fillRect(0, 0, 1280, 720);

      // Person shoulders
      ctx.fillStyle = '#314438';
      ctx.beginPath();
      ctx.moveTo(350, 720);
      ctx.quadraticCurveTo(640, 540, 930, 720);
      ctx.fill();

      // Face base (640, 360, width 320, height 420)
      const skin = '#D2A478';
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(640, 350, 150, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // Natural face shading - cheeks, forehead, chin have very gentle, smooth tone transitions
      const cheekL = ctx.createRadialGradient(560, 360, 10, 560, 360, 80);
      cheekL.addColorStop(0, '#DAA87C');
      cheekL.addColorStop(1, skin);
      ctx.fillStyle = cheekL;
      ctx.beginPath();
      ctx.arc(560, 360, 70, 0, Math.PI * 2);
      ctx.fill();

      const cheekR = ctx.createRadialGradient(720, 360, 10, 720, 360, 80);
      cheekR.addColorStop(0, '#DAA87C');
      cheekR.addColorStop(1, skin);
      ctx.fillStyle = cheekR;
      ctx.beginPath();
      ctx.arc(720, 360, 70, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#201610';
      ctx.beginPath();
      ctx.ellipse(640, 210, 160, 100, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(480, 210, 320, 70);

      // Eyebrows
      ctx.fillStyle = '#221710';
      ctx.beginPath();
      ctx.roundRect(535, 270, 70, 9, 4);
      ctx.roundRect(675, 270, 70, 9, 4);
      ctx.fill();

      // Eyes (realistic size in a 1280x720 webcam view)
      // Note: In 1280x720, an eye is about 50px wide and 25px high
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(570, 305, 25, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(710, 305, 25, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3E2412';
      ctx.beginPath();
      ctx.arc(570, 305, 10, 0, Math.PI * 2);
      ctx.arc(710, 305, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#080402';
      ctx.beginPath();
      ctx.arc(570, 305, 4, 0, Math.PI * 2);
      ctx.arc(710, 305, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyelid crease
      ctx.strokeStyle = '#8C5A32';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(570, 300, 26, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(710, 300, 26, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Nose bridge and nostrils
      ctx.fillStyle = '#B68256';
      ctx.fillRect(636, 310, 7, 50);
      ctx.fillStyle = '#8A5025';
      ctx.beginPath();
      ctx.ellipse(628, 365, 6, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(652, 365, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lips
      ctx.fillStyle = '#B05E54';
      ctx.beginPath();
      ctx.ellipse(640, 420, 42, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5E2218';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(600, 420);
      ctx.quadraticCurveTo(640, 427, 680, 420);
      ctx.stroke();

      return c;
    }

    function calcLaplacianVariance(canvas, sx, sy, sw, sh, downscaleDim = null) {
      let targetW = sw;
      let targetH = sh;
      let sourceCanvas = canvas;
      let cropX = sx;
      let cropY = sy;

      if (downscaleDim && (sw > downscaleDim || sh > downscaleDim)) {
        const s = downscaleDim / Math.max(sw, sh);
        targetW = Math.max(10, Math.round(sw * s));
        targetH = Math.max(10, Math.round(sh * s));

        const tempC = document.createElement('canvas');
        tempC.width = targetW;
        tempC.height = targetH;
        const tCtx = tempC.getContext('2d');
        tCtx.imageSmoothingEnabled = true;
        tCtx.imageSmoothingQuality = 'high';
        tCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, targetW, targetH);
        sourceCanvas = tempC;
        cropX = 0;
        cropY = 0;
      }

      const ctx = sourceCanvas.getContext('2d');
      const imgData = ctx.getImageData(cropX, cropY, targetW, targetH);
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

      if (n === 0) return 0;
      const mean = sum / n;
      return Math.max(0, sumSq / n - mean * mean);
    }

    const sharpCanvas = createPortraitCanvas();

    // Blurry canvas (Gaussian 6px blur)
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = 1280;
    blurCanvas.height = 720;
    const bCtx = blurCanvas.getContext('2d');
    bCtx.filter = 'blur(6px)';
    bCtx.drawImage(sharpCanvas, 0, 0);

    // Soft focus canvas (Gaussian 2px blur)
    const softCanvas = document.createElement('canvas');
    softCanvas.width = 1280;
    softCanvas.height = 720;
    const sCtx = softCanvas.getContext('2d');
    sCtx.filter = 'blur(2px)';
    sCtx.drawImage(sharpCanvas, 0, 0);

    // Bounding box from face detector:
    // x: 490, y: 220, w: 300, h: 320
    const bbox = { x: 490, y: 220, w: 300, h: 320 };

    // Inset 15% ROI:
    const inX = Math.round(bbox.w * 0.15); // 45
    const inY = Math.round(bbox.h * 0.15); // 48
    const roi15 = {
      x: bbox.x + inX, // 535
      y: bbox.y + inY, // 268
      w: bbox.w - 2 * inX, // 210
      h: bbox.h - 2 * inY // 224
    };

    // Cheek region only:
    const cheekRoi = { x: 535, y: 340, w: 100, h: 60 };

    return {
      // 1. Full Image Global (Phase 09 style downsampled to 320x240)
      globalSharp_320: Math.round(calcLaplacianVariance(sharpCanvas, 0, 0, 1280, 720, 320) * 10) / 10,
      globalSoft_320: Math.round(calcLaplacianVariance(softCanvas, 0, 0, 1280, 720, 320) * 10) / 10,
      globalBlur_320: Math.round(calcLaplacianVariance(blurCanvas, 0, 0, 1280, 720, 320) * 10) / 10,

      // 2. Full Image at 1280x720 Native
      globalSharp_1280: Math.round(calcLaplacianVariance(sharpCanvas, 0, 0, 1280, 720, null) * 10) / 10,
      globalSoft_1280: Math.round(calcLaplacianVariance(softCanvas, 0, 0, 1280, 720, null) * 10) / 10,
      globalBlur_1280: Math.round(calcLaplacianVariance(blurCanvas, 0, 0, 1280, 720, null) * 10) / 10,

      // 3. Face Bounding Box at Native Resolution
      faceBboxSharp_native: Math.round(calcLaplacianVariance(sharpCanvas, bbox.x, bbox.y, bbox.w, bbox.h, null) * 10) / 10,
      faceBboxSoft_native: Math.round(calcLaplacianVariance(softCanvas, bbox.x, bbox.y, bbox.w, bbox.h, null) * 10) / 10,
      faceBboxBlur_native: Math.round(calcLaplacianVariance(blurCanvas, bbox.x, bbox.y, bbox.w, bbox.h, null) * 10) / 10,

      // 4. Current Phase 10 Inset 15% ROI at Native Resolution
      faceRoi15Sharp_native: Math.round(calcLaplacianVariance(sharpCanvas, roi15.x, roi15.y, roi15.w, roi15.h, null) * 10) / 10,
      faceRoi15Soft_native: Math.round(calcLaplacianVariance(softCanvas, roi15.x, roi15.y, roi15.w, roi15.h, null) * 10) / 10,
      faceRoi15Blur_native: Math.round(calcLaplacianVariance(blurCanvas, roi15.x, roi15.y, roi15.w, roi15.h, null) * 10) / 10,

      // 5. Cheek Region Only
      cheekSharp_native: Math.round(calcLaplacianVariance(sharpCanvas, cheekRoi.x, cheekRoi.y, cheekRoi.w, cheekRoi.h, null) * 10) / 10,

      // 6. What happens if ROI is normalized/standardized to a fixed canonical size (e.g. 256x256)?
      faceRoi15Sharp_canonical256: Math.round(calcLaplacianVariance(sharpCanvas, roi15.x, roi15.y, roi15.w, roi15.h, 256) * 10) / 10,
      faceRoi15Soft_canonical256: Math.round(calcLaplacianVariance(softCanvas, roi15.x, roi15.y, roi15.w, roi15.h, 256) * 10) / 10,
      faceRoi15Blur_canonical256: Math.round(calcLaplacianVariance(blurCanvas, roi15.x, roi15.y, roi15.w, roi15.h, 256) * 10) / 10
    };
  });

  console.log('=== LAPLACIAN MATHEMATICS RESULTS ===');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
}

testLaplacianMathematics().catch(console.error);
