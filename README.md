# 💻 IT Asset Management Hub & Freeze Campaign Portal

Enterprise IT Asset Management, Verification Campaign (7-Day Freeze Policy), and 3-Way Lifecycle Offboarding & Onboarding Hub for **XPO** and **EDDU** organizations, seamlessly synchronized with **Lark Base** and **Lark Bot Notifications**.

---

## 🌟 Key Features

### 1. 🔍 Self-Service Asset Verification (โหมดตรวจสอบและยืนยันทรัพย์สิน)
- Real-time search across Lark Base Master Inventory with intelligent name aliasing.
- 1-Click device verification with audit notes and discrepancy reporting.
- **Locked Identity View**: When accessed via Lark Bot Magic Link (`?emp=...&mode=locked`), employee identity is locked to prevent unauthorized viewing or editing of colleagues' devices.

### 2. ➕ New Asset Registration & Tag Replacement (ลงทะเบียนเครื่องใหม่ / ขอติดป้าย)
- Direct registration of unrecorded devices into Master Base.
- 1-Click "Missing Asset Tag" reporting for IT re-tagging dispatch.

### 3. 🔄 Temporary Loan Management (ระบบยืม-คืนอุปกรณ์ชั่วคราว)
- Real-time loan status tracking (Active, Due Soon, Overdue, Returned).
- 1-Click stock return with condition reporting and automatic audit trail.

### 4. 📊 IT Admin Control Center & Freeze Campaign Monitor
- Real-time statistics across XPO and EDDU organizations with completion progress meters.
- **Smart Duplicate Cleaner**: Auto-detects identical Serial Numbers and employee-reported duplicates with 1-click safe batch removal and permanent audit logging.
- **Resigned Staff Tracker**: 1-Click auto-reclaim of devices held by resigned/closed accounts back to central stock.
- **Transferred Handover Resolver**: Auto-detects when a device originally held by a resigned employee is claimed by an active employee and resolves the duplicate cleanly.
- **Lark Bot Sandbox Console**: Whitelist-protected test center for interactive Lark notification cards.

### 5. 👥 3-Party Lifecycle Hub (HR ➔ Admin ➔ IT ➔ Admin ➔ Stock)
- **Step 1 (HR แจ้งออก)**: HR creates offboarding task with auto-filled device list.
- **Step 2 (Admin รับของ)**: Admin physically receives devices from departing staff.
- **Step 3 (IT ตรวจสภาพ & Reimage)**: IT formats, reinstalls OS, and checks hardware health.
- **Step 4 (Admin เก็บเข้าตู้สต็อก)**: Admin locks verified devices into stock or prepares onboarding kits for new joiners.

---

## 🛡️ Enterprise Security & Hardening

- **OWASP Broken Access Control Remediation**: Backend routes (`/api/admin/*` and `/api/lifecycle/*`) strictly protected by `requireAdminAuth` and `requireLifecycleAuth` middleware.
- **HMAC-SHA256 Signed Tokens**: 24-hour cryptographic session tokens with signature verification.
- **Anti-Brute Force Protection**: Express rate limiting on login endpoints (max 10 attempts / 15 mins) and global API (max 300 req / min).
- **HTTP Security Headers**: Powered by `helmet` for clickjacking, XSS, and MIME-sniffing protection.
- **Atomic File Persistence**: File operations use temporary writes and atomic renames to prevent race conditions and corrupted JSON files.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Lark CLI (`lark-cli`) installed and authenticated

### Installation
```bash
# 1. Clone repository
git clone <repository-url>
cd it-asset-portal

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server
npm start
# Server will run at http://localhost:3000
```

---

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

---

## 📄 License
Internal Enterprise Tool - Xponential Enterprise Co., Ltd.
