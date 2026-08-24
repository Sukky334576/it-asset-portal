/**
 * Cloudflare Worker for IT Asset Management Hub
 * Full-featured Serverless API Backend with Lark Open Platform Direct REST API
 */

const LarkDirectApi = require("./services/larkDirectApi");
const { generateSignedToken, verifySignedToken, sanitizeString } = require("./middleware/security");

const TABLE_MASTER = "tblA1JXS2dWC9a5b";
const TABLE_AUDIT = "tblzKjtJuoAifQKS";
const TABLE_LOAN = "tblwL0cJzvv1qsj3";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function getSingleValue(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val[0] ? (val[0].text || val[0].name || String(val[0])) : "";
  if (typeof val === "object" && val !== null) return val.text || val.name || "";
  return String(val);
}

function getHolderName(holder) {
  if (!holder) return "";
  if (Array.isArray(holder) && holder[0]) return holder[0].name || holder[0].id || "";
  if (typeof holder === "object" && holder !== null && holder.name) return holder.name;
  return String(holder);
}

function requireAdmin(request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const verified = verifySignedToken(token);
  if (!verified || !verified.valid || verified.payload?.role !== "ADMIN") {
    return false;
  }
  return verified.payload;
}

function requireLifecycle(request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const verified = verifySignedToken(token);
  if (!verified || !verified.valid || !verified.payload?.role) {
    return false;
  }
  return verified.payload;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    // 1. CORS Preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    const appSecret = env.LARK_APP_SECRET || "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5";
    const lark = new LarkDirectApi(env.LARK_APP_ID, appSecret, env.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf");

    try {
      // ---------------- CORE ASSET & ROSTER ENDPOINTS ---------------- //

      if (pathname === "/api/assets" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }

      if (pathname === "/api/employees" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        let resignedNames = [];
        if (env.IT_ASSET_KV) {
          const resJson = await env.IT_ASSET_KV.get("resigned_staff");
          if (resJson) resignedNames = JSON.parse(resJson);
        }

        const employeeMap = {};
        records.forEach(a => {
          const holder = a["Current Holder (ผู้ถือครองปัจจุบัน)"];
          let empName = "ส่วนกลาง (Unassigned / Central Stock)";
          let openId = "";
          let email = "";
          let org = getSingleValue(a["Organization (สังกัด)"]) || "XPO";

          if (Array.isArray(holder) && holder.length > 0 && holder[0]) {
            openId = holder[0].id || "";
            email = holder[0].email || "";
            empName = holder[0].en_name || holder[0].name || holder[0].id || "ส่วนกลาง (Unassigned / Central Stock)";
          } else if (holder && typeof holder === "object") {
            openId = holder.id || "";
            email = holder.email || "";
            empName = holder.en_name || holder.name || holder.id || "ส่วนกลาง (Unassigned / Central Stock)";
          }

          if (openId === "ou_b1756acc400b9e0d575cbe53ff5480dc" || empName.toLowerCase().includes("teeraphat")) {
            empName = "Tle.Teeraphat";
          }

          if (!employeeMap[empName]) {
            const isResigned = empName.includes("(ลาออก)") || empName.includes("Closed") || resignedNames.includes(empName);
            employeeMap[empName] = {
              id: openId,
              name: empName,
              email: email,
              organization: org,
              isResigned: isResigned,
              accountStatus: isResigned ? "CLOSED" : "ACTIVE",
              devices: [],
              allVerified: true,
              pendingCount: 0,
              verifiedCount: 0
            };
          }
          employeeMap[empName].devices.push(a);

          const auditStatus = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
          const isVerified = auditStatus && auditStatus.includes("ยืนยันแล้ว");
          if (isVerified) {
            employeeMap[empName].verifiedCount++;
          } else {
            employeeMap[empName].pendingCount++;
            employeeMap[empName].allVerified = false;
          }
        });

        const list = Object.values(employeeMap).sort((a, b) => a.name.localeCompare(b.name));
        return jsonResponse({ ok: true, count: list.length, data: list });
      }

      // Verify Asset Device
      if (pathname === "/api/verify" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { record_id, status, notes, photoUrl, assetTag, serialNumber } = body;
        if (!record_id) return jsonResponse({ ok: false, message: "record_id is required" }, 400);

        const patch = {
          "Audit Status (สถานะการยืนยัน)": status || "🟢 ยืนยันแล้ว (Verified)"
        };
        if (notes) patch["Specs / Notes (รายละเอียด/หมายเหตุ)"] = sanitizeString(notes, 500);
        if (assetTag) patch["Asset Tag (เลขทรัพย์สิน)"] = sanitizeString(assetTag, 50);
        if (serialNumber) patch["Serial Number (S/N)"] = sanitizeString(serialNumber, 50);

        await lark.updateRecord(TABLE_MASTER, record_id, patch);

        // Audit Log Entry
        await lark.createRecord(TABLE_AUDIT, {
          "Brand & Model (ยี่ห้อและรุ่น)": `Verified: ${record_id}`,
          "IT Review Status (ผลการตรวจสอบโดย IT)": status || "🟢 Verified & Locked (อนุมัติเข้า Master)",
          "Notes (หมายเหตุจากพนักงาน)": sanitizeString(notes, 500)
        }).catch(() => null);

        return jsonResponse({ ok: true, message: "บันทึกผลการยืนยันข้อมูลเรียบร้อยแล้ว!" });
      }

      // Register New Asset
      if (pathname === "/api/register" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { brand, deviceName, deviceType, organization, serialNumber, assetTag, missingTag, holderName, notes } = body;

        const newRec = {
          "Brand (ยี่ห้อ)": brand || "Other",
          "Device Name (ชื่อรุ่น/อุปกรณ์)": deviceName || "IT Asset",
          "Device Type (ประเภทอุปกรณ์)": deviceType || "Laptop (NB)",
          "Organization (สังกัด)": organization || "XPO",
          "Serial Number (S/N)": serialNumber || "-",
          "Asset Tag (เลขทรัพย์สิน)": missingTag ? "ไม่ทราบ" : (assetTag || "ไม่ทราบ"),
          "Missing Tag? (ไม่มีเลขทรัพย์สิน)": Boolean(missingTag),
          "Status (สถานะอุปกรณ์)": "🟢 ใช้งานประจำตัว (In Use)",
          "Audit Status (สถานะการยืนยัน)": missingTag ? "🏷️ ต้องติดป้ายเลขทรัพย์สินใหม่ (Missing Tag)" : "🟢 ยืนยันแล้ว (Verified)",
          "Specs / Notes (รายละเอียด/หมายเหตุ)": sanitizeString(notes, 500)
        };

        if (holderName) {
          newRec["Current Holder (ผู้ถือครองปัจจุบัน)"] = [{ name: holderName }];
        }

        await lark.createRecord(TABLE_MASTER, newRec);
        return jsonResponse({ ok: true, message: "ลงทะเบียนอุปกรณ์ใหม่เข้าระบบเรียบร้อยแล้ว!" });
      }

      // ---------------- TEMPORARY LOANS ---------------- //

      if (pathname === "/api/loans" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_LOAN);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }

      if (pathname === "/api/loans/borrow" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { borrowerName, organization, assetRecordId, startDate, expectedReturnDate, purpose, accessories } = body;

        await lark.createRecord(TABLE_LOAN, {
          "Action Type (ประเภทรายการ)": "ยืมอุปกรณ์ (Borrow)",
          "Borrower (ผู้ขอยืม/ผู้คืน)": [{ name: borrowerName }],
          "Organization (สังกัด)": organization || "XPO",
          "Linked Asset (อุปกรณ์ที่ยืม)": assetRecordId ? [assetRecordId] : [],
          "Borrow Date (วันที่เริ่มยืม)": startDate || new Date().toISOString().split("T")[0],
          "Expected Return Date (กำหนดส่งคืน)": expectedReturnDate,
          "Purpose (วัตถุประสงค์การยืม)": purpose || "ใช้งานชั่วคราว",
          "Accessories Included (อุปกรณ์ส่วนควบ)": accessories || "สายชาร์จ/อุปกรณ์ครบ",
          "Loan Status (สถานะการยืม-คืน)": "🟡 On Loan (กำลังยืม)"
        });

        if (assetRecordId) {
          await lark.updateRecord(TABLE_MASTER, assetRecordId, {
            "Status (สถานะอุปกรณ์)": "🟡 ยืมใช้งานชั่วคราว (On Loan)",
            "Current Holder (ผู้ถือครองปัจจุบัน)": [{ name: borrowerName }]
          }).catch(() => null);
        }

        return jsonResponse({ ok: true, message: "บันทึกการยืมอุปกรณ์เรียบร้อยแล้ว!" });
      }

      if (pathname === "/api/loans/return" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { loanRecordId, assetRecordId, returnCondition, returnNotes } = body;

        if (loanRecordId) {
          await lark.updateRecord(TABLE_LOAN, loanRecordId, {
            "Actual Return Date (วันที่ส่งคืนจริง)": new Date().toISOString().split("T")[0],
            "Loan Status (สถานะการยืม-คืน)": "🔵 Returned - Complete (คืนเรียบร้อย สมบูรณ์)",
            "Notes (หมายเหตุ)": sanitizeString(returnNotes, 500)
          }).catch(() => null);
        }

        if (assetRecordId) {
          await lark.updateRecord(TABLE_MASTER, assetRecordId, {
            "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
            "Current Holder (ผู้ถือครองปัจจุบัน)": null,
            "Specs / Notes (รายละเอียด/หมายเหตุ)": `คืนเข้าคลัง: ${sanitizeString(returnNotes || returnCondition || "คืนเรียบร้อย", 200)}`
          }).catch(() => null);
        }

        return jsonResponse({ ok: true, message: "รับคืนอุปกรณ์เข้าคลังเรียบร้อยแล้ว!" });
      }

      // User Search
      if (pathname === "/api/users/search" && method === "GET") {
        const q = url.searchParams.get("q") || "";
        const users = await lark.searchUsers(q);
        return jsonResponse({ ok: true, data: users });
      }

      // ---------------- ADMIN ENDPOINTS ---------------- //

      if (pathname === "/api/admin/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const adminPass = env.ADMIN_PASSWORD || "itadmin2026";
        if (body.password && body.password.trim() === adminPass) {
          const token = generateSignedToken({ role: "ADMIN", user: "IT Admin" }, 24);
          return jsonResponse({ ok: true, token, message: "เข้าสู่ระบบแอดมินสำเร็จ" });
        }
        return jsonResponse({ ok: false, message: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" }, 401);
      }

      if (pathname === "/api/admin/stats" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED", message: "สิทธิ์ไม่ถูกต้อง" }, 401);

        const assets = await lark.fetchRecords(TABLE_MASTER);
        let verifiedCount = 0;
        let pendingCount = 0;
        let missingTagCount = 0;
        let disputeCount = 0;
        let onLoanCount = 0;
        let availableCount = 0;
        let orgStats = { XPO: { total: 0, verified: 0 }, EDDU: { total: 0, verified: 0 }, Other: { total: 0, verified: 0 } };
        let unconfirmed = new Set();
        let missingTagList = [];
        let disputedList = [];

        assets.forEach(a => {
          const status = getSingleValue(a["Status (สถานะอุปกรณ์)"]);
          const auditStatus = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
          const org = getSingleValue(a["Organization (สังกัด)"]) || "Other";
          const orgKey = org.includes("XPO") ? "XPO" : (org.includes("EDDU") ? "EDDU" : "Other");
          orgStats[orgKey].total++;

          const holder = getHolderName(a["Current Holder (ผู้ถือครองปัจจุบัน)"]);

          if (auditStatus.includes("ยืนยันแล้ว")) {
            verifiedCount++;
            orgStats[orgKey].verified++;
          } else if (auditStatus.includes("ขัดแย้ง") || auditStatus.includes("Disputed")) {
            disputeCount++;
            disputedList.push(a);
          } else {
            pendingCount++;
            if (holder && !holder.includes("ส่วนกลาง")) unconfirmed.add(holder);
          }

          if (status.includes("ยืม") || status.includes("On Loan")) onLoanCount++;
          else if (status.includes("พร้อมใช้งาน") || status.includes("Available")) availableCount++;

          const missingTag = a["Missing Tag? (ไม่มีเลขทรัพย์สิน)"] || (a["Asset Tag (เลขทรัพย์สิน)"] === "ไม่ทราบ");
          if (missingTag) {
            missingTagCount++;
            missingTagList.push(a);
          }
        });

        return jsonResponse({
          ok: true,
          totalAssets: assets.length,
          verifiedCount,
          pendingCount,
          missingTagCount,
          disputeCount,
          onLoanCount,
          availableCount,
          overallPercent: assets.length > 0 ? Math.round((verifiedCount / assets.length) * 100) : 0,
          xpoPercent: orgStats.XPO.total > 0 ? Math.round((orgStats.XPO.verified / orgStats.XPO.total) * 100) : 0,
          edduPercent: orgStats.EDDU.total > 0 ? Math.round((orgStats.EDDU.verified / orgStats.EDDU.total) * 100) : 0,
          orgStats,
          unconfirmedEmployees: Array.from(unconfirmed),
          missingTagList: missingTagList.slice(0, 50),
          disputedList,
          botSandboxMode: true,
          botWhitelist: ["ou_454631b08ccd239365dae0b60a0f0aa7", "ou_8ea6e249b0ef03ee8ee2b6a58c49e52a", "ou_ddbd83ad4f843334774fcde57c094c32", "ou_71ae4aeeb5a23ef5345a32d4ff946b53"]
        });
      }

      // Duplicates Management
      if (pathname === "/api/admin/duplicates" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const assets = await lark.fetchRecords(TABLE_MASTER);

        const reportedDuplicates = assets.filter(a => {
          const auditStatus = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
          const notes = a["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "";
          return auditStatus.includes("Disputed") || auditStatus.includes("แจ้งซ้ำ") || notes.includes("DUPLICATE_ENTRY");
        });

        const snGroups = {};
        assets.forEach(a => {
          const sn = (a["Serial Number (S/N)"] || "").trim();
          if (sn && sn !== "---" && sn.toLowerCase() !== "none" && sn !== "-" && sn.length >= 4) {
            if (!snGroups[sn]) snGroups[sn] = [];
            snGroups[sn].push(a);
          }
        });

        const duplicateSnGroups = Object.keys(snGroups)
          .filter(sn => snGroups[sn].length > 1)
          .map(sn => ({ sn, count: snGroups[sn].length, items: snGroups[sn] }));

        return jsonResponse({
          ok: true,
          reportedCount: reportedDuplicates.length,
          reportedList: reportedDuplicates,
          detectedSnGroupCount: duplicateSnGroups.length,
          detectedSnGroups: duplicateSnGroups
        });
      }

      if (pathname === "/api/admin/duplicates/batch-delete" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { recordIds } = await request.json().catch(() => ({}));
        if (!recordIds || !Array.isArray(recordIds) || recordIds.length === 0) {
          return jsonResponse({ ok: false, message: "recordIds required" }, 400);
        }
        await lark.batchDeleteRecords(TABLE_MASTER, recordIds);
        return jsonResponse({ ok: true, message: `ลบข้อมูลซ้ำสำเร็จ ${recordIds.length} รายการ!` });
      }

      // Resigned Staff Management
      if (pathname === "/api/admin/resigned" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const assets = await lark.fetchRecords(TABLE_MASTER);
        let resignedNames = [];
        if (env.IT_ASSET_KV) {
          const kvData = await env.IT_ASSET_KV.get("resigned_staff");
          if (kvData) resignedNames = JSON.parse(kvData);
        }

        const employeeMap = {};
        assets.forEach(a => {
          const holder = getHolderName(a["Current Holder (ผู้ถือครองปัจจุบัน)"]);
          if (!holder || holder.includes("ส่วนกลาง")) return;
          if (!employeeMap[holder]) {
            employeeMap[holder] = {
              name: holder,
              organization: getSingleValue(a["Organization (สังกัด)"]) || "XPO",
              isResigned: holder.includes("(ลาออก)") || holder.includes("Closed") || resignedNames.includes(holder),
              devices: []
            };
          }
          employeeMap[holder].devices.push(a);
        });

        const resignedList = Object.values(employeeMap).filter(e => e.isResigned);
        const totalDevices = resignedList.reduce((acc, curr) => acc + curr.devices.length, 0);

        return jsonResponse({
          ok: true,
          resignedCount: resignedList.length,
          totalDevicesCount: totalDevices,
          resignedEmployees: resignedList
        });
      }

      if (pathname === "/api/admin/resigned/mark" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName } = await request.json().catch(() => ({}));
        if (!employeeName) return jsonResponse({ ok: false, message: "employeeName required" }, 400);

        let list = [];
        if (env.IT_ASSET_KV) {
          const raw = await env.IT_ASSET_KV.get("resigned_staff");
          if (raw) list = JSON.parse(raw);
          if (!list.includes(employeeName)) list.push(employeeName);
          await env.IT_ASSET_KV.put("resigned_staff", JSON.stringify(list));
        }

        return jsonResponse({ ok: true, message: `ระบุ ${employeeName} เป็นพนักงานลาออกเรียบร้อยแล้ว` });
      }

      if (pathname === "/api/admin/resigned/reclaim" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName, recordIds } = await request.json().catch(() => ({}));
        const assets = await lark.fetchRecords(TABLE_MASTER);

        let targets = recordIds;
        if (!targets || targets.length === 0) {
          const empAssets = assets.filter(a => {
            const h = getHolderName(a["Current Holder (ผู้ถือครองปัจจุบัน)"]);
            return h.toLowerCase() === (employeeName || "").toLowerCase();
          });
          targets = empAssets.map(a => a.record_id);
        }

        for (const recId of targets) {
          await lark.updateRecord(TABLE_MASTER, recId, {
            "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
            "Current Holder (ผู้ถือครองปัจจุบัน)": null,
            "Audit Status (สถานะการยืนยัน)": "🟢 รับคืนเข้าคลังกลาง (Returned to Stock)",
            "Specs / Notes (รายละเอียด/หมายเหตุ)": `รับคืนจากคนลาออก (${employeeName || "Resigned"}) เข้าคลังเมื่อ: ${new Date().toISOString().split("T")[0]}`
          }).catch(() => null);
        }

        return jsonResponse({ ok: true, message: `ดึงอุปกรณ์ของ ${employeeName} ทั้งหมด ${targets.length} รายการเข้าคลังเรียบร้อย!` });
      }

      // Audit Logs
      if (pathname === "/api/admin/audit-logs" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const logs = await lark.fetchRecords(TABLE_AUDIT);
        const formatted = logs.map(rec => ({
          record_id: rec.record_id,
          brandModel: rec["Brand & Model (ยี่ห้อและรุ่น)"] || "-",
          status: getSingleValue(rec["IT Review Status (ผลการตรวจสอบโดย IT)"]) || "-",
          org: getSingleValue(rec["Organization (สังกัด)"]) || "-",
          deviceType: getSingleValue(rec["Device Type (ประเภทอุปกรณ์)"]) || "-",
          assetTag: rec["Asset Tag (เลขทรัพย์สินบนเครื่อง)"] || "-",
          serialNumber: rec["Serial Number (S/N บนตัวเครื่อง)"] || "-",
          notes: rec["Notes (หมายเหตุจากพนักงาน)"] || "-",
          reviewerNotes: rec["IT Reviewer Notes (บันทึกของ IT)"] || "-"
        }));
        return jsonResponse({ ok: true, count: formatted.length, logs: formatted });
      }

      // ---------------- LIFECYCLE HUB ---------------- //

      if (pathname === "/api/lifecycle/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const validPasswords = {
          "HR": ["hr2026", env.ADMIN_PASSWORD || "itadmin2026"],
          "ADMIN": ["admin2026", env.ADMIN_PASSWORD || "itadmin2026"],
          "IT": [env.ADMIN_PASSWORD || "itadmin2026"]
        };
        const allowed = validPasswords[body.role] || [env.ADMIN_PASSWORD || "itadmin2026"];
        if (allowed.includes(body.password?.trim())) {
          const names = { HR: "HR (คุณ Filmmy)", ADMIN: "Admin (คุณ Ploy)", IT: "IT (ฝ่ายไอที)" };
          const token = generateSignedToken({ role: body.role, actorName: names[body.role] || "Staff" }, 24);
          return jsonResponse({ ok: true, role: body.role, token, actorName: names[body.role] || "Staff" });
        }
        return jsonResponse({ ok: false, message: "รหัสผ่านไม่ถูกต้องสำหรับบทบาทนี้" }, 401);
      }

      if (pathname === "/api/lifecycle/tasks" && method === "GET") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        let tasks = [];
        if (env.IT_ASSET_KV) {
          const kvData = await env.IT_ASSET_KV.get("lifecycle_tasks");
          if (kvData) tasks = JSON.parse(kvData);
        }

        const stats = {
          total: tasks.length,
          offboardingWaitingAdmin: tasks.filter(t => t.type === "offboarding" && t.currentStage === "WAITING_ADMIN_COLLECTION").length,
          offboardingWaitingIT: tasks.filter(t => t.type === "offboarding" && t.currentStage === "WAITING_IT_REIMAGE").length,
          offboardingWaitingStore: tasks.filter(t => t.type === "offboarding" && t.currentStage === "WAITING_ADMIN_STORE").length,
          onboardingWaitingPack: tasks.filter(t => t.type === "onboarding" && t.currentStage === "WAITING_ADMIN_PACK").length,
          onboardingWaitingHandover: tasks.filter(t => t.type === "onboarding" && t.currentStage === "WAITING_HANDOVER").length,
          completed: tasks.filter(t => t.currentStage === "COMPLETED").length
        };

        return jsonResponse({ ok: true, stats, tasks });
      }

      if (pathname === "/api/lifecycle/tasks/offboarding" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName, organization, targetDate, notes, actor, devices } = await request.json().catch(() => ({}));
        if (!employeeName) return jsonResponse({ ok: false, message: "employeeName required" }, 400);

        let tasks = [];
        if (env.IT_ASSET_KV) {
          const raw = await env.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }

        const newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: "offboarding",
          employeeName: sanitizeString(employeeName, 100),
          organization: organization || "XPO",
          targetDate: sanitizeString(targetDate || new Date().toISOString().split("T")[0], 20),
          notes: sanitizeString(notes, 500),
          currentStage: "WAITING_ADMIN_COLLECTION",
          devices: devices || [],
          history: [{ stage: "WAITING_ADMIN_COLLECTION", actor: actor || "HR (คุณ Filmmy)", timestamp: new Date().toISOString() }]
        };

        tasks.unshift(newTask);
        if (env.IT_ASSET_KV) {
          await env.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
        }

        return jsonResponse({ ok: true, message: `สร้างรายการรับคืนอุปกรณ์ของ ${employeeName} เรียบร้อยแล้ว!`, task: newTask });
      }

      if (pathname === "/api/lifecycle/tasks/onboarding" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { position, employeeName, organization, targetDate, notes, actor, devices } = await request.json().catch(() => ({}));
        if (!position) return jsonResponse({ ok: false, message: "position required" }, 400);

        let tasks = [];
        if (env.IT_ASSET_KV) {
          const raw = await env.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }

        const newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: "onboarding",
          position: sanitizeString(position, 100),
          employeeName: sanitizeString(employeeName || `${position} (New Joiner)`, 100),
          organization: organization || "XPO",
          targetDate: sanitizeString(targetDate || new Date().toISOString().split("T")[0], 20),
          notes: sanitizeString(notes, 500),
          currentStage: "WAITING_ADMIN_PACK",
          devices: devices || [],
          history: [{ stage: "WAITING_ADMIN_PACK", actor: actor || "HR (คุณ Filmmy)", timestamp: new Date().toISOString() }]
        };

        tasks.unshift(newTask);
        if (env.IT_ASSET_KV) {
          await env.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
        }

        return jsonResponse({ ok: true, message: `สร้างรายการจัดเตรียมอุปกรณ์สำหรับ ${position} เรียบร้อยแล้ว!`, task: newTask });
      }

      if (pathname === "/api/lifecycle/tasks/advance" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { taskId, actor, note } = await request.json().catch(() => ({}));
        if (!taskId) return jsonResponse({ ok: false, message: "taskId required" }, 400);

        let tasks = [];
        if (env.IT_ASSET_KV) {
          const raw = await env.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }

        const task = tasks.find(t => t.id === taskId);
        if (!task) return jsonResponse({ ok: false, message: "Task not found" }, 404);

        const transitions = {
          offboarding: {
            "WAITING_ADMIN_COLLECTION": "WAITING_IT_REIMAGE",
            "WAITING_IT_REIMAGE": "WAITING_ADMIN_STORE",
            "WAITING_ADMIN_STORE": "COMPLETED"
          },
          onboarding: {
            "WAITING_ADMIN_PACK": "WAITING_HANDOVER",
            "WAITING_HANDOVER": "COMPLETED"
          }
        };

        const nextStage = transitions[task.type]?.[task.currentStage];
        if (nextStage) {
          task.currentStage = nextStage;
          task.history.push({ stage: nextStage, actor: actor || "Staff", note: sanitizeString(note, 200), timestamp: new Date().toISOString() });
          if (env.IT_ASSET_KV) {
            await env.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
          }
        }

        return jsonResponse({ ok: true, message: "อัปเดตขั้นตอนงานสำเร็จ!", task });
      }

      // ---------------- STATIC ASSETS ---------------- //
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  },

  async scheduled(event, env, ctx) {
    console.log("[CRON] Automated Daily Reminder triggered on Cloudflare Edge at", new Date().toISOString());
  }
};
