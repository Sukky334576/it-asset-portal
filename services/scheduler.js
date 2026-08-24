/**
 * AUTOMATED CRON SCHEDULER & NOTIFICATION DISPATCHER
 * Manages daily 09:00 AM Cron Jobs, Overdue Loan reminders, and Manual Admin Batches
 */

const cron = require('node-cron');
const {
  botConfig,
  createVerificationCard,
  createLoanDueCard,
  sendCardSafely
} = require('./larkBot');

let schedulerRunning = false;

/**
 * Run verification reminders for unconfirmed employees
 */
async function runFreezeReminders(employees = []) {
  console.log(`[SCHEDULER] 🔍 Running Freeze Verification Reminders for ${employees.length} employees...`);
  const pendingEmployees = employees.filter(e => !e.allVerified && e.devices && e.devices.length > 0);

  const results = [];
  for (const emp of pendingEmployees) {
    const unverifiedDevices = emp.devices.filter(d => !(d["Audit Status (สถานะการยืนยัน)"] || "").includes("ยืนยันแล้ว"));
    if (unverifiedDevices.length === 0) continue;

    const openId = emp.id; // User's Lark Open ID (ou_...)
    if (!openId) {
      console.log(`[SCHEDULER SKIP] No Lark Open ID found for ${emp.name}`);
      continue;
    }

    const card = createVerificationCard(emp.name, unverifiedDevices, openId);
    const res = await sendCardSafely(openId, card, { recipientName: emp.name });
    results.push({ employeeName: emp.name, openId, deviceCount: unverifiedDevices.length, ...res });
  }

  return {
    totalPending: pendingEmployees.length,
    processed: results.length,
    results
  };
}

/**
 * Run due/overdue loan reminders
 */
async function runLoanDueAlerts(activeLoans = []) {
  console.log(`[SCHEDULER] 🔍 Checking ${activeLoans.length} active loans for due/overdue alerts...`);
  const todayStr = new Date().toISOString().split('T')[0];
  const results = [];

  for (const loan of activeLoans) {
    const notes = loan["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "";
    const matchDate = notes.match(/กำหนดคืน\s*(\d{4}-\d{2}-\d{2})/);
    if (!matchDate) continue;

    const expDate = matchDate[1];
    const isDueSoon = expDate === todayStr;
    const isOverdue = expDate < todayStr;

    if (isDueSoon || isOverdue) {
      const holder = loan["Current Holder (ผู้ถือครองปัจจุบัน)"];
      let holderId = null;
      let holderName = loan["Borrower Name"] || "ผู้ยืม";

      if (Array.isArray(holder) && holder[0]) {
        holderId = holder[0].id;
        holderName = holder[0].name || holderName;
      }

      if (holderId) {
        const assetName = loan["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset";
        const assetTag = loan["Asset Tag (เลขทรัพย์สิน)"] || "";

        const card = createLoanDueCard(holderName, assetName, assetTag, expDate, isOverdue, holderId);
        const res = await sendCardSafely(holderId, card, { recipientName: holderName });
        results.push({ borrowerName: holderName, openId: holderId, assetName, isOverdue, ...res });
      }
    }
  }

  return {
    totalChecked: activeLoans.length,
    alertsSent: results.length,
    results
  };
}

/**
 * Initialize Background Cron Schedule (09:00 AM Monday - Friday)
 */
function initScheduler(getDataCallbacks) {
  if (schedulerRunning) return;

  console.log('[SCHEDULER] ⏰ Initializing Automated Daily Cron Job (09:00 AM Mon-Fri)...');

  cron.schedule('0 9 * * 1-5', async () => {
    console.log('[CRON TRIGGER] 🔔 09:00 AM Workday Schedule Triggered!');
    try {
      if (getDataCallbacks.getEmployees && getDataCallbacks.getActiveLoans) {
        const [employees, loans] = await Promise.all([
          getDataCallbacks.getEmployees(),
          getDataCallbacks.getActiveLoans()
        ]);
        await runFreezeReminders(employees);
        await runLoanDueAlerts(loans);
      }
    } catch (cronErr) {
      console.error('[CRON ERROR] Failed during scheduled notification run:', cronErr);
    }
  });

  schedulerRunning = true;
}

module.exports = {
  initScheduler,
  runFreezeReminders,
  runLoanDueAlerts
};
