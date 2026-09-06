const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Auto-accept window.confirm
  page.on('dialog', async dialog => {
    console.log('[DIALOG DETECTED]', dialog.message());
    await dialog.accept();
  });
  
  // Step 1: Prime session and visit /profile
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('aayurface_session', JSON.stringify({
      id: 'mock-user-1', email: 'test@example.com', full_name: 'Namrata Sen', skin_type: 'dry', onboarding_completed: true
    }));
  });
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
  const profileUrlBefore = page.url();
  
  // Step 2: Find and click Sign Out button
  const signOutFound = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.includes('Sign Out of Account'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  
  await new Promise(r => setTimeout(r, 1000));
  const urlAfterSignOut = page.url();
  const sessionAfterSignOut = await page.evaluate(() => localStorage.getItem('aayurface_session'));
  
  // Step 3: Attempt to navigate to protected route /home
  await page.goto('http://localhost:5173/home', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const protectedAttemptHomeUrl = page.url();

  // Step 4: Attempt to navigate to protected route /profile
  await page.goto('http://localhost:5173/profile', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  const protectedAttemptProfileUrl = page.url();

  console.log(JSON.stringify({
    profileUrlBefore,
    signOutFound,
    urlAfterSignOut,
    sessionAfterSignOut,
    protectedAttemptHomeUrl,
    protectedAttemptProfileUrl,
    logoutPassed: urlAfterSignOut.includes('/login') && sessionAfterSignOut === null && protectedAttemptHomeUrl.includes('/login') && protectedAttemptProfileUrl.includes('/login')
  }, null, 2));

  await browser.close();
})();
