const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/xpo/.gemini/antigravity/brain/d9c4c60d-21b9-4eb0-a2f5-2b1f424587b0';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const delay = ms => new Promise(r => setTimeout(r, ms));

async function capture() {
  console.log("Launching headless browser to capture manual screenshots...");
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,880'],
    defaultViewport: { width: 1280, height: 880 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await delay(1500);

  // 1. Employee Search & Autocomplete
  console.log("Capturing 01_employee_search.png...");
  await page.type('#employeeSearchInput', 'Tong');
  await delay(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_employee_search.png') });

  // 2. Select Employee & View Device Cards
  console.log("Capturing 02_employee_devices.png...");
  const item = await page.$('.autocomplete-item');
  if (item) await item.click();
  await delay(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_employee_devices.png') });

  // 3. Open Edit / Dispute Modal
  console.log("Capturing 03_edit_modal.png...");
  const editBtn = await page.$('.btn-action-edit');
  if (editBtn) {
    await editBtn.click();
    await delay(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_edit_modal.png') });
    await page.click('#modalCloseBtn');
    await delay(300);
  }

  // 4. Tab 2: New Registration & Duplicate Alert
  console.log("Capturing 04_new_reg_duplicate_warning.png...");
  await page.click('[data-tab="registerTab"]');
  await delay(400);
  await page.type('#regEmployeeName', 'Ploy.Manas');
  await page.type('#regDeviceName', 'ThinkPad X280');
  await page.type('#regAssetTag', 'COM-00047');
  await delay(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_new_reg_duplicate_warning.png') });

  // 5. Tab 3: Temporary Loan - Stock Catalog
  console.log("Capturing 05_temp_loan_stock.png...");
  await page.click('[data-tab="loanTab"]');
  await delay(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_temp_loan_stock.png') });

  // 6. Tab 3: Borrow Request Form with Duration Presets
  console.log("Capturing 06_temp_loan_form.png...");
  await page.click('[data-subtab="subBorrowForm"]');
  await delay(400);
  await page.type('#loanBorrowerName', 'Tong.Thaksin');
  await page.type('#loanPurpose', 'ประชุมนำเสนองานลูกค้าและทดสอบระบบ');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_temp_loan_form.png') });

  // 7. Tab 3: Active Loans & Quick Return
  console.log("Capturing 07_temp_loan_active_return.png...");
  await page.click('[data-subtab="subMyLoans"]');
  await delay(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_temp_loan_active_return.png') });

  // 8. Tab 4: Admin Lock Screen
  console.log("Capturing 08_admin_login.png...");
  await page.click('[data-tab="adminTab"]');
  await delay(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_admin_login.png') });

  // 9. Tab 4: Admin Dashboard Overview
  console.log("Capturing 09_admin_dashboard.png...");
  await page.type('#adminPasswordInput', 'itadmin2026');
  await page.click('#btnAdminLogin');
  await delay(1200);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_admin_dashboard.png') });

  await browser.close();
  console.log("All screenshots captured successfully!");
}

capture().catch(err => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
