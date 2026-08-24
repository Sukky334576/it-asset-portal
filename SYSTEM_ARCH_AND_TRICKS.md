# 📚 IT Asset Hub: Architecture, Lark API Tricks & Handover Guide

คู่มือสรุปสถาปัตยกรรมระบบ, ทริคสำคัญ (Gotchas), คีย์คอนฟิก และแนวทางปฏิบัติสำหรับการส่งต่องานและการพัฒนาต่ออย่างราบรื่น

---

## 🌐 1. ข้อมูลระบบและการ Deploy (Production & Development)

| รายการ | ค่าที่ใช้งาน (Configuration) |
| :--- | :--- |
| **GitHub Repository** | `Sukky334576/it-asset-portal` (Branch: `main`) |
| **Cloudflare Production URL** | `https://it-asset-portal.shine-toothbrush.workers.dev` |
| **Cloudflare Account ID** | `e2d00bf217d08093261362e69871d081` (Shine Toothbrush) |
| **Local Dev Server** | `http://localhost:3000` (รันด้วย `node server.js` หรือ `npx wrangler dev`) |
| **Node.js Runtime** | Node.js 18+ (พร้อม `express`, `cors`, `helmet`, `crypto`) |

---

## 🔑 2. Lark Credentials, Tokens & Base Table IDs

> **คำเตือนความปลอดภัย**: ข้อมูลชุดนี้ใช้สำหรับระบบภายในองค์กร XPO & EDDU เท่านั้น

```ini
LARK_APP_ID = "cli_aa9a88a6e7f89ed2"
LARK_APP_SECRET = "qmzk... (See .env or wrangler.toml)"
BASE_TOKEN = "G2IgbTgmmaLnQPs3LPblGz0ngQf"
LARK_BOT_SECRET = "it_asset_hub_secure_hmac_secret_2026"
ADMIN_PASSWORD = "itadmin2026"
LIFECYCLE_PASSWORD = "lifecycle2026"
```

### 📊 Lark Base Table IDs:
1. **IT Assets Master (ตารางทรัพย์สินหลัก)**: `tblA1JXS2dWC9a5b`
2. **Audit Logs & Discrepancies (ตารางประวัติการยืนยัน/แจ้งซ้ำ)**: `tblzKjtJuoAifQKS`
3. **Temporary Loans & Returns (ตารางยืม-คืนอุปกรณ์ชั่วคราว)**: `tblwL0cJzvv1qsj3`

---

## 🛡️ 3. สถาปัตยกรรมความปลอดภัย & Lark SSO 2.0 (Core Architecture)

### 3.1 Strict Lark SSO Gateway (Zero Data Leakage)
- **เมื่อยังไม่ล็อกอิน**: หน้าเว็บจะไม่แสดงรายชื่อพนักงาน, ช่องค้นหา หรือตารางเครื่องใดๆ ทั้งสิ้น โดยจะแสดงเฉพาะหน้า **Lark SSO Gateway (1-Click Login)**
- **เมื่อล็อกอินผ่าน Lark สำเร็จ**: ระบบจะใช้ **Lark OpenID (`ou_...`)** ในการดึงเฉพาะเครื่องที่เป็นของพนักงานคนนั้น 100% 
- **ปิดช่องค้นหาชื่อถาวร**: พนักงานไม่สามารถพิมพ์ค้นหาหรือดูเครื่องของเพื่อนร่วมงานคนอื่นได้ ป้องกันปัญหาข้อมูลสับสน (Data Collision) โดยสิ้นเชิง

### 3.2 Registered Redirect URLs ใน Lark Developer Console:
ต้องมี URL เหล่านี้อยู่ใน **Security Settings ➔ Redirect URLs** เสมอ:
- `http://localhost:3000/auth/callback`
- `https://it-asset-portal.shine-toothbrush.workers.dev/`
- `https://it-asset-portal.shine-toothbrush.workers.dev/auth/callback`

---

## 💡 4. ทริคสำคัญ & Gotchas ที่ต้องรู้ (Crucial Tricks & Pitfalls)

### 🔴 Trick 1: ปัญหา Lark Error 20029 (Invalid redirect URL)
- **สาเหตุ**: Lark OAuth ตรวจสอบ URL ละเอียดมาก หากโปรโตคอลเป็น `http://` แทนที่จะเป็น `https://` บน Cloudflare Worker / Tunnel จะถูกปฏิเสธทันที
- **วิธีแก้**: ใน `server.js` และ `worker.js` ต้องตั้งค่า `app.set('trust proxy', 1)` และบังคับโปรโตคอลให้เป็น `https://` เสมอเมื่ออยู่บน Cloudflare หรือ Reverse Proxy

### 🔴 Trick 2: การบันทึก User Field ใน Lark Base API (Error 1254066 `UserFieldConvFail`)
- **สาเหตุ**: ฟิลด์ `Current Holder (ผู้ถือครองปัจจุบัน)` ใน Lark Base เป็นประเภท **User Field** ซึ่ง API ของ Lark รองรับเฉพาะการส่ง Array ของ Object ที่มี `id` เป็น Lark OpenID (`[{ "id": "ou_..." }]`)
- **ข้อห้าม**: ห้ามส่ง `[{ "name": "Somchai" }]` เข้า User Field เด็ดขาด เพราะจะเกิด Error `UserFieldConvFail`
- **วิธีปฏิบัติ**: หากไม่มี `ou_...` ให้ใส่ชื่อผู้ถือครองลงในฟิลด์ข้อความ `Specs / Notes` แทน

### 🔴 Trick 3: บอทส่งการ์ดไม่ไป (Error 230013 `Bot has NO availability to this user`)
- **สาเหตุ**: Lark Developer Console ยังไม่ได้เปิดสิทธิ์ขอบเขตความพร้อมใช้งาน (Availability) ให้เป็น All Members
- **วิธีแก้**: ไปที่ **Lark Developer Console** ➔ **Version Management & Release** ➔ **Availability** ➔ เลือก **All Members (พนักงานทุกคน)** ➔ กด **Create a Version** ➔ กด **Publish**

### 🔴 Trick 4: ป้องกันปัญหาการจับคู่ชื่อซ้ำ (Substring Collision)
- **ปัญหาเดิม**: การใช้ `String.includes()` จะทำให้คนชื่อ `Phat` ไปจับคู่กับ `Tle.Teeraphat`
- **วิธีแก้ที่ทำแล้ว**: ใช้ **Lark OpenID (`ou_...`)** เป็น Primary Match Key เสมอ และหากเปรียบเทียบชื่อ ให้ใช้ `===` (Exact Match) แบบ Case-Insensitive เท่านั้น

### 🔴 Trick 5: โครงสร้างเวลาแคมเปญ Freeze Period
- แคมเปญถูกกำหนดไว้คือ: **วันศุกร์ที่ 28 ส.ค. 2026 09:00 น. ถึง วันศุกร์ที่ 4 ก.ย. 2026 18:00 น.**
- ด้านบนสุดของเว็บมี Countdown Timer คำนวณแบบ Dynamic 3 ช่วง (ก่อนเริ่ม, กำลังรัน, สิ้นสุดแคมเปญ)

---

## ⚡ 5. Quick Command Reference (คำสั่งลัด)

### Deploy ขึ้น Cloudflare Workers:
```bash
cd "/Users/xpo/Downloads/CSM Part/it-asset-portal"
npx wrangler deploy
```

### สั่งรัน Server Localhost บนเครื่อง Mac:
```bash
cd "/Users/xpo/Downloads/CSM Part/it-asset-portal"
node server.js
```

### ทดสอบยิง Lark Card หาพนักงานเฉพาะบุคคล:
```bash
node -e '
(async () => {
  const LarkDirectApi = require("./services/larkDirectApi");
  const larkBot = require("./services/larkBot");
  const lark = new LarkDirectApi("cli_aa9a88a6e7f89ed2", "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5", "G2IgbTgmmaLnQPs3LPblGz0ngQf");
  const openId = "ou_ddbd83ad4f843334774fcde57c094c32"; // ระบุ OpenID ปลายทาง
  const name = "Aof.Thanakorn";
  const records = await lark.fetchRecords("tblA1JXS2dWC9a5b");
  const myDevices = records.filter(r => JSON.stringify(r).includes(openId));
  const cardPayload = larkBot.createVerificationCard(name, myDevices, openId);
  const token = await lark.getTenantAccessToken();
  const res = await fetch("https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=open_id", {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ receive_id: openId, msg_type: "interactive", content: JSON.stringify(cardPayload) })
  });
  console.log(await res.json());
})();'
```

---

## 🤝 6. Collaboration Workflow (แนวทางและกระบวนการทำงานร่วมกันระหว่าง User & AI Agent)

เพื่อให้การทำงานร่วมกันมีประสิทธิภาพสูงสุดและต่อเนื่อง ไม่ว่าจะเปิด Conversation ใหม่กี่ครั้ง ให้ยึดแนวทางปฏิบัติดังนี้:

### 6.1 บทบาทหน้าที่ (Roles & Responsibilities):
- **User (Product Owner & Lark Admin)**:
  - กำหนด Business Logic, เงื่อนไขแคมเปญ และ Requirement การใช้งานจริง
  - อนุมัติสิทธิ์ (Allow) บน Cloudflare Dashboard หรือจัดการ Scope / Redirect URLs ใน Lark Developer Console
  - ทดสอบ User Flow บนอุปกรณ์จริงร่วมกับทีมงาน
- **AI Agent (Full-Stack Engineer & DevOps)**:
  - ออกแบบสถาปัตยกรรมและเขียนโค้ดทั้งระบบ (Frontend UI, Express Server, Cloudflare Worker, Lark REST API)
  - จัดการ Git Version Control, ตรวจสอบ Secret Scanning ก่อน Push
  - จัดการ Build & Deploy ขึ้น Cloudflare Workers ผ่าน `wrangler`
  - ตรวจสอบความถูกต้องด้วย Unit Test, Curl และจับภาพหน้าจอด้วย Puppeteer เพื่อ Verify ก่อนส่งมอบ

---

### 6.2 ขั้นตอนการพัฒนาและส่งมอบงานมาตรฐาน (6-Step Development Lifecycle):

```mermaid
graph TD
    A["1. Requirement & Architecture Alignment"] --> B["2. Dual-Environment Implementation (Server & Worker)"]
    B --> C["3. Automated Browser & API Verification (Puppeteer)"]
    C --> D["4. Git Commit & Push (Secret Protection Safe)"]
    D --> E["5. One-Click Cloudflare Deploy (Wrangler)"]
    E --> F["6. Live Lark Bot Testing & End-to-End Validation"]
```

1. **Step 1: Alignment**: รับโจทย์ วิเคราะห์ผลกระทบต่อ Lark Base Schema และโครงสร้างข้อมูล
2. **Step 2: Dual Implementation**: เขียนโค้ดให้รองรับ 2 สภาพแวดล้อมพร้อมกันเสมอ:
   - `server.js`: Node.js Express สำหรับ Local Development
   - `worker.js`: Cloudflare Serverless สำหรับ Production
3. **Step 3: Verification**: ใช้ Puppeteer จำลองหน้าจอและแคปเจอร์ภาพ Screenshot ตรวจสอบ UI ทุกครั้ง
4. **Step 4: Safe Git Push**: จัดการ Git Commit และระวังการ Mask คีย์ Secret เสมอ เพื่อไม่ให้ติด GitHub Push Protection
5. **Step 5: Production Deployment**: รัน `npx wrangler deploy` เพื่ออัปเดตระบบจริงไปยัง `shine-toothbrush.workers.dev`
6. **Step 6: Live Bot & SSO Testing**: ทดสอบยิง Lark Card และตรวจสอบ OAuth SSO จริงกับบัญชีพนักงานเป้าหมาย

---

### 6.3 กฎการสื่อสารและการทำงานที่มีประสิทธิภาพ (Communication Best Practices):
- **กระชับ ชัดเจน และมีหลักฐาน**: รายงานผลด้วยภาพ Screenshot และผลลัพธ์ JSON จริงเสมอ
- **Step-by-Step Action สำหรับ User**: หากต้องมีการตั้งค่าบนหน้าเว็บ Lark/Cloudflare ให้สรุปเป็นข้อๆ สั้นๆ พร้อมระบุเมนูและปุ่มที่ต้องกดให้ชัดเจน
- **Auto-Sync to Markdown**: เมื่อมีการเปลี่ยนคอนฟิก หรือเจอปัญหาใหม่ (Gotcha) ให้บันทึกอัปเดตลงในไฟล์นี้ทันที

---

## 📖 7. Role-Based User Manuals & Operational SOP (คู่มือการใช้งาน 4 บทบาท)

### 👤 7.1 คู่มือพนักงานทั่วไป (Employee SOP)
1. **เข้าสู่ระบบด้วย Lark SSO (1-Click Login)**:
   - เปิดลิงก์ `https://it-asset-portal.shine-toothbrush.workers.dev`
   - กดปุ่ม **[🚀 เข้าสู่ระบบด้วย Lark (Login with Lark)]** เพื่อยืนยันตัวตนอย่างปลอดภัย
2. **ตรวจสอบและยืนยันเครื่องประจำตัว (แท็บ 1)**:
   - ตรวจดูเลขทรัพย์สิน (Asset Tag) บนสติกเกอร์ และเลข Serial Number ใต้เครื่อง
   - หากข้อมูลถูกต้อง: กดปุ่มสีเขียว **[✅ ข้อมูลถูกต้อง]**
   - หากพบข้อมูลซ้ำ หรือไม่ได้ถือครองเครื่องนี้แล้ว: กดยืนยันตัวจริง 1 เครื่อง แล้วกด **[✏️ แก้ไข/ย้าย]** บนตัวที่ซ้ำ เลือก **[🗑️ แจ้งเป็นข้อมูลซ้ำ]** เพื่อให้ IT เคลียร์ออกจากระบบ
3. **ลงทะเบียนเครื่องใหม่ (แท็บ 2)**:
   - ระบบจะล็อกชื่อบัญชี Lark ของคุณเป็นผู้ถือครองให้อัตโนมัติ
   - กรอกเลข Asset Tag และ Serial Number (มีระบบเตือนซ้ำ Real-time) ➔ กด **[🚀 บันทึกลงทะเบียน & ยืนยันเครื่องเข้าสู่ระบบ]**
4. **ยืม-คืนอุปกรณ์ชั่วคราว (แท็บ 3)**:
   - เลือกอุปกรณ์ที่ต้องการยืม ➔ เลือกระยะเวลายืมด่วน (1 วัน / 3 วัน / 7 วัน) ➔ กดส่งคำขอ
   - เมื่อนำของมาคืน: เปิดแท็บ *"รายการที่กำลังยืมอยู่"* แล้วกดปุ่ม **[📥 ส่งคืนอุปกรณ์]**

---

### 📊 7.2 คู่มือเจ้าหน้าที่ IT Admin (IT Admin SOP)
1. **การเข้าสู่ Dashboard**:
   - กดปุ่ม **[🔑 สำหรับเจ้าหน้าที่ IT Admin & HR]** ➔ กรอกรหัสผ่าน `itadmin2026`
2. **การ Monitor แคมเปญ 7-Day Freeze**:
   - ตรวจสอบอัตราความคืบหน้ารายบริษัท (% Verified XPO vs EDDU)
   - ตรวจสอบรายชื่อพนักงานที่ยังไม่ยืนยัน (Pending List) และรายการป้ายสติกเกอร์สูญหาย (Missing Tag Requests)
3. **การล้างข้อมูลซ้ำ (Smart Duplicate Cleaner)**:
   - ตรวจสอบตารางรายการที่พบ Serial Number ชนกัน หรือรายการที่พนักงานกด Flag ซ้ำ
   - กดปุ่ม **[⚡ ล้างรายการซ้ำที่เข้าเงื่อนไขทั้งหมดอัตโนมัติ (Safe Auto-Clean)]** ระบบจะคง Record ตัวจริงไว้ และลบ Record ซ้ำพร้อมบันทึกลง Audit Logs อัตโนมัติ
4. **การดึงเครื่องคนลาออกเข้าคลังกลาง (Resigned Auto-Reclaim)**:
   - ในกล่อง *พนักงานที่ลาออก / Closed Account* กดปุ่ม **[📥 ดึงอุปกรณ์ทั้งหมดกลับเข้าคลังกลาง (Reclaim to Stock)]** เพื่อปลดชื่อผู้ถือครองเดิมออกทันที
5. **การควบคุม Lark Bot**:
   - สั่งรันบอทยิงการ์ดแจ้งเตือนแบบ 1-on-1 เข้าแชท Lark ของพนักงานที่ยังไม่ได้ยืนยันตัวตน หรือทดสอบส่งหาพนักงานเฉพาะบุคคล

---

### 📦 7.3 คู่มือเจ้าหน้าที่ธุรการ / Admin คลัง (Operations SOP)
1. **การบริหารจัดการคลังกลาง (Central Stock)**:
   - เข้าแท็บ 3 ตรวจสอบจำนวนโน้ตบุ๊กสำรอง จอมอนิเตอร์ และอุปกรณ์เสริมที่พร้อมจ่าย (Available in Stock)
2. **การรับมอบเครื่องจริงจากคนลาออก (Step 2 ใน Lifecycle Hub)**:
   - เมื่อพนักงานนำเครื่องมาคืนในวันทำงานวันสุดท้าย ตรวจนับอุปกรณ์และสายชาร์จให้ครบตามตั๋ว แล้วกด **[📦 Admin รับเครื่องจริงแล้ว ➔ ส่งต่อ IT ตรวจสภาพ]**
3. **การจัดเตรียมชุด Onboarding Kit (Step 4 ใน Lifecycle Hub)**:
   - เมื่อ IT ล้างเครื่องและลง OS ใหม่เสร็จ Admin นำเครื่องมาจัดใส่กล่องชุด Kit (พร้อมบัตรผ่าน คีย์บอร์ด เมาส์) แล้วกด **[✅ Admin จัดชุด Kit เรียบร้อย ➔ พร้อมเริ่มงาน]**
4. **การตรวจรับคืนของยืมชั่วคราว**:
   - ตรวจสอบสภาพเครื่องและอุปกรณ์เสริมก่อนกดปุ่มยืนยันรับคืนเข้าสต็อก

---

### 👥 7.4 คู่มือฝ่ายบุคคล HR (HR Lifecycle SOP)
1. **การเข้าสู่ระบบ 3 ฝ่าย**:
   - เข้าแท็บ 5 (ส่งต่องาน 3 ฝ่าย) ➔ กรอกรหัสผ่าน `lifecycle2026`
2. **การเปิดตั๋วแจ้งพนักงานลาออก (Offboarding Flow)**:
   - กดปุ่ม **[➕ แจ้งพนักงานลาออก (Offboarding)]**
   - เลือกชื่อพนักงาน ➔ ระบบจะดึงรายการคอมพิวเตอร์และอุปกรณ์ทั้งหมดที่พนักงานคนนั้นถือครองอยู่มาใส่ในใบงานให้อัตโนมัติ
   - ระบุวันทำงานวันสุดท้าย ➔ กด **[🚀 ส่งเรื่องให้ Admin ธุรการรอดักรับของ]**
3. **การเปิดตั๋วแจ้งพนักงานเริ่มงานใหม่ (Onboarding Flow)**:
   - กดปุ่ม **[➕ แจ้งพนักงานเริ่มงานใหม่ (Onboarding)]**
   - ระบุชื่อพนักงานใหม่, สังกัด (XPO/EDDU), วันเริ่มงาน ➔ กด **[🚀 ส่งเรื่องให้ Admin จัดเตรียมของ]** ล่วงหน้าอย่างน้อย 3 วัน
4. **การติดตามสถานะ 3 ฝ่าย Real-time**:
   - ติดตามกระบวนการแบบ Step-by-Step (HR ➔ Admin ➔ IT ➔ Stock) ป้องกันปัญหาเครื่องสูญหายหรือตกหล่น 100%

---

*เอกสารฉบับนี้ถูกสร้างขึ้นเพื่อใช้เป็น Single Source of Truth สำหรับโปรเจกต์ IT Asset Management Hub.*
