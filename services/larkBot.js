/**
 * LARK BOT 1-ON-1 INTERACTIVE CARD SERVICE & SAFETY WHITELIST
 * Enterprise-grade Interactive Message Cards with 1-Click Callbacks & Whitelist Isolation
 */

const crypto = require('crypto');
const { execFile } = require('child_process');

const LARK_CLI_PATH = '/Users/xpo/Library/Application Support/Antigravity/bin/lark-cli';
const SECRET_KEY = process.env.LARK_BOT_SECRET || 'it_asset_hub_secure_hmac_secret_2026';

// Global Safety Whitelist Configuration
const botConfig = {
  sandboxMode: process.env.BOT_SANDBOX_MODE !== 'false', // Default: TRUE for maximum safety
  whitelist: (process.env.BOT_TEST_WHITELIST || 'ou_454631b08ccd239365dae0b60a0f0aa7,ou_8ea6e249b0ef03ee8ee2b6a58c49e52a,ou_ddbd83ad4f843334774fcde57c094c32,ou_71ae4aeeb5a23ef5345a32d4ff946b53')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  portalBaseUrl: process.env.PORTAL_BASE_URL || 'https://it-asset-portal.shine-toothbrush.workers.dev'
};

/**
 * Generate Secure HMAC Magic Link Token for 1-Click Auto-Login
 */
function generateMagicToken(employeeName, employeeId, expiresInHours = 72) {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payload = `${employeeName}:${employeeId || ''}:${exp}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return {
    token: `${Buffer.from(payload).toString('base64')}.${signature}`,
    exp
  };
}

/**
 * Verify Magic Link Token
 */
function verifyMagicToken(tokenStr) {
  try {
    if (!tokenStr) return { valid: false, reason: 'Missing token' };
    const [b64Payload, signature] = tokenStr.split('.');
    if (!b64Payload || !signature) return { valid: false, reason: 'Malformed token' };

    const payload = Buffer.from(b64Payload, 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');

    if (signature === expectedSig) {
      const [employeeName, employeeId, expStr] = payload.split(':');
      const exp = parseInt(expStr, 10);
      if (Date.now() > exp) {
        return { valid: false, reason: 'Token expired' };
      }
      return { valid: true, employeeName, employeeId, exp };
    }
    return { valid: false, reason: 'Invalid signature' };
  } catch (err) {
    return { valid: false, reason: err.message };
  }
}

/**
 * Generate Magic URL for employee
 */
function getMagicUrl(employeeName, employeeId) {
  const { token } = generateMagicToken(employeeName, employeeId);
  return `${botConfig.portalBaseUrl}/?emp=${encodeURIComponent(employeeName)}&token=${encodeURIComponent(token)}&mode=locked`;
}

/**
 * Card Template 1: 7-Day Freeze Campaign Verification Card with 1-Click Chat Action
 */
function createVerificationCard(employeeName, devices = [], employeeId = '') {
  const magicUrl = getMagicUrl(employeeName, employeeId);
  const recordIds = devices.map(d => d.record_id).filter(Boolean);

  const deviceListMd = devices.length > 0
    ? devices.map(d => {
        const name = d["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset";
        const tag = d["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบเลข";
        const sn = d["Serial Number (S/N)"] || "---";
        const isVerified = (d["Audit Status (สถานะการยืนยัน)"] || "").includes("ยืนยันแล้ว");
        return `• **${name}**\n  - เลขทรัพย์สิน: \`${tag}\` | S/N: \`${sn}\`\n  - สถานะ: ${isVerified ? '✅ ยืนยันแล้ว' : '⏳ **รอการยืนยัน**'}`;
      }).join('\n')
    : '• ไม่พบข้อมูลอุปกรณ์ในระบบ';

  return {
    config: { wide_screen_mode: true },
    header: {
      template: "red",
      title: {
        tag: "plain_text",
        content: "🚨 แจ้งเตือน: แคมเปญยืนยันเครื่อง IT ประจำตัว (7 Days Freeze)"
      }
    },
    elements: [
      {
        tag: "div",
        text: {
          tag: "lark_md",
          content: `สวัสดีครับคุณ **${employeeName}** 👋\n\nขณะนี้บริษัทอยู่ในช่วง **Freeze Period 7 วัน** เพื่อจัดระเบียบฐานข้อมูลทรัพย์สิน IT กลาง ขอความร่วมมือตรวจสอบอุปกรณ์ที่คุณถือครองอยู่ด้านล่างนี้ครับ:`
        }
      },
      {
        tag: "hr"
      },
      {
        tag: "div",
        text: {
          tag: "lark_md",
          content: `📋 **รายการอุปกรณ์ที่คุณถือครอง (${devices.length} รายการ):**\n${deviceListMd}`
        }
      },
      {
        tag: "note",
        elements: [
          {
            tag: "plain_text",
            content: "💡 หากข้อมูลถูกต้อง สามารถกดปุ่ม 'กดยืนยันในแชท' ได้ทันที หรือกดเปิดเว็บหากต้องการแจ้งสลับเครื่อง/ป้ายหาย"
          }
        ]
      },
      {
        tag: "action",
        actions: [
          {
            tag: "button",
            text: {
              tag: "plain_text",
              content: "✅ กดยืนยันทั้งหมดทันที (ในแชท)"
            },
            type: "primary",
            value: {
              action_type: "confirm_all_devices",
              employee_name: employeeName,
              record_ids: recordIds
            }
          },
          {
            tag: "button",
            text: {
              tag: "plain_text",
              content: "🌐 เปิดดูรายละเอียดเต็มบนเว็บ"
            },
            type: "default",
            url: magicUrl
          }
        ]
      }
    ]
  };
}

/**
 * Card Template 2: Temporary Loan Due / Overdue Reminder Card
 */
function createLoanDueCard(borrowerName, assetName, assetTag, returnDate, isOverdue = false, employeeId = '') {
  const magicUrl = getMagicUrl(borrowerName, employeeId);
  const headerTemplate = isOverdue ? "red" : "orange";
  const title = isOverdue ? "🚨 แจ้งเตือน: อุปกรณ์ยืมชั่วคราวเกินกำหนดส่งคืน!" : "⏰ แจ้งเตือน: ครบกำหนดส่งคืนอุปกรณ์ชั่วคราว";

  return {
    config: { wide_screen_mode: true },
    header: {
      template: headerTemplate,
      title: { tag: "plain_text", content: title }
    },
    elements: [
      {
        tag: "div",
        text: {
          tag: "lark_md",
          content: `สวัสดีครับคุณ **${borrowerName}** 👋\n\nอุปกรณ์ที่คุณขอยืมชั่วคราว **${isOverdue ? 'เกินกำหนดส่งคืนแล้ว' : 'กำลังจะครบกำหนดส่งคืน'}** โปรดนำส่งคืนที่โต๊ะเจ้าหน้าที่ IT ครับ:`
        }
      },
      {
        tag: "div",
        fields: [
          { is_short: true, text: { tag: "lark_md", content: `📦 **อุปกรณ์:**\n${assetName}` } },
          { is_short: true, text: { tag: "lark_md", content: `🏷️ **เลขทรัพย์สิน:**\n\`${assetTag || 'ไม่ทราบ'}\`` } },
          { is_short: true, text: { tag: "lark_md", content: `📅 **กำหนดส่งคืน:**\n${returnDate}` } },
          { is_short: true, text: { tag: "lark_md", content: `🚨 **สถานะ:**\n${isOverdue ? '<font color="red">**เกินกำหนดส่งคืน**</font>' : '🟢 กำลังยืม'}` } }
        ]
      },
      {
        tag: "action",
        actions: [
          {
            tag: "button",
            text: { tag: "plain_text", content: "📥 เปิดหน้าระบบเพื่อส่งคืนอุปกรณ์" },
            type: "primary",
            url: `${magicUrl}&tab=loanTab`
          }
        ]
      }
    ]
  };
}

/**
 * Card Template 3: Registration / Loan Receipt Card
 */
function createReceiptCard(employeeName, type = 'register', details = {}) {
  const isReg = type === 'register';
  return {
    config: { wide_screen_mode: true },
    header: {
      template: isReg ? "green" : "blue",
      title: {
        tag: "plain_text",
        content: isReg ? "🎉 ยืนยันการลงทะเบียนอุปกรณ์สำเร็จ" : "📦 ยืนยันการขอยืมอุปกรณ์ชั่วคราวสำเร็จ"
      }
    },
    elements: [
      {
        tag: "div",
        text: {
          tag: "lark_md",
          content: `เรียนคุณ **${employeeName}**,\n\nระบบ IT Asset Hub ได้บันทึกข้อมูลเข้าสู่ฐานข้อมูลกลางเรียบร้อยแล้ว รายละเอียดดังนี้:`
        }
      },
      {
        tag: "div",
        fields: [
          { is_short: true, text: { tag: "lark_md", content: `💻 **อุปกรณ์:**\n${details.deviceName || '-'}` } },
          { is_short: true, text: { tag: "lark_md", content: `🏷️ **เลขทรัพย์สิน:**\n\`${details.assetTag || 'ไม่ทราบ'}\`` } },
          { is_short: true, text: { tag: "lark_md", content: `🏢 **สังกัด:**\n${details.organization || '-'}` } },
          { is_short: true, text: { tag: "lark_md", content: `⏰ **เวลาบันทึก:**\n${new Date().toLocaleTimeString('th-TH')}` } }
        ]
      },
      {
        tag: "action",
        actions: [
          {
            tag: "button",
            text: { tag: "plain_text", content: "🌐 เปิดดูข้อมูลใน IT Asset Hub" },
            type: "default",
            url: botConfig.portalBaseUrl
          }
        ]
      }
    ]
  };
}

/**
 * Check if recipient is allowed under Sandbox Whitelist
 */
function isRecipientAllowed(recipientId, recipientName = '') {
  if (!botConfig.sandboxMode) return true; // Live mode allows everyone

  // Check ID matches
  const matchId = botConfig.whitelist.some(w => recipientId && (w.toLowerCase() === recipientId.toLowerCase() || recipientId.includes(w)));
  // Check Name matches
  const matchName = botConfig.whitelist.some(w => recipientName && recipientName.toLowerCase().includes(w.toLowerCase()));

  return matchId || matchName;
}

/**
 * Send Interactive Card Safely with Whitelist Guard
 */
async function sendCardSafely(recipientId, cardPayload, meta = {}) {
  const { recipientName = '', forceSend = false } = meta;

  // Safety Whitelist Guard Check
  const allowed = forceSend || isRecipientAllowed(recipientId, recipientName);

  if (!allowed) {
    console.log(`[BOT SANDBOX GUARD] 🛑 Blocked card to "${recipientName}" (${recipientId}). Not in whitelist: [${botConfig.whitelist.join(', ')}]`);
    return {
      success: true,
      dryRun: true,
      recipientId,
      recipientName,
      message: `[Sandbox Dry-Run] บอทจำลองการส่งหา ${recipientName || recipientId} สำเร็จ (ไม่ส่งจริงเพื่อความปลอดภัยตามนโยบาย Whitelist)`
    };
  }

  console.log(`[BOT SENDER] 🚀 Sending interactive card to "${recipientName}" (${recipientId})...`);

  // Call Lark CLI to send interactive card via user or app
  return new Promise((resolve) => {
    const cardJsonStr = JSON.stringify(cardPayload);
    const args = [
      'im', '+messages-send',
      '--user-id', recipientId,
      '--msg-type', 'interactive',
      '--content', cardJsonStr,
      '--as', 'user'
    ];

    execFile(
      LARK_CLI_PATH,
      args,
      { env: { ...process.env, LARK_CLI_NO_PROXY: '1', HOME: '/Users/xpo' }, timeout: 15000 },
      (err, stdout, stderr) => {
        if (err) {
          console.error(`[BOT ERROR] Failed to send card to ${recipientId}:`, stderr || err.message);
          resolve({
            success: false,
            dryRun: false,
            recipientId,
            error: err.message,
            rawError: stderr
          });
        } else {
          try {
            const data = JSON.parse(stdout);
            console.log(`[BOT SUCCESS] Card delivered to ${recipientId}:`, data.data?.message_id || 'OK');
            resolve({
              success: true,
              dryRun: false,
              recipientId,
              messageId: data.data?.message_id,
              raw: data
            });
          } catch (pe) {
            resolve({
              success: true,
              dryRun: false,
              recipientId,
              output: stdout
            });
          }
        }
      }
    );
  });
}

module.exports = {
  botConfig,
  generateMagicToken,
  verifyMagicToken,
  getMagicUrl,
  createVerificationCard,
  createLoanDueCard,
  createReceiptCard,
  isRecipientAllowed,
  sendCardSafely
};
