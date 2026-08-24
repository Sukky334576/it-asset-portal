/**
 * LARK INTERACTIVE CARD ACTION WEBHOOK HANDLER
 * Handles 1-Click Card Callbacks from Lark Chat and real-time Base updates
 */

const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');

const LARK_CLI_PATH = '/Users/xpo/Library/Application Support/Antigravity/bin/lark-cli';
const BASE_TOKEN = 'G2IgbTgmmaLnQPs3LPblGz0ngQf';
const MASTER_TABLE_ID = 'tblA1JXS2dWC9a5b';
const AUDIT_TABLE_ID = 'tblzKjtJuoAifQKS';

/**
 * Execute Lark CLI Command helper
 */
function runLarkCli(args) {
  return new Promise((resolve, reject) => {
    execFile(
      LARK_CLI_PATH,
      args,
      { env: { ...process.env, LARK_CLI_NO_PROXY: '1', HOME: '/Users/xpo' }, timeout: 15000 },
      (error, stdout, stderr) => {
        if (error) reject(new Error(stderr || error.message));
        else {
          try { resolve(JSON.parse(stdout)); }
          catch (e) { resolve(stdout); }
        }
      }
    );
  });
}

/**
 * POST /api/lark/card-action
 * Main webhook endpoint for Lark Card Action buttons
 */
router.post('/card-action', async (req, res) => {
  try {
    const body = req.body || {};

    // 1. Handle Lark URL Verification Challenge
    if (body.challenge) {
      return res.json({ challenge: body.challenge });
    }

    console.log('[LARK WEBHOOK] Received Card Action Event:', JSON.stringify(body, null, 2));

    const action = body.action || body.open_action || {};
    const actionValue = action.value || {};
    const actionType = actionValue.action_type || body.action_type;
    const employeeName = actionValue.employee_name || body.employee_name || 'พนักงาน';
    const recordIds = actionValue.record_ids || [];

    // 2. Action: 1-Click Confirm All Devices from Lark Chat
    if (actionType === 'confirm_all_devices') {
      const nowStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

      console.log(`[LARK WEBHOOK] 1-Click Confirming ${recordIds.length} devices for ${employeeName}...`);

      // Update each device in Lark Base Master & Audit tables
      for (const recId of recordIds) {
        try {
          // Update Master Table
          await runLarkCli([
            'base', '+record-batch-update',
            '--base-token', BASE_TOKEN,
            '--table-id', MASTER_TABLE_ID,
            '--as', 'user',
            '--json', JSON.stringify({
              record_id_list: [recId],
              patch: {
                "Audit Status (สถานะการยืนยัน)": "🟢 ยืนยันแล้ว (Verified)",
                "Audit Date (วันที่ตรวจสอบ)": nowStr
              }
            })
          ]);

          // Insert Audit Log Entry
          await runLarkCli([
            'base', '+record-batch-create',
            '--base-token', BASE_TOKEN,
            '--table-id', AUDIT_TABLE_ID,
            '--as', 'user',
            '--json', JSON.stringify({
              records: [{
                fields: {
                  "Verification Timestamp (เวลาที่กดยืนยัน)": new Date().toISOString(),
                  "Audit Status (สถานะ)": "✅ ยืนยันถูกต้องแล้ว (Verified)",
                  "Holder Name (ผู้กดยืนยัน)": employeeName,
                  "Notes / Discrepancy (หมายเหตุ)": `ยืนยันความถูกต้องผ่าน 1-Click Lark Bot Card เมื่อ ${nowStr} ${timeStr}`,
                  "Action Channel (ช่องทาง)": "Lark Bot 1-Click Action"
                }
              }]
            })
          ]);
        } catch (updateErr) {
          console.error(`[LARK WEBHOOK ERROR] Error updating record ${recId}:`, updateErr.message);
        }
      }

      // 3. Return Instant Updated Card Response to Lark Chat
      return res.json({
        toast: {
          type: "success",
          content: "✅ บันทึกยืนยันอุปกรณ์ทั้งหมดเข้าสู่ระบบเรียบร้อยแล้ว!"
        },
        card: {
          config: { wide_screen_mode: true },
          header: {
            template: "green",
            title: {
              tag: "plain_text",
              content: "✅ ยืนยันอุปกรณ์ IT ประจำตัวสำเร็จเรียบร้อยแล้ว"
            }
          },
          elements: [
            {
              tag: "div",
              text: {
                tag: "lark_md",
                content: `คุณ **${employeeName}** ได้กดยืนยันความถูกต้องของอุปกรณ์ IT ทั้งหมด **(${recordIds.length} รายการ)** เรียบร้อยแล้ว\n\n⏰ **เวลาที่ยืนยัน:** ${nowStr} เวลา ${timeStr} น.\n📡 **สถานะ:** บันทึกลง Lark Base Master ครบถ้วน\n\n*ขอบคุณสำหรับความร่วมมือในการจัดระเบียบข้อมูลทรัพย์สิน IT ครับ!* 🙏`
              }
            },
            {
              tag: "action",
              actions: [
                {
                  tag: "button",
                  text: { tag: "plain_text", content: "🌐 เปิดดูทะเบียนทรัพย์สินใน IT Asset Hub" },
                  type: "default",
                  url: process.env.PORTAL_BASE_URL || "http://localhost:3000"
                }
              ]
            }
          ]
        }
      });
    }

    // Default Fallback
    return res.json({
      toast: { type: "info", content: "รับคำสั่งเรียบร้อยแล้ว" }
    });

  } catch (err) {
    console.error('[LARK WEBHOOK FATAL ERROR]:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
