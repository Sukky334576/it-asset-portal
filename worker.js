/**
 * Cloudflare Worker for IT Asset Management Hub
 * Handles Serverless API Endpoints, KV Persistence, and Static Assets
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
  if (Array.isArray(val)) return val[0] || "";
  if (typeof val === "object" && val.text) return val.text;
  return String(val);
}

function getHolderName(holder) {
  if (!holder) return "";
  if (Array.isArray(holder) && holder[0]) return holder[0].name || holder[0].id || "";
  if (typeof holder === "object" && holder.name) return holder.name;
  return String(holder);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    // Handle CORS Preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    // Initialize Lark API Client with Environment Secrets
    const lark = new LarkDirectApi(env.LARK_APP_ID, env.LARK_APP_SECRET, env.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf");

    try {
      // 1. Employee List & Master Assets
      if (pathname === "/api/assets" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }

      if (pathname === "/api/employees" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        const employeeMap = {};

        records.forEach(a => {
          const holder = a["Current Holder (ผู้ถือครองปัจจุบัน)"];
          let empName = "ส่วนกลาง (Unassigned / Central Stock)";
          let openId = "";
          let org = getSingleValue(a["Organization (สังกัด)"]) || "XPO";

          if (Array.isArray(holder) && holder[0]) {
            empName = holder[0].name || holder[0].id;
            openId = holder[0].id || "";
          } else if (typeof holder === "object" && holder.name) {
            empName = holder.name;
            openId = holder.id || "";
          }

          if (!employeeMap[empName]) {
            employeeMap[empName] = {
              id: openId,
              name: empName,
              organization: org,
              isResigned: empName.includes("(ลาออก)") || empName.includes("Closed"),
              devices: []
            };
          }
          employeeMap[empName].devices.push(a);
        });

        const list = Object.values(employeeMap).sort((a, b) => a.name.localeCompare(b.name));
        return jsonResponse({ ok: true, count: list.length, data: list });
      }

      // 2. Loans List
      if (pathname === "/api/loans" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_LOAN);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }

      // 3. User Search
      if (pathname === "/api/users/search" && method === "GET") {
        const q = url.searchParams.get("q") || "";
        const users = await lark.searchUsers(q);
        return jsonResponse({ ok: true, data: users });
      }

      // 4. Admin Login
      if (pathname === "/api/admin/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const adminPass = env.ADMIN_PASSWORD || "itadmin2026";
        if (body.password && body.password.trim() === adminPass) {
          const token = generateSignedToken({ role: "ADMIN", user: "IT Admin" }, 24);
          return jsonResponse({ ok: true, token, message: "เข้าสู่ระบบแอดมินสำเร็จ" });
        }
        return jsonResponse({ ok: false, message: "รหัสผ่านไม่ถูกต้อง" }, 401);
      }

      // 5. Admin Stats
      if (pathname === "/api/admin/stats" && method === "GET") {
        const authHeader = request.headers.get("Authorization") || "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        const verified = verifySignedToken(token);
        if (!verified || verified.role !== "ADMIN") {
          return jsonResponse({ ok: false, code: "UNAUTHORIZED", message: "สิทธิ์ไม่ถูกต้องหรือ Session หมดอายุ" }, 401);
        }

        const assets = await lark.fetchRecords(TABLE_MASTER);
        let verifiedCount = 0;
        let pendingCount = 0;
        let missingTagCount = 0;
        let disputeCount = 0;
        let unconfirmed = new Set();

        assets.forEach(a => {
          const status = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
          const holder = getHolderName(a["Current Holder (ผู้ถือครองปัจจุบัน)"]);
          if (status.includes("ยืนยันแล้ว")) verifiedCount++;
          else if (status.includes("ขัดแย้ง")) disputeCount++;
          else {
            pendingCount++;
            if (holder && !holder.includes("ส่วนกลาง")) unconfirmed.add(holder);
          }
          if (a["Missing Tag? (ไม่มีเลขทรัพย์สิน)"]) missingTagCount++;
        });

        return jsonResponse({
          ok: true,
          totalAssets: assets.length,
          verifiedCount,
          pendingCount,
          missingTagCount,
          disputeCount,
          overallPercent: assets.length > 0 ? Math.round((verifiedCount / assets.length) * 100) : 0,
          unconfirmedEmployees: Array.from(unconfirmed)
        });
      }

      // 6. Lifecycle Hub Login
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
        return jsonResponse({ ok: false, message: "รหัสผ่านไม่ถูกต้อง" }, 401);
      }

      // 7. Lifecycle Hub Tasks (Cloudflare KV persistence)
      if (pathname === "/api/lifecycle/tasks" && method === "GET") {
        let tasks = [];
        if (env.IT_ASSET_KV) {
          const kvData = await env.IT_ASSET_KV.get("lifecycle_tasks");
          if (kvData) tasks = JSON.parse(kvData);
        }
        return jsonResponse({ ok: true, tasks });
      }

      // 8. Serve Static Assets (HTML/CSS/JS/Images)
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  },

  // Automated Daily Cron Trigger (Mon-Fri 09:00 AM BKK)
  async scheduled(event, env, ctx) {
    console.log("[CRON] Automated Daily Reminder triggered on Cloudflare Edge at", new Date().toISOString());
  }
};
