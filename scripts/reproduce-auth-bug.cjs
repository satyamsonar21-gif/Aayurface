const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runAudit() {
  console.log('=== AUTH & NAVIGATION WORKFLOW FORENSIC AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = {};

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Scenario 1: Fresh visit to "/" with clean incognito session
    console.log('\n[TEST 1] Visiting http://localhost:5173/ as fresh visitor...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    const url1 = page.url();
    const storage1 = await page.evaluate(() => ({ ...localStorage }));
    const headerButtons1 = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('header a, header button')).map(el => ({
        text: el.textContent.trim(),
        href: el.getAttribute('href') || el.getAttribute('to')
      }));
    });
    console.log('URL at root:', url1);
    console.log('LocalStorage keys:', Object.keys(storage1));
    console.log('Header buttons:', headerButtons1);
    results.test1_fresh_landing = { url: url1, storageKeys: Object.keys(storage1), headerButtons: headerButtons1 };

    // Scenario 2: Unauthenticated direct access to /dashboard
    console.log('\n[TEST 2] Visiting /dashboard directly without session...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    const url2 = page.url();
    console.log('URL after direct /dashboard access:', url2);
    results.test2_unauth_dashboard = { url: url2, redirectedToSignin: url2.includes('/signin') };

    // Scenario 3: Unauthenticated direct access to /scan
    console.log('\n[TEST 3] Visiting /scan directly without session...');
    await page.goto('http://localhost:5173/scan', { waitUntil: 'networkidle2' });
    const url3 = page.url();
    console.log('URL after direct /scan access:', url3);
    results.test3_unauth_scan = { url: url3, redirectedToSignin: url3.includes('/signin') };

    // Scenario 4: Footer link to /scan from landing page
    console.log('\n[TEST 4] Clicking "Facial Observation" link on landing page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    const scanFooterLink = await page.$('footer a[href="/scan"]');
    if (scanFooterLink) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}),
        scanFooterLink.click()
      ]);
      await new Promise(r => setTimeout(r, 1000));
      const url4 = page.url();
      console.log('URL after clicking footer /scan link:', url4);
      results.test4_footer_scan_click = { url: url4 };
    }

    // Scenario 5: Registering a new account and checking where it routes
    console.log('\n[TEST 5] Testing new account registration routing...');
    const uniqueEmail = `test_audit_${Date.now()}@example.com`;
    await page.goto('http://localhost:5173/register', { waitUntil: 'networkidle2' });
    await page.type('#register-fullName', 'Audit User');
    await page.type('#register-email', uniqueEmail);
    await page.type('#register-password', 'Password123!');
    await page.type('#register-confirmPassword', 'Password123!');
    
    const submitBtn = await page.$('button[type="submit"]');
    console.log('Submitting register form for:', uniqueEmail);
    await submitBtn.click();
    
    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));
    const url5 = page.url();
    console.log('URL after registration submit:', url5);
    results.test5_registration_target = { url: url5, email: uniqueEmail };

    // Scenario 6: Test what happens if we navigate to /dashboard when onboarding is not completed
    console.log('\n[TEST 6] Navigating to /dashboard while onboarding_completed might be false...');
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    const url6 = page.url();
    console.log('URL after trying to reach /dashboard:', url6);
    results.test6_dashboard_gating = { url: url6 };

    // Scenario 7: What does the landing page show while user is authenticated?
    console.log('\n[TEST 7] Visiting "/" while authenticated...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    const url7 = page.url();
    const headerButtons7 = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('header a, header button')).map(el => ({
        text: el.textContent.trim(),
        href: el.getAttribute('href') || el.getAttribute('to')
      }));
    });
    console.log('Landing page header buttons while authenticated:', headerButtons7);
    results.test7_landing_authenticated = { url: url7, headerButtons: headerButtons7 };

    // Scenario 8: Test Settings Page Logout
    console.log('\n[TEST 8] Testing Logout from /settings...');
    // If user is incomplete, /settings will bounce to /onboarding!
    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    const url8 = page.url();
    console.log('URL when visiting /settings:', url8);
    results.test8_settings_url = { url: url8 };

    console.log('\n=== AUDIT RESULTS SUMMARY ===');
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Audit exception:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
