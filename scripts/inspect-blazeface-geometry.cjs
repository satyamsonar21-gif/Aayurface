// ============================================================
// AayurFace — Inspect BlazeFace Bounding Box & Landmark Offsets
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function inspectBlazeFaceGeometry() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const geometry = await page.evaluate(async () => {
    const { BrowserMediaPipeFaceProvider } = await import('/src/lib/cv/providers/mediaPipeProvider.ts');
    const mp = new BrowserMediaPipeFaceProvider();

    // Create a realistic face image
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#E5E0D8';
    ctx.fillRect(0, 0, 1280, 720);

    // Person
    ctx.fillStyle = '#22332B';
    ctx.beginPath();
    ctx.moveTo(350, 720);
    ctx.quadraticCurveTo(640, 560, 930, 720);
    ctx.fill();

    // Neck
    ctx.fillStyle = '#C89B72';
    ctx.fillRect(590, 430, 100, 120);

    // Head
    ctx.fillStyle = '#DCAE85';
    ctx.beginPath();
    ctx.ellipse(640, 330, 140, 180, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#1A120B';
    ctx.beginPath();
    ctx.ellipse(640, 230, 150, 100, 0, Math.PI, 0);
    ctx.fill();

    // Eyebrows
    ctx.fillStyle = '#201610';
    ctx.beginPath();
    ctx.roundRect(545, 275, 65, 8, 3);
    ctx.roundRect(670, 275, 65, 8, 3);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(577, 305, 24, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(703, 305, 24, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3A2215';
    ctx.beginPath();
    ctx.arc(577, 305, 10, 0, Math.PI * 2);
    ctx.arc(703, 305, 10, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#B68257';
    ctx.fillRect(636, 310, 8, 55);

    // Mouth
    ctx.fillStyle = '#AC5B52';
    ctx.beginPath();
    ctx.ellipse(640, 420, 40, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const output = await mp.detect(canvas);
    if (!output || output.faces.length === 0) {
      return { error: 'No face detected by MediaPipe', errorDetail: output?.error };
    }

    const face = output.faces[0];
    const bbox = face.boundingBox;
    const lm = face.landmarks;

    // Relative landmark positions within bounding box (0.0 to 1.0)
    const relLeftEyeY = lm?.leftEye ? (lm.leftEye.y - bbox.y) / bbox.height : null;
    const relRightEyeY = lm?.rightEye ? (lm.rightEye.y - bbox.y) / bbox.height : null;
    const relNoseY = lm?.noseTip ? (lm.noseTip.y - bbox.y) / bbox.height : null;
    const relMouthY = lm?.mouthCenter ? (lm.mouthCenter.y - bbox.y) / bbox.height : null;

    return {
      bbox,
      landmarks: lm,
      relativeLandmarksY: {
        leftEye: relLeftEyeY,
        rightEye: relRightEyeY,
        noseTip: relNoseY,
        mouthCenter: relMouthY
      }
    };
  });

  console.log('Geometry inspection:');
  console.log(JSON.stringify(geometry, null, 2));

  await browser.close();
}

inspectBlazeFaceGeometry().catch(console.error);
