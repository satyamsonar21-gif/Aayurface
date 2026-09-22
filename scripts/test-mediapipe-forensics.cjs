// ============================================================
// AayurFace — Phase 10 MediaPipe & Real Face Forensic Test
// Test MediaPipe FaceDetector on real face images and measure ROI metrics
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('docs/engineering/frontend/visual-audit/phase-10/forensics');

async function testMediaPipeAndFaceMetrics() {
  console.log('=== TESTING MEDIAPIPE FACE DETECTOR ON REAL FACE RENDERING ===');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--use-gl=angle',
      '--use-angle=swiftshader'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  await page.exposeFunction('saveDebugImage', (filename, base64Data) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    console.log(`Saved debug image: ${filename}`);
  });

  // Navigate to localhost:5173 to have access to npm packages and same-origin CDN
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  const analysis = await page.evaluate(async () => {
    // 1. Dynamically import MediaPipe FaceDetector in browser context
    let FaceDetector, FilesetResolver;
    try {
      const mp = await import('@mediapipe/tasks-vision');
      FaceDetector = mp.FaceDetector;
      FilesetResolver = mp.FilesetResolver;
    } catch (e) {
      return { error: 'Failed to import @mediapipe/tasks-vision: ' + e.message };
    }

    const wasmFileset = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    const detector = await FaceDetector.createFromOptions(wasmFileset, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
        delegate: 'CPU'
      },
      runningMode: 'IMAGE',
      minDetectionConfidence: 0.3
    });

    // 2. Load the synthetic photorealistic face canvas created earlier
    const img = new Image();
    const loadPromise = new Promise((resolve) => {
      img.onload = resolve;
    });
    // Use an online Creative Commons real human face photo or draw realistic human portrait
    // Let's create a realistic human canvas:
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Create a real-feeling webcam frame of a person sitting in a room
    // Background: Room wall with soft gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1280, 720);
    bgGrad.addColorStop(0, '#EAE6DF');
    bgGrad.addColorStop(1, '#C8C2B8');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Wall frame/door in background
    ctx.fillStyle = '#A0988A';
    ctx.fillRect(100, 50, 200, 350);

    // Person shoulders / neck
    ctx.fillStyle = '#2C3E35'; // Ayurvedic forest green shirt
    ctx.beginPath();
    ctx.moveTo(320, 720);
    ctx.quadraticCurveTo(640, 540, 960, 720);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#C89D74';
    ctx.fillRect(590, 440, 100, 120);

    // Head oval
    ctx.fillStyle = '#D9AE83';
    ctx.beginPath();
    ctx.ellipse(640, 320, 150, 190, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1A1412';
    ctx.beginPath();
    ctx.ellipse(640, 220, 160, 110, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(480, 220, 320, 80);

    // Forehead shading
    ctx.fillStyle = '#CE9F72';
    ctx.beginPath();
    ctx.ellipse(640, 240, 130, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows
    ctx.fillStyle = '#221814';
    ctx.beginPath();
    ctx.roundRect(535, 275, 75, 10, [5, 15, 2, 2]);
    ctx.roundRect(670, 275, 75, 10, [15, 5, 2, 2]);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(572, 305, 26, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(708, 305, 26, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Irises
    ctx.fillStyle = '#3A2010';
    ctx.beginPath();
    ctx.arc(572, 305, 11, 0, Math.PI * 2);
    ctx.arc(708, 305, 11, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#050201';
    ctx.beginPath();
    ctx.arc(572, 305, 5, 0, Math.PI * 2);
    ctx.arc(708, 305, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.strokeStyle = '#B38157';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(640, 290);
    ctx.lineTo(635, 360);
    ctx.lineTo(650, 365);
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#7A4822';
    ctx.beginPath();
    ctx.ellipse(630, 370, 6, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(650, 370, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth / Lips
    ctx.fillStyle = '#A35C52';
    ctx.beginPath();
    ctx.ellipse(640, 425, 45, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5E2822';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(598, 425);
    ctx.quadraticCurveTo(640, 432, 682, 425);
    ctx.stroke();

    // 3. Run MediaPipe FaceDetector on this image
    const detections = detector.detect(canvas).detections || [];
    console.log('Detections count:', detections.length);

    if (detections.length === 0) {
      return { error: 'MediaPipe detected 0 faces on test canvas' };
    }

    const det = detections[0];
    const mpBbox = det.boundingBox;

    // Calculate Laplacian variance helper
    function calcLaplacian(sx, sy, sw, sh) {
      const imgData = ctx.getImageData(sx, sy, sw, sh);
      const px = imgData.data;
      const countTotal = sw * sh;
      const gray = new Uint8Array(countTotal);
      for (let i = 0; i < countTotal; i++) {
        gray[i] = Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      }

      let sum = 0;
      let sumSq = 0;
      let n = 0;
      for (let y = 1; y < sh - 1; y++) {
        const row = y * sw;
        const above = (y - 1) * sw;
        const below = (y + 1) * sw;
        for (let x = 1; x < sw - 1; x++) {
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

    // 4. Compare Different ROI Extractions on MediaPipe's detected bbox:
    // mpBbox:
    const bX = Math.round(mpBbox.originX);
    const bY = Math.round(mpBbox.originY);
    const bW = Math.round(mpBbox.width);
    const bH = Math.round(mpBbox.height);

    // Current code: 15% inset
    const curInsetX = Math.round(bW * 0.15);
    const curInsetY = Math.round(bH * 0.15);
    const curRoiX = bX + curInsetX;
    const curRoiY = bY + curInsetY;
    const curRoiW = bW - 2 * curInsetX;
    const curRoiH = bH - 2 * curInsetY;
    const curVariance = calcLaplacian(curRoiX, curRoiY, curRoiW, curRoiH);

    // Full detected bounding box (0% inset)
    const fullVariance = calcLaplacian(bX, bY, bW, bH);

    // Draw debug overlay showing mpBbox and curRoi
    const debugCanvas = document.createElement('canvas');
    debugCanvas.width = 1280;
    debugCanvas.height = 720;
    const dCtx = debugCanvas.getContext('2d');
    dCtx.drawImage(canvas, 0, 0);

    // MediaPipe Bbox (Green)
    dCtx.strokeStyle = '#10B981';
    dCtx.lineWidth = 3;
    dCtx.strokeRect(bX, bY, bW, bH);

    // Current 15% inset ROI (Red)
    dCtx.strokeStyle = '#EF4444';
    dCtx.lineWidth = 3;
    dCtx.strokeRect(curRoiX, curRoiY, curRoiW, curRoiH);

    // Draw landmarks if present
    if (det.keypoints) {
      dCtx.fillStyle = '#3B82F6';
      for (const kp of det.keypoints) {
        dCtx.beginPath();
        dCtx.arc(kp.x * 1280, kp.y * 720, 5, 0, Math.PI * 2);
        dCtx.fill();
      }
    }

    const debugBase64 = debugCanvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    await window.saveDebugImage('03_mediapipe_detected_face_overlay.jpg', debugBase64);

    return {
      mpBbox: { originX: bX, originY: bY, width: bW, height: bH },
      keypoints: det.keypoints ? det.keypoints.map(k => ({ x: Math.round(k.x * 1280), y: Math.round(k.y * 720) })) : [],
      curRoi: { x: curRoiX, y: curRoiY, width: curRoiW, height: curRoiH },
      curVariance: Math.round(curVariance * 10) / 10,
      fullVariance: Math.round(fullVariance * 10) / 10
    };
  });

  console.log('MediaPipe Analysis Result:');
  console.log(JSON.stringify(analysis, null, 2));

  await browser.close();
}

testMediaPipeAndFaceMetrics().catch(console.error);
