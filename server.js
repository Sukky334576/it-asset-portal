require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { execFile } = require('child_process');

const larkBot = require('./services/larkBot');
const scheduler = require('./services/scheduler');
const larkWebhook = require('./routes/larkWebhook');
const {
  loginLimiter,
  apiLimiter,
  generateSignedToken,
  verifySignedToken,
  requireAdminAuth,
  requireLifecycleAuth,
  sanitizeString
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers & Global API Rate Limiting
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(apiLimiter);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Mount Lark Webhook Router
app.use('/api/lark', larkWebhook);

const BASE_TOKEN = process.env.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf";
const TABLE_MASTER = "tblA1JXS2dWC9a5b";
const TABLE_AUDIT = "tblzKjtJuoAifQKS";
const TABLE_LOAN = "tblwL0cJzvv1qsj3";
const LARK_CLI_PATH = "/Users/xpo/Library/Application Support/Antigravity/bin/lark-cli";

// Lark Direct REST API Client
const LarkDirectApi = require('./services/larkDirectApi');
const larkDirect = new LarkDirectApi(
    process.env.LARK_APP_ID || "cli_aa9a88a6e7f89ed2",
    process.env.LARK_APP_SECRET || "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5",
    BASE_TOKEN
);

// Admin Security Password / PIN
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "itadmin2026";

// In-memory caches
let cachedAssets = [];
let cachedLoans = [];
let userDirectoryCache = new Map(); // lowercase name/id -> { id: 'ou_...', name: '...' }
let lastFetchTime = 0;
let lastLoanFetchTime = 0;
const CACHE_TTL_MS = 20000; // 20 seconds

// Campaign End Date (7 days from today)
const CAMPAIGN_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

function runLarkCli(args) {
    return new Promise((resolve, reject) => {
        const env = { ...process.env, LARK_CLI_NO_PROXY: "1", HOME: "/Users/xpo" };
        execFile(LARK_CLI_PATH, args, { env, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error("Lark CLI Error:", stderr || error.message);
                resolve({ ok: false, error: stderr || error.message });
            } else {
                try {
                    const parsed = JSON.parse(stdout);
                    resolve(parsed);
                } catch (e) {
                    resolve({ ok: true, raw: stdout });
                }
            }
        });
    });
}

// Fetch all records from Master Table & Populate User Directory Cache
async function fetchMasterAssets(force = false) {
    const now = Date.now();
    if (!force && cachedAssets.length > 0 && (now - lastFetchTime) < CACHE_TTL_MS) {
        return cachedAssets;
    }

    try {
        const records = await larkDirect.fetchRecords(TABLE_MASTER);
        if (records && records.length > 0) {
            records.forEach(rec => {
                const holder = rec["Current Holder (ผู้ถือครองปัจจุบัน)"];
                if (Array.isArray(holder) && holder.length > 0) {
                    holder.forEach(u => {
                        if (u && u.id && (u.name || u.en_name)) {
                            const name = u.en_name || u.name;
                            userDirectoryCache.set(name.toLowerCase().trim(), { id: u.id, name: name });
                            userDirectoryCache.set(u.id, { id: u.id, name: name });
                        }
                    });
                }
            });
            cachedAssets = records;
            lastFetchTime = now;
            return cachedAssets;
        }
    } catch (apiErr) {
        console.warn("Direct API fetchMasterAssets error, trying CLI fallback:", apiErr.message);
    }

    let allRecords = [];
    let offset = 0;
    const limit = 100;

    while (true) {
        const res = await runLarkCli([
            "base", "+record-list",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--offset", String(offset),
            "--limit", String(limit),
            "--format", "json",
            "--as", "user"
        ]);

        if (!res.ok || !res.data) {
            console.error("Failed to fetch master records:", res);
            break;
        }

        const fields = res.data.fields || [];
        const rows = res.data.data || [];
        const recordIds = res.data.record_id_list || [];
        const hasMore = res.data.has_more || false;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rec = { record_id: recordIds[i] };
            fields.forEach((fName, idx) => {
                rec[fName] = row[idx];
            });

            // Harvest user ids into userDirectoryCache
            const holder = rec["Current Holder (ผู้ถือครองปัจจุบัน)"];
            if (Array.isArray(holder) && holder.length > 0) {
                holder.forEach(u => {
                    if (u && u.id && (u.name || u.en_name)) {
                        const name = u.en_name || u.name;
                        userDirectoryCache.set(name.toLowerCase().trim(), { id: u.id, name: name });
                        userDirectoryCache.set(u.id, { id: u.id, name: name });
                    }
                });
            }

            allRecords.push(rec);
        }

        if (rows.length < limit || rows.length === 0) break;
        offset += rows.length;
    }

    if (allRecords.length > 0) {
        cachedAssets = allRecords;
        lastFetchTime = now;
    }
    return cachedAssets;
}

// Fetch all records from Loan Table
async function fetchLoanRecords(force = false) {
    const now = Date.now();
    if (!force && cachedLoans.length > 0 && (now - lastLoanFetchTime) < CACHE_TTL_MS) {
        return cachedLoans;
    }

    try {
        const records = await larkDirect.fetchRecords(TABLE_LOAN);
        if (records && records.length > 0) {
            cachedLoans = records;
            lastLoanFetchTime = now;
            return cachedLoans;
        }
    } catch (apiErr) {
        console.warn("Direct API fetchLoanRecords error, trying CLI fallback:", apiErr.message);
    }

    let allLoans = [];
    let offset = 0;
    const limit = 100;

    while (true) {
        const res = await runLarkCli([
            "base", "+record-list",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_LOAN,
            "--offset", String(offset),
            "--limit", String(limit),
            "--format", "json",
            "--as", "user"
        ]);

        if (!res.ok || !res.data) break;

        const fields = res.data.fields || [];
        const rows = res.data.data || [];
        const recordIds = res.data.record_id_list || [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rec = { record_id: recordIds[i] };
            fields.forEach((fName, idx) => {
                rec[fName] = row[idx];
            });
            allLoans.push(rec);
        }

        if (rows.length < limit || rows.length === 0) break;
        offset += rows.length;
    }

    cachedLoans = allLoans;
    lastLoanFetchTime = now;
    return cachedLoans;
}

function getHolderName(userField) {
    if (!userField) return "ส่วนกลาง / ไม่ระบุผู้ถือครอง";
    if (Array.isArray(userField) && userField.length > 0) {
        return userField[0].en_name || userField[0].name || userField[0].id || "พนักงาน";
    }
    if (typeof userField === 'object' && userField !== null) {
        return userField.en_name || userField.name || userField.id || "พนักงาน";
    }
    return String(userField);
}

function getSingleValue(val) {
    if (Array.isArray(val) && val.length > 0) return val[0];
    return val || "";
}

// Smart Lark User Resolver (Matches against directory or searches Lark contact API)
async function resolveLarkUser(inputNameOrId) {
    if (!inputNameOrId) return null;
    const raw = String(inputNameOrId).trim();
    if (!raw) return null;

    if (raw.startsWith("ou_")) {
        return [{ id: raw }];
    }

    const cleanLower = raw.toLowerCase();

    if (userDirectoryCache.has(cleanLower)) {
        const hit = userDirectoryCache.get(cleanLower);
        return [{ id: hit.id }];
    }

    for (const [key, val] of userDirectoryCache.entries()) {
        if (key.includes(cleanLower) || cleanLower.includes(key)) {
            return [{ id: val.id }];
        }
    }

    try {
        const queryTerm = raw.split('.')[0] || raw;
        const searchRes = await runLarkCli([
            "contact", "+search-user",
            "--query", queryTerm,
            "--as", "user",
            "--format", "json"
        ]);

        if (searchRes.ok && searchRes.data && searchRes.data.users && searchRes.data.users.length > 0) {
            const users = searchRes.data.users;
            let matchedUser = users.find(u => {
                const locName = (u.localized_name || "").toLowerCase();
                const email = (u.email || "").toLowerCase();
                return locName.includes(cleanLower) || email.includes(cleanLower);
            }) || users[0];

            if (matchedUser && matchedUser.open_id) {
                userDirectoryCache.set(cleanLower, { id: matchedUser.open_id, name: matchedUser.localized_name });
                userDirectoryCache.set(matchedUser.localized_name.toLowerCase(), { id: matchedUser.open_id, name: matchedUser.localized_name });
                return [{ id: matchedUser.open_id }];
            }
        }
    } catch (err) {
        console.error("Error searching Lark user contact:", err);
    }

    return null;
}

const resignedService = require('./services/resignedService');

// Helper to structure employee list with devices
async function getEmployeeDeviceList() {
    const assets = await fetchMasterAssets();
    const employeeMap = {};

    assets.forEach(item => {
        const holder = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
        if (!holder || (Array.isArray(holder) && holder.length === 0)) return;

        let empName = "";
        let empId = "";
        if (Array.isArray(holder) && holder[0]) {
            empName = holder[0].en_name || holder[0].name || holder[0].id;
            empId = holder[0].id;
        } else if (typeof holder === 'object' && holder !== null) {
            empName = holder.en_name || holder.name || holder.id;
            empId = holder.id;
        } else {
            empName = String(holder);
            empId = String(holder);
        }

        // Normalize known nicknames
        if (empId === "ou_b1756acc400b9e0d575cbe53ff5480dc" || empName.toLowerCase() === "teeraphat") {
            empName = "Tle.Teeraphat";
        }
        if (empId === "ou_b1e49e6d5a230cf75c3e402b75df9854" || empName.toLowerCase().includes("ployfreyah") || empName.toLowerCase().includes("freyah")) {
            empName = "PloyFreyah.Patcharaporn";
        }
        if (empId === "ou_f2d6832595326edf913a4ad0499718b8" || empName.toLowerCase().includes("foam")) {
            empName = "Foam.Patcharaporn";
        }

        if (!employeeMap[empName]) {
            const isResigned = resignedService.isEmployeeResigned(empName, empId);
            employeeMap[empName] = {
                id: empId,
                name: empName,
                organization: getSingleValue(item["Organization (สังกัด)"]) || "XPO",
                isResigned: isResigned,
                accountStatus: isResigned ? "CLOSED" : "ACTIVE",
                devices: [],
                allVerified: true,
                pendingCount: 0,
                verifiedCount: 0
            };
        }

        const auditStatus = getSingleValue(item["Audit Status (สถานะการยืนยัน)"]);
        const isVerified = auditStatus && auditStatus.includes("ยืนยันแล้ว");

        employeeMap[empName].devices.push(item);
        if (isVerified) {
            employeeMap[empName].verifiedCount++;
        } else {
            employeeMap[empName].pendingCount++;
            employeeMap[empName].allVerified = false;
        }
    });

    return Object.values(employeeMap).sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------- API ENDPOINTS ---------------- //

// Magic Link Verification Endpoint
app.get('/api/auth/magic-verify', (req, res) => {
    const { token } = req.query;
    const result = larkBot.verifyMagicToken(token);
    res.json(result);
});

// Admin Login Endpoint (Protected by Rate Limiter & HMAC Token)
app.post('/api/admin/login', loginLimiter, (req, res) => {
    const { password } = req.body;
    if (password && password.trim() === ADMIN_PASSWORD) {
        const token = generateSignedToken({ role: 'ADMIN', user: 'IT Admin' }, 24);
        res.json({ ok: true, token, message: "เข้าสู่ระบบแอดมินสำเร็จ" });
    } else {
        res.status(401).json({ ok: false, message: "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง" });
    }
});

// Search Lark Users Directory Endpoint (for autocomplete)
app.get('/api/users/search', async (req, res) => {
    try {
        const query = (req.query.q || "").trim();
        if (!query) {
            return res.json({ ok: true, data: [] });
        }

        const searchRes = await runLarkCli([
            "contact", "+search-user",
            "--query", query,
            "--as", "user",
            "--format", "json"
        ]);

        let results = [];
        if (searchRes.ok && searchRes.data && searchRes.data.users) {
            results = searchRes.data.users.map(u => ({
                id: u.open_id,
                name: u.localized_name,
                email: u.email || u.enterprise_email,
                department: u.department || ""
            }));
        }

        res.json({ ok: true, data: results });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 1. Get all assets
app.get('/api/assets', async (req, res) => {
    try {
        const force = req.query.refresh === 'true';
        const assets = await fetchMasterAssets(force);
        res.json({ ok: true, total: assets.length, data: assets });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.set('trust proxy', 1);

// ---------------- LARK OAUTH SSO ROUTES ---------------- //

app.get('/auth/lark', (req, res) => {
    let proto = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host') || "";
    if (host.includes('trycloudflare.com') || host.includes('workers.dev') || req.secure) {
        proto = 'https';
    }
    const origin = `${proto}://${host}`;
    const redirectUri = `${origin}/auth/callback`;
    const appId = process.env.LARK_APP_ID || "cli_aa9a88a6e7f89ed2";
    const authUrl = `https://open.larksuite.com/open-apis/authen/v1/authorize?app_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=lark_sso`;
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.json({ ok: true, url: authUrl });
    }
    res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("Missing authorization code");
    }

    try {
        const authData = await larkDirect.exchangeOAuthCode(code);
        const openId = authData.open_id || "";
        const name = authData.name || "";
        const enName = authData.en_name || name;
        const email = authData.email || "";
        const avatarUrl = authData.avatar_url || authData.avatar_thumb || "";

        const token = generateSignedToken({ open_id: openId, name: enName, role: "EMPLOYEE" }, 72);

        const userSession = JSON.stringify({
            open_id: openId,
            name: enName,
            realName: name,
            email: email,
            avatar_url: avatarUrl,
            token: token
        });

        const html = `<!DOCTYPE html>
        <html>
        <head>
          <title>Lark SSO Authenticated</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #fff; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); text-align: center; max-width: 420px; border: 1px solid #334155; }
            .avatar { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #3b82f6; margin: 0 auto 1rem; object-fit: cover; }
            .spinner { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #38bdf8; border-radius: 50%; width: 32px; height: 32px; animation: spin 0.8s linear infinite; margin: 1.5rem auto 0.5rem; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            ${avatarUrl ? `<img class="avatar" src="${avatarUrl}" alt="Avatar">` : `<div style="font-size:3rem; margin-bottom:0.5rem;">👤</div>`}
            <h2 style="margin:0 0 0.5rem; font-size:1.4rem;">🔐 เข้าสู่ระบบสำเร็จ!</h2>
            <p style="margin:0; font-size:1.1rem; color:#38bdf8; font-weight:600;">${enName}</p>
            ${email ? `<p style="margin:0.25rem 0 0; font-size:0.875rem; color:#94a3b8;">${email}</p>` : ''}
            <div class="spinner"></div>
            <p style="color: #94a3b8; font-size: 0.875rem; margin-top: 0.5rem;">กำลังพาเข้าสู่ระบบ IT Asset Hub...</p>
          </div>
          <script>
            try {
              const userObj = ${userSession};
              sessionStorage.setItem('lark_sso_user', JSON.stringify(userObj));
              localStorage.setItem('lark_sso_user', JSON.stringify(userObj));
              setTimeout(() => { window.location.replace('/?sso=success'); }, 800);
            } catch(e) {
              window.location.replace('/?sso=success');
            }
          </script>
        </body>
        </html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.send(html);
    } catch (err) {
        res.status(500).send(`OAuth Error: ${err.message}`);
    }
});

// Authenticated User's Devices
app.get('/api/me/devices', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace(/^Bearer\s+/i, "");
        const verified = verifySignedToken(token);

        let targetOpenId = req.query.open_id || "";
        let targetName = req.query.name || "";

        if (verified && verified.valid && verified.payload) {
            if (verified.payload.open_id) targetOpenId = verified.payload.open_id;
            if (verified.payload.name) targetName = verified.payload.name;
        }

        if (!targetOpenId && !targetName) {
            return res.status(401).json({ ok: false, message: "Authentication required" });
        }

        const assets = await fetchMasterAssets();
        const myDevices = assets.filter(a => {
            const holder = a["Current Holder (ผู้ถือครองปัจจุบัน)"];
            if (!holder) return false;
            if (Array.isArray(holder) && holder.length > 0) {
                return holder.some(u => {
                    if (targetOpenId && u.id === targetOpenId) return true;
                    const uName = (u.en_name || u.name || "").toLowerCase();
                    const tName = targetName.toLowerCase();
                    return uName && tName && (uName === tName || uName.includes(tName) || tName.includes(uName));
                });
            }
            if (typeof holder === "object") {
                if (targetOpenId && holder.id === targetOpenId) return true;
                const uName = (holder.en_name || holder.name || "").toLowerCase();
                const tName = targetName.toLowerCase();
                return uName && tName && (uName === tName || uName.includes(tName) || tName.includes(uName));
            }
            return false;
        });

        res.json({
            ok: true,
            openId: targetOpenId,
            name: targetName,
            total: myDevices.length,
            data: myDevices
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 2. Get employee list with device summaries
app.get('/api/employees', async (req, res) => {
    try {
        const employeeList = await getEmployeeDeviceList();
        res.json({ ok: true, total: employeeList.length, data: employeeList });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 3. Duplicate check endpoint
app.post('/api/check-duplicate', async (req, res) => {
    try {
        const { assetTag, serialNumber, excludeRecordId } = req.body;
        const assets = await fetchMasterAssets();

        let tagConflict = null;
        let snConflict = null;

        const cleanTag = (assetTag || "").trim();
        const cleanSN = (serialNumber || "").trim();

        if (cleanTag && cleanTag !== "ไม่ทราบ" && cleanTag !== "---") {
            const found = assets.find(a => {
                if (excludeRecordId && a.record_id === excludeRecordId) return false;
                const existingTag = (a["Asset Tag (เลขทรัพย์สิน)"] || "").trim();
                return existingTag.toLowerCase() === cleanTag.toLowerCase();
            });
            if (found) {
                tagConflict = {
                    record_id: found.record_id,
                    assetTag: found["Asset Tag (เลขทรัพย์สิน)"],
                    deviceName: found["Device Name (ชื่อรุ่น/อุปกรณ์)"],
                    holder: getHolderName(found["Current Holder (ผู้ถือครองปัจจุบัน)"]),
                    organization: getSingleValue(found["Organization (สังกัด)"])
                };
            }
        }

        if (cleanSN && cleanSN !== "---" && cleanSN.toLowerCase() !== "null") {
            const found = assets.find(a => {
                if (excludeRecordId && a.record_id === excludeRecordId) return false;
                const existingSN = (a["Serial Number (S/N)"] || "").trim();
                return existingSN.toLowerCase() === cleanSN.toLowerCase();
            });
            if (found) {
                snConflict = {
                    record_id: found.record_id,
                    serialNumber: found["Serial Number (S/N)"],
                    deviceName: found["Device Name (ชื่อรุ่น/อุปกรณ์)"],
                    holder: getHolderName(found["Current Holder (ผู้ถือครองปัจจุบัน)"]),
                    organization: getSingleValue(found["Organization (สังกัด)"])
                };
            }
        }

        res.json({
            ok: true,
            hasConflict: !!(tagConflict || snConflict),
            tagConflict,
            snConflict
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 4. Path 1: Verify assigned device
app.post('/api/verify', async (req, res) => {
    try {
        const { recordId, employeeName, notes, updatedTag, isUnknownTag } = req.body;

        if (!recordId) {
            return res.status(400).json({ ok: false, message: "recordId is required" });
        }

        if (cachedAssets.length === 0) {
            await fetchMasterAssets();
        }
        let item = cachedAssets.find(a => a.record_id === recordId);
        if (!item) {
            await fetchMasterAssets(true);
            item = cachedAssets.find(a => a.record_id === recordId);
        }
        if (!item) {
            return res.status(404).json({ ok: false, message: "Device record not found" });
        }

        let newTag = item["Asset Tag (เลขทรัพย์สิน)"];
        let missingTag = item["Missing Tag? (ไม่มีเลขทรัพย์สิน)"];
        let newAuditStatus = "🟢 ยืนยันแล้ว (Verified)";

        if (isUnknownTag) {
            newTag = "ไม่ทราบ";
            missingTag = true;
            newAuditStatus = "🏷️ ต้องติดป้ายเลขทรัพย์สินใหม่ (Missing Tag)";
        } else if (updatedTag && updatedTag.trim()) {
            newTag = updatedTag.trim();
            missingTag = false;
        }

        // 1. Update Master Record in Lark Base
        await runLarkCli([
            "base", "+record-batch-update",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--json", JSON.stringify({
                record_id_list: [recordId],
                patch: {
                    "Audit Status (สถานะการยืนยัน)": newAuditStatus,
                    "Asset Tag (เลขทรัพย์สิน)": newTag,
                    "Missing Tag? (ไม่มีเลขทรัพย์สิน)": Boolean(missingTag)
                }
            })
        ]);

        // 2. Log to Audit Campaign Table
        const auditLogPayload = {
            fields: [
                "Brand & Model (ยี่ห้อและรุ่น)",
                "Asset Tag (เลขทรัพย์สินบนเครื่อง)",
                "ไม่ทราบเลขทรัพย์สิน (Missing Tag)",
                "Serial Number (S/N บนตัวเครื่อง)",
                "Device Condition (สภาพเครื่องปัจจุบัน)",
                "IT Review Status (ผลการตรวจสอบโดย IT)",
                "Notes (หมายเหตุจากพนักงาน)"
            ],
            rows: [[
                item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                newTag,
                Boolean(missingTag),
                item["Serial Number (S/N)"] || "",
                "🟢 สมบูรณ์ ใช้งานได้ปกติ",
                "🟢 Verified & Locked (อนุมัติเข้า Master)",
                `Verified by ${employeeName || "User"}. ${notes || ""}`
            ]]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_AUDIT,
            "--as", "user",
            "--json", JSON.stringify(auditLogPayload)
        ]);

        lastFetchTime = 0;
        item["Audit Status (สถานะการยืนยัน)"] = [newAuditStatus];
        item["Asset Tag (เลขทรัพย์สิน)"] = newTag;
        item["Missing Tag? (ไม่มีเลขทรัพย์สิน)"] = missingTag;

        res.json({ ok: true, message: "Device verified successfully!", item });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 5. Path 1: Report discrepancy / Not holding / Duplicate
app.post('/api/report-discrepancy', async (req, res) => {
    try {
        const { recordId, employeeName, reason, newHolderName } = req.body;
        const item = cachedAssets.find(a => a.record_id === recordId);
        if (!item) {
            return res.status(404).json({ ok: false, message: "Device record not found" });
        }

        // Mark Master as Disputed
        await runLarkCli([
            "base", "+record-batch-update",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--json", JSON.stringify({
                record_id_list: [recordId],
                patch: {
                    "Audit Status (สถานะการยืนยัน)": "🔴 ข้อมูลขัดแย้ง/ซ้ำซ้อน (Disputed)"
                }
            })
        ]);

        // Log to Audit Campaign
        const auditLogPayload = {
            fields: [
                "Brand & Model (ยี่ห้อและรุ่น)",
                "Asset Tag (เลขทรัพย์สินบนเครื่อง)",
                "Serial Number (S/N บนตัวเครื่อง)",
                "IT Review Status (ผลการตรวจสอบโดย IT)",
                "Notes (หมายเหตุจากพนักงาน)",
                "IT Reviewer Notes (บันทึกของ IT)"
            ],
            rows: [[
                item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                item["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบ",
                item["Serial Number (S/N)"] || "",
                "🔴 Duplicate / Conflict (พบข้อมูลซ้ำซ้อน)",
                `รายงานโดย ${employeeName}: ${reason || "ไม่ได้ถือครองเครื่องนี้แล้ว"}`,
                `ผู้ครอบครองใหม่ที่แจ้ง: ${newHolderName || "ไม่ระบุ"}`
            ]]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_AUDIT,
            "--as", "user",
            "--json", JSON.stringify(auditLogPayload)
        ]);

        lastFetchTime = 0;
        item["Audit Status (สถานะการยืนยัน)"] = ["🔴 ข้อมูลขัดแย้ง/ซ้ำซ้อน (Disputed)"];
        res.json({ ok: true, message: "Discrepancy reported to IT successfully!" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 6. Path 2: Register New Asset (With Automatic Lark User Resolver & Receipt Bot Card)
app.post('/api/register', async (req, res) => {
    try {
        const {
            employeeName,
            employeeId,
            organization,
            deviceType,
            brand,
            deviceName,
            assetTag,
            isUnknownTag,
            serialNumber,
            isUnknownSN,
            condition,
            notes
        } = req.body;

        const tag = isUnknownTag ? "ไม่ทราบ" : (assetTag || "ไม่ทราบ").trim();
        const sn = isUnknownSN ? null : (serialNumber || "").trim() || null;
        const missingTag = isUnknownTag || tag === "ไม่ทราบ";
        const missingSN = isUnknownSN || !sn;

        const auditStatus = missingTag
            ? "🏷️ ต้องติดป้ายเลขทรัพย์สินใหม่ (Missing Tag)"
            : "🟢 ยืนยันแล้ว (Verified)";

        const userObj = await resolveLarkUser(employeeId || employeeName);
        const holderNote = employeeName ? `ผู้ถือครอง: ${employeeName}` : "";
        const combinedNotes = [holderNote, notes ? `Notes: ${notes}` : ""].filter(Boolean).join(" | ");

        // 1. Insert into IT Assets Master
        const masterRow = [
            tag,
            sn,
            deviceName || `${brand} ${deviceType}`,
            deviceType || "Laptop (NB)",
            brand || "Other",
            organization || "XPO",
            userObj,
            "🟢 ใช้งานประจำตัว (In Use)",
            auditStatus,
            missingTag,
            missingSN,
            combinedNotes || "New Registration via Web Portal"
        ];

        const masterPayload = {
            fields: [
                "Asset Tag (เลขทรัพย์สิน)",
                "Serial Number (S/N)",
                "Device Name (ชื่อรุ่น/อุปกรณ์)",
                "Device Type (ประเภทอุปกรณ์)",
                "Brand (ยี่ห้อ)",
                "Organization (สังกัด)",
                "Current Holder (ผู้ถือครองปัจจุบัน)",
                "Status (สถานะอุปกรณ์)",
                "Audit Status (สถานะการยืนยัน)",
                "Missing Tag? (ไม่มีเลขทรัพย์สิน)",
                "Missing Serial? (ไม่มี S/N)",
                "Specs / Notes (รายละเอียด/หมายเหตุ)"
            ],
            rows: [masterRow]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--json", JSON.stringify(masterPayload)
        ]);

        // 2. Also log in Audit Campaign
        const auditLogPayload = {
            fields: [
                "Organization (สังกัด)",
                "Device Type (ประเภทอุปกรณ์)",
                "Brand & Model (ยี่ห้อและรุ่น)",
                "Asset Tag (เลขทรัพย์สินบนเครื่อง)",
                "ไม่ทราบเลขทรัพย์สิน (Missing Tag)",
                "Serial Number (S/N บนตัวเครื่อง)",
                "ไม่ทราบ S/N (Missing S/N)",
                "Device Condition (สภาพเครื่องปัจจุบัน)",
                "IT Review Status (ผลการตรวจสอบโดย IT)",
                "Notes (หมายเหตุจากพนักงาน)"
            ],
            rows: [[
                organization || "XPO",
                deviceType || "Laptop (NB)",
                `${brand || ""} ${deviceName || ""}`.trim(),
                tag,
                missingTag,
                sn || "",
                missingSN,
                condition || "🟢 สมบูรณ์ ใช้งานได้ปกติ",
                "🟢 Verified & Locked (อนุมัติเข้า Master)",
                `Registered by ${employeeName || "User"}. ${notes || ""}`
            ]]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_AUDIT,
            "--as", "user",
            "--json", JSON.stringify(auditLogPayload)
        ]);

        lastFetchTime = 0;

        // 3. Send Bot Receipt Card if Open ID is resolved
        let botResult = null;
        if (userObj && userObj[0] && userObj[0].id) {
            const receiptCard = larkBot.createReceiptCard(employeeName, 'register', {
                deviceName: deviceName || `${brand} ${deviceType}`,
                assetTag: tag,
                organization: organization || 'XPO'
            });
            botResult = await larkBot.sendCardSafely(userObj[0].id, receiptCard, { recipientName: employeeName });
        }

        res.json({
            ok: true,
            message: "New asset registered and verified successfully!",
            stampedUser: userObj,
            botNotification: botResult
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 7. Get Loans & Available Stock & History
app.get('/api/loans', async (req, res) => {
    try {
        const force = req.query.refresh === 'true';
        const assets = await fetchMasterAssets(force);
        const loans = await fetchLoanRecords(force);

        const availableStock = assets.filter(a => {
            const status = getSingleValue(a["Status (สถานะอุปกรณ์)"]);
            return status.includes("พร้อมใช้งาน") || status.includes("Available");
        });

        const activeLoans = assets.filter(a => {
            const status = getSingleValue(a["Status (สถานะอุปกรณ์)"]);
            return status.includes("ยืม") || status.includes("On Loan");
        });

        const returnHistory = loans.filter(l => {
            const status = getSingleValue(l["Loan Status (สถานะการยืม-คืน)"]);
            return status.includes("Returned") || status.includes("คืน");
        });

        res.json({
            ok: true,
            availableStock,
            activeLoans,
            returnHistory,
            rawLoans: loans
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 8. Submit Loan Request (ยืมอุปกรณ์ชั่วคราว With Automatic Lark User Resolver)
app.post('/api/loans/request', async (req, res) => {
    try {
        const { borrowerName, borrowerId, organization, assetRecordId, loanType, expectedReturnDate, purpose, accessories } = req.body;

        if (!assetRecordId) {
            return res.status(400).json({ ok: false, message: "กรุณาเลือกอุปกรณ์ที่ต้องการยืม" });
        }

        const item = cachedAssets.find(a => a.record_id === assetRecordId);
        if (!item) {
            return res.status(404).json({ ok: false, message: "ไม่พบข้อมูลอุปกรณ์นี้ในคลัง" });
        }

        const userObj = await resolveLarkUser(borrowerId || borrowerName);
        
        // 1. Update Asset Status in Master to "On Loan"
        await runLarkCli([
            "base", "+record-batch-update",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--json", JSON.stringify({
                record_id_list: [assetRecordId],
                patch: {
                    "Status (สถานะอุปกรณ์)": "🟡 อยู่ระหว่างการยืม (On Loan)",
                    "Current Holder (ผู้ถือครองปัจจุบัน)": userObj,
                    "Specs / Notes (รายละเอียด/หมายเหตุ)": `ยืมชั่วคราวโดย ${borrowerName || "พนักงาน"} (${loanType || "ทั่วไป"}): กำหนดคืน ${expectedReturnDate}`
                }
            })
        ]);

        // 2. Create Loan Transaction in Loan Table
        const loanRow = [
            "📤 ยืมอุปกรณ์ (Borrow)",
            userObj,
            organization || "XPO",
            [assetRecordId],
            new Date().toISOString().split('T')[0],
            expectedReturnDate,
            `[${loanType || "ยืมชั่วคราว"}] ${purpose || "ใช้งานชั่วคราว"} (ผู้ยืม: ${borrowerName})`,
            accessories ? (Array.isArray(accessories) ? accessories.join(", ") : accessories) : "สายชาร์จ/Adapter",
            "🟢 Active Loan (อยู่ระหว่างการยืม)"
        ];

        const loanPayload = {
            fields: [
                "Action Type (ประเภทรายการ)",
                "Borrower (ผู้ขอยืม/ผู้คืน)",
                "Organization (สังกัด)",
                "Linked Asset (อุปกรณ์ที่ยืม)",
                "Borrow Date (วันที่เริ่มยืม)",
                "Expected Return Date (กำหนดส่งคืน)",
                "Purpose (วัตถุประสงค์การยืม)",
                "Accessories Included (อุปกรณ์ส่วนควบ)",
                "Loan Status (สถานะการยืม-คืน)"
            ],
            rows: [loanRow]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_LOAN,
            "--as", "user",
            "--json", JSON.stringify(loanPayload)
        ]);

        lastFetchTime = 0;
        lastLoanFetchTime = 0;

        // 3. Send Bot Loan Confirmation Card
        let botResult = null;
        if (userObj && userObj[0] && userObj[0].id) {
            const receiptCard = larkBot.createReceiptCard(borrowerName, 'loan', {
                deviceName: item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                assetTag: item["Asset Tag (เลขทรัพย์สิน)"] || "No Tag",
                organization: organization || 'XPO'
            });
            botResult = await larkBot.sendCardSafely(userObj[0].id, receiptCard, { recipientName: borrowerName });
        }

        res.json({
            ok: true,
            message: "บันทึกการขอยืมอุปกรณ์ชั่วคราวสำเร็จ!",
            botNotification: botResult
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 9. Return Asset Endpoint (ส่งคืนอุปกรณ์ชั่วคราว - 1-Click Return)
app.post('/api/loans/return', async (req, res) => {
    try {
        const { assetRecordId, returnCondition, returnNotes } = req.body;

        if (!assetRecordId) {
            return res.status(400).json({ ok: false, message: "assetRecordId is required" });
        }

        const todayStr = new Date().toISOString().split('T')[0];

        // 1. Update Master Asset Status -> Back to "Available in Stock" & Clear Holder
        await runLarkCli([
            "base", "+record-batch-update",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--json", JSON.stringify({
                record_id_list: [assetRecordId],
                patch: {
                    "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
                    "Current Holder (ผู้ถือครองปัจจุบัน)": null,
                    "Specs / Notes (รายละเอียด/หมายเหตุ)": `รับคืนเข้าคลังเมื่อ: ${todayStr} (${returnCondition || "สภาพสมบูรณ์"})`
                }
            })
        ]);

        // 2. Log Return Transaction in Loan Table
        const returnRow = [
            "📥 คืนอุปกรณ์ (Return)",
            null,
            "HQ/ส่วนกลาง",
            [assetRecordId],
            todayStr,
            todayStr,
            todayStr,
            `รับคืนอุปกรณ์: ${returnNotes || "คืนเรียบร้อย"}`,
            "สายชาร์จ/อุปกรณ์ครบ",
            "🔵 Returned - Complete (คืนเรียบร้อย สมบูรณ์)",
            `สภาพ: ${returnCondition || "สมบูรณ์"}`
        ];

        const loanPayload = {
            fields: [
                "Action Type (ประเภทรายการ)",
                "Borrower (ผู้ขอยืม/ผู้คืน)",
                "Organization (สังกัด)",
                "Linked Asset (อุปกรณ์ที่ยืม)",
                "Borrow Date (วันที่เริ่มยืม)",
                "Expected Return Date (กำหนดส่งคืน)",
                "Actual Return Date (วันที่ส่งคืนจริง)",
                "Purpose (วัตถุประสงค์การยืม)",
                "Accessories Included (อุปกรณ์ส่วนควบ)",
                "Loan Status (สถานะการยืม-คืน)",
                "Notes (หมายเหตุ)"
            ],
            rows: [returnRow]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_LOAN,
            "--as", "user",
            "--json", JSON.stringify(loanPayload)
        ]);

        lastFetchTime = 0;
        lastLoanFetchTime = 0;
        res.json({ ok: true, message: "รับคืนอุปกรณ์เข้าคลังเรียบร้อยแล้ว!" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 10. Admin Stats (Protected by requireAdminAuth)
app.get('/api/admin/stats', requireAdminAuth, async (req, res) => {
    try {
        const assets = await fetchMasterAssets();

        let totalAssets = assets.length;
        let verifiedCount = 0;
        let pendingCount = 0;
        let missingTagCount = 0;
        let disputeCount = 0;
        let onLoanCount = 0;
        let availableCount = 0;

        let orgStats = {
            XPO: { total: 0, verified: 0 },
            EDDU: { total: 0, verified: 0 },
            Other: { total: 0, verified: 0 }
        };

        let missingTagList = [];
        let disputedList = [];
        let unconfirmedEmployees = new Set();

        assets.forEach(a => {
            const auditStatus = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
            const status = getSingleValue(a["Status (สถานะอุปกรณ์)"]);
            const org = getSingleValue(a["Organization (สังกัด)"]) || "Other";
            const orgKey = org.includes("XPO") ? "XPO" : (org.includes("EDDU") ? "EDDU" : "Other");

            orgStats[orgKey].total++;

            const holder = getHolderName(a["Current Holder (ผู้ถือครองปัจจุบัน)"]);

            if (auditStatus && auditStatus.includes("ยืนยันแล้ว")) {
                verifiedCount++;
                orgStats[orgKey].verified++;
            } else if (auditStatus && auditStatus.includes("ขัดแย้ง")) {
                disputeCount++;
                disputedList.push(a);
            } else {
                pendingCount++;
                if (holder && !holder.includes("ส่วนกลาง")) {
                    unconfirmedEmployees.add(holder);
                }
            }

            if (status.includes("ยืม") || status.includes("On Loan")) {
                onLoanCount++;
            } else if (status.includes("พร้อมใช้งาน") || status.includes("Available")) {
                availableCount++;
            }

            const missingTag = a["Missing Tag? (ไม่มีเลขทรัพย์สิน)"] || (a["Asset Tag (เลขทรัพย์สิน)"] === "ไม่ทราบ");
            if (missingTag) {
                missingTagCount++;
                missingTagList.push(a);
            }
        });

        const overallPercent = totalAssets > 0 ? Math.round((verifiedCount / totalAssets) * 100) : 0;
        const xpoPercent = orgStats.XPO.total > 0 ? Math.round((orgStats.XPO.verified / orgStats.XPO.total) * 100) : 0;
        const edduPercent = orgStats.EDDU.total > 0 ? Math.round((orgStats.EDDU.verified / orgStats.EDDU.total) * 100) : 0;

        res.json({
            ok: true,
            totalAssets,
            verifiedCount,
            pendingCount,
            missingTagCount,
            disputeCount,
            onLoanCount,
            availableCount,
            overallPercent,
            xpoPercent,
            edduPercent,
            orgStats,
unconfirmedEmployees: Array.from(unconfirmedEmployees),
            missingTagList: missingTagList.slice(0, 50),
            disputedList,
            campaignEndDate: CAMPAIGN_END_DATE,
            botSandboxMode: larkBot.botConfig.sandboxMode,
            botWhitelist: larkBot.botConfig.whitelist
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 11. Bot Admin Endpoints: Test Console & Manual Trigger (Protected by requireAdminAuth)
app.get('/api/admin/bot/config', requireAdminAuth, (req, res) => {
    res.json({
        ok: true,
        sandboxMode: larkBot.botConfig.sandboxMode,
        whitelist: larkBot.botConfig.whitelist,
        portalBaseUrl: larkBot.botConfig.portalBaseUrl
    });
});

app.post('/api/admin/bot/whitelist', requireAdminAuth, (req, res) => {
    const { sandboxMode, whitelist } = req.body;
    if (typeof sandboxMode === 'boolean') {
        larkBot.botConfig.sandboxMode = sandboxMode;
    }
    if (Array.isArray(whitelist)) {
        larkBot.botConfig.whitelist = whitelist.map(s => String(s).trim()).filter(Boolean);
    }
    res.json({
        ok: true,
        message: "อัปเดตการตั้งค่า Whitelist สำเร็จ",
        config: {
            sandboxMode: larkBot.botConfig.sandboxMode,
            whitelist: larkBot.botConfig.whitelist
        }
    });
});

// Send Test Card (Single target test)
app.post('/api/admin/bot/send-test', requireAdminAuth, async (req, res) => {
    try {
        const { targetOpenId, targetName, cardType } = req.body;

        if (!targetOpenId && !targetName) {
            return res.status(400).json({ ok: false, message: "กรุณาระบุ Lark Open ID หรือเลือกชื่อพนักงานเป้าหมาย" });
        }

        let openId = targetOpenId;
        let name = targetName || "ผู้ทดสอบ";

        if (!openId && targetName) {
            const resolved = await resolveLarkUser(targetName);
            if (resolved && resolved[0]) {
                openId = resolved[0].id;
            }
        }

        if (!openId) {
            return res.status(404).json({ ok: false, message: `ไม่พบ Lark Open ID สำหรับ '${targetName}'` });
        }

        const employees = await getEmployeeDeviceList();
        const empRecord = employees.find(e => e.id === openId || e.name === name);
        const sampleDevices = empRecord ? empRecord.devices : [{
            "Device Name (ชื่อรุ่น/อุปกรณ์)": "MacBook Pro 14 M3 (Test Unit)",
            "Asset Tag (เลขทรัพย์สิน)": "COM-TEST-001",
            "Serial Number (S/N)": "C02XYZ12345",
            "Audit Status (สถานะการยืนยัน)": "⏳ รอการยืนยัน"
        }];

        let cardPayload = null;
        if (cardType === 'loan_due') {
            cardPayload = larkBot.createLoanDueCard(name, "Lenovo ThinkPad X280", "COM-00047", "2026-08-25", false, openId);
        } else if (cardType === 'loan_overdue') {
            cardPayload = larkBot.createLoanDueCard(name, "Dell 24 Monitor", "MO-00088", "2026-08-15", true, openId);
        } else if (cardType === 'receipt') {
            cardPayload = larkBot.createReceiptCard(name, 'register', {
                deviceName: "ThinkPad T14 Gen 3",
                assetTag: "COM-00999",
                organization: "XPO"
            });
        } else {
            cardPayload = larkBot.createVerificationCard(name, sampleDevices, openId);
        }

        const sendResult = await larkBot.sendCardSafely(openId, cardPayload, {
            recipientName: name,
            forceSend: true
        });

        res.json({
            ok: sendResult.success,
            message: sendResult.dryRun ? sendResult.message : (sendResult.success ? "🎉 ส่งการ์ดทดสอบเข้าแชท Lark สำเร็จ!" : `เกิดข้อผิดพลาด: ${sendResult.error}`),
            sendResult
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Run Batch Reminders Trigger
app.post('/api/admin/bot/batch-reminders', requireAdminAuth, async (req, res) => {
    try {
        const [employees, loans] = await Promise.all([
            getEmployeeDeviceList(),
            fetchLoanRecords()
        ]);

        const freezeResults = await scheduler.runFreezeReminders(employees);
        const loanResults = await scheduler.runLoanDueAlerts(loans);

        res.json({
            ok: true,
            message: `ประมวลผลส่งการ์ดแจ้งเตือนเรียบร้อย (Freeze: ${freezeResults.processed}, Loans: ${loanResults.alertsSent})`,
            freezeResults,
            loanResults
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Helper function to write detailed audit log for deleted / modified items
async function saveDeletionAuditLog(auditEntries) {
    if (!auditEntries || auditEntries.length === 0) return;

    const fields = [
        "Brand & Model (ยี่ห้อและรุ่น)",
        "IT Review Status (ผลการตรวจสอบโดย IT)",
        "Organization (สังกัด)",
        "Device Type (ประเภทอุปกรณ์)",
        "Asset Tag (เลขทรัพย์สินบนเครื่อง)",
        "Serial Number (S/N บนตัวเครื่อง)",
        "Notes (หมายเหตุจากพนักงาน)",
        "IT Reviewer Notes (บันทึกของ IT)"
    ];

    const rows = auditEntries.map(e => [
        e.brandModel || "IT Asset",
        e.reviewStatus || "🟢 Verified & Locked (อนุมัติเข้า Master)",
        e.org || "XPO",
        e.deviceType || "Other",
        e.assetTag || "-",
        e.serialNumber || "-",
        e.notes || "",
        e.reviewerNotes || ""
    ]);

    for (let i = 0; i < rows.length; i += 100) {
        const chunk = rows.slice(i, i + 100);
        try {
            await runLarkCli([
                "base", "+record-batch-create",
                "--base-token", BASE_TOKEN,
                "--table-id", TABLE_AUDIT,
                "--as", "user",
                "--json", JSON.stringify({ fields, rows: chunk })
            ]);
        } catch (err) {
            console.error("Error writing audit log:", err.message);
        }
    }
}

// 12. Duplicate Cleaner Endpoints (Protected by requireAdminAuth)
app.get('/api/admin/duplicates', requireAdminAuth, async (req, res) => {
    try {
        const assets = await fetchMasterAssets();

        // 1. Employee-reported duplicates
        const reportedDuplicates = assets.filter(a => {
            const auditStatus = getSingleValue(a["Audit Status (สถานะการยืนยัน)"]);
            const notes = a["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "";
            return (auditStatus && (auditStatus.includes("Disputed") || auditStatus.includes("แจ้งซ้ำ"))) ||
                   notes.includes("DUPLICATE_ENTRY");
        });

        // 2. Auto-detected duplicate Serial Numbers
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
            .map(sn => ({
                sn,
                count: snGroups[sn].length,
                items: snGroups[sn]
            }));

        res.json({
            ok: true,
            reportedCount: reportedDuplicates.length,
            reportedList: reportedDuplicates,
            detectedSnGroupCount: duplicateSnGroups.length,
            detectedSnGroups: duplicateSnGroups
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Batch Delete records by Record IDs with FULL Audit Snapshot
app.post('/api/admin/duplicates/batch-delete', requireAdminAuth, async (req, res) => {
    try {
        const { recordIds } = req.body;
        if (!recordIds || !Array.isArray(recordIds) || recordIds.length === 0) {
            return res.status(400).json({ ok: false, message: "กรุณาระบุ record_ids ที่ต้องการลบ" });
        }

        const assets = await fetchMasterAssets();
        const targets = assets.filter(a => recordIds.includes(a.record_id));

        // Snapshot audit entries BEFORE deletion
        const auditEntries = targets.map(t => {
            const holder = t["Current Holder (ผู้ถือครองปัจจุบัน)"];
            let holderName = "ไม่ระบุ";
            if (Array.isArray(holder) && holder[0]) holderName = holder[0].name || holder[0].id;
            else if (typeof holder === 'object' && holder.name) holderName = holder.name;

            return {
                brandModel: t["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                reviewStatus: "🔴 Duplicate / Conflict (พบข้อมูลซ้ำซ้อน)",
                org: getSingleValue(t["Organization (สังกัด)"]) || "XPO",
                deviceType: getSingleValue(t["Device Type (ประเภทอุปกรณ์)"]) || "Other",
                assetTag: t["Asset Tag (เลขทรัพย์สิน)"] || "-",
                serialNumber: t["Serial Number (S/N)"] || "-",
                notes: `ลบข้อมูลซ้ำออกจากระบบ (Duplicate Purge)`,
                reviewerNotes: `ถือครองเดิมโดย: ${holderName} | Record ID: ${t.record_id} | รายละเอียดเดิม: ${t["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "-"} | วันที่ลบ: ${new Date().toLocaleString('th-TH')}`
            };
        });

        // 1. Delete from Master
        await runLarkCli([
            "base", "+record-delete",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--yes",
            "--json", JSON.stringify({ record_id_list: recordIds })
        ]);

        // Invalidate cache
        lastFetchTime = 0;
        cachedAssets = cachedAssets.filter(a => !recordIds.includes(a.record_id));

        // 2. Write full snapshot to Audit Log Table
        await saveDeletionAuditLog(auditEntries);

        res.json({
            ok: true,
            message: `ลบรายการข้อมูลซ้ำสำเร็จ ${recordIds.length} รายการ และบันทึกประวัติการลบเข้าตาราง Log ตรวจสอบย้อนหลังเรียบร้อย!`
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Auto Clean Exact Duplicates (Keeps 1, deletes all twins with FULL Audit Snapshot)
app.post('/api/admin/duplicates/auto-clean', requireAdminAuth, async (req, res) => {
    try {
        const assets = await fetchMasterAssets();
        const snMap = {};
        assets.forEach(a => {
            const sn = (a["Serial Number (S/N)"] || "").trim();
            if (sn && sn !== "---" && sn.toLowerCase() !== "none" && sn !== "-" && sn.length >= 4) {
                if (!snMap[sn]) snMap[sn] = [];
                snMap[sn].push(a);
            }
        });

        const recordsToDelete = [];
        const auditEntries = [];

        for (const [sn, list] of Object.entries(snMap)) {
            if (list.length > 1) {
                const verifiedIdx = list.findIndex(item => {
                    const s = Array.isArray(item["Audit Status (สถานะการยืนยัน)"]) ? item["Audit Status (สถานะการยืนยัน)"][0] : item["Audit Status (สถานะการยืนยัน)"];
                    return s && s.includes("ยืนยันแล้ว");
                });
                const keepIndex = verifiedIdx >= 0 ? verifiedIdx : 0;
                const keptItem = list[keepIndex];

                list.forEach((item, idx) => {
                    if (idx !== keepIndex) {
                        recordsToDelete.push(item.record_id);

                        const holder = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
                        let holderName = "ไม่ระบุ";
                        if (Array.isArray(holder) && holder[0]) holderName = holder[0].name || holder[0].id;
                        else if (typeof holder === 'object' && holder.name) holderName = holder.name;

                        auditEntries.push({
                            brandModel: item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                            reviewStatus: "🔴 Duplicate / Conflict (พบข้อมูลซ้ำซ้อน)",
                            org: getSingleValue(item["Organization (สังกัด)"]) || "XPO",
                            deviceType: getSingleValue(item["Device Type (ประเภทอุปกรณ์)"]) || "Other",
                            assetTag: item["Asset Tag (เลขทรัพย์สิน)"] || "-",
                            serialNumber: sn,
                            notes: `ลบคู่แฝด S/N ซ้ำอัตโนมัติ (เก็บแถวสมบูรณ์ Record ID: ${keptItem.record_id} ไว้)`,
                            reviewerNotes: `ถือครองเดิมโดย: ${holderName} | Record ID ที่ลบ: ${item.record_id} | วันที่ลบ: ${new Date().toLocaleString('th-TH')}`
                        });
                    }
                });
            }
        }

        if (recordsToDelete.length === 0) {
            return res.json({ ok: true, message: "ไม่พบรายการ S/N ซ้ำซ้อนในระบบ" });
        }

        await runLarkCli([
            "base", "+record-delete",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--yes",
            "--json", JSON.stringify({ record_id_list: recordsToDelete })
        ]);

        lastFetchTime = 0;
        cachedAssets = cachedAssets.filter(a => !recordsToDelete.includes(a.record_id));

        // Save Audit Log
        await saveDeletionAuditLog(auditEntries);

        res.json({
            ok: true,
            message: `ระบบลบรายการซ้ำซ้อนออกให้อัตโนมัติเรียบร้อย ${recordsToDelete.length} รายการ และบันทึกประวัติลงตาราง Log เรียบร้อย!`,
            deletedCount: recordsToDelete.length,
            deletedIds: recordsToDelete
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 13. Resigned Staff Management Endpoints (Protected by requireAdminAuth)
app.get('/api/admin/resigned', requireAdminAuth, async (req, res) => {
    try {
        const employees = await getEmployeeDeviceList();
        const resignedList = employees.filter(e => e.isResigned);
        const totalDevices = resignedList.reduce((acc, curr) => acc + curr.devices.length, 0);

        res.json({
            ok: true,
            resignedCount: resignedList.length,
            totalDevicesCount: totalDevices,
            resignedEmployees: resignedList
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

app.post('/api/admin/resigned/mark', requireAdminAuth, (req, res) => {
    const { employeeName } = req.body;
    if (!employeeName) return res.status(400).json({ ok: false, message: "กรุณาระบุชื่อพนักงาน" });

    resignedService.markResigned(employeeName);
    res.json({ ok: true, message: `ระบุ ${employeeName} เป็นพนักงานลาออก (Closed) เรียบร้อยแล้ว` });
});

app.post('/api/admin/resigned/unmark', requireAdminAuth, (req, res) => {
    const { employeeName } = req.body;
    if (!employeeName) return res.status(400).json({ ok: false, message: "กรุณาระบุชื่อพนักงาน" });

    resignedService.unmarkResigned(employeeName);
    res.json({ ok: true, message: `ยกเลิกสถานะลาออกของ ${employeeName} เรียบร้อยแล้ว` });
});

// Reclaim devices of a resigned employee back to central stock
app.post('/api/admin/resigned/reclaim', requireAdminAuth, async (req, res) => {
    try {
        const { employeeName, recordIds } = req.body;
        const assets = await fetchMasterAssets();
        
        let targetRecordIds = recordIds;
        if (!targetRecordIds || targetRecordIds.length === 0) {
            const empAssets = assets.filter(a => {
                const h = a["Current Holder (ผู้ถือครองปัจจุบัน)"];
                let name = "";
                if (Array.isArray(h) && h[0]) name = h[0].name || h[0].id;
                else if (typeof h === 'object') name = h.name || h.id;
                else name = String(h || "");
                return name.toLowerCase() === (employeeName || "").toLowerCase();
            });
            targetRecordIds = empAssets.map(a => a.record_id);
        }

        if (!targetRecordIds || targetRecordIds.length === 0) {
            return res.status(400).json({ ok: false, message: "ไม่พบรายการอุปกรณ์ของพนักงานท่านนี้ที่จะดึงเข้าคลัง" });
        }

        const todayStr = new Date().toISOString().split('T')[0];

        for (const recId of targetRecordIds) {
            await runLarkCli([
                "base", "+record-batch-update",
                "--base-token", BASE_TOKEN,
                "--table-id", TABLE_MASTER,
                "--as", "user",
                "--json", JSON.stringify({
                    record_id_list: [recId],
                    patch: {
                        "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
                        "Current Holder (ผู้ถือครองปัจจุบัน)": null,
                        "Audit Status (สถานะการยืนยัน)": "🟢 รับคืนเข้าคลังกลาง (Returned to Stock)",
                        "Specs / Notes (รายละเอียด/หมายเหตุ)": `รับคืนจากพนักงานลาออก (${employeeName || "Resigned Staff"}) เข้าคลังเมื่อ: ${todayStr}`
                    }
                })
            ]);
        }

        lastFetchTime = 0;
        lastLoanFetchTime = 0;

        // Log to Audit Campaign
        const auditLogPayload = {
            fields: [
                "Brand & Model (ยี่ห้อและรุ่น)",
                "IT Review Status (ผลการตรวจสอบโดย IT)",
                "Notes (หมายเหตุจากพนักงาน)",
                "IT Reviewer Notes (บันทึกของ IT)"
            ],
            rows: [[
                `Reclaimed ${targetRecordIds.length} devices from ${employeeName}`,
                "🟢 Verified & Locked (อนุมัติเข้า Master)",
                `ดึงเครื่องกลับเข้าคลังกลางเนื่องจากพนักงานลาออก (Closed Account)`,
                `Record IDs: ${targetRecordIds.join(', ')}`
            ]]
        };

        await runLarkCli([
            "base", "+record-batch-create",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_AUDIT,
            "--as", "user",
            "--json", JSON.stringify(auditLogPayload)
        ]);

        res.json({
            ok: true,
            message: `ดึงอุปกรณ์ของ ${employeeName} ทั้งหมด ${targetRecordIds.length} รายการกลับเข้าคลังกลางเรียบร้อยแล้ว!`
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Batch Reclaim ALL devices of ALL resigned employees (Protected by requireAdminAuth)
app.post('/api/admin/resigned/reclaim-all-batch', requireAdminAuth, async (req, res) => {
    try {
        const employees = await getEmployeeDeviceList();
        const resignedList = employees.filter(e => e.isResigned);
        
        let allReclaimIds = [];
        resignedList.forEach(e => {
            e.devices.forEach(d => allReclaimIds.push({ recId: d.record_id, empName: e.name }));
        });

        if (allReclaimIds.length === 0) {
            return res.json({ ok: true, message: "ไม่มีอุปกรณ์ค้างกับพนักงานที่ลาออกแล้ว" });
        }

        const todayStr = new Date().toISOString().split('T')[0];

        for (const item of allReclaimIds) {
            await runLarkCli([
                "base", "+record-batch-update",
                "--base-token", BASE_TOKEN,
                "--table-id", TABLE_MASTER,
                "--as", "user",
                "--json", JSON.stringify({
                    record_id_list: [item.recId],
                    patch: {
                        "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
                        "Current Holder (ผู้ถือครองปัจจุบัน)": null,
                        "Audit Status (สถานะการยืนยัน)": "🟢 รับคืนเข้าคลังกลาง (Returned to Stock)",
                        "Specs / Notes (รายละเอียด/หมายเหตุ)": `รับคืนจากพนักงานลาออก (${item.empName}) เข้าคลังเมื่อ: ${todayStr}`
                    }
                })
            ]);
        }

        lastFetchTime = 0;
        lastLoanFetchTime = 0;

        res.json({
            ok: true,
            message: `ดึงอุปกรณ์ของพนักงานที่ลาออกทั้งหมด ${resignedList.length} คน รวม ${allReclaimIds.length} รายการ กลับเข้าคลังกลางเรียบร้อย!`,
            count: allReclaimIds.length
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 14. Resigned Handover Endpoints (Detect & Resolve Transferred Devices - Protected by requireAdminAuth)
app.get('/api/admin/resigned/handovers', requireAdminAuth, async (req, res) => {
    try {
        const employees = await getEmployeeDeviceList();
        const resignedEmployees = employees.filter(e => e.isResigned);
        const activeEmployees = employees.filter(e => !e.isResigned);

        const handovers = [];
        const seenHandoverKeys = new Set();

        resignedEmployees.forEach(rEmp => {
            rEmp.devices.forEach(rDev => {
                const rSn = (rDev["Serial Number (S/N)"] || "").trim().toLowerCase();
                const rTag = (rDev["Asset Tag (เลขทรัพย์สิน)"] || "").trim().toLowerCase();

                activeEmployees.forEach(aEmp => {
                    aEmp.devices.forEach(aDev => {
                        const aSn = (aDev["Serial Number (S/N)"] || "").trim().toLowerCase();
                        const aTag = (aDev["Asset Tag (เลขทรัพย์สิน)"] || "").trim().toLowerCase();

                        const matchSn = rSn && rSn !== "---" && rSn !== "none" && rSn !== "-" && rSn === aSn;
                        const matchTag = rTag && rTag !== "ไม่ทราบ" && rTag !== "-" && rTag !== "none" && rTag === aTag;

                        if (matchSn || matchTag) {
                            const key = `${rDev.record_id}_${aDev.record_id}`;
                            if (!seenHandoverKeys.has(key)) {
                                seenHandoverKeys.add(key);
                                handovers.push({
                                    matchType: matchSn ? "Serial Number" : "Asset Tag",
                                    matchedValue: matchSn ? rDev["Serial Number (S/N)"] : rDev["Asset Tag (เลขทรัพย์สิน)"],
                                    deviceName: aDev["Device Name (ชื่อรุ่น/อุปกรณ์)"] || rDev["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset",
                                    deviceType: getSingleValue(aDev["Device Type (ประเภทอุปกรณ์)"] || rDev["Device Type (ประเภทอุปกรณ์)"]) || "Device",
                                    resignedEmp: rEmp.name,
                                    resignedRecordId: rDev.record_id,
                                    activeEmp: aEmp.name,
                                    activeOrg: aEmp.organization,
                                    activeRecordId: aDev.record_id,
                                    activeAuditStatus: getSingleValue(aDev["Audit Status (สถานะการยืนยัน)"]) || "รอตรวจสอบ"
                                });
                            }
                        }
                    });
                });
            });
        });

        res.json({
            ok: true,
            handoverCount: handovers.length,
            handovers: handovers
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Resolve Handover (Batch or Single - Protected by requireAdminAuth)
app.post('/api/admin/resigned/resolve-handovers', requireAdminAuth, async (req, res) => {
    try {
        const { handoversToResolve } = req.body;
        if (!handoversToResolve || handoversToResolve.length === 0) {
            return res.status(400).json({ ok: false, message: "ไม่มีรายการที่เลือกสำหรับอนุมัติการส่งต่อ" });
        }

        const resignedIdsToDelete = handoversToResolve.map(h => h.resignedRecordId);

        // 1. Delete obsolete records under resigned staff
        await runLarkCli([
            "base", "+record-delete",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_MASTER,
            "--as", "user",
            "--yes",
            "--json", JSON.stringify({ record_id_list: resignedIdsToDelete })
        ]);

        // 2. Batch update active employee's records to Verified
        for (const h of handoversToResolve) {
            await runLarkCli([
                "base", "+record-batch-update",
                "--base-token", BASE_TOKEN,
                "--table-id", TABLE_MASTER,
                "--as", "user",
                "--json", JSON.stringify({
                    record_id_list: [h.activeRecordId],
                    patch: {
                        "Audit Status (สถานะการยืนยัน)": "🟢 ยืนยันแล้ว (Verified)",
                        "Specs / Notes (รายละเอียด/หมายเหตุ)": `โอนย้ายสิทธิ์มาจากพนักงานลาออก (${h.resignedEmp}) สู่ (${h.activeEmp}) เรียบร้อย`
                    }
                })
            ]);
        }

        lastFetchTime = 0;
        lastLoanFetchTime = 0;
        cachedAssets = cachedAssets.filter(a => !resignedIdsToDelete.includes(a.record_id));

        // 3. Log to Audit table with full details per device
        const auditEntries = handoversToResolve.map(h => ({
            brandModel: h.deviceName || "IT Asset",
            reviewStatus: "🟢 Verified & Locked (อนุมัติเข้า Master)",
            org: h.activeOrg || "XPO",
            deviceType: h.deviceType || "Other",
            assetTag: h.matchType === 'Asset Tag' ? h.matchedValue : "-",
            serialNumber: h.matchType === 'Serial Number' ? h.matchedValue : "-",
            notes: `ประวัติการส่งต่อเครื่อง (Device Handover Log): ส่งต่อจาก [${h.resignedEmp}] (คนลาออก) สู่ [${h.activeEmp}] (คนปัจจุบัน)`,
            reviewerNotes: `แถวเดิมของคนลาออก (Record ID: ${h.resignedRecordId}) ถูกลบออกจาก Master Table และบันทึกประวัติการส่งต่อไว้ที่นี่อย่างถาวร สำหรับตรวจสอบย้อนหลังกรณีเครื่องพังหรือชำรุด | แถวปัจจุบัน: ${h.activeRecordId} | วันที่บันทึก: ${new Date().toLocaleString('th-TH')}`
        }));

        await saveDeletionAuditLog(auditEntries);

        res.json({
            ok: true,
            message: `อนุมัติการส่งต่อเครื่องและลบแถวเก่าของคนลาออกเรียบร้อยแล้ว ${handoversToResolve.length} รายการ (บันทึกประวัติลงตาราง Log ถาวร)!`,
            count: handoversToResolve.length
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 15. Audit Logs Endpoint (Fetch audit trail for review - Protected by requireAdminAuth)
app.get('/api/admin/audit-logs', requireAdminAuth, async (req, res) => {
    try {
        const resList = await runLarkCli([
            "base", "+record-list",
            "--base-token", BASE_TOKEN,
            "--table-id", TABLE_AUDIT,
            "--format", "json",
            "--as", "user"
        ]);

        const logs = [];
        if (resList.ok && resList.data && resList.data.data) {
            const rows = resList.data.data || [];
            const fields = resList.data.fields || [];
            const recordIds = resList.data.record_id_list || [];

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                const rec = { record_id: recordIds[i] };
                fields.forEach((fName, idx) => {
                    rec[fName] = row[idx];
                });

                logs.push({
                    record_id: rec.record_id,
                    brandModel: rec["Brand & Model (ยี่ห้อและรุ่น)"] || "-",
                    status: getSingleValue(rec["IT Review Status (ผลการตรวจสอบโดย IT)"]) || "-",
                    org: getSingleValue(rec["Organization (สังกัด)"]) || "-",
                    deviceType: getSingleValue(rec["Device Type (ประเภทอุปกรณ์)"]) || "-",
                    assetTag: rec["Asset Tag (เลขทรัพย์สินบนเครื่อง)"] || "-",
                    serialNumber: rec["Serial Number (S/N บนตัวเครื่อง)"] || "-",
                    notes: rec["Notes (หมายเหตุจากพนักงาน)"] || "-",
                    reviewerNotes: rec["IT Reviewer Notes (บันทึกของ IT)"] || "-"
                });
            }
        }

        res.json({
            ok: true,
            count: logs.length,
            logs: logs.reverse() // latest first
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// 16. Lifecycle Hub Endpoints (HR ➔ Admin ➔ IT ➔ Admin ➔ Stock)
const lifecycleService = require('./services/lifecycleService');

// Lifecycle Login (Protected by loginLimiter & HMAC Signed Tokens)
app.post('/api/lifecycle/login', loginLimiter, (req, res) => {
    try {
        const { role, password } = req.body;
        if (!role || !password) return res.status(400).json({ ok: false, message: "กรุณาระบุ Role และ รหัสผ่าน" });

        const validPasswords = {
            "HR": ["hr2026", "itadmin2026"],
            "ADMIN": ["admin2026", "itadmin2026"],
            "IT": ["itadmin2026"]
        };

        const allowed = validPasswords[role] || ["itadmin2026"];
        if (allowed.includes(password.trim())) {
            const actorNames = {
                'HR': 'HR (คุณ Filmmy)',
                'ADMIN': 'Admin (คุณ Ploy)',
                'IT': 'IT (ฝ่ายไอที)'
            };
            const token = generateSignedToken({ role, actorName: actorNames[role] || 'Staff User' }, 24);
            return res.json({
                ok: true,
                role,
                token,
                actorName: actorNames[role] || 'Staff User'
            });
        }

        return res.status(401).json({ ok: false, message: "รหัสผ่านไม่ถูกต้องสำหรับบทบาทนี้" });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Tasks List (Protected by requireLifecycleAuth)
app.get('/api/lifecycle/tasks', requireLifecycleAuth, (req, res) => {
    try {
        const org = req.query.org || 'ALL';
        const tasks = lifecycleService.getTasks(org);

        const stats = {
            total: tasks.length,
            offboardingWaitingAdmin: tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_ADMIN_COLLECTION').length,
            offboardingWaitingIT: tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_IT_REIMAGE').length,
            offboardingWaitingStore: tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_ADMIN_STORE').length,
            onboardingWaitingPack: tasks.filter(t => t.type === 'onboarding' && t.currentStage === 'WAITING_ADMIN_PACK').length,
            onboardingWaitingHandover: tasks.filter(t => t.type === 'onboarding' && t.currentStage === 'WAITING_HANDOVER').length,
            completed: tasks.filter(t => t.currentStage === 'COMPLETED').length
        };

        res.json({ ok: true, stats, tasks });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Offboarding Task Creation (Protected by requireLifecycleAuth)
app.post('/api/lifecycle/tasks/offboarding', requireLifecycleAuth, async (req, res) => {
    try {
        const { employeeName, organization, targetDate, notes, actor, devices } = req.body;
        if (!employeeName) return res.status(400).json({ ok: false, message: "กรุณาระบุชื่อพนักงานที่ลาออก" });

        let taskDevices = devices;
        if (!taskDevices || taskDevices.length === 0) {
            const employees = await getEmployeeDeviceList();
            const emp = employees.find(e => e.name.toLowerCase().includes(employeeName.toLowerCase()) || employeeName.toLowerCase().includes(e.name.toLowerCase()));
            if (emp && emp.devices) {
                taskDevices = emp.devices.map(d => ({
                    name: d["Device Name (ชื่อรุ่น/อุปกรณ์)"] || d["Device Type (ประเภทอุปกรณ์)"] || "IT Asset",
                    tag: d["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบ",
                    sn: d["Serial Number (S/N)"] || "-",
                    recordId: d.record_id,
                    status: "รอรับคืน"
                }));
            }
        }

        const task = lifecycleService.createOffboardingTask({
            employeeName: sanitizeString(employeeName, 100),
            organization: organization || "XPO",
            targetDate: sanitizeString(targetDate, 20),
            notes: sanitizeString(notes, 500),
            actor: actor || "HR (คุณ Filmmy)",
            devices: taskDevices || []
        });

        res.json({ ok: true, message: `สร้างรายการรับคืนอุปกรณ์ของ ${employeeName} เรียบร้อยแล้ว!`, task });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Onboarding Task Creation (Protected by requireLifecycleAuth)
app.post('/api/lifecycle/tasks/onboarding', requireLifecycleAuth, (req, res) => {
    try {
        const { employeeName, position, organization, targetDate, notes, actor, devices } = req.body;
        if (!position) return res.status(400).json({ ok: false, message: "กรุณาระบุตำแหน่งพนักงานใหม่" });

        const task = lifecycleService.createOnboardingTask({
            employeeName: sanitizeString(employeeName || `${position} (New Joiner)`, 100),
            position: sanitizeString(position, 100),
            organization: organization || "XPO",
            targetDate: sanitizeString(targetDate, 20),
            notes: sanitizeString(notes, 500),
            actor: actor || "HR (คุณ Filmmy)",
            devices: devices || []
        });

        res.json({ ok: true, message: `สร้างรายการจัดเตรียมอุปกรณ์สำหรับ ${position} เรียบร้อยแล้ว!`, task });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Stage Advancement (Protected by requireLifecycleAuth)
app.post('/api/lifecycle/tasks/advance', requireLifecycleAuth, async (req, res) => {
    try {
        const { taskId, actor, note } = req.body;
        if (!taskId) return res.status(400).json({ ok: false, message: "taskId is required" });

        const prevTask = lifecycleService.getTaskById(taskId);
        if (!prevTask) return res.status(404).json({ ok: false, message: "Task not found" });

        const updatedTask = lifecycleService.advanceTaskStage(taskId, actor, note);

        // If completed offboarding task, update devices in Master to 'Available in Stock' & save audit log
        if (updatedTask.type === 'offboarding' && updatedTask.currentStage === 'COMPLETED') {
            const devRecordIds = (updatedTask.devices || []).map(d => d.recordId).filter(Boolean);
            if (devRecordIds.length > 0) {
                for (const rId of devRecordIds) {
                    await runLarkCli([
                        "base", "+record-batch-update",
                        "--base-token", BASE_TOKEN,
                        "--table-id", TABLE_MASTER,
                        "--as", "user",
                        "--json", JSON.stringify({
                            record_id_list: [rId],
                            patch: {
                                "Status (สถานะอุปกรณ์)": "🔵 พร้อมใช้งานในคลัง (Available in Stock)",
                                "Current Holder (ผู้ถือครองปัจจุบัน)": null,
                                "Audit Status (สถานะการยืนยัน)": "🟢 รับคืนเข้าคลังกลาง (Returned to Stock)",
                                "Specs / Notes (รายละเอียด/หมายเหตุ)": `ผ่านกระบวนการล้างเครื่อง/ลง OS ใหม่ และเก็บเข้าตู้สต็อกเรียบร้อย (${updatedTask.employeeName})`
                            }
                        })
                    ]);
                }
                lastFetchTime = 0;
            }

            // Save Audit Log
            await saveDeletionAuditLog([{
                brandModel: `Lifecycle Offboarding: ${updatedTask.employeeName}`,
                reviewStatus: "🟢 Verified & Locked (อนุมัติเข้า Master)",
                org: updatedTask.organization || "XPO",
                deviceType: "Multi-Device Pack",
                assetTag: "-",
                serialNumber: "-",
                notes: `กระบวนการรับคืนอุปกรณ์สมบูรณ์: HR แจ้ง ➔ Admin รับของ ➔ IT ลง OS/ตรวจสภาพ ➔ Admin เก็บเข้าตู้สต็อก`,
                reviewerNotes: `พนักงาน: ${updatedTask.employeeName} | จำนวนอุปกรณ์: ${updatedTask.devices.length} ชิ้น | วันที่เสร็จสิ้น: ${new Date().toLocaleString('th-TH')}`
            }]);
        }

        res.json({ ok: true, message: `อัปเดตขั้นตอนงานสำเร็จ!`, task: updatedTask });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Delete Task (Protected by requireLifecycleAuth)
app.delete('/api/lifecycle/tasks/:id', requireLifecycleAuth, (req, res) => {
    try {
        const deleted = lifecycleService.deleteTask(req.params.id);
        if (!deleted) return res.status(404).json({ ok: false, message: "Task not found" });
        res.json({ ok: true, message: "ลบ Task เรียบร้อยแล้ว", task: deleted });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Start Server & Initialize Scheduler
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 IT Asset Portal running at: http://localhost:${PORT}`);
    console.log(`📡 Connected to Lark Base: ${BASE_TOKEN}`);
    console.log(`🔑 Admin Password: ${ADMIN_PASSWORD}`);
    console.log(`🛡️ Bot Sandbox Mode: ${larkBot.botConfig.sandboxMode ? 'ACTIVE (Whitelist Only)' : 'LIVE'}`);
    console.log(`📋 Whitelisted Users: [${larkBot.botConfig.whitelist.join(', ')}]`);
    console.log(`====================================================`);

    // Initialize daily 09:00 AM Cron
    scheduler.initScheduler({
        getEmployees: getEmployeeDeviceList,
        getActiveLoans: fetchLoanRecords
    });
});
