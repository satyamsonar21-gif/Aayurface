const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.toString()));

  // Prime auth session
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('aayurface_session', JSON.stringify({
      id: 'mock-user-1', email: 'test@example.com', full_name: 'Namrata Sen', skin_type: 'dry', onboarding_completed: true
    }));
  });

  const routes = [
    { path: '/', authRequired: false },
    { path: '/login', authRequired: false },
    { path: '/register', authRequired: false },
    { path: '/forgot-password', authRequired: false },
    { path: '/home', authRequired: true },
    { path: '/scan', authRequired: true },
    { path: '/results/demo-scan', authRequired: true },
    { path: '/library', authRequired: true },
    { path: '/chat', authRequired: true },
    { path: '/profile', authRequired: true },
    { path: '/profile/edit', authRequired: true },
    { path: '/onboarding', authRequired: true },
    { path: '/unknown-route', authRequired: false }
  ];

  const results = [];
  for (const r of routes) {
    const url = 'http://localhost:5173' + r.path;
    const errCountBefore = consoleErrors.length;
    let status = 200;
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle0' });
      status = resp ? resp.status() : 0;
      await new Promise(res => setTimeout(res, 400));
      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        return h1 ? h1.textContent.trim() : (h2 ? h2.textContent.trim() : document.title);
      });
      const currentUrl = page.url();
      results.push({
        route: r.path,
        status,
        currentUrl,
        pageHeading: title,
        errorsLogged: consoleErrors.length - errCountBefore,
        loadsSuccessfully: status === 200 || status === 304
      });
    } catch (e) {
      results.push({
        route: r.path,
        error: e.message,
        loadsSuccessfully: false
      });
    }
  }

  console.log(JSON.stringify({ totalErrors: consoleErrors.length, results }, null, 2));
  await browser.close();
})();
