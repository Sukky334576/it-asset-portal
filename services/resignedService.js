const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const LARK_BIN = process.env.LARK_CLI_BIN || '/Users/xpo/Library/Application Support/Antigravity/bin/lark-cli';
const PERSIST_FILE = path.join(__dirname, '../data/resigned_staff.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
}

// Initial default list of confirmed closed/resigned users
const defaultResignedNames = [
  'Muay. Anongrat', 'Anongrat',
  'Aon.Teerawut', 'Aon.THEINSIDER',
  'BamBam.TANSUDA',
  'Benz.Chinapat',
  'Renoir.Chonlarat', 'Chonlarat',
  'Hong.Natsuda',
  'Ice.Phurinat',
  'Ployjie.Isada', 'Isada',
  'Kevin.Pawaris',
  'Luknam.Pennapa', 'Luknam',
  'Ning.Achiraya',
  'oil.lakkhana',
  'Pannee',
  'Pinn.Noppawan',
  'Ploy.Yuwadee', 'Ploy',
  'PLUG.Ratchanon',
  'Sant.Montiya', 'San Montiya Poonchob',
  'Ta.Aungsumalee',
  'Peam.theeratat', 'Theeratat',
  'Thip.Tippaporn',
  'Tuck.Atawat',
  'Vivi.Pornthip',
  'Tawan.T',
  'Preme.Plaifah', 'Preme', 'Plaifah'
];

let resignedCache = new Set(defaultResignedNames.map(n => n.toLowerCase().trim()));

// Load from disk if exists
try {
  if (fs.existsSync(PERSIST_FILE)) {
    const fileData = JSON.parse(fs.readFileSync(PERSIST_FILE, 'utf8'));
    if (Array.isArray(fileData)) {
      fileData.forEach(n => resignedCache.add(n.toLowerCase().trim()));
    }
  }
} catch (e) {
  console.error("Error reading resigned_staff.json:", e.message);
}

function persistToDisk() {
  try {
    const tempFile = `${PERSIST_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(Array.from(resignedCache), null, 2), 'utf8');
    fs.renameSync(tempFile, PERSIST_FILE);
  } catch (e) {
    console.error("Error writing resigned_staff.json:", e.message);
  }
}

/**
 * Check if an employee name or open_id is closed/resigned
 */
function isEmployeeResigned(empName, openId = null) {
  if (!empName) return false;
  const cleanName = empName.toLowerCase().trim();
  
  for (const rName of resignedCache) {
    if (cleanName === rName || cleanName.includes(rName) || rName.includes(cleanName)) {
      return true;
    }
  }
  return false;
}

/**
 * Scan a specific user against Lark Left-Organization API
 */
async function checkLarkLeftOrg(nameQuery) {
  try {
    const cp = spawnSync(LARK_BIN, [
      'contact', '+search-user',
      '--query', nameQuery,
      '--left-organization',
      '--as', 'user',
      '--format', 'json'
    ], {
      env: { ...process.env, LARK_CLI_NO_PROXY: '1', HOME: '/Users/xpo' },
      encoding: 'utf8'
    });

    if (cp.stdout) {
      const parsed = JSON.parse(cp.stdout);
      if (parsed.ok && parsed.data && parsed.data.users && parsed.data.users.length > 0) {
        parsed.data.users.forEach(u => {
          if (u.localized_name) {
            resignedCache.add(u.localized_name.toLowerCase().trim());
          }
        });
        persistToDisk();
        return parsed.data.users;
      }
    }
  } catch (err) {
    console.error('Error checking Lark left-organization:', err.message);
  }
  return [];
}

/**
 * Mark an employee as resigned manually in cache
 */
function markResigned(name) {
  if (name) {
    resignedCache.add(name.toLowerCase().trim());
    persistToDisk();
  }
}

/**
 * Unmark an employee from resigned cache
 */
function unmarkResigned(name) {
  if (name) {
    resignedCache.delete(name.toLowerCase().trim());
    persistToDisk();
  }
}

/**
 * Get all cached resigned names
 */
function getResignedList() {
  return Array.from(resignedCache);
}

module.exports = {
  isEmployeeResigned,
  checkLarkLeftOrg,
  markResigned,
  unmarkResigned,
  getResignedList
};
