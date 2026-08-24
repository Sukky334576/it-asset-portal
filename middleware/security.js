/**
 * ENTERPRISE SECURITY & DEFENSIVE HARDENING MIDDLEWARE
 * Comprehensive protection against OWASP Top 10 vulnerabilities
 */

const crypto = require('node:crypto');
const rateLimit = require('express-rate-limit');

// Secret Key for HMAC signature
const SECURITY_SECRET = process.env.APP_SECURITY_SECRET || 'it_asset_hub_enterprise_secret_key_2026_q98f4h';

// 1. Rate Limiting Protection (Brute-Force & DoS defense)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "⚠️ มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอ 15 นาทีแล้วลองใหม่อีกครั้ง (Rate limit exceeded)"
  }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "⚠️ คำขอถี่เกินไป กรุณาลองใหม่อีกครั้งในภายหลัง"
  }
});

// 2. Cryptographic HMAC Token Service with Expiration
function generateSignedToken(payloadObj, expiresInHours = 24) {
  const exp = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payloadStr = JSON.stringify({ ...payloadObj, exp, nonce: crypto.randomBytes(8).toString('hex') });
  const b64Payload = Buffer.from(payloadStr).toString('base64url');
  const signature = crypto.createHmac('sha256', SECURITY_SECRET).update(b64Payload).digest('base64url');
  return `${b64Payload}.${signature}`;
}

function verifySignedToken(tokenStr) {
  if (!tokenStr || typeof tokenStr !== 'string') return { valid: false, reason: 'Missing token' };
  const parts = tokenStr.trim().replace(/^Bearer\s+/i, '').split('.');
  if (parts.length !== 2) return { valid: false, reason: 'Malformed token' };

  const [b64Payload, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SECURITY_SECRET).update(b64Payload).digest('base64url');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    try {
      const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
      if (Date.now() > payload.exp) {
        return { valid: false, reason: 'Token expired' };
      }
      return { valid: true, payload };
    } catch (e) {
      return { valid: false, reason: 'Corrupt payload' };
    }
  }
  return { valid: false, reason: 'Invalid signature' };
}

// 3. Authorization Middleware for Admin Endpoints
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-admin-token'] || req.query.token;
  const verification = verifySignedToken(authHeader);

  if (!verification.valid) {
    return res.status(401).json({
      ok: false,
      code: "UNAUTHORIZED",
      message: "⚠️ ไม่ได้รับอนุญาต: สิทธิ์การเข้าถึงไม่ถูกต้อง หรือ Session หมดอายุ กรุณาเข้าสู่ระบบแอดมินใหม่อีกครั้ง"
    });
  }

  const role = verification.payload.role;
  if (role !== 'ADMIN' && role !== 'IT') {
    return res.status(403).json({
      ok: false,
      code: "FORBIDDEN",
      message: "⚠️ สิทธิ์ไม่เพียงพอ: บัญชีนี้ไม่มีสิทธิ์ดำเนินการของผู้ดูแลระบบ (Admin Only)"
    });
  }

  req.user = verification.payload;
  next();
}

// 4. Authorization Middleware for Lifecycle Endpoints (HR, Admin, IT)
function requireLifecycleAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['x-lifecycle-token'] || req.query.token;
  const verification = verifySignedToken(authHeader);

  if (!verification.valid) {
    return res.status(401).json({
      ok: false,
      code: "UNAUTHORIZED",
      message: "⚠️ ไม่ได้รับอนุญาต: กรุณายืนยันตัวตนเจ้าหน้าที่ (HR / Admin / IT) ก่อนทำรายการ"
    });
  }

  const role = verification.payload.role;
  if (!['HR', 'ADMIN', 'IT'].includes(role)) {
    return res.status(403).json({
      ok: false,
      code: "FORBIDDEN",
      message: "⚠️ สิทธิ์ไม่เพียงพอ: บัญชีนี้ไม่มีสิทธิ์เข้าถึงส่วนส่งต่องาน 3 ฝ่าย"
    });
  }

  req.user = verification.payload;
  next();
}

// 5. Input Sanitization Helpers
function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // remove control chars
    .trim()
    .slice(0, maxLength);
}

module.exports = {
  loginLimiter,
  apiLimiter,
  generateSignedToken,
  verifySignedToken,
  requireAdminAuth,
  requireLifecycleAuth,
  sanitizeString
};
