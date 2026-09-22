// ============================================================
// AayurFace — Test Real Photo Laplacian Sharpness Distribution
// ============================================================

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testRealPhotos() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });

  const measurements = await page.evaluate(async () => {
    const { analyzeFaceROIQuality, FACE_QUALITY_THRESHOLDS_V1 } = await import('/src/lib/cv/faceQuality.ts');
    const { BrowserMediaPipeFaceProvider } = await import('/src/lib/cv/providers/mediaPipeProvider.ts');

    // Create a series of realistic photographic face simulations
    // using realistic optical point-spread function (smooth natural edges):
    function renderRealisticPhoto(blurPx = 0) {
      const c = document.createElement('canvas');
      c.width = 1280;
      c.height = 720;
      const ctx = c.getContext('2d');

      // Realistic indoor lighting
      ctx.fillStyle = '#D6CEBE';
      ctx.fillRect(0, 0, 1280, 720);

      // Person shoulders
      ctx.fillStyle = '#1D2A24';
      ctx.beginPath();
      ctx.moveTo(350, 720);
      ctx.quadraticCurveTo(640, 540, 930, 720);
      ctx.fill();

      // Face base
      const skin = '#C8976C';
      ctx.fillStyle = skin;
      ctx.beginPath();
      ctx.ellipse(640, 350, 150, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // Realistic hair
      ctx.fillStyle = '#18120E';
      ctx.beginPath();
      ctx.ellipse(640, 220, 160, 100, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(480, 220, 320, 70);

      // Eyebrows (natural soft hair gradient)
      ctx.fillStyle = '#221914';
      ctx.beginPath();
      ctx.roundRect(535, 275, 70, 10, 4);
      ctx.roundRect(675, 275, 70, 10, 4);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#EDE8E0';
      ctx.beginPath();
      ctx.ellipse(570, 308, 25, 12, 0, 0, Math.PI * 2);
      ctx.ellipse(710, 308, 25, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3A2215';
      ctx.beginPath();
      ctx.arc(570, 308, 10, 0, Math.PI * 2);
      ctx.arc(710, 308, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#080402';
      ctx.beginPath();
      ctx.arc(570, 308, 4, 0, Math.PI * 2);
      ctx.arc(710, 308, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyelid line
      ctx.strokeStyle = '#5A3218';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(570, 304, 25, Math.PI * 1.15, Math.PI * 1.85);
      ctx.arc(710, 304, 25, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Nose
      ctx.fillStyle = '#B07B50';
      ctx.fillRect(636, 315, 8, 48);
      ctx.fillStyle = '#7C441E';
      ctx.beginPath();
      ctx.ellipse(628, 368, 6, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(652, 368, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Lips
      ctx.fillStyle = '#A8574E';
      ctx.beginPath();
      ctx.ellipse(640, 422, 42, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4A1C16';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(600, 422);
      ctx.quadraticCurveTo(640, 428, 680, 422);
      ctx.stroke();

      // Simulate camera sensor Point Spread Function (PSF: 0.8px natural optical dispersion)
      const opticalCanvas = document.createElement('canvas');
      opticalCanvas.width = 1280;
      opticalCanvas.height = 720;
      const oCtx = opticalCanvas.getContext('2d');
      const totalBlur = 0.8 + blurPx;
      if (totalBlur > 0) {
        oCtx.filter = `blur(${totalBlur}px)`;
      }
      oCtx.drawImage(c, 0, 0);

      return opticalCanvas;
    }

    const mp = new BrowserMediaPipeFaceProvider();

    // 1. In-Focus Realistic Photo (optical PSF 0.8px, typical webcam)
    const inFocusCanvas = renderRealisticPhoto(0);
    const inFocusDet = await mp.detect(inFocusCanvas);
    const inFocusMetrics = inFocusDet.faces[0]
      ? analyzeFaceROIQuality(inFocusCanvas, inFocusDet.faces[0])
      : null;

    // 2. Mildly Soft / Slight Defocus Photo (+1.5px blur)
    const softCanvas = renderRealisticPhoto(1.5);
    const softDet = await mp.detect(softCanvas);
    const softMetrics = softDet.faces[0]
      ? analyzeFaceROIQuality(softCanvas, softDet.faces[0])
      : null;

    // 3. Blurry / Motion Blurred Photo (+4px blur)
    const blurCanvas = renderRealisticPhoto(4.0);
    const blurDet = await mp.detect(blurCanvas);
    const blurMetrics = blurDet.faces[0]
      ? analyzeFaceROIQuality(blurCanvas, blurDet.faces[0])
      : null;

    // 4. Heavily Blurry Photo (+8px blur)
    const heavyBlurCanvas = renderRealisticPhoto(8.0);
    const heavyBlurDet = await mp.detect(heavyBlurCanvas);
    const heavyBlurMetrics = heavyBlurDet.faces[0]
      ? analyzeFaceROIQuality(heavyBlurCanvas, heavyBlurDet.faces[0])
      : null;

    return {
      inFocus: {
        sharpness: inFocusMetrics?.sharpnessVariance,
        status: inFocusMetrics?.status,
        luminance: inFocusMetrics?.meanLuminance
      },
      mildlySoft: {
        sharpness: softMetrics?.sharpnessVariance,
        status: softMetrics?.status,
        luminance: softMetrics?.meanLuminance
      },
      motionBlur_4px: {
        sharpness: blurMetrics?.sharpnessVariance,
        status: blurMetrics?.status,
        luminance: blurMetrics?.meanLuminance
      },
      heavyBlur_8px: {
        sharpness: heavyBlurMetrics?.sharpnessVariance,
        status: heavyBlurMetrics?.status,
        luminance: heavyBlurMetrics?.meanLuminance
      }
    };
  });

  console.log('Real Photo Optical Simulation Results:');
  console.log(JSON.stringify(measurements, null, 2));

  await browser.close();
}

testRealPhotos().catch(console.error);
