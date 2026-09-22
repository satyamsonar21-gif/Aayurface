const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function testAccountIsolation() {
  console.log('Testing Account A vs Account B Client Storage & Profile Isolation...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const BASE = 'http://localhost:5173';
  try {
    const page = await browser.newPage();

    // Account A setup
    const tsA = Date.now();
    const emailA = `account_a_${tsA}@aayurface.local`;
    const nameA = 'Vaishali Sharma';

    await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    await page.type('#register-email', emailA);
    await page.type('#register-password', 'Pass@123456!');
    await page.type('#register-confirmPassword', 'Pass@123456!');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    await new Promise(r => setTimeout(r, 1000));

    // Complete onboarding for A
    const beginBtnA = await page.waitForSelector('button ::-p-text(Begin Intake)', { timeout: 5000 });
    await beginBtnA.click();
    await new Promise(r => setTimeout(r, 500));
    await page.type('#onboarding-fullname', nameA);

    // Continue to end of onboarding
    await (await page.waitForSelector('button ::-p-text(Continue)')).click(); // Step 2 -> 3
    await new Promise(r => setTimeout(r, 500));
    await (await page.waitForSelector('button ::-p-text(Continue)')).click(); // Step 3 -> 4
    await new Promise(r => setTimeout(r, 500));
    await (await page.waitForSelector('button ::-p-text(Continue)')).click(); // Step 4 -> 5
    await new Promise(r => setTimeout(r, 500));
    await (await page.waitForSelector('button ::-p-text(Review & Confirm)')).click(); // Step 5 -> 6
    await new Promise(r => setTimeout(r, 500));
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      (await page.waitForSelector('button ::-p-text(Complete Setup & Enter)')).click()
    ]);
    await new Promise(r => setTimeout(r, 1500));

    // Get User A ID from auth token
    const userAInfo = await page.evaluate(() => {
      for (const k of Object.keys(localStorage)) {
        if (k.includes('auth-token')) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            return { id: parsed.user?.id, email: parsed.user?.email };
          } catch {}
        }
      }
      return null;
    });

    console.log('Account A established:', userAInfo?.id);

    // Save mock remedy under User A key
    await page.evaluate((uid) => {
      localStorage.setItem(`aayurface_saved_remedies_${uid}`, JSON.stringify(['remedy-kumkumadi-tailam']));
      localStorage.setItem(`aayurface_notification_settings_${uid}`, JSON.stringify({ emailDigest: true, routineReminders: true }));
    }, userAInfo.id);

    // Sign out User A
    const signOutA = await page.waitForSelector('button ::-p-text(Sign Out)');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}),
      signOutA.click()
    ]);
    await new Promise(r => setTimeout(r, 1000));

    // Register Account B
    const tsB = Date.now() + 1;
    const emailB = `account_b_${tsB}@aayurface.local`;
    const nameB = 'Gaurav Malhotra';

    await page.goto(BASE + '/register', { waitUntil: 'networkidle0' });
    await page.type('#register-email', emailB);
    await page.type('#register-password', 'Pass@123456!');
    await page.type('#register-confirmPassword', 'Pass@123456!');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 15000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    await new Promise(r => setTimeout(r, 1000));

    // Get User B ID
    const userBInfo = await page.evaluate(() => {
      for (const k of Object.keys(localStorage)) {
        if (k.includes('auth-token')) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            return { id: parsed.user?.id, email: parsed.user?.email };
          } catch {}
        }
      }
      return null;
    });

    console.log('Account B established:', userBInfo?.id);

    // Check Account B storage isolation
    const bStorageCheck = await page.evaluate((uidB, uidA) => {
      return {
        bSavedRemedies: localStorage.getItem(`aayurface_saved_remedies_${uidB}`),
        bNotifications: localStorage.getItem(`aayurface_notification_settings_${uidB}`),
        aRemediesStillExistForA: localStorage.getItem(`aayurface_saved_remedies_${uidA}`) !== null,
      };
    }, userBInfo.id, userAInfo.id);

    console.log('Storage Isolation Verification:', bStorageCheck);

    const isIsolated = bStorageCheck.bSavedRemedies === null && bStorageCheck.bNotifications === null;
    console.log(`Account A / Account B Client-Storage Isolation: ${isIsolated ? 'VERIFIED' : 'FAILED'}`);

    await browser.close();
  } catch (err) {
    console.error('Account isolation error:', err);
    await browser.close();
  }
}

testAccountIsolation();
