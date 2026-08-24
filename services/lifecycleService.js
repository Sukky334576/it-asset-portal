const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/lifecycle_tasks.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, '../data'))) {
  fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
}

// Initial seed sample task if file does not exist
const initialSeed = [
  {
    id: "TASK-OFF-20260821-001",
    type: "offboarding",
    title: "คืนอุปกรณ์: น้องกระแต (Eddu) - Last Day 21 ส.ค.",
    employeeName: "น้องกระแต",
    organization: "EDDU",
    targetDate: "2026-08-21",
    notes: "คืนอุปกรณ์ 17.45 น. ฝากคืนที่หัวหน้า (พี่มิ้นท์ Eddu)",
    currentStage: "WAITING_ADMIN_COLLECTION",
    devices: [
      { name: "จอมอนิเตอร์ 1 จอ", tag: "ไม่ทราบ", sn: "-", status: "รอรับคืน" },
      { name: "Thinkpad", tag: "ไม่ทราบ", sn: "-", status: "รอรับคืน" },
      { name: "Keyboard + Mouse 1 Set", tag: "ไม่ทราบ", sn: "-", status: "รอรับคืน" },
      { name: "โทรศัพท์มือถือ", tag: "ไม่ทราบ", sn: "-", status: "ขอใช้คุยกับลูกค้าก่อน" }
    ],
    history: [
      {
        stage: "CREATED",
        actor: "HR (คุณ Filmmy)",
        timestamp: "2026-08-21 10:55",
        note: "แจ้งพนักงานลาออก และสร้างรายการคืนของ"
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: "TASK-ON-20260821-001",
    type: "onboarding",
    title: "จัดชุดอุปกรณ์: Marketing Project Manager (เริ่มงาน 1 ส.ค.)",
    employeeName: "Marketing Project Manager (New Joiner)",
    position: "Marketing Project Manager",
    organization: "EDDU",
    targetDate: "2026-08-01",
    notes: "แปะโพสอิทไว้หน้าห้องบัญชี",
    currentStage: "WAITING_ADMIN_PACK",
    devices: [
      { name: "จอมอนิเตอร์ 1 จอ", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "ThinkPad หรือ MacBook 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Keyboard + Mouse 1 Set", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "บัตรเข้าออกอาคาร", tag: "HR/Admin", sn: "-", status: "รอจัดเตรียม" }
    ],
    history: [
      {
        stage: "CREATED",
        actor: "HR (คุณ Filmmy)",
        timestamp: "2026-08-21 10:50",
        note: "แจ้งรับพนักงานใหม่ พร้อมรายการอุปกรณ์ที่ต้องใช้"
      }
    ],
    createdAt: new Date().toISOString()
  }
];

let tasks = [];

function loadTasks() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      tasks = JSON.parse(data);
    } else {
      tasks = initialSeed;
      saveTasks();
    }
  } catch (err) {
    console.error("Error loading lifecycle tasks:", err.message);
    tasks = initialSeed;
  }
  return tasks;
}

function saveTasks() {
  try {
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error("Error saving lifecycle tasks:", err.message);
  }
}

// Initial load
loadTasks();

function getTasks(filterOrg = null) {
  loadTasks();
  if (filterOrg && filterOrg !== 'ALL') {
    return tasks.filter(t => t.organization === filterOrg);
  }
  return tasks;
}

function getTaskById(id) {
  loadTasks();
  return tasks.find(t => t.id === id);
}

function createOffboardingTask(data) {
  loadTasks();
  const id = `TASK-OFF-${Date.now().toString().slice(-6)}`;
  const newTask = {
    id,
    type: "offboarding",
    title: `คืนอุปกรณ์: ${data.employeeName} (${data.organization || 'XPO'}) - Last Day ${data.targetDate || 'วันนี้'}`,
    employeeName: data.employeeName,
    organization: data.organization || "XPO",
    targetDate: data.targetDate || new Date().toISOString().split('T')[0],
    notes: data.notes || "",
    currentStage: "WAITING_ADMIN_COLLECTION",
    devices: data.devices || [],
    history: [
      {
        stage: "CREATED",
        actor: data.actor || "HR (คุณ Filmmy)",
        timestamp: new Date().toLocaleString('th-TH'),
        note: "แจ้งพนักงานลาออก และสร้าง Checklist รับคืนอุปกรณ์"
      }
    ],
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();
  return newTask;
}

function createOnboardingTask(data) {
  loadTasks();
  const id = `TASK-ON-${Date.now().toString().slice(-6)}`;
  const newTask = {
    id,
    type: "onboarding",
    title: `จัดชุดอุปกรณ์: ${data.position || 'พนักงานใหม่'} (${data.organization || 'XPO'}) - เริ่มงาน ${data.targetDate || 'เร็วๆ นี้'}`,
    employeeName: data.employeeName || `${data.position} (New Joiner)`,
    position: data.position || "General Staff",
    organization: data.organization || "XPO",
    targetDate: data.targetDate || new Date().toISOString().split('T')[0],
    notes: data.notes || "",
    currentStage: "WAITING_ADMIN_PACK",
    devices: data.devices || [],
    history: [
      {
        stage: "CREATED",
        actor: data.actor || "HR (คุณ Filmmy)",
        timestamp: new Date().toLocaleString('th-TH'),
        note: "แจ้งรับพนักงานใหม่ และกำหนดชุดอุปกรณ์ Onboarding Pack"
      }
    ],
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();
  return newTask;
}

function advanceTaskStage(taskId, actor, note = "") {
  loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  let nextStage = task.currentStage;
  let stageDescription = "";

  if (task.type === "offboarding") {
    switch (task.currentStage) {
      case "WAITING_ADMIN_COLLECTION":
        nextStage = "WAITING_IT_REIMAGE";
        stageDescription = "Admin (คุณ Ploy) รับของครบแล้ว ➔ ส่งต่อให้ IT ตรวจเช็ค/ลง Windows ใหม่";
        break;
      case "WAITING_IT_REIMAGE":
        nextStage = "WAITING_ADMIN_STORE";
        stageDescription = "IT (ฝ่ายไอที) ตรวจสภาพ + ลง OS/Windows ใหม่เสร็จแล้ว ➔ ส่งมอบให้ Admin นำไปเก็บเข้าตู้";
        break;
      case "WAITING_ADMIN_STORE":
        nextStage = "COMPLETED";
        stageDescription = "Admin (คุณ Ploy) นำเครื่องไปเก็บเข้าตู้สต็อกเรียบร้อย ➔ สถานะ: พร้อมใช้งานในคลัง (In Stock)";
        break;
      default:
        break;
    }
  } else if (task.type === "onboarding") {
    switch (task.currentStage) {
      case "WAITING_ADMIN_PACK":
        nextStage = "WAITING_HANDOVER";
        stageDescription = "Admin (คุณ Ploy) จัดเซ็ตอุปกรณ์เรียบร้อย ➔ รอส่งมอบให้พนักงานใหม่ในวันเริ่มงาน";
        break;
      case "WAITING_HANDOVER":
        nextStage = "COMPLETED";
        stageDescription = "ส่งมอบอุปกรณ์ให้พนักงานใหม่เรียบร้อย ➔ พนักงานเริ่มใช้งาน";
        break;
      default:
        break;
    }
  }

  task.currentStage = nextStage;
  task.history.push({
    stage: nextStage,
    actor: actor || "System User",
    timestamp: new Date().toLocaleString('th-TH'),
    note: note || stageDescription
  });

  saveTasks();
  return task;
}

function deleteTask(taskId) {
  loadTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    const deleted = tasks.splice(idx, 1);
    saveTasks();
    return deleted[0];
  }
  return null;
}

module.exports = {
  getTasks,
  getTaskById,
  createOffboardingTask,
  createOnboardingTask,
  advanceTaskStage,
  deleteTask
};
