const puppeteer = require('puppeteer-core');

async function testRoot() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Trace navigation & console logs
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  console.log('Navigating to http://localhost:5173/ with fresh page...');
  const res = await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('Final URL:', page.url());
  console.log('Document title:', await page.title());
  
  const localStorageDump = await page.evaluate(() => {
    return {
      session: localStorage.getItem('aayurface_session'),
      users: localStorage.getItem('aayurface_users'),
      allKeys: Object.keys(localStorage)
    };
  });
  console.log('LocalStorage dump:', localStorageDump);
  
  const bodyTextSnippet = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Body snippet:\n', bodyTextSnippet);

  await browser.close();
}

testRoot().catch(console.error);
