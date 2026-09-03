/**
 * IT ASSET MANAGEMENT HUB - FRONTEND APPLICATION
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    employees: [],
    assets: [],
    loans: { availableStock: [], activeLoans: [], returnHistory: [] },
    adminStats: null,
    selectedEmployee: null,
    orgFilter: 'ALL',
    stockCatFilter: 'ALL',
    duplicateCheckTimeout: null,
    userSearchTimeout: null,
    isAdminLoggedIn: false
  };

  // DOM Elements
  const elements = {
    // Tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    subtabButtons: document.querySelectorAll('.subtab-btn'),
    subtabContents: document.querySelectorAll('.subtab-content'),
    ssoGatewayScreen: document.getElementById('ssoGatewayScreen'),
    mainAppWrapper: document.getElementById('mainAppWrapper'),
    btnGatewayLarkLogin: document.getElementById('btnGatewayLarkLogin'),
    btnGatewayAdminLogin: document.getElementById('btnGatewayAdminLogin'),

    searchPanelCard: document.getElementById('searchPanelCard'),
    lockedIdentityBanner: document.getElementById('lockedIdentityBanner'),
    lockedEmployeeName: document.getElementById('lockedEmployeeName'),
    lockedUserAvatarBox: document.getElementById('lockedUserAvatarBox'),
    btnSsoLogout: document.getElementById('btnSsoLogout'),
    larkSsoLoginCard: document.getElementById('larkSsoLoginCard'),

    // Lark SSO Header Elements
    btnHeaderLarkLogin: document.getElementById('btnHeaderLarkLogin'),
    headerUserProfile: document.getElementById('headerUserProfile'),
    headerUserAvatar: document.getElementById('headerUserAvatar'),
    headerUserName: document.getElementById('headerUserName'),
    btnHeaderLogout: document.getElementById('btnHeaderLogout'),

    // Badges & Sync
    syncText: document.getElementById('syncText'),
    btnRefreshData: document.getElementById('btnRefreshData'),
    tabPendingBadge: document.getElementById('tabPendingBadge'),
    tabStockBadge: document.getElementById('tabStockBadge'),

    // User Guide Modal Elements
    btnOpenUserGuide: document.getElementById('btnOpenUserGuide'),
    guideModalOverlay: document.getElementById('guideModalOverlay'),
    guideModalCloseBtn: document.getElementById('guideModalCloseBtn'),
    guideModalOkBtn: document.getElementById('guideModalOkBtn'),
    guideNavButtons: document.querySelectorAll('.guide-nav-btn'),
    guideTabPanels: document.querySelectorAll('.guide-tab-panel'),
    helpPills: document.querySelectorAll('.btn-help-pill'),

    // Countdown & Banner
    bannerBadge: document.getElementById('bannerBadge'),
    bannerText: document.getElementById('bannerText'),
    cdLabel: document.getElementById('cdLabel'),
    cdDays: document.getElementById('cdDays'),
    cdHours: document.getElementById('cdHours'),
    cdMins: document.getElementById('cdMins'),
    cdSecs: document.getElementById('cdSecs'),

    // Tab 1: Verification
    employeeSearchInput: document.getElementById('employeeSearchInput'),
    employeeDropdown: document.getElementById('employeeDropdown'),
    orgPills: document.querySelectorAll('.pill-btn'),
    employeeProfileCard: document.getElementById('employeeProfileCard'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileName: document.getElementById('profileName'),
    profileResignedTag: document.getElementById('profileResignedTag'),
    resignedBanner: document.getElementById('resignedBanner'),
    btnReclaimSingleResigned: document.getElementById('btnReclaimSingleResigned'),
    profileOrg: document.getElementById('profileOrg'),
    profileDeviceCount: document.getElementById('profileDeviceCount'),
    profileVerifyStatus: document.getElementById('profileVerifyStatus'),
    btnConfirmAll: document.getElementById('btnConfirmAll'),
    employeeDeviceGrid: document.getElementById('employeeDeviceGrid'),

    // Tab 2: New Registration
    newAssetForm: document.getElementById('newAssetForm'),
    regEmployeeName: document.getElementById('regEmployeeName'),
    regEmployeeId: document.getElementById('regEmployeeId'),
    regEmployeeDropdown: document.getElementById('regEmployeeDropdown'),
    regOrg: document.getElementById('regOrg'),
    regDeviceType: document.getElementById('regDeviceType'),
    regBrand: document.getElementById('regBrand'),
    regDeviceName: document.getElementById('regDeviceName'),
    regAssetTag: document.getElementById('regAssetTag'),
    regUnknownTag: document.getElementById('regUnknownTag'),
    regSerial: document.getElementById('regSerial'),
    regUnknownSN: document.getElementById('regUnknownSN'),
    regCondition: document.getElementById('regCondition'),
    regNotes: document.getElementById('regNotes'),
    duplicateAlertBanner: document.getElementById('duplicateAlertBanner'),
    duplicateAlertText: document.getElementById('duplicateAlertText'),

    // Tab 3: Temporary Loans & Returns
    availableStockGrid: document.getElementById('availableStockGrid'),
    activeLoansTbody: document.getElementById('activeLoansTbody'),
    returnHistoryTbody: document.getElementById('returnHistoryTbody'),
    stockCatPills: document.querySelectorAll('.stock-cat-pill'),
    loanRequestForm: document.getElementById('loanRequestForm'),
    loanBorrowerName: document.getElementById('loanBorrowerName'),
    loanBorrowerId: document.getElementById('loanBorrowerId'),
    loanBorrowerDropdown: document.getElementById('loanBorrowerDropdown'),
    loanOrg: document.getElementById('loanOrg'),
    loanAssetSelect: document.getElementById('loanAssetSelect'),
    loanTypeSelect: document.getElementById('loanTypeSelect'),
    loanExpectedReturn: document.getElementById('loanExpectedReturn'),
    loanPurpose: document.getElementById('loanPurpose'),
    presetChips: document.querySelectorAll('.preset-chip'),

    // Return Modal
    returnModalOverlay: document.getElementById('returnModalOverlay'),
    returnAssetRecordId: document.getElementById('returnAssetRecordId'),
    returnDevicePreview: document.getElementById('returnDevicePreview'),
    returnConditionSelect: document.getElementById('returnConditionSelect'),
    returnNotesInput: document.getElementById('returnNotesInput'),
    returnModalCloseBtn: document.getElementById('returnModalCloseBtn'),
    returnModalCancelBtn: document.getElementById('returnModalCancelBtn'),
    returnModalConfirmBtn: document.getElementById('returnModalConfirmBtn'),

    // Tab 4: Admin & Login
    adminLoginView: document.getElementById('adminLoginView'),
    adminDashboardView: document.getElementById('adminDashboardView'),
    adminLoginForm: document.getElementById('adminLoginForm'),
    adminPasswordInput: document.getElementById('adminPasswordInput'),
    adminLoginError: document.getElementById('adminLoginError'),
    btnAdminLogin: document.getElementById('btnAdminLogin'),
    btnAdminLogout: document.getElementById('btnAdminLogout'),

    metricTotal: document.getElementById('metricTotal'),
    metricVerified: document.getElementById('metricVerified'),
    metricVerifiedPct: document.getElementById('metricVerifiedPct'),
    metricPending: document.getElementById('metricPending'),
    metricMissingTag: document.getElementById('metricMissingTag'),
    xpoProgressText: document.getElementById('xpoProgressText'),
    xpoProgressBar: document.getElementById('xpoProgressBar'),
    edduProgressText: document.getElementById('edduProgressText'),
    edduProgressBar: document.getElementById('edduProgressBar'),
    btnCopyReminderText: document.getElementById('btnCopyReminderText'),
    btnCopyReminderSeg1: document.getElementById('btnCopyReminderSeg1'),
    btnCopyReminderSeg2: document.getElementById('btnCopyReminderSeg2'),
    btnPreviewCardSeg1: document.getElementById('btnPreviewCardSeg1'),
    btnPreviewCardSeg2: document.getElementById('btnPreviewCardSeg2'),
    seg1CountBadge: document.getElementById('seg1CountBadge'),
    seg2CountBadge: document.getElementById('seg2CountBadge'),
    copySuccessMsg: document.getElementById('copySuccessMsg'),
    missingTagTbody: document.getElementById('missingTagTbody'),
    missingTagBadgeCount: document.getElementById('missingTagBadgeCount'),

    // Live Monitor Elements
    liveMonitorSyncStatus: document.getElementById('liveMonitorSyncStatus'),
    chkAutoRefreshMonitor: document.getElementById('chkAutoRefreshMonitor'),
    btnRefreshLiveMonitor: document.getElementById('btnRefreshLiveMonitor'),
    statLiveZeroCount: document.getElementById('statLiveZeroCount'),
    statLiveZeroPct: document.getElementById('statLiveZeroPct'),
    statLivePendingCount: document.getElementById('statLivePendingCount'),
    statLivePendingPct: document.getElementById('statLivePendingPct'),
    statLiveVerifiedCount: document.getElementById('statLiveVerifiedCount'),
    statLiveVerifiedPct: document.getElementById('statLiveVerifiedPct'),
    statLiveTotalCount: document.getElementById('statLiveTotalCount'),
    liveMonitorFilterPills: document.getElementById('liveMonitorFilterPills'),
    pillPendingCount: document.getElementById('pillPendingCount'),
    pillZeroCount: document.getElementById('pillZeroCount'),
    pillVerifiedCount: document.getElementById('pillVerifiedCount'),
    pillAllCount: document.getElementById('pillAllCount'),
    liveMonitorSearchInput: document.getElementById('liveMonitorSearchInput'),
    btnCopyPendingList: document.getElementById('btnCopyPendingList'),
    liveMonitorTableBody: document.getElementById('liveMonitorTableBody'),
    cardFilterZero: document.getElementById('cardFilterZero'),
    cardFilterPending: document.getElementById('cardFilterPending'),
    cardFilterVerified: document.getElementById('cardFilterVerified'),
    cardFilterAll: document.getElementById('cardFilterAll'),

    // Add Central Stock Elements
    btnOpenAddStockModal: document.getElementById('btnOpenAddStockModal'),
    adminAuthPromptModal: document.getElementById('adminAuthPromptModal'),
    adminAuthPromptCloseBtn: document.getElementById('adminAuthPromptCloseBtn'),
    adminAuthPromptCancelBtn: document.getElementById('adminAuthPromptCancelBtn'),
    adminAuthPromptSubmitBtn: document.getElementById('adminAuthPromptSubmitBtn'),
    adminPromptPasswordInput: document.getElementById('adminPromptPasswordInput'),
    adminPromptErrorMsg: document.getElementById('adminPromptErrorMsg'),

    addCentralStockModal: document.getElementById('addCentralStockModal'),
    addCentralStockCloseBtn: document.getElementById('addCentralStockCloseBtn'),
    addCentralStockCancelBtn: document.getElementById('addCentralStockCancelBtn'),
    addCentralStockSubmitBtn: document.getElementById('addCentralStockSubmitBtn'),
    addCentralStockForm: document.getElementById('addCentralStockForm'),
    stockDeviceType: document.getElementById('stockDeviceType'),
    stockBrand: document.getElementById('stockBrand'),
    stockDeviceName: document.getElementById('stockDeviceName'),
    stockOrg: document.getElementById('stockOrg'),
    stockAssetTag: document.getElementById('stockAssetTag'),
    stockUnknownTag: document.getElementById('stockUnknownTag'),
    stockSerial: document.getElementById('stockSerial'),
    stockUnknownSerial: document.getElementById('stockUnknownSerial'),
    stockNotes: document.getElementById('stockNotes'),

    // Lark Bot Test Console
    botTestUserSelect: document.getElementById('botTestUserSelect'),
    botTestCardType: document.getElementById('botTestCardType'),
    btnSendTestCard: document.getElementById('btnSendTestCard'),
    botTestResultAlert: document.getElementById('botTestResultAlert'),
    botSandboxBadge: document.getElementById('botSandboxBadge'),
    btnTriggerBatchBot: document.getElementById('btnTriggerBatchBot'),
    batchBotStatus: document.getElementById('batchBotStatus'),

    // Duplicate Cleaner Elements
    dupReportedBadge: document.getElementById('dupReportedBadge'),
    dupDetectedBadge: document.getElementById('dupDetectedBadge'),
    btnDeleteReportedDuplicates: document.getElementById('btnDeleteReportedDuplicates'),
    btnReportedCount: document.getElementById('btnReportedCount'),
    btnAutoCleanSnDuplicates: document.getElementById('btnAutoCleanSnDuplicates'),
    btnRefreshDuplicates: document.getElementById('btnRefreshDuplicates'),
    duplicatePreviewTbody: document.getElementById('duplicatePreviewTbody'),

    // Resigned Staff Elements
    resignedStaffBadge: document.getElementById('resignedStaffBadge'),
    btnBatchReclaimAllResigned: document.getElementById('btnBatchReclaimAllResigned'),
    btnRefreshResigned: document.getElementById('btnRefreshResigned'),
    resignedStaffTbody: document.getElementById('resignedStaffTbody'),
    manualResignedSelect: document.getElementById('manualResignedSelect'),
    btnMarkResignedManual: document.getElementById('btnMarkResignedManual'),

    // Resigned Handover Elements
    handoverCountBadge: document.getElementById('handoverCountBadge'),
    btnBatchResolveHandovers: document.getElementById('btnBatchResolveHandovers'),
    handoverBtnCount: document.getElementById('handoverBtnCount'),
    resignedHandoverTbody: document.getElementById('resignedHandoverTbody'),

    // Audit Log Elements
    auditLogCountBadge: document.getElementById('auditLogCountBadge'),
    btnRefreshAuditLogs: document.getElementById('btnRefreshAuditLogs'),
    auditLogsTbody: document.getElementById('auditLogsTbody'),

    // Edit Modal
    editModalOverlay: document.getElementById('editModalOverlay'),
    modalTitle: document.getElementById('modalTitle'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    modalSaveBtn: document.getElementById('modalSaveBtn'),
    modalRecordId: document.getElementById('modalRecordId'),
    modalDevicePreview: document.getElementById('modalDevicePreview'),
    modalUpdatedTag: document.getElementById('modalUpdatedTag'),
    modalIsUnknownTag: document.getElementById('modalIsUnknownTag'),
    modalNotes: document.getElementById('modalNotes'),
    modalDiscrepancyReason: document.getElementById('modalDiscrepancyReason'),
    modalDiscrepancyNewHolder: document.getElementById('modalDiscrepancyNewHolder'),
    btnReportDiscrepancy: document.getElementById('btnReportDiscrepancy'),
    btnReportDuplicate: document.getElementById('btnReportDuplicate'),
    // Lifecycle Elements (HR / Admin / IT)
    tabLifecycleBadge: document.getElementById('tabLifecycleBadge'),
    lifecycleLoginView: document.getElementById('lifecycleLoginView'),
    lifecycleDashboardView: document.getElementById('lifecycleDashboardView'),
    lifecycleLoginForm: document.getElementById('lifecycleLoginForm'),
    lifecycleRoleSelect: document.getElementById('lifecycleRoleSelect'),
    lifecyclePasswordInput: document.getElementById('lifecyclePasswordInput'),
    lifecycleLoginError: document.getElementById('lifecycleLoginError'),
    btnLifecycleLogin: document.getElementById('btnLifecycleLogin'),
    btnLifecycleLogout: document.getElementById('btnLifecycleLogout'),
    lifecycleActiveRoleBadge: document.getElementById('lifecycleActiveRoleBadge'),
    btnOpenOffboardingModal: document.getElementById('btnOpenOffboardingModal'),
    btnOpenOnboardingModal: document.getElementById('btnOpenOnboardingModal'),
    lifecycleOrgFilters: document.getElementById('lifecycleOrgFilters'),
    statWaitingAdminCollection: document.getElementById('statWaitingAdminCollection'),
    statWaitingItReimage: document.getElementById('statWaitingItReimage'),
    statWaitingAdminStore: document.getElementById('statWaitingAdminStore'),
    badgeStep1: document.getElementById('badgeStep1'),
    badgeStep2: document.getElementById('badgeStep2'),
    badgeStep3: document.getElementById('badgeStep3'),
    badgeStep4: document.getElementById('badgeStep4'),
    colAdminCollection: document.getElementById('colAdminCollection'),
    colItReimage: document.getElementById('colItReimage'),
    colAdminStore: document.getElementById('colAdminStore'),
    colOnboardingCompleted: document.getElementById('colOnboardingCompleted'),

    // Offboarding Modal Elements
    offboardingModalOverlay: document.getElementById('offboardingModalOverlay'),
    offboardingModalCloseBtn: document.getElementById('offboardingModalCloseBtn'),
    offboardingModalCancelBtn: document.getElementById('offboardingModalCancelBtn'),
    offboardingModalSubmitBtn: document.getElementById('offboardingModalSubmitBtn'),
    offboardingEmployeeInput: document.getElementById('offboardingEmployeeInput'),
    offboardingOrgSelect: document.getElementById('offboardingOrgSelect'),
    offboardingLastDayInput: document.getElementById('offboardingLastDayInput'),
    offboardingNotesInput: document.getElementById('offboardingNotesInput'),
    offboardingDeviceList: document.getElementById('offboardingDeviceList'),

    // Onboarding Modal Elements
    onboardingModalOverlay: document.getElementById('onboardingModalOverlay'),
    onboardingModalCloseBtn: document.getElementById('onboardingModalCloseBtn'),
    onboardingModalCancelBtn: document.getElementById('onboardingModalCancelBtn'),
    onboardingModalSubmitBtn: document.getElementById('onboardingModalSubmitBtn'),
    onboardingPresetSelect: document.getElementById('onboardingPresetSelect'),
    onboardingEmployeeName: document.getElementById('onboardingEmployeeName'),
    onboardingOrgSelect: document.getElementById('onboardingOrgSelect'),
    onboardingStartDateInput: document.getElementById('onboardingStartDateInput'),
    onboardingNotesInput: document.getElementById('onboardingNotesInput'),
    onboardingKitList: document.getElementById('onboardingKitList'),

    // Edit Task Modal Elements
    editTaskModalOverlay: document.getElementById('editTaskModalOverlay'),
    editTaskModalCloseBtn: document.getElementById('editTaskModalCloseBtn'),
    editTaskModalCancelBtn: document.getElementById('editTaskModalCancelBtn'),
    editTaskModalSaveBtn: document.getElementById('editTaskModalSaveBtn'),
    editTaskModalDeleteBtn: document.getElementById('editTaskModalDeleteBtn'),
    editTaskId: document.getElementById('editTaskId'),
    editTaskEmployeeName: document.getElementById('editTaskEmployeeName'),
    editTaskOrgSelect: document.getElementById('editTaskOrgSelect'),
    editTaskDateInput: document.getElementById('editTaskDateInput'),
    editTaskStageSelect: document.getElementById('editTaskStageSelect'),
    editTaskNotesInput: document.getElementById('editTaskNotesInput'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // ---------------- USER GUIDE MODAL LOGIC ---------------- //

  function openGuideModal(targetTabKey = 'gVerify') {
    elements.guideNavButtons.forEach(btn => {
      if (btn.getAttribute('data-guide-tab') === targetTabKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    elements.guideTabPanels.forEach(panel => {
      if (panel.id === targetTabKey) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    elements.guideModalOverlay.style.display = 'flex';
  }

  elements.btnOpenUserGuide.addEventListener('click', () => openGuideModal('gVerify'));
  elements.guideModalCloseBtn.addEventListener('click', () => elements.guideModalOverlay.style.display = 'none');
  elements.guideModalOkBtn.addEventListener('click', () => elements.guideModalOverlay.style.display = 'none');

  elements.guideNavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-guide-tab');
      elements.guideNavButtons.forEach(b => b.classList.remove('active'));
      elements.guideTabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  elements.helpPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetGuide = pill.getAttribute('data-guide-target');
      let tabKey = 'gVerify';
      if (targetGuide === 'guideRegister') tabKey = 'gRegister';
      if (targetGuide === 'guideLoan') tabKey = 'gLoan';
      if (targetGuide === 'guideITAdmin') tabKey = 'gITAdmin';
      if (targetGuide === 'guideOpsAdmin') tabKey = 'gOpsAdmin';
      if (targetGuide === 'guideHR') tabKey = 'gHR';
      openGuideModal(tabKey);
    });
  });

  // ---------------- HELPER FUNCTIONS ---------------- //

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : (type === 'warning' ? '⚠️' : 'ℹ️'));
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function getSingleVal(val) {
    if (Array.isArray(val) && val.length > 0) return val[0];
    return val || "";
  }

  function getSafeHolderName(holder, defaultVal = "ส่วนกลาง (Central Stock)") {
    if (!holder) return defaultVal;
    if (Array.isArray(holder) && holder.length > 0 && holder[0]) {
      return holder[0].name || holder[0].en_name || holder[0].id || defaultVal;
    }
    if (typeof holder === 'object' && holder && holder.name) {
      return holder.name || holder.en_name || holder.id || defaultVal;
    }
    if (typeof holder === 'string') return holder;
    return defaultVal;
  }

  function getDeviceIcon(type) {
    const t = (type || "").toLowerCase();
    if (t.includes('laptop') || t.includes('nb')) return '💻';
    if (t.includes('desktop') || t.includes('pc')) return '🖥️';
    if (t.includes('monitor') || t.includes('mo')) return '🖥️';
    if (t.includes('adapter') || t.includes('ad')) return '🔌';
    if (t.includes('mouse') || t.includes('keyboard')) return '🖱️';
    if (t.includes('storage') || t.includes('ssd') || t.includes('hdd')) return '💾';
    if (t.includes('phone') || t.includes('tablet')) return '📱';
    if (t.includes('hub') || t.includes('dongle')) return '🔌';
    return '📦';
  }

  function formatDaysOffset(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  // ---------------- COUNTDOWN TIMER (28 ส.ค. – 4 ก.ย. 2026) ---------------- //
  function startCountdown() {
    // Campaign Schedule: Friday 28 Aug 2026 09:00 AM to Friday 4 Sep 2026 18:00 PM
    const startCampaignTime = new Date('2026-08-28T09:00:00+07:00').getTime();
    const endCampaignTime = new Date('2026-09-04T18:00:00+07:00').getTime();

    function update() {
      const now = Date.now();

      if (now < startCampaignTime) {
        // Pre-Campaign Stage (กำลังจะเริ่มศุกร์นี้)
        const distance = startCampaignTime - now;
        if (elements.cdLabel) elements.cdLabel.textContent = "เริ่มในอีก:";
        if (elements.bannerBadge) elements.bannerBadge.textContent = "⏳ UPCOMING 7-DAY FREEZE";
        if (elements.bannerText) elements.bannerText.innerHTML = `แคมเปญยืนยันถือครองอุปกรณ์ IT ประจำตัว <strong>(เริ่มศุกร์ที่ 28 ส.ค. 09:00 น. – 4 ก.ย. 18:00 น.)</strong>`;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elements.cdDays) elements.cdDays.textContent = String(days).padStart(2, '0');
        if (elements.cdHours) elements.cdHours.textContent = String(hours).padStart(2, '0');
        if (elements.cdMins) elements.cdMins.textContent = String(minutes).padStart(2, '0');
        if (elements.cdSecs) elements.cdSecs.textContent = String(seconds).padStart(2, '0');
      } else if (now <= endCampaignTime) {
        // Active Campaign Stage (ช่วงแคมเปญ 7 วัน)
        const distance = endCampaignTime - now;
        if (elements.cdLabel) elements.cdLabel.textContent = "สิ้นสุดใน:";
        if (elements.bannerBadge) elements.bannerBadge.textContent = "🚨 FREEZE PERIOD 7 วัน";
        if (elements.bannerText) elements.bannerText.innerHTML = `แคมเปญยืนยันถือครองอุปกรณ์ IT ประจำตัว (28 ส.ค. – 4 ก.ย. 2026) — <strong>ห้ามสลับหรือส่งต่อเครื่องระหว่างช่วงเวลานี้</strong>`;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elements.cdDays) elements.cdDays.textContent = String(days).padStart(2, '0');
        if (elements.cdHours) elements.cdHours.textContent = String(hours).padStart(2, '0');
        if (elements.cdMins) elements.cdMins.textContent = String(minutes).padStart(2, '0');
        if (elements.cdSecs) elements.cdSecs.textContent = String(seconds).padStart(2, '0');
      } else {
        // Post-Campaign Stage (สิ้นสุดแล้ว)
        if (elements.cdLabel) elements.cdLabel.textContent = "สถานะ:";
        if (elements.bannerBadge) elements.bannerBadge.textContent = "✅ สิ้นสุดแคมเปญ";
        if (elements.bannerText) elements.bannerText.innerHTML = `สิ้นสุดช่วง 7-Day Freeze Campaign เรียบร้อยแล้ว — ขอบคุณพนักงานทุกท่านที่ให้ความร่วมมือครับ 🙏`;

        if (elements.cdDays) elements.cdDays.textContent = "00";
        if (elements.cdHours) elements.cdHours.textContent = "00";
        if (elements.cdMins) elements.cdMins.textContent = "00";
        if (elements.cdSecs) elements.cdSecs.textContent = "00";
      }
    }
    update();
    setInterval(update, 1000);
  }

  // ---------------- AUTHENTICATED FETCH HELPERS ---------------- //
  async function adminFetch(url, options = {}) {
    const token = sessionStorage.getItem('it_admin_token') || '';
    if (!token) {
      return { ok: false, status: 401, json: async () => ({ ok: false, code: 'UNAUTHORIZED' }) };
    }
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    try {
      const res = await fetch(url, { ...options, headers });
      return {
        ok: res.ok,
        status: res.status,
        json: async () => {
          try {
            return await res.json();
          } catch (e) {
            return { ok: false, message: 'Invalid response from server' };
          }
        }
      };
    } catch (err) {
      return { ok: false, status: 500, json: async () => ({ ok: false, message: err.message }) };
    }
  }

  async function lifecycleFetch(url, options = {}) {
    const token = sessionStorage.getItem('lifecycle_auth_token') || '';
    if (!token) {
      return { ok: false, status: 401, json: async () => ({ ok: false, code: 'UNAUTHORIZED' }) };
    }
    const headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`
    };
    try {
      const res = await fetch(url, { ...options, headers });
      return {
        ok: res.ok,
        status: res.status,
        json: async () => {
          try {
            return await res.json();
          } catch (e) {
            return { ok: false, message: 'Invalid response from server' };
          }
        }
      };
    } catch (err) {
      return { ok: false, status: 500, json: async () => ({ ok: false, message: err.message }) };
    }
  }

  // ---------------- ADMIN AUTHENTICATION ---------------- //

  function checkAdminAuth() {
    const isAuth = sessionStorage.getItem('it_admin_auth') === 'true' && Boolean(sessionStorage.getItem('it_admin_token'));
    state.isAdminLoggedIn = isAuth;

    if (isAuth) {
      elements.adminLoginView.style.display = 'none';
      elements.adminDashboardView.style.display = 'block';
      loadAdminStats();
    } else {
      elements.adminLoginView.style.display = 'flex';
      elements.adminDashboardView.style.display = 'none';
    }
  }

  async function loadAdminStats() {
    try {
      const res = await adminFetch('/api/admin/stats').then(r => r.json());
      if (res.ok) {
        state.adminStats = res;
        renderAdminStats();
        loadLiveMonitorData();
      } else if (res.code === 'UNAUTHORIZED') {
        sessionStorage.removeItem('it_admin_auth');
        sessionStorage.removeItem('it_admin_token');
        checkAdminAuth();
      }
    } catch (err) {
      console.error("Error loading admin stats:", err);
    }
  }

  elements.adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = elements.adminPasswordInput.value;
    elements.btnAdminLogin.disabled = true;
    elements.btnAdminLogin.textContent = "กำลังตรวจสอบ...";
    elements.adminLoginError.style.display = 'none';

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      }).then(r => r.json());

      if (res.ok) {
        sessionStorage.setItem('it_admin_auth', 'true');
        sessionStorage.setItem('it_admin_token', res.token);
        state.isAdminLoggedIn = true;
        showToast("🔓 เข้าสู่ระบบ IT Admin สำเร็จ!", "success");
        elements.adminPasswordInput.value = "";
        checkAdminAuth();
      } else {
        elements.adminLoginError.textContent = res.message || "รหัสผ่านไม่ถูกต้อง";
        elements.adminLoginError.style.display = 'block';
      }
    } catch (err) {
      elements.adminLoginError.textContent = "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: " + err.message;
      elements.adminLoginError.style.display = 'block';
    } finally {
      elements.btnAdminLogin.disabled = false;
      elements.btnAdminLogin.textContent = "🔓 เข้าสู่ระบบ IT Admin";
    }
  });

  elements.btnAdminLogout.addEventListener('click', () => {
    sessionStorage.removeItem('it_admin_auth');
    sessionStorage.removeItem('it_admin_token');
    state.isAdminLoggedIn = false;
    showToast("ออกจากระบบ Admin เรียบร้อยแล้ว", "info");
    checkAdminAuth();
  });

  // ---------------- USER AUTOCOMPLETE SETUP ---------------- //

  function setupUserAutocomplete(inputEl, hiddenIdEl, dropdownEl) {
    inputEl.addEventListener('input', (e) => {
      clearTimeout(state.userSearchTimeout);
      const query = e.target.value.trim().toLowerCase();
      hiddenIdEl.value = ""; // clear until selected

      if (!query) {
        dropdownEl.style.display = 'none';
        return;
      }

      // First check local employees roster
      const localMatches = state.employees.filter(emp => emp.name.toLowerCase().includes(query));

      state.userSearchTimeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`).then(r => r.json());
          const remoteUsers = res.ok ? res.data : [];

          // Combine results
          const combined = [...localMatches.map(m => ({ id: m.id, name: m.name, department: m.organization }))];
          remoteUsers.forEach(ru => {
            if (!combined.some(c => c.name.toLowerCase() === ru.name.toLowerCase())) {
              combined.push(ru);
            }
          });

          if (combined.length === 0) {
            dropdownEl.innerHTML = `<div class="autocomplete-item text-muted">ไม่พบรายชื่อในระบบ (จะใช้ชื่อที่พิมพ์)</div>`;
          } else {
            dropdownEl.innerHTML = combined.slice(0, 10).map(u => `
              <div class="autocomplete-item" data-id="${u.id || ''}" data-name="${u.name}">
                <div>
                  <strong>${u.name}</strong>
                  ${u.department ? `<span class="tag tag-org" style="margin-left: 6px;">${u.department}</span>` : ''}
                </div>
                ${u.email ? `<span style="font-size:0.75rem; color:var(--text-muted);">${u.email}</span>` : ''}
              </div>
            `).join('');
          }
          dropdownEl.style.display = 'block';
        } catch (err) {
          console.error("Autocomplete search error:", err);
        }
      }, 300);
    });

    dropdownEl.addEventListener('click', (e) => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;
      const uName = item.getAttribute('data-name');
      const uId = item.getAttribute('data-id');

      if (uName) {
        inputEl.value = uName;
        hiddenIdEl.value = uId || "";
        dropdownEl.style.display = 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
        dropdownEl.style.display = 'none';
      }
    });
  }

  // Initialize Autocomplete for Registration & Loan Borrower
  setupUserAutocomplete(elements.regEmployeeName, elements.regEmployeeId, elements.regEmployeeDropdown);
  setupUserAutocomplete(elements.loanBorrowerName, elements.loanBorrowerId, elements.loanBorrowerDropdown);

  // ---------------- DATA FETCHING ---------------- //

  async function loadAllData(force = false) {
    try {
      elements.syncText.textContent = "กำลังซิงก์ข้อมูลจาก Lark Base...";
      
      const [empRes, assetsRes, loansRes, adminRes] = await Promise.all([
        fetch(`/api/employees${force ? '?refresh=true' : ''}`).then(r => r.json()),
        fetch(`/api/assets${force ? '?refresh=true' : ''}`).then(r => r.json()),
        fetch(`/api/loans${force ? '?refresh=true' : ''}`).then(r => r.json()),
        state.isAdminLoggedIn ? adminFetch(`/api/admin/stats`).then(r => r.json()).catch(() => null) : Promise.resolve(null)
      ]);

      if (empRes && empRes.ok) state.employees = empRes.data;
      if (assetsRes && assetsRes.ok) state.assets = assetsRes.data;
      if (loansRes && loansRes.ok) state.loans = loansRes;
      if (adminRes && adminRes.ok) state.adminStats = adminRes;

      if (state.isAdminLoggedIn) {
        renderAdminStats();
      }
      renderLoans();
      updateBadges();

      // If an employee was already selected, re-render their devices
      if (state.selectedEmployee) {
        const found = state.employees.find(e => e.name === state.selectedEmployee.name);
        if (found) selectEmployee(found);
      }

      checkLarkSsoAuth();

      elements.syncText.textContent = `ซิงก์กับ Lark Base เรียบร้อย (${state.assets.length} รายการ)`;
    } catch (err) {
      console.error("Error loading data:", err);
      elements.syncText.textContent = "เชื่อมต่อ Lark Base ขัดข้อง (ใช้ข้อมูลแคช)";
    }
  }

  function updateBadges() {
    if (state.adminStats) {
      elements.tabPendingBadge.textContent = `${state.adminStats.pendingCount} รอตรวจ`;
    }
    if (state.loans.availableStock) {
      elements.tabStockBadge.textContent = `${state.loans.availableStock.length} ว่าง`;
    }
  }

  // ---------------- TAB NAVIGATION ---------------- //

  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      elements.tabButtons.forEach(b => b.classList.remove('active'));
      elements.tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      if (targetTab === 'adminTab') {
        checkAdminAuth();
        if (sessionStorage.getItem('it_admin_auth') === 'true') {
          loadLiveMonitorData();
        }
      } else if (targetTab === 'lifecycleTab') {
        loadLifecycleTasks();
      }
    });
  });

  elements.subtabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSub = btn.getAttribute('data-subtab');
      elements.subtabButtons.forEach(b => b.classList.remove('active'));
      elements.subtabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(targetSub).classList.add('active');
    });
  });

  // ---------------- TAB 1: EMPLOYEE SEARCH & VERIFICATION ---------------- //

  // Autocomplete search
  elements.employeeSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      elements.employeeDropdown.style.display = 'none';
      return;
    }

    const qClean = query.replace(/[.\s_-]/g, '');
    const filtered = state.employees.filter(emp => {
      const empClean = emp.name.toLowerCase().replace(/[.\s_-]/g, '');
      const matchName = emp.name.toLowerCase().includes(query) || 
                        empClean.includes(qClean) || 
                        (emp.email && emp.email.toLowerCase().includes(query)) ||
                        (emp.id && emp.id.toLowerCase().includes(query));
      const matchOrg = state.orgFilter === 'ALL' 
        ? true 
        : (state.orgFilter === 'RESIGNED' ? emp.isResigned : emp.organization.includes(state.orgFilter));
      return matchName && matchOrg;
    });

    if (filtered.length === 0) {
      elements.employeeDropdown.innerHTML = `<div class="autocomplete-item text-muted">ไม่พบรายชื่อพนักงาน</div>`;
    } else {
      elements.employeeDropdown.innerHTML = filtered.slice(0, 15).map(emp => `
        <div class="autocomplete-item" data-name="${emp.name}">
          <div>
            <strong>${emp.name}</strong>
            ${emp.isResigned ? `<span class="tag" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem; font-weight:600; margin-left:4px;">🛑 Closed</span>` : ''}
            <span class="tag tag-org" style="margin-left: 6px;">${emp.organization}</span>
          </div>
          <div>
            <span class="tag ${emp.allVerified ? 'tag-verify-status verified' : 'tag-verify-status pending'}">
              ${emp.devices.length} อุปกรณ์ (${emp.allVerified ? '✅ ยืนยันแล้ว' : '⏳ รอตรวจ'})
            </span>
          </div>
        </div>
      `).join('');
    }
    elements.employeeDropdown.style.display = 'block';
  });

  // Click on dropdown item
  elements.employeeDropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (!item) return;
    const empName = item.getAttribute('data-name');
    const emp = state.employees.find(e => e.name === empName);
    if (emp) {
      selectEmployee(emp);
      elements.employeeSearchInput.value = emp.name;
      elements.employeeDropdown.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!elements.employeeSearchInput.contains(e.target) && !elements.employeeDropdown.contains(e.target)) {
      elements.employeeDropdown.style.display = 'none';
    }
  });

  // Org Filter Pills
  elements.orgPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.orgPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.orgFilter = pill.getAttribute('data-org');
      elements.employeeSearchInput.dispatchEvent(new Event('input'));
    });
  });

  function selectEmployee(emp) {
    state.selectedEmployee = emp;
    elements.employeeProfileCard.style.display = 'block';
    elements.profileName.textContent = emp.name;
    elements.profileOrg.textContent = emp.organization;
    elements.profileDeviceCount.textContent = `${emp.devices.length} รายการอุปกรณ์`;
    elements.profileAvatar.textContent = emp.name.charAt(0).toUpperCase();

    // Handle Resigned Badge and Banner
    if (emp.isResigned) {
      if (elements.profileResignedTag) elements.profileResignedTag.style.display = 'inline-flex';
      if (elements.resignedBanner) elements.resignedBanner.style.display = 'flex';
    } else {
      if (elements.profileResignedTag) elements.profileResignedTag.style.display = 'none';
      if (elements.resignedBanner) elements.resignedBanner.style.display = 'none';
    }

    if (emp.allVerified) {
      elements.profileVerifyStatus.textContent = '✅ ยืนยันครบถ้วนแล้ว';
      elements.profileVerifyStatus.className = 'tag tag-verify-status verified';
      elements.btnConfirmAll.style.display = 'none';
    } else {
      elements.profileVerifyStatus.textContent = `⏳ รอตรวจ ${emp.pendingCount} รายการ`;
      elements.profileVerifyStatus.className = 'tag tag-verify-status pending';
      elements.btnConfirmAll.style.display = 'inline-flex';
    }

    renderEmployeeDevices(emp.devices);

    // Automatically lock and pre-fill Tab 2 registration name
    if (elements.regEmployeeName) {
      elements.regEmployeeName.value = emp.name;
      elements.regEmployeeName.readOnly = true;
      elements.regEmployeeName.style.background = "#f1f5f9";
      elements.regEmployeeName.style.cursor = "not-allowed";
      elements.regEmployeeName.title = "🔒 ล็อกชื่อตามบัญชี Lark ที่เข้าสู่ระบบ";
    }
    if (elements.regEmployeeId) {
      elements.regEmployeeId.value = emp.id || '';
    }
    if (elements.regOrg && emp.organization) {
      elements.regOrg.value = emp.organization;
    }
  }

  // Single Reclaim Button
  if (elements.btnReclaimSingleResigned) {
    elements.btnReclaimSingleResigned.addEventListener('click', async () => {
      if (!state.selectedEmployee) return;
      if (!confirm(`คุณต้องการดึงอุปกรณ์ทั้งหมด ${state.selectedEmployee.devices.length} รายการของ ${state.selectedEmployee.name} กลับเข้าคลังกลาง (Available in Stock) ใช่หรือไม่?`)) return;

      elements.btnReclaimSingleResigned.disabled = true;
      elements.btnReclaimSingleResigned.textContent = "กำลังดึงเข้าคลัง...";

      try {
        const res = await adminFetch('/api/admin/resigned/reclaim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeName: state.selectedEmployee.name })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnReclaimSingleResigned.disabled = false;
        elements.btnReclaimSingleResigned.textContent = "📥 ดึงอุปกรณ์ทั้งหมดกลับเข้าคลังกลาง (Reclaim to Stock)";
      }
    });
  }

  function renderEmployeeDevices(devices) {
    if (!devices || devices.length === 0) {
      elements.employeeDeviceGrid.innerHTML = `
        <div style="grid-column: 1 / -1; background: white; padding: 3rem 2rem; border-radius: var(--radius-lg); text-align: center; border: 2px dashed #cbd5e1; box-shadow: var(--shadow-sm); margin-top: 1rem;">
          <div style="font-size: 3rem; margin-bottom: 0.75rem;">📦</div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem;">ยังไม่มีอุปกรณ์ที่ลงทะเบียนภายใต้ชื่อของคุณ</h3>
          <p style="color: #64748b; font-size: 0.95rem; max-width: 500px; margin: 0 auto 1.5rem; line-height: 1.5;">
            ขณะนี้ยังไม่มีอุปกรณ์ IT (Laptop, PC, Monitor) ผูกอยู่กับบัญชี Lark นี้ หากคุณมีอุปกรณ์ประจำตัวที่ใช้งานอยู่ สามารถกดลงทะเบียนเพิ่มได้ทันทีครับ
          </p>
          <button class="btn btn-primary btn-lg" onclick="document.querySelector('[data-tab=\\'registerTab\\']').click()" style="padding: 12px 28px; font-weight: 700; border-radius: 10px;">
            ➕ ลงทะเบียนอุปกรณ์ใหม่ประจำตัวคุณ
          </button>
        </div>
      `;
      return;
    }

    elements.employeeDeviceGrid.innerHTML = devices.map(item => {
      const devType = getSingleVal(item["Device Type (ประเภทอุปกรณ์)"]);
      const brand = getSingleVal(item["Brand (ยี่ห้อ)"]);
      const devName = item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || `${brand} ${devType}`;
      const assetTag = item["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบ";
      const isMissingTag = item["Missing Tag? (ไม่มีเลขทรัพย์สิน)"] || (assetTag === "ไม่ทราบ");
      const serial = item["Serial Number (S/N)"] || "---";
      const auditStatus = getSingleVal(item["Audit Status (สถานะการยืนยัน)"]);
      const isVerified = auditStatus && auditStatus.includes("ยืนยันแล้ว");
      const isDisputed = auditStatus && auditStatus.includes("ขัดแย้ง");

      let cardClass = isVerified ? 'verified' : (isDisputed ? 'disputed' : (isMissingTag ? 'missing-tag' : 'pending'));
      let statusBadge = isVerified 
        ? `<span class="status-badge verified">✅ ยืนยันถูกต้องแล้ว</span>`
        : (isDisputed 
            ? `<span class="status-badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-weight:600;">🔴 แจ้งซ้ำ/โอนย้ายแล้ว (รอ IT ดำเนินการ)</span>` 
            : `<span class="status-badge pending">⏳ รอการยืนยัน</span>`);

      return `
        <div class="device-card ${cardClass}" data-record-id="${item.record_id}" ${isDisputed ? 'style="opacity: 0.78; border-color: #fca5a5;"' : ''}>
          <div>
            <div class="card-top">
              <span class="device-type-badge">${getDeviceIcon(devType)} ${devType}</span>
              ${statusBadge}
            </div>
            <h4 class="device-title">${devName}</h4>
            <div class="device-brand">${brand} &bull; สังกัด: ${getSingleVal(item["Organization (สังกัด)"])}</div>

            <div class="device-specs-table">
              <div class="spec-row">
                <span class="spec-label">เลขทรัพย์สิน (Asset Tag):</span>
                <span class="spec-value ${isMissingTag ? 'highlight-tag' : ''}">
                  ${isMissingTag ? '🏷️ ไม่ทราบเลขทรัพย์สิน (รอ IT ติดป้าย)' : assetTag}
                </span>
              </div>
              <div class="spec-row">
                <span class="spec-label">Serial Number (S/N):</span>
                <span class="spec-value">${serial}</span>
              </div>
              ${item["Specs / Notes (รายละเอียด/หมายเหตุ)"] ? `
                <div class="spec-row">
                  <span class="spec-label">บันทึก:</span>
                  <span class="spec-value">${item["Specs / Notes (รายละเอียด/หมายเหตุ)"]}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="card-actions" style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${isVerified ? `
              <button class="btn btn-secondary btn-sm" disabled style="color: var(--success); font-weight:600; flex: 1;">
                ✅ ยืนยันแล้ว
              </button>
            ` : (isDisputed ? `
              <button class="btn btn-secondary btn-sm" disabled style="color: #b91c1c; background: #fef2f2; border-color: #fecaca; font-weight: 600; flex: 1;">
                🔴 แจ้งซ้ำ/โอนย้ายแล้ว
              </button>
            ` : `
              <button class="btn btn-primary btn-sm btn-action-verify" data-id="${item.record_id}" style="flex: 1.2;">
                ✅ ข้อมูลถูกต้อง
              </button>
              <button class="btn btn-secondary btn-sm btn-action-quick-dup" data-id="${item.record_id}" style="color: #dc2626; border-color: #fecaca; background: #fff5f5; font-weight: 600; flex: 1;">
                🗑️ แจ้งซ้ำ
              </button>
            `)}
            <button class="btn btn-secondary btn-sm btn-action-edit" data-id="${item.record_id}">
              ✏️ แก้ไข/ย้าย
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach Event Listeners
    elements.employeeDeviceGrid.querySelectorAll('.btn-action-verify').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const recordId = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.textContent = "กำลังบันทึก...";
        await verifyDevice(recordId, state.selectedEmployee.name);
      });
    });

    // Quick duplicate button on front of card
    elements.employeeDeviceGrid.querySelectorAll('.btn-action-quick-dup').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const recordId = btn.getAttribute('data-id');
        if (!confirm("คุณต้องการแจ้งว่ารายการนี้เป็น 'ข้อมูลซ้ำในระบบ' (ไม่มีเครื่องนี้จริง) เพื่อให้ IT ลบออก ใช่หรือไม่?")) return;
        btn.disabled = true;
        btn.textContent = "กำลังบันทึก...";
        try {
          const res = await fetch('/api/report-discrepancy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recordId,
              employeeName: state.selectedEmployee ? state.selectedEmployee.name : "User",
              reason: "รายการข้อมูลซ้ำในระบบ (แจ้งด่วนจากหน้าการ์ด)",
              newHolderName: "DUPLICATE_ENTRY"
            })
          }).then(r => r.json());
          if (res.ok) {
            showToast("🗑️ แจ้งข้อมูลซ้ำเรียบร้อยแล้ว!", "warning");
            await loadAllData(true);
          }
        } catch (err) {
          showToast("เกิดข้อผิดพลาด: " + err.message, "error");
        }
      });
    });

    elements.employeeDeviceGrid.querySelectorAll('.btn-action-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const recordId = btn.getAttribute('data-id');
        openEditModal(recordId);
      });
    });
  }

  async function verifyDevice(recordId, employeeName, notes = "", updatedTag = null, isUnknownTag = false) {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, employeeName, notes, updatedTag, isUnknownTag })
      }).then(r => r.json());

      if (res.ok) {
        showToast(`ยืนยันอุปกรณ์เรียบร้อยแล้ว!`, 'success');
        await loadAllData(true);
      } else {
        showToast(`เกิดข้อผิดพลาด: ${res.message}`, 'error');
      }
    } catch (err) {
      showToast(`ไม่สามารถบันทึกข้อมูลได้: ${err.message}`, 'error');
    }
  }

  // Batch confirm all devices
  elements.btnConfirmAll.addEventListener('click', async () => {
    if (!state.selectedEmployee) return;
    const unverified = state.selectedEmployee.devices.filter(d => {
      const s = getSingleVal(d["Audit Status (สถานะการยืนยัน)"]);
      return !s || !s.includes("ยืนยันแล้ว");
    });

    if (unverified.length === 0) {
      showToast("อุปกรณ์ทั้งหมดยืนยันแล้ว", "info");
      return;
    }

    elements.btnConfirmAll.disabled = true;
    elements.btnConfirmAll.textContent = "กำลังบันทึกยืนยันทั้งหมด...";

    for (const d of unverified) {
      await verifyDevice(d.record_id, state.selectedEmployee.name);
    }

    showToast(`ยืนยันอุปกรณ์ทั้งหมด ${unverified.length} ชิ้นเรียบร้อย!`, "success");
    elements.btnConfirmAll.disabled = false;
    elements.btnConfirmAll.textContent = "✅ ยืนยันอุปกรณ์ทั้งหมดของฉัน";
  });

  // ---------------- MODAL EDIT / REPORT DISCREPANCY ---------------- //

  function openEditModal(recordId) {
    const item = state.assets.find(a => a.record_id === recordId);
    if (!item) return;

    elements.modalRecordId.value = recordId;
    const tag = item["Asset Tag (เลขทรัพย์สิน)"] || "";
    const isUnknown = item["Missing Tag? (ไม่มีเลขทรัพย์สิน)"] || (tag === "ไม่ทราบ");

    elements.modalUpdatedTag.value = isUnknown ? "" : tag;
    elements.modalIsUnknownTag.checked = isUnknown;
    elements.modalUpdatedTag.disabled = isUnknown;
    elements.modalNotes.value = "";
    elements.modalDiscrepancyReason.value = "";
    elements.modalDiscrepancyNewHolder.value = "";

    const devType = getSingleVal(item["Device Type (ประเภทอุปกรณ์)"]);
    elements.modalDevicePreview.innerHTML = `
      <strong>${getDeviceIcon(devType)} ${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset"}</strong>
      <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">
        Serial Number: ${item["Serial Number (S/N)"] || "---"} &bull; สังกัด: ${getSingleVal(item["Organization (สังกัด)"])}
      </div>
    `;

    elements.editModalOverlay.style.display = 'flex';
  }

  elements.modalIsUnknownTag.addEventListener('change', (e) => {
    elements.modalUpdatedTag.disabled = e.target.checked;
    if (e.target.checked) elements.modalUpdatedTag.value = "";
  });

  elements.modalCloseBtn.addEventListener('click', () => elements.editModalOverlay.style.display = 'none');
  elements.modalCancelBtn.addEventListener('click', () => elements.editModalOverlay.style.display = 'none');

  elements.modalSaveBtn.addEventListener('click', async () => {
    const recordId = elements.modalRecordId.value;
    const isUnknownTag = elements.modalIsUnknownTag.checked;
    const updatedTag = elements.modalUpdatedTag.value.trim();
    const notes = elements.modalNotes.value.trim();
    const empName = state.selectedEmployee ? state.selectedEmployee.name : "User";

    elements.modalSaveBtn.disabled = true;
    elements.modalSaveBtn.textContent = "กำลังบันทึก...";

    await verifyDevice(recordId, empName, notes, updatedTag, isUnknownTag);

    elements.modalSaveBtn.disabled = false;
    elements.modalSaveBtn.textContent = "💾 บันทึกและยืนยันเครื่อง";
    elements.editModalOverlay.style.display = 'none';
  });

  elements.btnReportDiscrepancy.addEventListener('click', async () => {
    const recordId = elements.modalRecordId.value;
    const reason = elements.modalDiscrepancyReason.value.trim();
    const newHolder = elements.modalDiscrepancyNewHolder.value.trim();
    const empName = state.selectedEmployee ? state.selectedEmployee.name : "User";

    if (!confirm("คุณต้องการแจ้ง IT ว่าคุณไม่ได้ถือครองเครื่องนี้แล้วใช่หรือไม่?")) return;

    elements.btnReportDiscrepancy.disabled = true;
    try {
      const res = await fetch('/api/report-discrepancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, employeeName: empName, reason, newHolderName: newHolder })
      }).then(r => r.json());

      if (res.ok) {
        showToast("ส่งรายงานความคลาดเคลื่อนให้ IT เรียบร้อยแล้ว", "warning");
        elements.editModalOverlay.style.display = 'none';
        await loadAllData(true);
      }
    } catch (err) {
      showToast("เกิดข้อผิดพลาด: " + err.message, "error");
    } finally {
      elements.btnReportDiscrepancy.disabled = false;
    }
  });

  elements.btnReportDuplicate.addEventListener('click', async () => {
    const recordId = elements.modalRecordId.value;
    const empName = state.selectedEmployee ? state.selectedEmployee.name : "User";

    if (!confirm("คุณต้องการแจ้งว่ารายการนี้เป็น 'ข้อมูลซ้ำ' เพื่อให้ IT ลบออกจากระบบใช่หรือไม่?")) return;

    elements.btnReportDuplicate.disabled = true;
    elements.btnReportDuplicate.textContent = "กำลังบันทึกแจ้งข้อมูลซ้ำ...";

    try {
      const res = await fetch('/api/report-discrepancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recordId,
          employeeName: empName,
          reason: "รายการข้อมูลซ้ำในระบบ (ใช้งานเครื่องจริงเพียง 1 ตัว)",
          newHolderName: "DUPLICATE_ENTRY"
        })
      }).then(r => r.json());

      if (res.ok) {
        showToast("🗑️ แจ้งเป็นข้อมูลซ้ำเรียบร้อยแล้ว! เจ้าหน้าที่ IT จะดำเนินการลบออกจากระบบกลางครับ", "warning");
        elements.editModalOverlay.style.display = 'none';
        await loadAllData(true);
      }
    } catch (err) {
      showToast("เกิดข้อผิดพลาด: " + err.message, "error");
    } finally {
      elements.btnReportDuplicate.disabled = false;
      elements.btnReportDuplicate.textContent = "🗑️ แจ้งเป็นข้อมูลซ้ำในระบบ (มีเครื่องเดียวจริง ให้ IT ลบรายการนี้)";
    }
  });

  // ---------------- TAB 2: REGISTER NEW ASSET & DUPLICATE DETECTION ---------------- //

  elements.regUnknownTag.addEventListener('change', (e) => {
    elements.regAssetTag.disabled = e.target.checked;
    if (e.target.checked) {
      elements.regAssetTag.value = "ไม่ทราบ";
      elements.duplicateAlertBanner.style.display = 'none';
    } else {
      elements.regAssetTag.value = "";
    }
  });

  elements.regUnknownSN.addEventListener('change', (e) => {
    elements.regSerial.disabled = e.target.checked;
    if (e.target.checked) elements.regSerial.value = "";
  });

  // Real-time Duplicate Detection Listener
  function checkDuplicateRealtime() {
    clearTimeout(state.duplicateCheckTimeout);
    state.duplicateCheckTimeout = setTimeout(async () => {
      const tag = elements.regAssetTag.value.trim();
      const sn = elements.regSerial.value.trim();

      if ((!tag || tag === "ไม่ทราบ") && (!sn || sn === "---")) {
        elements.duplicateAlertBanner.style.display = 'none';
        return;
      }

      try {
        const res = await fetch('/api/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetTag: tag, serialNumber: sn })
        }).then(r => r.json());

        if (res.hasConflict) {
          let conflictMsg = [];
          if (res.canClaim && res.claimRecordId) {
            conflictMsg.push(`
              <div style="margin-bottom: 8px;">
                💡 ตรวจพบเครื่องนี้ในระบบ (<strong>${res.snConflict?.deviceName || res.tagConflict?.deviceName || 'อุปกรณ์ IT'}</strong> | S/N: <code>${res.snConflict?.serialNumber || sn || '-'}</code>) สถานะปัจจุบัน: <strong>สำรองในคลังส่วนกลาง</strong>
              </div>
              <button type="button" class="btn btn-success btn-sm" id="btnOneClickClaimDuplicate" data-id="${res.claimRecordId}" style="background: #059669; border-color: #047857; font-weight: 600; padding: 6px 14px; box-shadow: 0 2px 4px rgba(5,150,105,0.2);">
                🙋‍♂️ ฉันกำลังใช้งานเครื่องนี้อยู่ (โอนเข้าชื่อฉันทันที 1 คลิก)
              </button>
            `);
          } else {
            if (res.tagConflict) {
              conflictMsg.push(`🏷️ <strong>เลขทรัพย์สิน '${res.tagConflict.assetTag}'</strong> ถูกบันทึกไว้แล้วในระบบ (ถือครองโดย <strong>${res.tagConflict.holder}</strong> - ${res.tagConflict.deviceName})`);
            }
            if (res.snConflict) {
              conflictMsg.push(`🔍 <strong>Serial Number '${res.snConflict.serialNumber}'</strong> ตรงกับเครื่องของ <strong>${res.snConflict.holder}</strong>`);
            }
          }
          elements.duplicateAlertText.innerHTML = conflictMsg.join("<br>");
          elements.duplicateAlertBanner.style.display = 'flex';

          const claimBtn = document.getElementById('btnOneClickClaimDuplicate');
          if (claimBtn) {
            claimBtn.addEventListener('click', async () => {
              const currentEmp = state.selectedEmployee || state.ssoUser;
              if (!currentEmp || !currentEmp.name) {
                showToast("กรุณาเข้าสู่ระบบก่อนรับโอนเครื่อง", "warning");
                return;
              }
              claimBtn.disabled = true;
              claimBtn.textContent = "กำลังโอนเครื่อง...";
              try {
                const claimRes = await fetch('/api/assets/claim', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    assetRecordId: res.claimRecordId,
                    employeeName: currentEmp.name,
                    employeeId: currentEmp.id || currentEmp.open_id,
                    organization: currentEmp.organization || 'XPO'
                  })
                }).then(r => r.json());

                if (claimRes.ok) {
                  showToast("🎉 โอนเครื่องเข้าเป็นทรัพย์สินของคุณและยืนยันเรียบร้อยแล้ว!", "success");
                  elements.newAssetForm.reset();
                  elements.duplicateAlertBanner.style.display = 'none';
                  await loadAllData(true);
                  const tab1 = document.querySelector('.tab-btn[data-tab="verifyTab"]');
                  if (tab1) tab1.click();
                } else {
                  showToast(claimRes.message || "โอนเครื่องไม่สำเร็จ", "error");
                }
              } catch (err) {
                showToast("เชื่อมต่อขัดข้อง: " + err.message, "error");
              } finally {
                claimBtn.disabled = false;
              }
            });
          }
        } else {
          elements.duplicateAlertBanner.style.display = 'none';
        }
      } catch (err) {
        console.error("Duplicate check error:", err);
      }
    }, 400);
  }

  elements.regAssetTag.addEventListener('input', checkDuplicateRealtime);
  elements.regSerial.addEventListener('input', checkDuplicateRealtime);

  // New Asset Form Submit
  elements.newAssetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('btnSubmitNewAsset');
    submitBtn.disabled = true;
    submitBtn.textContent = "กำลังบันทึกและส่งข้อมูลเข้า Lark Base...";

    let ssoOpenId = elements.regEmployeeId.value || undefined;
    try {
      const ssoUser = JSON.parse(sessionStorage.getItem('lark_sso_user') || localStorage.getItem('lark_sso_user') || '{}');
      if (ssoUser && ssoUser.open_id) ssoOpenId = ssoUser.open_id;
    } catch(e) {}

    const payload = {
      employeeName: elements.regEmployeeName.value.trim(),
      employeeId: ssoOpenId,
      organization: elements.regOrg.value,
      deviceType: elements.regDeviceType.value,
      brand: elements.regBrand.value,
      deviceName: elements.regDeviceName.value.trim(),
      assetTag: elements.regAssetTag.value.trim(),
      isUnknownTag: elements.regUnknownTag.checked,
      serialNumber: elements.regSerial.value.trim(),
      isUnknownSN: elements.regUnknownSN.checked,
      condition: elements.regCondition.value,
      notes: elements.regNotes.value.trim()
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.ok) {
        showToast("🎉 ลงทะเบียนและยืนยันเครื่องเข้าสู่ Lark Base เรียบร้อยแล้ว!", "success");
        elements.newAssetForm.reset();
        elements.regEmployeeId.value = "";
        elements.regAssetTag.disabled = false;
        elements.regSerial.disabled = false;
        elements.duplicateAlertBanner.style.display = 'none';
        await loadAllData(true);
        const verifyBtn = document.querySelector('[data-tab="verifyTab"]');
        if (verifyBtn) verifyBtn.click();
      } else {
        showToast("เกิดข้อผิดพลาด: " + res.message, "error");
      }
    } catch (err) {
      showToast("ไม่สามารถส่งข้อมูลได้: " + err.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "🚀 บันทึกลงทะเบียน & ยืนยันเครื่องเข้าสู่ระบบ";
    }
  });

  // ---------------- TAB 3: TEMPORARY LOAN & RETURN KIOSK ---------------- //

  // Stock Category Filter Pills
  elements.stockCatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      elements.stockCatPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.stockCatFilter = pill.getAttribute('data-cat');
      renderLoans();
    });
  });

  // Duration Presets Chips in Borrow Form
  elements.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const days = parseInt(chip.getAttribute('data-days'), 10);
      elements.loanExpectedReturn.value = formatDaysOffset(days);
    });
  });

  // Set default return date to tomorrow (+1 day)
  elements.loanExpectedReturn.value = formatDaysOffset(1);

  function renderLoans() {
    const rawStock = state.loans.availableStock || [];
    const active = state.loans.activeLoans || [];
    const history = state.loans.returnHistory || [];

    // Filter stock by category
    const filteredStock = rawStock.filter(item => {
      if (state.stockCatFilter === 'ALL') return true;
      const type = (getSingleVal(item["Device Type (ประเภทอุปกรณ์)"]) || "").toLowerCase();
      const cat = state.stockCatFilter.toLowerCase();
      return type.includes(cat);
    });

    // Render Available Stock Grid
    if (filteredStock.length === 0) {
      elements.availableStockGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>ขณะนี้ไม่มีอุปกรณ์คงคลังในหมวดนี้ที่ว่างพร้อมให้ยืม</h3>
        </div>
      `;
    } else {
      elements.availableStockGrid.innerHTML = filteredStock.map(item => {
        const devType = getSingleVal(item["Device Type (ประเภทอุปกรณ์)"]);
        const brand = getSingleVal(item["Brand (ยี่ห้อ)"]);
        const name = item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || `${brand} ${devType}`;
        const tag = item["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบ";

        return `
          <div class="stock-card">
            <div>
              <div class="card-top">
                <span class="device-type-badge">${getDeviceIcon(devType)} ${devType}</span>
                <span class="status-badge verified">🟢 ว่างในคลัง</span>
              </div>
              <h4 class="device-title">${name}</h4>
              <div class="device-brand">${brand} &bull; สังกัด: ${getSingleVal(item["Organization (สังกัด)"])}</div>
              <div class="device-specs-table">
                <div class="spec-row">
                  <span class="spec-label">เลขทรัพย์สิน:</span>
                  <span class="spec-value">${tag}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">S/N:</span>
                  <span class="spec-value">${item["Serial Number (S/N)"] || "---"}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm btn-borrow-this" data-id="${item.record_id}" data-name="${name}" style="flex: 1; font-size: 0.75rem; padding: 6px 8px;">
                ⚡ ขอยืมชั่วคราว
              </button>
              <button class="btn btn-success btn-sm btn-claim-this" data-id="${item.record_id}" data-name="${name}" data-tag="${tag}" style="flex: 1.2; font-size: 0.75rem; padding: 6px 8px; background: #059669; border-color: #047857; font-weight: 600;">
                🙋‍♂️ ฉันกำลังใช้เครื่องนี้
              </button>
            </div>
          </div>
        `;
      }).join('');

      elements.availableStockGrid.querySelectorAll('.btn-borrow-this').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          document.querySelector('[data-subtab="subBorrowForm"]').click();
          elements.loanAssetSelect.value = id;
        });
      });

      elements.availableStockGrid.querySelectorAll('.btn-claim-this').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.getAttribute('data-id');
          const name = btn.getAttribute('data-name');
          const tag = btn.getAttribute('data-tag');

          const currentEmp = state.selectedEmployee || state.ssoUser;
          if (!currentEmp || !currentEmp.name) {
            showToast("กรุณาเข้าสู่ระบบด้วย Lark SSO ก่อนกดยืนยันรับเครื่อง", "warning");
            return;
          }

          if (!confirm(`คุณต้องการรับ "${name}" (เลขทรัพย์สิน: ${tag}) เข้าเป็นอุปกรณ์ประจำตัวของคุณ (${currentEmp.name}) ใช่หรือไม่?`)) return;

          btn.disabled = true;
          btn.textContent = "กำลังรับเครื่อง...";

          try {
            const res = await fetch('/api/assets/claim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                assetRecordId: id,
                employeeName: currentEmp.name,
                employeeId: currentEmp.id || currentEmp.open_id,
                organization: currentEmp.organization || 'XPO'
              })
            }).then(r => r.json());

            if (res.ok) {
              showToast("🎉 รับเครื่องเข้าเป็นทรัพย์สินประจำตัวของคุณเรียบร้อยแล้ว!", "success");
              await loadAllData(true);
              const tab1 = document.querySelector('.tab-btn[data-tab="verifyTab"]');
              if (tab1) tab1.click();
            } else {
              showToast(res.message || "เกิดข้อผิดพลาดในการรับเครื่อง", "error");
            }
          } catch (err) {
            showToast(`เชื่อมต่อขัดข้อง: ${err.message}`, "error");
          } finally {
            btn.disabled = false;
            btn.textContent = "🙋‍♂️ ฉันกำลังใช้เครื่องนี้";
          }
        });
      });
    }

    // Populate Loan Request Select Dropdown
    elements.loanAssetSelect.innerHTML = `<option value="">-- กรุณาเลือกอุปกรณ์ที่ว่าง --</option>` +
      rawStock.map(s => `<option value="${s.record_id}">${getDeviceIcon(getSingleVal(s["Device Type (ประเภทอุปกรณ์)"]))} ${s["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "Asset"} (${s["Asset Tag (เลขทรัพย์สิน)"] || "No Tag"})</option>`).join('');

    // Render Active Loans Table with Due Calculation & Quick Return Button
    if (active.length === 0) {
      elements.activeLoansTbody.innerHTML = `<tr><td colspan="8" class="text-center">ไม่มีอุปกรณ์ที่อยู่ระหว่างการยืมในขณะนี้</td></tr>`;
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      elements.activeLoansTbody.innerHTML = active.map(item => {
        const holder = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
        let holderName = getSafeHolderName(holder, "-");

        // Parse expected return date from notes or default
        const notes = item["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "";
        let returnDateText = "ตามรอบยืม";
        let statusBadge = `<span class="status-badge pending">🟡 กำลังยืม</span>`;

        const matchDate = notes.match(/กำหนดคืน\s*(\d{4}-\d{2}-\d{2})/);
        if (matchDate) {
          const expDate = matchDate[1];
          returnDateText = expDate;
          if (expDate < todayStr) {
            statusBadge = `<span class="status-badge overdue">🚨 เกินกำหนดคืน (Overdue)</span>`;
          } else if (expDate === todayStr) {
            statusBadge = `<span class="status-badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">⏰ ครบกำหนดคืนวันนี้</span>`;
          } else {
            statusBadge = `<span class="status-badge pending">🟢 กำลังยืม (ถึง ${expDate})</span>`;
          }
        }

        return `
          <tr>
            <td><strong>${item["Asset Tag (เลขทรัพย์สิน)"] || "ไม่ทราบ"}</strong></td>
            <td>${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "Asset"}</td>
            <td><strong>${holderName}</strong></td>
            <td><span class="tag tag-org">${getSingleVal(item["Organization (สังกัด)"])}</span></td>
            <td>${item["Received Date (วันที่เริ่มใช้งาน)"] || todayStr}</td>
            <td>${returnDateText}</td>
            <td>${statusBadge}</td>
            <td>
              <button class="btn btn-success btn-sm btn-quick-return" data-id="${item.record_id}" data-name="${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "Asset"}" data-tag="${item["Asset Tag (เลขทรัพย์สิน)"] || ""}">
                📥 ส่งคืนอุปกรณ์
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Attach Quick Return Modal Trigger
      elements.activeLoansTbody.querySelectorAll('.btn-quick-return').forEach(btn => {
        btn.addEventListener('click', () => {
          const assetId = btn.getAttribute('data-id');
          const devName = btn.getAttribute('data-name');
          const tag = btn.getAttribute('data-tag');
          openReturnModal(assetId, devName, tag);
        });
      });
    }

    // Render Return History Log
    if (history.length === 0) {
      elements.returnHistoryTbody.innerHTML = `<tr><td colspan="6" class="text-center">ยังไม่มีประวัติการส่งคืนอุปกรณ์</td></tr>`;
    } else {
      elements.returnHistoryTbody.innerHTML = history.slice(0, 30).map(h => `
        <tr>
          <td><strong>${h["Linked Asset (อุปกรณ์ที่ยืม)"] || "Asset"}</strong></td>
          <td>${h["Purpose (วัตถุประสงค์การยืม)"] || "ส่งคืนเข้าคลัง"}</td>
          <td>${h["Borrow Date (วันที่เริ่มยืม)"] || "-"}</td>
          <td><span class="tag" style="background:#ecfdf5; color:#065f46;">${h["Actual Return Date (วันที่ส่งคืนจริง)"] || "-"}</span></td>
          <td><span class="status-badge verified">🔵 คืนเรียบร้อย</span></td>
          <td>${h["Notes (หมายเหตุ)"] || h["Loan Status (สถานะการยืม-คืน)"] || "-"}</td>
        </tr>
      `).join('');
    }
  }

  // ---------------- RETURN MODAL LOGIC ---------------- //

  function openReturnModal(assetId, devName, tag) {
    elements.returnAssetRecordId.value = assetId;
    elements.returnDevicePreview.innerHTML = `
      <strong>📦 ${devName}</strong>
      <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">
        เลขทรัพย์สิน: <strong>${tag || "ไม่ทราบ"}</strong>
      </div>
    `;
    elements.returnNotesInput.value = "";
    elements.returnModalOverlay.style.display = 'flex';
  }

  elements.returnModalCloseBtn.addEventListener('click', () => elements.returnModalOverlay.style.display = 'none');
  elements.returnModalCancelBtn.addEventListener('click', () => elements.returnModalOverlay.style.display = 'none');

  elements.returnModalConfirmBtn.addEventListener('click', async () => {
    const assetRecordId = elements.returnAssetRecordId.value;
    const returnCondition = elements.returnConditionSelect.value;
    const returnNotes = elements.returnNotesInput.value.trim();

    elements.returnModalConfirmBtn.disabled = true;
    elements.returnModalConfirmBtn.textContent = "กำลังบันทึกรับคืน...";

    try {
      const res = await fetch('/api/loans/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetRecordId, returnCondition, returnNotes })
      }).then(r => r.json());

      if (res.ok) {
        showToast("📥 รับคืนอุปกรณ์เข้าสู่คลังเรียบร้อยแล้ว!", "success");
        elements.returnModalOverlay.style.display = 'none';
        await loadAllData(true);
      } else {
        showToast("เกิดข้อผิดพลาด: " + res.message, "error");
      }
    } catch (err) {
      showToast("ไม่สามารถบันทึกรับคืนได้: " + err.message, "error");
    } finally {
      elements.returnModalConfirmBtn.disabled = false;
      elements.returnModalConfirmBtn.textContent = "📥 บันทึกรับคืนเข้าคลัง";
    }
  });

  // Submit Loan Request Form
  elements.loanRequestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checkedAcc = Array.from(document.querySelectorAll('input[name="acc"]:checked')).map(c => c.value);

    const payload = {
      borrowerName: elements.loanBorrowerName.value.trim(),
      borrowerId: elements.loanBorrowerId.value || undefined,
      organization: elements.loanOrg.value,
      assetRecordId: elements.loanAssetSelect.value,
      loanType: elements.loanTypeSelect.value,
      expectedReturnDate: elements.loanExpectedReturn.value,
      purpose: elements.loanPurpose.value.trim(),
      accessories: checkedAcc
    };

    const submitBtn = document.getElementById('btnSubmitLoanRequest');
    submitBtn.disabled = true;
    submitBtn.textContent = "กำลังบันทึกคำขอยืม...";

    try {
      const res = await fetch('/api/loans/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.ok) {
        showToast("🎉 บันทึกการขอยืมอุปกรณ์ชั่วคราวเข้าสู่ Lark Base สำเร็จ!", "success");
        elements.loanRequestForm.reset();
        elements.loanBorrowerId.value = "";
        await loadAllData(true);
        document.querySelector('[data-subtab="subMyLoans"]').click();
      } else {
        showToast("เกิดข้อผิดพลาด: " + res.message, "error");
      }
    } catch (err) {
      showToast("ไม่สามารถส่งข้อมูลได้: " + err.message, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "📤 ยื่นคำขอยืมอุปกรณ์ชั่วคราว";
    }
  });

  // ---------------- CENTRAL STOCK MANAGEMENT (ADMIN) ---------------- //

  if (elements.btnOpenAddStockModal) {
    elements.btnOpenAddStockModal.addEventListener('click', () => {
      if (state.isAdminLoggedIn) {
        elements.addCentralStockModal.style.display = 'flex';
      } else {
        elements.adminAuthPromptModal.style.display = 'flex';
        elements.adminPromptPasswordInput.value = '';
        elements.adminPromptErrorMsg.style.display = 'none';
        setTimeout(() => elements.adminPromptPasswordInput.focus(), 100);
      }
    });
  }

  if (elements.adminAuthPromptCloseBtn) {
    elements.adminAuthPromptCloseBtn.addEventListener('click', () => {
      elements.adminAuthPromptModal.style.display = 'none';
    });
  }
  if (elements.adminAuthPromptCancelBtn) {
    elements.adminAuthPromptCancelBtn.addEventListener('click', () => {
      elements.adminAuthPromptModal.style.display = 'none';
    });
  }

  if (elements.adminAuthPromptSubmitBtn) {
    elements.adminAuthPromptSubmitBtn.addEventListener('click', async () => {
      const pass = elements.adminPromptPasswordInput.value.trim();
      if (!pass) return;

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pass })
        }).then(r => r.json());

        if (res.ok && res.token) {
          sessionStorage.setItem('it_admin_token', res.token);
          state.isAdminLoggedIn = true;
          elements.adminAuthPromptModal.style.display = 'none';
          elements.addCentralStockModal.style.display = 'flex';
          showToast("ยืนยันสิทธิ์ IT Admin สำเร็จ", "success");
        } else {
          elements.adminPromptErrorMsg.style.display = 'block';
        }
      } catch (err) {
        elements.adminPromptErrorMsg.style.display = 'block';
      }
    });
  }

  if (elements.adminPromptPasswordInput) {
    elements.adminPromptPasswordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        elements.adminAuthPromptSubmitBtn.click();
      }
    });
  }

  if (elements.stockUnknownTag) {
    elements.stockUnknownTag.addEventListener('change', (e) => {
      if (e.target.checked) {
        elements.stockAssetTag.value = "ไม่ทราบ";
        elements.stockAssetTag.disabled = true;
      } else {
        elements.stockAssetTag.value = "";
        elements.stockAssetTag.disabled = false;
      }
    });
  }

  if (elements.stockUnknownSerial) {
    elements.stockUnknownSerial.addEventListener('change', (e) => {
      if (e.target.checked) {
        elements.stockSerial.value = "---";
        elements.stockSerial.disabled = true;
      } else {
        elements.stockSerial.value = "";
        elements.stockSerial.disabled = false;
      }
    });
  }

  if (elements.addCentralStockCloseBtn) {
    elements.addCentralStockCloseBtn.addEventListener('click', () => {
      elements.addCentralStockModal.style.display = 'none';
    });
  }
  if (elements.addCentralStockCancelBtn) {
    elements.addCentralStockCancelBtn.addEventListener('click', () => {
      elements.addCentralStockModal.style.display = 'none';
    });
  }

  if (elements.addCentralStockSubmitBtn) {
    elements.addCentralStockSubmitBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const devType = elements.stockDeviceType.value;
      const brand = elements.stockBrand.value;
      const devName = elements.stockDeviceName.value.trim();
      const org = elements.stockOrg.value;
      const tag = elements.stockAssetTag.value.trim();
      const sn = elements.stockSerial.value.trim();
      const notes = elements.stockNotes.value.trim();

      if (!devName) {
        showToast("กรุณาระบุชื่อรุ่น / สเปกอุปกรณ์", "warning");
        elements.stockDeviceName.focus();
        return;
      }

      elements.addCentralStockSubmitBtn.disabled = true;
      elements.addCentralStockSubmitBtn.textContent = "กำลังบันทึกเข้าคลัง...";

      try {
        const res = await adminFetch('/api/admin/stock/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceType: devType,
            brand: brand,
            deviceName: devName,
            organization: org,
            assetTag: tag,
            isUnknownTag: elements.stockUnknownTag?.checked,
            serialNumber: sn,
            isUnknownSN: elements.stockUnknownSerial?.checked,
            notes: notes
          })
        }).then(r => r.json());

        if (res.ok) {
          showToast("🎉 เพิ่มอุปกรณ์เข้าคลังส่วนกลางเรียบร้อยแล้ว!", "success");
          elements.addCentralStockModal.style.display = 'none';
          elements.addCentralStockForm.reset();
          loadAllData(true);
        } else {
          showToast(res.message || "เกิดข้อผิดพลาดในการบันทึก", "error");
        }
      } catch (err) {
        showToast(`เชื่อมต่อล้มเหลว: ${err.message}`, "error");
      } finally {
        elements.addCentralStockSubmitBtn.disabled = false;
        elements.addCentralStockSubmitBtn.textContent = "💾 บันทึกเข้าคลังส่วนกลางทันที";
      }
    });
  }

  // ---------------- TAB 4: IT ADMIN DASHBOARD ---------------- //

  // ---------------- LIVE REAL-TIME EMPLOYEE AUDIT MONITOR ---------------- //
  let liveMonitorData = { stats: null, unverifiedList: [], zeroDeviceList: [], verifiedList: [] };
  let currentMonitorFilter = 'PENDING';
  let monitorAutoRefreshTimer = null;

  async function loadLiveMonitorData(force = false) {
    if (!elements.liveMonitorTableBody) return;

    try {
      if (elements.liveMonitorSyncStatus) elements.liveMonitorSyncStatus.textContent = "กำลังซิงก์ข้อมูล...";
      const res = await adminFetch(`/api/admin/live-monitor${force ? '?refresh=true' : ''}`).then(r => r.json());

      if (res.ok && res.stats) {
        liveMonitorData = res;
        const s = res.stats;

        if (elements.statLiveZeroCount) elements.statLiveZeroCount.textContent = s.zeroDeviceCount;
        if (elements.statLiveZeroPct) elements.statLiveZeroPct.textContent = `ยังไม่มีข้อมูลในระบบ ${s.zeroDevicePct}%`;

        if (elements.statLivePendingCount) elements.statLivePendingCount.textContent = s.unverifiedCount;
        if (elements.statLivePendingPct) elements.statLivePendingPct.textContent = `รอตรวจสอบเครื่อง ${s.unverifiedPct}%`;

        if (elements.statLiveVerifiedCount) elements.statLiveVerifiedCount.textContent = s.verifiedCount;
        if (elements.statLiveVerifiedPct) elements.statLiveVerifiedPct.textContent = `เสร็จสิ้นสมบูรณ์ ${s.verifiedPct}%`;

        if (elements.statLiveTotalCount) elements.statLiveTotalCount.textContent = `${s.totalActive} คน`;

        if (elements.pillPendingCount) elements.pillPendingCount.textContent = s.unverifiedCount;
        if (elements.pillZeroCount) elements.pillZeroCount.textContent = s.zeroDeviceCount;
        if (elements.pillVerifiedCount) elements.pillVerifiedCount.textContent = s.verifiedCount;
        if (elements.pillAllCount) elements.pillAllCount.textContent = s.totalActive;

        const timeStr = new Date().toLocaleTimeString('th-TH');
        if (elements.liveMonitorSyncStatus) elements.liveMonitorSyncStatus.textContent = `ซิงก์ล่าสุด: ${timeStr}`;

        renderLiveMonitorTable();
      } else {
        elements.liveMonitorTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--danger); padding:20px;">โหลดข้อมูลไม่สำเร็จ: ${res.message || 'โปรดเข้าสู่ระบบ Admin'}</td></tr>`;
      }
    } catch (err) {
      console.error("Live Monitor Error:", err);
      if (elements.liveMonitorTableBody) {
        elements.liveMonitorTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--danger); padding:20px;">เกิดข้อผิดพลาดในการเชื่อมต่อ: ${err.message}</td></tr>`;
      }
    }
  }

  function renderLiveMonitorTable() {
    if (!elements.liveMonitorTableBody) return;
    const query = (elements.liveMonitorSearchInput?.value || "").toLowerCase().trim();

    let list = [];
    if (currentMonitorFilter === 'PENDING') {
      list = (liveMonitorData.unverifiedList || []).map(u => ({ ...u, rowType: 'PENDING' }));
    } else if (currentMonitorFilter === 'ZERO') {
      list = (liveMonitorData.zeroDeviceList || []).map(u => ({ ...u, rowType: 'ZERO' }));
    } else if (currentMonitorFilter === 'VERIFIED') {
      list = (liveMonitorData.verifiedList || []).map(u => ({ ...u, rowType: 'VERIFIED' }));
    } else {
      list = [
        ...(liveMonitorData.unverifiedList || []).map(u => ({ ...u, rowType: 'PENDING' })),
        ...(liveMonitorData.zeroDeviceList || []).map(u => ({ ...u, rowType: 'ZERO' })),
        ...(liveMonitorData.verifiedList || []).map(u => ({ ...u, rowType: 'VERIFIED' })),
        ...(liveMonitorData.directorList || []).map(u => ({ ...u, rowType: 'DIRECTOR' }))
      ];
    }

    if (query) {
      list = list.filter(u => 
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.enName && u.enName.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.org && u.org.toLowerCase().includes(query))
      );
    }

    if (list.length === 0) {
      elements.liveMonitorTableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="padding:24px; color:var(--text-muted);">🎉 ไม่พบข้อมูลในหมวดนี้ หรือไม่ตรงกับคำค้นหา</td></tr>`;
      return;
    }

    const rowsHtml = list.map(u => {
      let badgeHtml = '';
      let devicesHtml = '';
      let actionBtnHtml = '';

      if (u.rowType === 'DIRECTOR') {
        badgeHtml = `<span class="tag" style="background:#f1f5f9; color:#475569; font-weight:600;">👑 กรรมการบริษัท</span>`;
        devicesHtml = `<span style="color:#64748b; font-size:0.8125rem;">ยกเว้นการตรวจสอบตามนโยบาย</span>`;
        actionBtnHtml = `<span style="color:#94a3b8; font-size:0.75rem; font-weight:600; display:block; text-align:center;">🛡️ ไม่ส่งแจ้งเตือน</span>`;
      } else if (u.rowType === 'ZERO') {
        badgeHtml = `<span class="tag" style="background:#fee2e2; color:#b91c1c; font-weight:600;">🔴 ยังไม่ลงทะเบียน</span>`;
        devicesHtml = `<span style="color:#94a3b8; font-size:0.8125rem;">ยังไม่มีรายการอุปกรณ์ในระบบ (0 ชิ้น)</span>`;
        actionBtnHtml = `
          <button class="btn btn-sm btn-primary btn-nudge-employee" data-openid="${u.openId}" data-name="${u.name}" data-type="REGISTER" style="padding: 4px 10px; font-size: 0.75rem; width: 100%;">
            🔔 เตือนลงทะเบียน
          </button>
        `;
      } else if (u.rowType === 'PENDING') {
        badgeHtml = `<span class="tag" style="background:#fef3c7; color:#92400e; font-weight:600;">🟡 รอการยืนยัน (${u.pendingDevices?.length || 0})</span>`;
        const devItems = (u.pendingDevices || []).map(d => 
          `<div style="margin-bottom:2px;">• <strong>${d.name}</strong> <span style="color:#64748b; font-size:0.75rem;">(Tag: <code>${d.tag}</code> | S/N: <code>${d.sn}</code>)</span></div>`
        ).join('');
        devicesHtml = `<div style="font-size:0.8125rem;">${devItems || '-'}</div>`;
        const devPayload = encodeURIComponent(JSON.stringify(u.pendingDevices || []));
        actionBtnHtml = `
          <button class="btn btn-sm btn-nudge-employee" data-openid="${u.openId}" data-name="${u.name}" data-type="VERIFY" data-devices="${devPayload}" style="padding: 4px 10px; font-size: 0.75rem; background:#f59e0b; color:#fff; border:none; border-radius:4px; cursor:pointer; width: 100%; font-weight:600;">
            🔔 เตือนกดยืนยัน
          </button>
        `;
      } else {
        badgeHtml = `<span class="tag" style="background:#dcfce7; color:#166534; font-weight:600;">🟢 ยืนยันครบแล้ว</span>`;
        devicesHtml = `<span style="color:#166534; font-size:0.8125rem;">✅ ยืนยันความถูกต้องครบทุกเครื่อง (${u.deviceCount || 1} ชิ้น)</span>`;
        actionBtnHtml = `<span style="color:#166534; font-size:0.8rem; font-weight:600; display:block; text-align:center;">✅ สมบูรณ์แล้ว</span>`;
      }

      const avatarHtml = u.avatar 
        ? `<img src="${u.avatar}" style="width:24px; height:24px; border-radius:50%; object-fit:cover;">`
        : `<span style="font-size:1rem;">👤</span>`;

      return `
        <tr>
          <td>${badgeHtml}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${avatarHtml}
              <div>
                <strong>${u.name}</strong>
                ${u.enName && u.enName !== u.name ? `<div style="font-size:0.75rem; color:#64748b;">${u.enName}</div>` : ''}
              </div>
            </div>
          </td>
          <td><span class="tag tag-org">${u.org || "XPO"}</span></td>
          <td style="font-size:0.8125rem; color:#475569;">${u.email || "-"}</td>
          <td>${devicesHtml}</td>
          <td style="text-align: center;">${actionBtnHtml}</td>
        </tr>
      `;
    });

    elements.liveMonitorTableBody.innerHTML = rowsHtml.join('');

    // Attach Nudge Click Listeners
    elements.liveMonitorTableBody.querySelectorAll('.btn-nudge-employee').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const openId = btn.getAttribute('data-openid');
        const name = btn.getAttribute('data-name');
        const type = btn.getAttribute('data-type');
        let devices = [];
        try {
          const rawDev = btn.getAttribute('data-devices');
          if (rawDev) devices = JSON.parse(decodeURIComponent(rawDev));
        } catch(e) {}

        if (!confirm(`ต้องการส่งการ์ดแจ้งเตือนผ่าน Lark Bot ไปหา "${name}" ตอนนี้ใช่หรือไม่?`)) return;

        btn.disabled = true;
        btn.textContent = "กำลังส่ง...";

        try {
          const res = await adminFetch('/api/admin/live-monitor/nudge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ openId, name, type, devices })
          }).then(r => r.json());

          if (res.ok) {
            showToast(`ส่งการ์ดแจ้งเตือนหา ${name} สำเร็จเรียบร้อย!`, "success");
            btn.textContent = "✓ ส่งเตือนแล้ว";
            btn.style.background = "#10b981";
          } else {
            showToast(res.message || "เกิดข้อผิดพลาดในการส่ง", "error");
            btn.disabled = false;
            btn.textContent = "🔔 ลองใหม่อีกครั้ง";
          }
        } catch (err) {
          showToast("เกิดข้อผิดพลาด: " + err.message, "error");
          btn.disabled = false;
          btn.textContent = "🔔 ลองใหม่อีกครั้ง";
        }
      });
    });
  }

  // Filter pills click
  if (elements.liveMonitorFilterPills) {
    elements.liveMonitorFilterPills.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        elements.liveMonitorFilterPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentMonitorFilter = pill.getAttribute('data-filter');
        renderLiveMonitorTable();
      });
    });
  }

  // Mini-cards click to filter
  if (elements.cardFilterZero) {
    elements.cardFilterZero.addEventListener('click', () => {
      currentMonitorFilter = 'ZERO';
      elements.liveMonitorFilterPills?.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'ZERO'));
      renderLiveMonitorTable();
    });
  }
  if (elements.cardFilterPending) {
    elements.cardFilterPending.addEventListener('click', () => {
      currentMonitorFilter = 'PENDING';
      elements.liveMonitorFilterPills?.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'PENDING'));
      renderLiveMonitorTable();
    });
  }
  if (elements.cardFilterVerified) {
    elements.cardFilterVerified.addEventListener('click', () => {
      currentMonitorFilter = 'VERIFIED';
      elements.liveMonitorFilterPills?.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'VERIFIED'));
      renderLiveMonitorTable();
    });
  }
  if (elements.cardFilterAll) {
    elements.cardFilterAll.addEventListener('click', () => {
      currentMonitorFilter = 'ALL';
      elements.liveMonitorFilterPills?.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-filter') === 'ALL'));
      renderLiveMonitorTable();
    });
  }

  // Search input
  if (elements.liveMonitorSearchInput) {
    elements.liveMonitorSearchInput.addEventListener('input', () => renderLiveMonitorTable());
  }

  // Manual refresh
  if (elements.btnRefreshLiveMonitor) {
    elements.btnRefreshLiveMonitor.addEventListener('click', async () => {
      elements.btnRefreshLiveMonitor.disabled = true;
      elements.btnRefreshLiveMonitor.textContent = "กำลังซิงก์...";
      await loadLiveMonitorData(true);
      elements.btnRefreshLiveMonitor.disabled = false;
      elements.btnRefreshLiveMonitor.textContent = "🔄 ซิงก์ข้อมูลสด";
      showToast("ซิงก์ข้อมูลพนักงานล่าสุดสำเร็จ!", "success");
    });
  }

  // Copy list to clipboard
  if (elements.btnCopyPendingList) {
    elements.btnCopyPendingList.addEventListener('click', () => {
      let textToCopy = "";
      if (currentMonitorFilter === 'ZERO') {
        const names = (liveMonitorData.zeroDeviceList || []).map((u, i) => `${i + 1}. ${u.name} (${u.org})`).join('\n');
        textToCopy = `📢 รายชื่อพนักงานที่ยังไม่ขึ้นทะเบียนเครื่องในระบบ (${liveMonitorData.zeroDeviceList?.length || 0} คน):\n${names}\n\n👉 โปรดลงทะเบียนเครื่องได้ที่: https://it-asset-portal.shine-toothbrush.workers.dev/?tab=registerTab`;
      } else if (currentMonitorFilter === 'VERIFIED') {
        const names = (liveMonitorData.verifiedList || []).map((u, i) => `${i + 1}. ${u.name} (${u.org})`).join('\n');
        textToCopy = `✅ รายชื่อพนักงานที่ยืนยันเครื่องเรียบร้อยแล้ว (${liveMonitorData.verifiedList?.length || 0} คน):\n${names}`;
      } else {
        const names = (liveMonitorData.unverifiedList || []).map((u, i) => `${i + 1}. ${u.name} (${u.org}) - ค้างยืนยัน ${u.pendingDevices?.length || 0} ชิ้น`).join('\n');
        textToCopy = `⏳ รายชื่อพนักงานที่มีเครื่องรอการยืนยัน (${liveMonitorData.unverifiedList?.length || 0} คน):\n${names}\n\n👉 โปรดกดยืนยันเครื่องได้ที่: https://it-asset-portal.shine-toothbrush.workers.dev/?tab=verifyTab`;
      }
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("คัดลอกรายชื่อลง Clipboard สำเร็จ! นำไปวางใน Lark ได้เลย", "success");
      });
    });
  }

  // Auto refresh timer setup (30s)
  function startMonitorAutoRefresh() {
    if (monitorAutoRefreshTimer) clearInterval(monitorAutoRefreshTimer);
    monitorAutoRefreshTimer = setInterval(() => {
      if (elements.chkAutoRefreshMonitor && elements.chkAutoRefreshMonitor.checked && elements.adminDashboardView && elements.adminDashboardView.style.display !== 'none') {
        loadLiveMonitorData();
      }
    }, 30000);
  }
  startMonitorAutoRefresh();

  function renderAdminStats() {
    if (!state.adminStats) return;
    const s = state.adminStats;

    if (elements.metricTotal) elements.metricTotal.textContent = s.totalAssets || 0;
    if (elements.metricVerified) elements.metricVerified.textContent = s.verifiedCount || 0;
    if (elements.metricVerifiedPct) elements.metricVerifiedPct.textContent = `${s.overallPercent || 0}%`;
    if (elements.metricPending) elements.metricPending.textContent = s.pendingCount || 0;
    if (elements.metricMissingTag) elements.metricMissingTag.textContent = s.missingTagCount || 0;

    // Progress Bars
    if (elements.xpoProgressText) elements.xpoProgressText.textContent = `${s.orgStats?.XPO?.verified || 0} / ${s.orgStats?.XPO?.total || 0} (${s.xpoPercent || 0}%)`;
    if (elements.xpoProgressBar) elements.xpoProgressBar.style.width = `${s.xpoPercent || 0}%`;

    if (elements.edduProgressText) elements.edduProgressText.textContent = `${s.orgStats?.EDDU?.verified || 0} / ${s.orgStats?.EDDU?.total || 0} (${s.edduPercent || 0}%)`;
    if (elements.edduProgressBar) elements.edduProgressBar.style.width = `${s.edduPercent || 0}%`;

    // Missing Tag Worklist
    const missingList = s.missingTagList || [];
    elements.missingTagBadgeCount.textContent = `${missingList.length} รายการ`;
    if (missingList.length === 0) {
      elements.missingTagTbody.innerHTML = `<tr><td colspan="6" class="text-center">ไม่มีรายการที่ต้องติดป้ายใหม่</td></tr>`;
    } else {
      elements.missingTagTbody.innerHTML = missingList.map(item => {
        const holder = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
        const holderName = getSafeHolderName(holder, "ส่วนกลาง (Central Stock)");

        return `
          <tr>
            <td><strong>${holderName}</strong></td>
            <td><span class="tag tag-org">${getSingleVal(item["Organization (สังกัด)"])}</span></td>
            <td>${getSingleVal(item["Device Type (ประเภทอุปกรณ์)"])}</td>
            <td>${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "IT Asset"}</td>
            <td>${item["Serial Number (S/N)"] || "---"}</td>
            <td><span style="color: var(--text-muted); font-size: 0.8125rem;">${item["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "-"}</span></td>
          </tr>
        `;
      }).join('');
    }

    // Render Bot Test Console Select Options
    if (elements.botTestUserSelect && elements.botTestUserSelect.options.length <= 1) {
      elements.botTestUserSelect.innerHTML = `<option value="">-- เลือกรายชื่อพนักงาน --</option>` +
        state.employees.map(e => `<option value="${e.id || ''}" data-name="${e.name}">${e.name} (${e.organization} - ${e.devices.length} อุปกรณ์)</option>`).join('');
    }

    if (elements.botSandboxBadge) {
      const isSandbox = s.botSandboxMode !== false;
      elements.botSandboxBadge.textContent = isSandbox ? '🛡️ Sandbox Whitelist Active' : '🟢 Live Mode';
      elements.botSandboxBadge.className = isSandbox ? 'tag tag-org' : 'tag tag-verify-status verified';
    }

    // Load Duplicates & Resigned Staff & Audit Logs
    loadDuplicateStats();
    loadResignedStaffStats();
    loadResignedHandovers();
    loadAuditLogs();
  }

  // ---------------- SMART DUPLICATE CLEANER HUB ---------------- //
  let duplicateDataCache = { reportedList: [], detectedSnGroups: [] };

  async function loadDuplicateStats() {
    if (!elements.duplicatePreviewTbody) return;
    try {
      elements.duplicatePreviewTbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">กำลังสแกนหาข้อมูลซ้ำ...</td></tr>`;
      const res = await adminFetch('/api/admin/duplicates').then(r => r.json());
      if (!res.ok) return;

      duplicateDataCache = res;
      if (elements.dupReportedBadge) elements.dupReportedBadge.textContent = `${res.reportedCount} ที่พนักงานแจ้งซ้ำ`;
      if (elements.dupDetectedBadge) elements.dupDetectedBadge.textContent = `${res.detectedSnGroupCount} คู่ S/N ซ้ำ`;
      if (elements.btnReportedCount) elements.btnReportedCount.textContent = res.reportedCount;

      const rows = [];
      // 1. Employee reported
      res.reportedList.forEach(item => {
        const h = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
        const holderName = getSafeHolderName(h, "ส่วนกลาง (Central Stock)");

        rows.push(`
          <tr style="background: #fff5f5;">
            <td><span class="tag" style="background:#fee2e2; color:#b91c1c; font-weight:600;">พนักงานแจ้งซ้ำ</span></td>
            <td><strong>${holderName}</strong></td>
            <td>${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "-"}</td>
            <td>${item["Asset Tag (เลขทรัพย์สิน)"] || "-"}</td>
            <td><code>${item["Serial Number (S/N)"] || "---"}</code></td>
            <td><span style="color:#b91c1c; font-size:0.75rem;">${item["Specs / Notes (รายละเอียด/หมายเหตุ)"] || "แจ้งซ้ำในระบบ"}</span></td>
            <td>
              <button class="btn btn-danger btn-sm btn-delete-single-record" data-id="${item.record_id}" style="padding: 2px 8px; font-size: 0.75rem;">
                🗑️ ลบแถวนี้
              </button>
            </td>
          </tr>
        `);
      });

      // 2. Auto-detected S/N groups
      res.detectedSnGroups.forEach(grp => {
        grp.items.forEach((item, idx) => {
          const h = item["Current Holder (ผู้ถือครองปัจจุบัน)"];
          const holderName = getSafeHolderName(h, "ส่วนกลาง (Central Stock)");
          const rawAudit = item["Audit Status (สถานะการยืนยัน)"];
          const auditStr = Array.isArray(rawAudit) ? rawAudit[0] : (rawAudit || "");
          const isVerified = auditStr.includes("ยืนยันแล้ว") || auditStr.includes("Verified");
          const isCentral = holderName.includes("ส่วนกลาง") || holderName.includes("รอจัดสรร");

          let badgeHtml = "";
          if (isVerified) {
            badgeHtml = `<span class="tag" style="background:#dcfce7; color:#166534; font-weight:600;">🟢 ยืนยันแล้ว (แนะนำคงไว้)</span>`;
          } else if (isCentral) {
            badgeHtml = `<span class="tag" style="background:#f1f5f9; color:#475569; font-weight:600;">🏢 สต็อกส่วนกลาง</span>`;
          } else {
            badgeHtml = `<span class="tag" style="background:#fef3c7; color:#92400e; font-weight:600;">🟡 แถวในระบบ</span>`;
          }

          const otherIds = grp.items.filter(it => it.record_id !== item.record_id).map(it => it.record_id);

          rows.push(`
            <tr style="background: ${isVerified ? '#f0fdf4' : (isCentral ? '#f8fafc' : '#fffbeb')};">
              <td>${badgeHtml}</td>
              <td><strong>${holderName}</strong></td>
              <td>${item["Device Name (ชื่อรุ่น/อุปกรณ์)"] || "-"}</td>
              <td>${item["Asset Tag (เลขทรัพย์สิน)"] || "-"}</td>
              <td><strong><code>${grp.sn}</code></strong></td>
              <td><span style="font-size:0.75rem; color:var(--text-muted);">พบซ้ำ ${grp.count} แถว</span></td>
              <td>
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                  ${otherIds.length > 0 ? `
                    <button class="btn btn-success btn-sm btn-keep-this-record" data-id="${item.record_id}" data-other-ids="${otherIds.join(',')}" data-name="${holderName}" data-sn="${grp.sn}" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 600;">
                      ✅ คงแถวนี้ (ลบคู่แฝดอื่น)
                    </button>
                  ` : ''}
                  <button class="btn btn-danger btn-sm btn-delete-single-record" data-id="${item.record_id}" data-name="${holderName}" data-sn="${grp.sn}" style="padding: 3px 8px; font-size: 0.75rem; font-weight: 600;">
                    🗑️ ลบแถวนี้
                  </button>
                </div>
              </td>
            </tr>
          `);
        });
      });

      if (rows.length === 0) {
        elements.duplicatePreviewTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="color:var(--success); padding: 18px;">🎉 เยี่ยมมาก! ไม่พบข้อมูลซ้ำซ้อนในระบบขณะนี้</td></tr>`;
      } else {
        elements.duplicatePreviewTbody.innerHTML = rows.join('');
      }

      // Attach Keep This (Delete Others) listeners
      elements.duplicatePreviewTbody.querySelectorAll('.btn-keep-this-record').forEach(b => {
        b.addEventListener('click', async () => {
          const recId = b.getAttribute('data-id');
          const otherIdsStr = b.getAttribute('data-other-ids') || '';
          const otherIds = otherIdsStr.split(',').filter(Boolean);
          const name = b.getAttribute('data-name');
          const sn = b.getAttribute('data-sn');

          if (otherIds.length === 0) return;
          if (!confirm(`คุณต้องการ "คงรายการของ ${name}" (S/N: ${sn}) ไว้ในระบบ และสั่งลบแถวคู่แฝดที่ซ้ำทั้งหมด (${otherIds.length} แถว) ใช่หรือไม่?`)) return;

          b.disabled = true;
          b.textContent = 'กำลังลบแถวอื่น...';

          try {
            const delRes = await adminFetch('/api/admin/duplicates/batch-delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ recordIds: otherIds })
            }).then(r => r.json());

            if (delRes.ok) {
              showToast(`เก็บแถวของ ${name} เรียบร้อย และลบแถวคู่แฝดที่ซ้ำออกแล้ว!`, 'success');
              await loadAllData(true);
              await loadDuplicateStats();
            } else {
              showToast(delRes.message || 'เกิดข้อผิดพลาด', 'error');
            }
          } catch (err) {
            showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
          }
        });
      });

      // Attach single delete listeners
      elements.duplicatePreviewTbody.querySelectorAll('.btn-delete-single-record').forEach(b => {
        b.addEventListener('click', async () => {
          const recId = b.getAttribute('data-id');
          const name = b.getAttribute('data-name') || 'รายการนี้';
          const sn = b.getAttribute('data-sn') || '';
          if (!confirm(`คุณต้องการลบแถวของ "${name}" ${sn ? `(S/N: ${sn})` : ''} ออกจาก Lark Base ทันทีใช่หรือไม่?`)) return;
          b.disabled = true;
          b.textContent = "...";
          try {
            const delRes = await adminFetch('/api/admin/duplicates/batch-delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ recordIds: [recId] })
            }).then(r => r.json());
            if (delRes.ok) {
              showToast(delRes.message || 'ลบแถวสำเร็จ!', "success");
              await loadAllData(true);
              await loadDuplicateStats();
            } else {
              showToast(delRes.message || 'เกิดข้อผิดพลาดในการลบ', "error");
            }
          } catch (err) {
            showToast("เกิดข้อผิดพลาด: " + err.message, "error");
          }
        });
      });
    } catch (err) {
      console.error("Load duplicates error:", err);
    }
  }

  // Handle 1-Click Delete All Reported Duplicates
  if (elements.btnDeleteReportedDuplicates) {
    elements.btnDeleteReportedDuplicates.addEventListener('click', async () => {
      if (!duplicateDataCache.reportedList || duplicateDataCache.reportedList.length === 0) {
        showToast("ไม่พบรายการที่พนักงานแจ้งซ้ำให้ลบ", "info");
        return;
      }
      const ids = duplicateDataCache.reportedList.map(a => a.record_id);
      if (!confirm(`คุณต้องการสั่งลบข้อมูลที่พนักงานแจ้งซ้ำทั้งหมด ${ids.length} รายการออกจาก Lark Base ทันทีใช่หรือไม่?`)) return;

      elements.btnDeleteReportedDuplicates.disabled = true;
      elements.btnDeleteReportedDuplicates.textContent = "กำลังลบข้อมูลซ้ำ...";

      try {
        const res = await adminFetch('/api/admin/duplicates/batch-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recordIds: ids })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
          await loadDuplicateStats();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnDeleteReportedDuplicates.disabled = false;
        elements.btnDeleteReportedDuplicates.textContent = `🗑️ สั่งลบแถวที่พนักงานแจ้งซ้ำทั้งหมด (${duplicateDataCache.reportedList?.length || 0} รายการ)`;
      }
    });
  }

  // Handle 1-Click Auto Clean Exact S/N Twins
  if (elements.btnAutoCleanSnDuplicates) {
    elements.btnAutoCleanSnDuplicates.addEventListener('click', async () => {
      if (!confirm("คุณต้องการให้ระบบสแกนและลบแถวคู่แฝดที่ Serial Number ซ้ำกันทั้งหมด โดยเก็บแถวที่สมบูรณ์ไว้ 1 แถวอัตโนมัติใช่หรือไม่?")) return;

      elements.btnAutoCleanSnDuplicates.disabled = true;
      elements.btnAutoCleanSnDuplicates.textContent = "กำลังวิเคราะห์และล้างข้อมูลซ้ำ...";

      try {
        const res = await adminFetch('/api/admin/duplicates/auto-clean', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
          await loadDuplicateStats();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnAutoCleanSnDuplicates.disabled = false;
        elements.btnAutoCleanSnDuplicates.textContent = "🤖 ลบแถว S/N ซ้ำอัตโนมัติ (คงเหลือแถวสมบูรณ์ไว้ 1 แถว)";
      }
    });
  }

  if (elements.btnRefreshDuplicates) {
    elements.btnRefreshDuplicates.addEventListener('click', () => loadDuplicateStats());
  }

  // ---------------- RESIGNED STAFF TRACKER ---------------- //
  let resignedDataCache = { resignedEmployees: [] };

  async function loadResignedStaffStats() {
    if (!elements.resignedStaffTbody) return;
    try {
      elements.resignedStaffTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">กำลังโหลดรายชื่อพนักงานที่ลาออก...</td></tr>`;
      const res = await adminFetch('/api/admin/resigned').then(r => r.json());
      if (!res.ok) return;

      resignedDataCache = res;
      if (elements.resignedStaffBadge) {
        elements.resignedStaffBadge.textContent = `${res.resignedCount} คนลาออก (${res.totalDevicesCount} อุปกรณ์ค้าง)`;
      }

      // Populate Manual Resigned Select Options
      if (elements.manualResignedSelect) {
        const activeEmps = state.employees.filter(e => !e.isResigned);
        elements.manualResignedSelect.innerHTML = `<option value="">-- เลือกรายชื่อพนักงาน --</option>` +
          activeEmps.map(e => `<option value="${e.name}">${e.name} (${e.organization} - ${e.devices.length} อุปกรณ์)</option>`).join('');
      }

      if (res.resignedEmployees.length === 0) {
        elements.resignedStaffTbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:var(--success); padding: 18px;">🎉 เยี่ยมมาก! ไม่มีอุปกรณ์ค้างกับพนักงานที่ลาออกแล้ว</td></tr>`;
        return;
      }

      elements.resignedStaffTbody.innerHTML = res.resignedEmployees.map(emp => {
        const devListStr = emp.devices.map(d => {
          const name = d["Device Name (ชื่อรุ่น/อุปกรณ์)"] || d["Device Type (ประเภทอุปกรณ์)"];
          const sn = d["Serial Number (S/N)"] || "";
          return `${name}${sn && sn !== '---' ? ` (S/N: ${sn})` : ''}`;
        }).join(', ');

        return `
          <tr>
            <td>
              <strong>${emp.name}</strong>
              <span class="tag" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem; font-weight:600; margin-left:4px;">🛑 Closed</span>
            </td>
            <td><span class="tag tag-org">${emp.organization}</span></td>
            <td><strong style="color:#b91c1c;">${emp.devices.length} อุปกรณ์</strong></td>
            <td><span style="font-size:0.75rem; color:var(--text-muted);">${devListStr}</span></td>
            <td>
              <button class="btn btn-danger btn-sm btn-reclaim-emp" data-name="${emp.name}" style="padding: 3px 10px; font-size: 0.75rem;">
                📥 ดึงเข้าคลัง (${emp.devices.length})
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Attach single reclaim listeners
      elements.resignedStaffTbody.querySelectorAll('.btn-reclaim-emp').forEach(btn => {
        btn.addEventListener('click', async () => {
          const empName = btn.getAttribute('data-name');
          if (!confirm(`คุณต้องการดึงอุปกรณ์ทั้งหมดของ ${empName} กลับเข้าคลังกลาง (Available in Stock) ใช่หรือไม่?`)) return;

          btn.disabled = true;
          btn.textContent = "...";
          try {
            const res = await adminFetch('/api/admin/resigned/reclaim', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ employeeName: empName })
            }).then(r => r.json());

            if (res.ok) {
              showToast(res.message, "success");
              await loadAllData(true);
              await loadResignedStaffStats();
            } else {
              showToast(res.message, "error");
            }
          } catch (err) {
            showToast("เกิดข้อผิดพลาด: " + err.message, "error");
          }
        });
      });
    } catch (err) {
      console.error("Load resigned staff error:", err);
    }
  }

  // Handle Batch Reclaim All Resigned Staff Devices
  if (elements.btnBatchReclaimAllResigned) {
    elements.btnBatchReclaimAllResigned.addEventListener('click', async () => {
      if (!resignedDataCache.resignedEmployees || resignedDataCache.resignedEmployees.length === 0) {
        showToast("ไม่พบอุปกรณ์ค้างของพนักงานที่ลาออกแล้ว", "info");
        return;
      }
      if (!confirm(`คุณต้องการดึงอุปกรณ์ของพนักงานที่ลาออกทั้งหมด ${resignedDataCache.resignedCount} คน รวม ${resignedDataCache.totalDevicesCount} ชิ้น กลับเข้าคลังกลางทันทีใช่หรือไม่?`)) return;

      elements.btnBatchReclaimAllResigned.disabled = true;
      elements.btnBatchReclaimAllResigned.textContent = "กำลังดึงเครื่องเข้าคลังทั้งหมด...";

      try {
        const res = await adminFetch('/api/admin/resigned/reclaim-all-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
          await loadResignedStaffStats();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnBatchReclaimAllResigned.disabled = false;
        elements.btnBatchReclaimAllResigned.textContent = "⚡ ดึงเครื่องพนักงานที่ลาออกทั้งหมดกลับเข้าคลังกลาง (1-Click Reclaim All)";
      }
    });
  }

  if (elements.btnMarkResignedManual) {
    elements.btnMarkResignedManual.addEventListener('click', async () => {
      const selectedName = elements.manualResignedSelect.value;
      if (!selectedName) {
        showToast("กรุณาเลือกพนักงานที่ต้องการระบุว่าลาออก", "warning");
        return;
      }

      if (!confirm(`คุณต้องการระบุ "${selectedName}" เป็นพนักงานที่ลาออกแล้ว (Closed Account) ใช่หรือไม่?`)) return;

      elements.btnMarkResignedManual.disabled = true;
      elements.btnMarkResignedManual.textContent = "...";

      try {
        const res = await adminFetch('/api/admin/resigned/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeName: selectedName })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
          await loadResignedStaffStats();
          await loadResignedHandovers();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnMarkResignedManual.disabled = false;
        elements.btnMarkResignedManual.textContent = "🛑 ระบุว่าลาออกแล้ว";
      }
    });
  }

  if (elements.btnRefreshResigned) {
    elements.btnRefreshResigned.addEventListener('click', () => {
      loadResignedStaffStats();
      loadResignedHandovers();
    });
  }

  // ---------------- RESIGNED HANDOVERS & TRANSFERS ---------------- //
  let handoverDataCache = { handovers: [] };

  async function loadResignedHandovers() {
    if (!elements.resignedHandoverTbody) return;
    try {
      elements.resignedHandoverTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">กำลังสแกนหาอุปกรณ์ที่ถูกส่งต่อ...</td></tr>`;
      const res = await adminFetch('/api/admin/resigned/handovers').then(r => r.json());
      if (!res.ok) return;

      handoverDataCache = res;
      if (elements.handoverCountBadge) {
        elements.handoverCountBadge.textContent = `${res.handoverCount} รายการส่งต่อ`;
      }
      if (elements.handoverBtnCount) {
        elements.handoverBtnCount.textContent = res.handoverCount;
      }

      if (res.handovers.length === 0) {
        elements.resignedHandoverTbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:var(--success); padding: 14px;">🎉 ไม่พบอุปกรณ์ที่ถูกส่งต่อซ้ำซ้อนในขณะนี้</td></tr>`;
        return;
      }

      elements.resignedHandoverTbody.innerHTML = res.handovers.map(h => {
        return `
          <tr style="background: #fff8f8;">
            <td>
              <strong>${h.deviceName}</strong><br>
              <small style="color:var(--text-muted);">${h.matchType}: <code>${h.matchedValue}</code></small>
            </td>
            <td>
              <span class="tag" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem; font-weight:600;">🛑 ${h.resignedEmp}</span>
            </td>
            <td>
              <span class="tag" style="background:#dcfce7; color:#166534; font-size:0.75rem; font-weight:600;">🟢 ${h.activeEmp}</span>
            </td>
            <td><span class="tag tag-org">${h.activeOrg}</span></td>
            <td><span class="tag tag-verify-status pending" style="font-size:0.75rem;">${h.activeAuditStatus}</span></td>
            <td>
              <button class="btn btn-danger btn-sm btn-resolve-single-handover" 
                data-resigned-id="${h.resignedRecordId}"
                data-active-id="${h.activeRecordId}"
                data-active-emp="${h.activeEmp}"
                data-resigned-emp="${h.resignedEmp}"
                data-device-name="${h.deviceName}"
                style="padding: 2px 8px; font-size: 0.75rem; background: #e11d48; border-color: #be123c;">
                ⚡ อนุมัติโอนย้าย
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // Single Resolve Listeners
      elements.resignedHandoverTbody.querySelectorAll('.btn-resolve-single-handover').forEach(btn => {
        btn.addEventListener('click', async () => {
          const resignedRecordId = btn.getAttribute('data-resigned-id');
          const activeRecordId = btn.getAttribute('data-active-id');
          const activeEmp = btn.getAttribute('data-active-emp');
          const resignedEmp = btn.getAttribute('data-resigned-emp');
          const deviceName = btn.getAttribute('data-device-name');

          if (!confirm(`คุณต้องการอนุมัติการส่งต่อเครื่อง "${deviceName}" จาก ${resignedEmp} ให้ ${activeEmp} และลบแถวเก่าออกจาก Lark Base ทันทีใช่หรือไม่?`)) return;

          btn.disabled = true;
          btn.textContent = "...";

          try {
            const res = await adminFetch('/api/admin/resigned/resolve-handovers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                handoversToResolve: [{ resignedRecordId, activeRecordId, activeEmp, resignedEmp, deviceName }]
              })
            }).then(r => r.json());

            if (res.ok) {
              showToast(res.message, "success");
              await loadAllData(true);
              await loadResignedStaffStats();
              await loadResignedHandovers();
            } else {
              showToast(res.message, "error");
            }
          } catch (err) {
            showToast("เกิดข้อผิดพลาด: " + err.message, "error");
          }
        });
      });

    } catch (err) {
      console.error("Load handovers error:", err);
    }
  }

  // Handle Batch Resolve All Handovers
  if (elements.btnBatchResolveHandovers) {
    elements.btnBatchResolveHandovers.addEventListener('click', async () => {
      if (!handoverDataCache.handovers || handoverDataCache.handovers.length === 0) {
        showToast("ไม่พบรายการที่ต้องอนุมัติการส่งต่อ", "info");
        return;
      }

      if (!confirm(`คุณต้องการอนุมัติการส่งต่ออุปกรณ์ทั้งหมด ${handoverDataCache.handoverCount} รายการ ให้เป็นสิทธิ์ของพนักงานปัจจุบัน และลบแถวเก่าของคนลาออกทั้งหมดทันทีใช่หรือไม่?`)) return;

      elements.btnBatchResolveHandovers.disabled = true;
      elements.btnBatchResolveHandovers.textContent = "กำลังประมวลผลการโอนย้าย...";

      try {
        const res = await adminFetch('/api/admin/resigned/resolve-handovers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ handoversToResolve: handoverDataCache.handovers })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          await loadAllData(true);
          await loadResignedStaffStats();
          await loadResignedHandovers();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.btnBatchResolveHandovers.disabled = false;
        elements.btnBatchResolveHandovers.innerHTML = `⚡ อนุมัติการส่งต่อและลบแถวคนลาออกทั้งหมดใน 1 คลิก (<span id="handoverBtnCount">${handoverDataCache.handovers?.length || 0}</span> รายการ)`;
      }
    });
  }

  // ---------------- IT AUDIT LOGS & DELETION HISTORY ---------------- //
  async function loadAuditLogs() {
    if (!elements.auditLogsTbody) return;
    try {
      elements.auditLogsTbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">กำลังโหลดประวัติ Audit Log...</td></tr>`;
      const res = await adminFetch('/api/admin/audit-logs').then(r => r.json());
      if (!res.ok) return;

      if (elements.auditLogCountBadge) {
        elements.auditLogCountBadge.textContent = `${res.count} รายการ Log`;
      }

      if (!res.logs || res.logs.length === 0) {
        elements.auditLogsTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 16px;">ยังไม่มีรายการประวัติการตรวจสอบย้อนหลัง</td></tr>`;
        return;
      }

      elements.auditLogsTbody.innerHTML = res.logs.map(log => {
        let statusBadge = `<span class="tag tag-verify-status pending">${log.status}</span>`;
        if (log.status.includes('Verified') || log.status.includes('อนุมัติ')) {
          statusBadge = `<span class="tag tag-verify-status verified">🟢 บันทึกอนุมัติ</span>`;
        } else if (log.status.includes('Duplicate') || log.status.includes('ซ้ำ')) {
          statusBadge = `<span class="tag" style="background:#fee2e2; color:#b91c1c; font-weight:600;">🔴 ลบข้อมูลซ้ำ</span>`;
        } else if (log.status.includes('Re-tagging') || log.status.includes('ป้าย')) {
          statusBadge = `<span class="tag" style="background:#fef3c7; color:#92400e; font-weight:600;">🟡 นัดติดป้าย</span>`;
        }

        return `
          <tr>
            <td>${statusBadge}</td>
            <td><span class="tag tag-org">${log.org}</span></td>
            <td>${log.deviceType}</td>
            <td><strong>${log.brandModel}</strong></td>
            <td>
              <div>Tag: <code>${log.assetTag}</code></div>
              <div>S/N: <code>${log.serialNumber}</code></div>
            </td>
            <td><span style="font-size:0.75rem; color:#1e293b;">${log.notes}</span></td>
            <td><span style="font-size:0.75rem; color:var(--text-muted);">${log.reviewerNotes}</span></td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      console.error("Load audit logs error:", err);
    }
  }

  if (elements.btnRefreshAuditLogs) {
    elements.btnRefreshAuditLogs.addEventListener('click', () => loadAuditLogs());
  }

  // Handle Send Test Card from Admin Console
  if (elements.btnSendTestCard) {
    elements.btnSendTestCard.addEventListener('click', async () => {
      const selectedOption = elements.botTestUserSelect.options[elements.botTestUserSelect.selectedIndex];
      const openId = elements.botTestUserSelect.value;
      const targetName = selectedOption ? selectedOption.getAttribute('data-name') : '';
      const cardType = elements.botTestCardType.value;

      if (!targetName && !openId) {
        showToast("กรุณาเลือกพนักงานเป้าหมายก่อนส่งทดสอบ", "warning");
        return;
      }

      elements.btnSendTestCard.disabled = true;
      elements.btnSendTestCard.textContent = "กำลังส่งการ์ดทดสอบ...";
      elements.botTestResultAlert.style.display = 'none';

      try {
        const res = await adminFetch('/api/admin/bot/send-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetOpenId: openId, targetName, cardType })
        }).then(r => r.json());

        elements.botTestResultAlert.style.display = 'block';
        if (res.ok) {
          elements.botTestResultAlert.style.background = '#ecfdf5';
          elements.botTestResultAlert.style.color = '#065f46';
          elements.botTestResultAlert.style.border = '1px solid #a7f3d0';
          elements.botTestResultAlert.innerHTML = `✅ <strong>${res.message}</strong>${res.sendResult?.dryRun ? '<br><small style="color:#b45309;">(หมายเหตุ: ป้องกันการส่งจริงตาม Sandbox Whitelist Guard)</small>' : ''}`;
          showToast(res.message, "success");
        } else {
          elements.botTestResultAlert.style.background = '#fef2f2';
          elements.botTestResultAlert.style.color = '#991b1b';
          elements.botTestResultAlert.style.border = '1px solid #fecaca';
          elements.botTestResultAlert.innerHTML = `❌ ${res.message}`;
          showToast(res.message, "error");
        }
      } catch (err) {
        elements.botTestResultAlert.style.display = 'block';
        elements.botTestResultAlert.style.background = '#fef2f2';
        elements.botTestResultAlert.style.color = '#991b1b';
        elements.botTestResultAlert.innerHTML = `❌ เชื่อมต่อล้มเหลว: ${err.message}`;
      } finally {
        elements.btnSendTestCard.disabled = false;
        elements.btnSendTestCard.textContent = "🚀 ส่งการ์ดทดสอบเข้าแชท Lark ทันที";
      }
    });
  }

  // Handle Trigger Batch Reminders
  if (elements.btnTriggerBatchBot) {
    elements.btnTriggerBatchBot.addEventListener('click', async () => {
      if (!confirm("คุณต้องการสั่งรันระบบส่งการ์ดแจ้งเตือนและทวงยืนยันอัตโนมัติทันทีใช่หรือไม่? (ระบบจะทำงานภายใต้โหมด Sandbox Whitelist ปลอดภัย)")) return;

      elements.btnTriggerBatchBot.disabled = true;
      elements.btnTriggerBatchBot.textContent = "กำลังประมวลผล...";
      elements.batchBotStatus.style.display = 'block';
      elements.batchBotStatus.textContent = "กำลังสแกนและส่งการ์ด...";

      try {
        const res = await adminFetch('/api/admin/bot/batch-reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }).then(r => r.json());

        if (res.ok) {
          elements.batchBotStatus.textContent = `✅ ${res.message}`;
          showToast(res.message, "success");
        } else {
          elements.batchBotStatus.textContent = `❌ ${res.message}`;
          showToast(res.message, "error");
        }
      } catch (err) {
        elements.batchBotStatus.textContent = `❌ เกิดข้อผิดพลาด: ${err.message}`;
      } finally {
        elements.btnTriggerBatchBot.disabled = false;
        elements.btnTriggerBatchBot.textContent = "⚡ รันส่งการ์ดทวงคนที่ยังไม่ยืนยันอัตโนมัติ (Batch Scheduler)";
      }
    });
  }

  // ---------------- LARK SSO AUTHENTICATION HANDLER ---------------- //

  function checkLarkSsoAuth() {
    let ssoUser = null;
    try {
      const raw = sessionStorage.getItem('lark_sso_user') || localStorage.getItem('lark_sso_user');
      if (raw) ssoUser = JSON.parse(raw);
    } catch (e) {}

    if (ssoUser && ssoUser.open_id) {
      if (elements.ssoGatewayScreen) elements.ssoGatewayScreen.style.display = 'none';
      if (elements.mainAppWrapper) elements.mainAppWrapper.style.display = 'block';

      if (elements.headerUserProfile) elements.headerUserProfile.style.display = 'flex';
      if (elements.headerUserName) elements.headerUserName.textContent = ssoUser.name || ssoUser.realName || "พนักงาน";
      if (elements.headerUserAvatar && ssoUser.avatar_url) elements.headerUserAvatar.src = ssoUser.avatar_url;

      if (elements.lockedIdentityBanner) elements.lockedIdentityBanner.style.display = 'flex';
      if (elements.lockedEmployeeName) elements.lockedEmployeeName.textContent = ssoUser.name || ssoUser.realName;
      if (elements.lockedUserAvatarBox && ssoUser.avatar_url) {
        elements.lockedUserAvatarBox.innerHTML = `<img src="${ssoUser.avatar_url}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
      }

      // Auto-fill and lock borrower / requester names
      if (elements.regEmployeeName) {
        elements.regEmployeeName.value = ssoUser.name || ssoUser.realName;
        elements.regEmployeeName.readOnly = true;
      }
      if (elements.loanBorrowerName) {
        elements.loanBorrowerName.value = ssoUser.name || ssoUser.realName;
        elements.loanBorrowerName.readOnly = true;
      }

      // Auto select matching employee by Open ID or exact name
      const targetOpenId = ssoUser.open_id;
      const targetName = (ssoUser.name || ssoUser.realName || "").toLowerCase();

      const found = state.employees.find(e => {
        if (targetOpenId && e.id === targetOpenId) return true;
        const eLower = e.name.toLowerCase();
        if (eLower === targetName) return true;
        if (ssoUser.email && e.email && e.email.toLowerCase() === ssoUser.email.toLowerCase()) return true;
        if (targetName.includes("freyah") && eLower.includes("freyah")) return true;
        if (targetName.includes("foam") && eLower.includes("foam")) return true;
        if (targetName.includes("teeraphat") && eLower.includes("teeraphat")) return true;
        return false;
      });

      if (found) {
        selectEmployee(found);
      } else {
        // User logged in via Lark SSO but has 0 records in master sheet currently
        selectEmployee({
          id: targetOpenId,
          name: ssoUser.name || ssoUser.realName || "พนักงาน",
          organization: "XPO",
          devices: [],
          allVerified: true,
          pendingCount: 0,
          verifiedCount: 0
        });
      }
      return true;
    } else if (state.isAdminLoggedIn) {
      if (elements.ssoGatewayScreen) elements.ssoGatewayScreen.style.display = 'none';
      if (elements.mainAppWrapper) elements.mainAppWrapper.style.display = 'block';
      return true;
    } else {
      if (elements.ssoGatewayScreen) elements.ssoGatewayScreen.style.display = 'flex';
      if (elements.mainAppWrapper) elements.mainAppWrapper.style.display = 'none';
      return false;
    }
  }

  function handleLarkSsoLogout() {
    sessionStorage.removeItem('lark_sso_user');
    localStorage.removeItem('lark_sso_user');
    sessionStorage.removeItem('it_admin_token');
    window.location.href = '/';
  }

  if (elements.btnHeaderLogout) elements.btnHeaderLogout.addEventListener('click', handleLarkSsoLogout);
  if (elements.btnSsoLogout) elements.btnSsoLogout.addEventListener('click', handleLarkSsoLogout);

  if (elements.btnGatewayAdminLogin) {
    elements.btnGatewayAdminLogin.addEventListener('click', () => {
      const pwd = prompt("🔐 กรุณากรอกรหัสผ่าน IT Admin:");
      if (!pwd) return;
      fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      })
      .then(r => r.json())
      .then(res => {
        if (res.ok && res.token) {
          sessionStorage.setItem('it_admin_token', res.token);
          state.isAdminLoggedIn = true;
          if (elements.ssoGatewayScreen) elements.ssoGatewayScreen.style.display = 'none';
          if (elements.mainAppWrapper) elements.mainAppWrapper.style.display = 'block';
          showToast("🔑 เข้าสู่ระบบ IT Admin สำเร็จ!", "success");
          loadAllData(true);
          const adminTabBtn = document.querySelector('[data-tab="adminTab"]');
          if (adminTabBtn) adminTabBtn.click();
        } else {
          alert("❌ รหัสผ่านไม่ถูกต้อง: " + (res.message || "กรุณาลองใหม่อีกครั้ง"));
        }
      })
      .catch(err => alert("เกิดข้อผิดพลาด: " + err.message));
    });
  }

  // Magic Link URL Parameter Auto-Selection Handler
  function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const empParam = urlParams.get('emp');
    const tabParam = urlParams.get('tab');
    const tokenParam = urlParams.get('token');
    const modeParam = urlParams.get('mode');
    const ssoSuccess = urlParams.get('sso');

    if (ssoSuccess === 'success') {
      showToast("🎉 เข้าสู่ระบบด้วยบัญชี Lark สำเร็จ!", "success");
      // Clean query params from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const hasSso = checkLarkSsoAuth();

    if (tabParam) {
      const targetTabBtn = document.querySelector(`[data-tab="${tabParam}"]`);
      if (targetTabBtn) targetTabBtn.click();
    }

    if (!hasSso && empParam) {
      setTimeout(() => {
        elements.employeeSearchInput.value = empParam;
        const cleanParam = empParam.toLowerCase().trim();
        const found = state.employees.find(e => {
          const lower = e.name.toLowerCase();
          return lower === cleanParam || lower.includes(cleanParam) || cleanParam.includes(lower);
        });
        if (found) {
          selectEmployee(found);
          const isLocked = modeParam === 'locked' || Boolean(tokenParam);
          if (isLocked) {
            if (elements.larkSsoLoginCard) elements.larkSsoLoginCard.style.display = 'none';
            if (elements.searchPanelCard) elements.searchPanelCard.style.display = 'none';
            if (elements.lockedIdentityBanner) elements.lockedIdentityBanner.style.display = 'flex';
            if (elements.lockedEmployeeName) elements.lockedEmployeeName.textContent = found.name;
            showToast(`🔒 โหมดความปลอดภัย: ล็อกสิทธิ์เฉพาะคุณ ${found.name}`, "info");
          } else {
            showToast(`ยินดีต้อนรับคุณ ${found.name}! ระบบเปิดรายการอุปกรณ์ของคุณเรียบร้อยแล้ว`, "success");
          }
        }
      }, 500);
    }
  }

  // =========================================================================
  // ---------------- TAB 5: LIFECYCLE HUB (HR / ADMIN / IT) ---------------- //
  // =========================================================================

  let lifecycleState = {
    filterOrg: 'ALL',
    tasks: [],
    stats: {}
  };

  // Preset Mapping for Onboarding
  const onboardingPresets = {
    "Marketing Project Manager": [
      { name: "ThinkPad หรือ MacBook 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "จอมอนิเตอร์ 1 จอ", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Keyboard + Mouse 1 Set", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "บัตรเข้าออกอาคาร", tag: "HR/Admin", sn: "-", status: "รอจัดเตรียม" }
    ],
    "Production": [
      { name: "Mac mini 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "จอมอนิเตอร์ธรรมดา 2 จอ", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "External HDD 1TB (2 ชิ้น)", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Keyboard + Mouse 1 Set", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "USB Port Hub (2 อัน)", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" }
    ],
    "Junior Graphic Designer": [
      { name: "Mac mini 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "จอมอนิเตอร์กราฟิก 2 จอ", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "External HDD 1TB (2 ชิ้น)", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Keyboard + Mouse 1 Set", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "USB Port Hub (2 อัน)", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" }
    ],
    "Sales / Account Executive": [
      { name: "ThinkPad / Laptop 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Wireless Mouse 1 ตัว", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" }
    ],
    "General Staff": [
      { name: "ThinkPad / Laptop 1 เครื่อง", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" },
      { name: "Wireless Mouse 1 ตัว", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" }
    ],
    "Custom": [
      { name: "อุปกรณ์ตามระบุในหมายเหตุ", tag: "รอเบิก", sn: "-", status: "รอจัดเตรียม" }
    ]
  };

  async function loadLifecycleTasks() {
    if (!elements.colAdminCollection) return;
    const token = sessionStorage.getItem('lifecycle_auth_token');
    if (!token) return;

    try {
      const res = await lifecycleFetch(`/api/lifecycle/tasks?org=${lifecycleState.filterOrg}`).then(r => r.json());
      if (!res.ok) {
        if (res.code === 'UNAUTHORIZED') {
          sessionStorage.removeItem('lifecycle_auth_token');
          sessionStorage.removeItem('lifecycle_auth_role');
          sessionStorage.removeItem('lifecycle_actor_name');
          checkLifecycleAuth();
        }
        return;
      }

      lifecycleState.tasks = res.tasks || [];
      lifecycleState.stats = res.stats || {};

      // Update badge
      if (elements.tabLifecycleBadge) {
        const activeCount = (res.stats.offboardingWaitingAdmin || 0) + 
                            (res.stats.offboardingWaitingIT || 0) + 
                            (res.stats.offboardingWaitingStore || 0) + 
                            (res.stats.onboardingWaitingPack || 0);
        elements.tabLifecycleBadge.textContent = `${activeCount} งานค้าง`;
      }

      // Update metrics
      if (elements.statWaitingAdminCollection) elements.statWaitingAdminCollection.textContent = `${res.stats.offboardingWaitingAdmin || 0} งาน`;
      if (elements.statWaitingItReimage) elements.statWaitingItReimage.textContent = `${res.stats.offboardingWaitingIT || 0} งาน`;
      if (elements.statWaitingAdminStore) elements.statWaitingAdminStore.textContent = `${res.stats.offboardingWaitingStore || 0} งาน`;

      renderLifecycleColumns();
    } catch (err) {
      console.error("Load lifecycle tasks error:", err);
    }
  }

  function renderLifecycleColumns() {
    const tasks = lifecycleState.tasks;

    const step1Tasks = tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_ADMIN_COLLECTION');
    const step2Tasks = tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_IT_REIMAGE');
    const step3Tasks = tasks.filter(t => t.type === 'offboarding' && t.currentStage === 'WAITING_ADMIN_STORE');
    const step4Tasks = tasks.filter(t => t.type === 'onboarding' || t.currentStage === 'COMPLETED');

    if (elements.badgeStep1) elements.badgeStep1.textContent = step1Tasks.length;
    if (elements.badgeStep2) elements.badgeStep2.textContent = step2Tasks.length;
    if (elements.badgeStep3) elements.badgeStep3.textContent = step3Tasks.length;
    if (elements.badgeStep4) elements.badgeStep4.textContent = step4Tasks.length;

    // Render Step 1
    elements.colAdminCollection.innerHTML = step1Tasks.length === 0 ? 
      `<div class="text-center text-muted" style="padding: 24px; font-size: 0.8125rem;">ไม่มีคนลาออกรอคืนของ 👍</div>` :
      step1Tasks.map(t => createTaskCardHtml(t, 1)).join('');

    // Render Step 2
    elements.colItReimage.innerHTML = step2Tasks.length === 0 ? 
      `<div class="text-center text-muted" style="padding: 24px; font-size: 0.8125rem;">ไม่มีคิวเครื่องรอลง Windows / ตรวจสภาพ 🎉</div>` :
      step2Tasks.map(t => createTaskCardHtml(t, 2)).join('');

    // Render Step 3
    elements.colAdminStore.innerHTML = step3Tasks.length === 0 ? 
      `<div class="text-center text-muted" style="padding: 24px; font-size: 0.8125rem;">ไม่มีเครื่องรอเก็บเข้าตู้สต็อก 🗄️</div>` :
      step3Tasks.map(t => createTaskCardHtml(t, 3)).join('');

    // Render Step 4
    elements.colOnboardingCompleted.innerHTML = step4Tasks.length === 0 ? 
      `<div class="text-center text-muted" style="padding: 24px; font-size: 0.8125rem;">ยังไม่มีรายการ Onboarding หรือประวัติงานสำเร็จ</div>` :
      step4Tasks.map(t => createTaskCardHtml(t, 4)).join('');

    // Attach Action Listeners
    attachTaskActionListeners();
  }

  function createTaskCardHtml(task, step) {
    const isOffboarding = task.type === 'offboarding';
    const isCompleted = task.currentStage === 'COMPLETED';

    const cardClass = isCompleted ? 'card-completed' : (isOffboarding ? 'card-offboarding' : 'card-onboarding');

    const devicesListHtml = (task.devices || []).map(d => `
      <div class="task-device-row">
        <span>• <strong>${d.name}</strong></span>
        <span style="color:var(--text-muted); font-size:0.75rem;">${d.tag && d.tag !== 'ไม่ทราบ' ? `Tag: ${d.tag}` : (d.status || '')}</span>
      </div>
    `).join('');

    let actionBtnHtml = '';
    if (step === 1) {
      actionBtnHtml = `
        <button class="task-btn-action btn-step1 btn-advance-task" data-id="${task.id}" data-actor="Admin (คุณ Ploy)">
          📥 Admin รับของคืนครบแล้ว ➔ ส่งต่อให้ IT
        </button>
      `;
    } else if (step === 2) {
      actionBtnHtml = `
        <button class="task-btn-action btn-step2 btn-advance-task" data-id="${task.id}" data-actor="IT (ฝ่ายไอที)">
          💻 IT ลง OS/ตรวจเสร็จแล้ว ➔ ส่งมอบให้ Admin
        </button>
      `;
    } else if (step === 3) {
      actionBtnHtml = `
        <button class="task-btn-action btn-step3 btn-advance-task" data-id="${task.id}" data-actor="Admin (คุณ Ploy)">
          🗄️ เก็บเข้าตู้สต็อกเรียบร้อย (Available in Stock)
        </button>
      `;
    } else if (step === 4) {
      if (task.type === 'onboarding') {
        if (task.currentStage === 'WAITING_ADMIN_PACK') {
          actionBtnHtml = `
            <button class="task-btn-action btn-step4 btn-advance-task" data-id="${task.id}" data-actor="Admin (คุณ Ploy)">
              📦 Admin จัดเซ็ตอุปกรณ์เรียบร้อย
            </button>
          `;
        } else if (task.currentStage === 'WAITING_HANDOVER') {
          actionBtnHtml = `
            <button class="task-btn-action btn-step4 btn-advance-task" data-id="${task.id}" data-actor="Admin (คุณ Ploy)">
              🤝 ส่งมอบให้พนักงานใหม่เรียบร้อย
            </button>
          `;
        } else {
          actionBtnHtml = `<div style="text-align:center; font-size:0.75rem; color:#166534; font-weight:600;">✅ ส่งมอบสำเร็จ (In Use)</div>`;
        }
      } else {
        actionBtnHtml = `<div style="text-align:center; font-size:0.75rem; color:#166534; font-weight:600;">✅ คืนและเก็บเข้าตู้สต็อกเรียบร้อย</div>`;
      }
    }

    const typeBadge = isOffboarding ? 
      `<span class="tag" style="background:#fee2e2; color:#b91c1c; font-size:0.75rem;">🚪 คนลาออก</span>` :
      `<span class="tag" style="background:#dcfce7; color:#166534; font-size:0.75rem;">✨ พนักงานใหม่</span>`;

    return `
      <div class="task-card ${cardClass}" id="task-${task.id}">
        <div class="task-header">
          <div class="task-title">${task.employeeName}</div>
          <div style="display: flex; align-items: center; gap: 6px;">
            ${typeBadge}
            <button class="btn-edit-task" data-id="${task.id}" title="แก้ไขข้อมูล / ย้ายสถานะ" style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 0.75rem; color: #334155; font-weight: 500;">✏️ แก้ไข</button>
            <button class="btn-delete-task" data-id="${task.id}" title="ลบรายการ" style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 2px 6px; cursor: pointer; font-size: 0.75rem; color: #dc2626;">🗑️</button>
          </div>
        </div>
        <div class="task-meta">
          <div>🏢 สังกัด: <span class="tag tag-org">${task.organization}</span> | 📅 วันที่: <strong>${task.targetDate}</strong></div>
          ${task.notes ? `<div style="color:#b91c1c; margin-top:2px;">💬 ${task.notes}</div>` : ''}
        </div>
        <div class="task-devices-box">
          <div style="font-weight:600; color:var(--text-muted); margin-bottom:2px;">รายการอุปกรณ์ (${task.devices?.length || 0} ชิ้น):</div>
          ${devicesListHtml}
        </div>
        ${actionBtnHtml}
      </div>
    `;
  }

  function attachTaskActionListeners() {
    document.querySelectorAll('.btn-advance-task').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const taskId = btn.getAttribute('data-id');
        const actor = btn.getAttribute('data-actor') || "System User";
        btn.disabled = true;
        btn.textContent = "กำลังอัปเดต...";

        try {
          const res = await lifecycleFetch('/api/lifecycle/tasks/advance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId, actor })
          }).then(r => r.json());

          if (res.ok) {
            showToast(res.message, "success");
            await loadLifecycleTasks();
            await loadAllData(true);
          } else {
            showToast(res.message, "error");
          }
        } catch (err) {
          showToast("เกิดข้อผิดพลาด: " + err.message, "error");
        }
      });
    });

    // Edit task buttons
    document.querySelectorAll('.btn-edit-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const taskId = btn.getAttribute('data-id');
        const task = lifecycleState.tasks.find(t => t.id === taskId);
        if (!task) return;

        elements.editTaskId.value = task.id;
        elements.editTaskEmployeeName.value = task.employeeName || '';
        elements.editTaskOrgSelect.value = task.organization || 'EDDU';
        elements.editTaskDateInput.value = task.targetDate || '';
        elements.editTaskStageSelect.value = task.currentStage || 'WAITING_ADMIN_PACK';
        elements.editTaskNotesInput.value = task.notes || '';

        elements.editTaskModalOverlay.style.display = 'flex';
      });
    });

    // Delete task buttons
    document.querySelectorAll('.btn-delete-task').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const taskId = btn.getAttribute('data-id');
        const task = lifecycleState.tasks.find(t => t.id === taskId);
        const name = task ? task.employeeName : taskId;

        if (!confirm(`คุณต้องการลบ Task ของ "${name}" ใช่หรือไม่?`)) return;

        try {
          const res = await lifecycleFetch('/api/lifecycle/tasks/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId })
          }).then(r => r.json());

          if (res.ok) {
            showToast(res.message || 'ลบรายการสำเร็จ', 'success');
            await loadLifecycleTasks();
          } else {
            showToast(res.message || 'เกิดข้อผิดพลาดในการลบ', 'error');
          }
        } catch (err) {
          showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
        }
      });
    });
  }

  // Filter Pills Event Listener for Lifecycle
  if (elements.lifecycleOrgFilters) {
    elements.lifecycleOrgFilters.querySelectorAll('.filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        elements.lifecycleOrgFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        lifecycleState.filterOrg = pill.getAttribute('data-org') || 'ALL';
        loadLifecycleTasks();
      });
    });
  }

  // Offboarding Modal Triggers & Handlers
  if (elements.btnOpenOffboardingModal) {
    elements.btnOpenOffboardingModal.addEventListener('click', () => {
      elements.offboardingLastDayInput.value = new Date().toISOString().split('T')[0];
      elements.offboardingModalOverlay.style.display = 'flex';
    });
  }
  if (elements.offboardingModalCloseBtn) {
    elements.offboardingModalCloseBtn.addEventListener('click', () => elements.offboardingModalOverlay.style.display = 'none');
  }
  if (elements.offboardingModalCancelBtn) {
    elements.offboardingModalCancelBtn.addEventListener('click', () => elements.offboardingModalOverlay.style.display = 'none');
  }

  // Auto-fill devices when employee name typed in Offboarding modal
  if (elements.offboardingEmployeeInput) {
    elements.offboardingEmployeeInput.addEventListener('input', () => {
      const inputName = elements.offboardingEmployeeInput.value.toLowerCase().trim();
      if (!inputName) {
        elements.offboardingDeviceList.textContent = "พิมพ์ชื่อพนักงานด้านบนเพื่อดึงรายการของอัตโนมัติ";
        return;
      }
      const matched = state.employees.find(e => e.name.toLowerCase().includes(inputName) || inputName.includes(e.name.toLowerCase()));
      if (matched && matched.devices && matched.devices.length > 0) {
        elements.offboardingOrgSelect.value = matched.organization || "XPO";
        elements.offboardingDeviceList.innerHTML = matched.devices.map(d => `
          <div>• ${d["Device Name (ชื่อรุ่น/อุปกรณ์)"] || d["Device Type (ประเภทอุปกรณ์)"]} (Tag: ${d["Asset Tag (เลขทรัพย์สิน)"] || '-'}, S/N: ${d["Serial Number (S/N)"] || '-'})</div>
        `).join('');
      } else {
        elements.offboardingDeviceList.textContent = "ไม่พบอุปกรณ์ผูกค้างในระบบ (จะสร้างรายการคืนของเปล่าให้)";
      }
    });
  }

  if (elements.offboardingModalSubmitBtn) {
    elements.offboardingModalSubmitBtn.addEventListener('click', async () => {
      const employeeName = elements.offboardingEmployeeInput.value.trim();
      const organization = elements.offboardingOrgSelect.value;
      const targetDate = elements.offboardingLastDayInput.value;
      const notes = elements.offboardingNotesInput.value.trim();

      if (!employeeName) {
        showToast("กรุณาระบุชื่อพนักงานที่ลาออก", "warning");
        return;
      }

      elements.offboardingModalSubmitBtn.disabled = true;
      elements.offboardingModalSubmitBtn.textContent = "กำลังสร้าง Task...";

      try {
        const res = await lifecycleFetch('/api/lifecycle/tasks/offboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeName, organization, targetDate, notes })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message, "success");
          elements.offboardingModalOverlay.style.display = 'none';
          elements.offboardingEmployeeInput.value = '';
          elements.offboardingNotesInput.value = '';
          await loadLifecycleTasks();
        } else {
          showToast(res.message, "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.offboardingModalSubmitBtn.disabled = false;
        elements.offboardingModalSubmitBtn.textContent = "🚀 ส่งเรื่องให้ Admin & IT (Create Task)";
      }
    });
  }

  // Onboarding Modal Triggers & Handlers
  if (elements.btnOpenOnboardingModal) {
    elements.btnOpenOnboardingModal.addEventListener('click', () => {
      elements.onboardingStartDateInput.value = new Date().toISOString().split('T')[0];
      elements.onboardingModalOverlay.style.display = 'flex';
    });
  }
  if (elements.onboardingModalCloseBtn) {
    elements.onboardingModalCloseBtn.addEventListener('click', () => elements.onboardingModalOverlay.style.display = 'none');
  }
  if (elements.onboardingModalCancelBtn) {
    elements.onboardingModalCancelBtn.addEventListener('click', () => elements.onboardingModalOverlay.style.display = 'none');
  }

  // Update Kit preview when preset changes
  if (elements.onboardingPresetSelect) {
    elements.onboardingPresetSelect.addEventListener('change', () => {
      const presetKey = elements.onboardingPresetSelect.value;
      const kit = onboardingPresets[presetKey] || onboardingPresets["General Staff"];
      elements.onboardingKitList.innerHTML = kit.map(k => `<div>• ${k.name}</div>`).join('');
    });
  }

  if (elements.onboardingModalSubmitBtn) {
    elements.onboardingModalSubmitBtn.addEventListener('click', async () => {
      const position = elements.onboardingPresetSelect.value;
      const employeeName = elements.onboardingEmployeeName.value.trim() || `${position} (New Joiner)`;
      const organization = elements.onboardingOrgSelect.value;
      const targetDate = elements.onboardingStartDateInput.value;
      const notes = elements.onboardingNotesInput.value.trim();
      const devices = onboardingPresets[position] || onboardingPresets["General Staff"];

      elements.onboardingModalSubmitBtn.disabled = true;
      elements.onboardingModalSubmitBtn.textContent = "กำลังสร้าง Task...";

      try {
        const res = await lifecycleFetch('/api/lifecycle/tasks/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position, employeeName, organization, targetDate, notes, devices })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message || "สร้างรายการจัดเตรียมอุปกรณ์สำเร็จ!", "success");
          elements.onboardingModalOverlay.style.display = "none";
          elements.onboardingEmployeeName.value = "";
          elements.onboardingNotesInput.value = "";
          await loadLifecycleTasks();
        } else {
          showToast(res.message || res.error || "เกิดข้อผิดพลาดในการสร้างคำขอ", "error");
        }
      } catch (err) {
        showToast("เกิดข้อผิดพลาด: " + err.message, "error");
      } finally {
        elements.onboardingModalSubmitBtn.disabled = false;
        elements.onboardingModalSubmitBtn.textContent = "🚀 ส่งเรื่องให้ Admin จัดเตรียมของ";
      }
    });
  }

  // Edit Task Modal Event Handlers
  if (elements.editTaskModalSaveBtn) {
    elements.editTaskModalSaveBtn.addEventListener('click', async () => {
      const taskId = elements.editTaskId.value;
      const employeeName = elements.editTaskEmployeeName.value.trim();
      const organization = elements.editTaskOrgSelect.value;
      const targetDate = elements.editTaskDateInput.value;
      const currentStage = elements.editTaskStageSelect.value;
      const notes = elements.editTaskNotesInput.value.trim();
      const actor = sessionStorage.getItem('lifecycle_actor_name') || 'Staff';

      if (!employeeName) {
        showToast('กรุณาระบุชื่อพนักงาน', 'warning');
        return;
      }

      elements.editTaskModalSaveBtn.disabled = true;
      elements.editTaskModalSaveBtn.textContent = 'กำลังบันทึก...';

      try {
        const res = await lifecycleFetch('/api/lifecycle/tasks/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, employeeName, organization, targetDate, currentStage, notes, actor })
        }).then(r => r.json());

        if (res.ok) {
          showToast(res.message || 'บันทึกการแก้ไขสำเร็จ!', 'success');
          elements.editTaskModalOverlay.style.display = 'none';
          await loadLifecycleTasks();
        } else {
          showToast(res.message || 'เกิดข้อผิดพลาดในการแก้ไข', 'error');
        }
      } catch (err) {
        showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
      } finally {
        elements.editTaskModalSaveBtn.disabled = false;
        elements.editTaskModalSaveBtn.textContent = '💾 บันทึกการแก้ไข';
      }
    });
  }

  if (elements.editTaskModalDeleteBtn) {
    elements.editTaskModalDeleteBtn.addEventListener('click', async () => {
      const taskId = elements.editTaskId.value;
      const task = lifecycleState.tasks.find(t => t.id === taskId);
      const name = task ? task.employeeName : taskId;

      if (!confirm(`คุณต้องการลบ Task ของ "${name}" ใช่หรือไม่?`)) return;

      try {
        const res = await lifecycleFetch('/api/lifecycle/tasks/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId })
        }).then(r => r.json());

        if (res.ok) {
          showToast('ลบ Task เรียบร้อยแล้ว', 'success');
          elements.editTaskModalOverlay.style.display = 'none';
          await loadLifecycleTasks();
        } else {
          showToast(res.message || 'เกิดข้อผิดพลาดในการลบ', 'error');
        }
      } catch (err) {
        showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
      }
    });
  }

  if (elements.editTaskModalCloseBtn) {
    elements.editTaskModalCloseBtn.addEventListener('click', () => {
      elements.editTaskModalOverlay.style.display = 'none';
    });
  }
  if (elements.editTaskModalCancelBtn) {
    elements.editTaskModalCancelBtn.addEventListener('click', () => {
      elements.editTaskModalOverlay.style.display = 'none';
    });
  }

  // ---------------- LIFECYCLE AUTHENTICATION & ACCESS CONTROL ---------------- //

  function checkLifecycleAuth() {
    const role = sessionStorage.getItem('lifecycle_auth_role');
    const token = sessionStorage.getItem('lifecycle_auth_token');
    const actorName = sessionStorage.getItem('lifecycle_actor_name') || 'Staff User';

    if (token && role && elements.lifecycleLoginView && elements.lifecycleDashboardView) {
      elements.lifecycleLoginView.style.display = 'none';
      elements.lifecycleDashboardView.style.display = 'block';

      const roleIcons = { 'HR': '👔', 'ADMIN': '📦', 'IT': '💻' };
      if (elements.lifecycleActiveRoleBadge) {
        elements.lifecycleActiveRoleBadge.innerHTML = `<span>${roleIcons[role] || '👤'}</span> <strong>เข้าใช้งานในฐานะ: ${actorName}</strong>`;
      }
      loadLifecycleTasks();
    } else if (elements.lifecycleLoginView && elements.lifecycleDashboardView) {
      elements.lifecycleLoginView.style.display = 'flex';
      elements.lifecycleDashboardView.style.display = 'none';
    }
  }

  if (elements.lifecycleLoginForm) {
    elements.lifecycleLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const role = elements.lifecycleRoleSelect.value;
      const password = elements.lifecyclePasswordInput.value;

      elements.btnLifecycleLogin.disabled = true;
      elements.btnLifecycleLogin.textContent = "กำลังตรวจสอบสิทธิ์...";
      elements.lifecycleLoginError.style.display = 'none';

      try {
        const res = await fetch('/api/lifecycle/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, password })
        }).then(r => r.json());

        if (res.ok) {
          sessionStorage.setItem('lifecycle_auth_token', res.token);
          sessionStorage.setItem('lifecycle_auth_role', res.role);
          sessionStorage.setItem('lifecycle_actor_name', res.actorName);
          showToast(`ยินดีต้อนรับ ${res.actorName}! เข้าสู่ระบบเรียบร้อยแล้ว`, 'success');
          elements.lifecyclePasswordInput.value = '';
          checkLifecycleAuth();
        } else {
          elements.lifecycleLoginError.textContent = res.message || 'รหัสผ่านไม่ถูกต้อง';
          elements.lifecycleLoginError.style.display = 'block';
        }
      } catch (err) {
        elements.lifecycleLoginError.textContent = 'เกิดข้อผิดพลาด: ' + err.message;
        elements.lifecycleLoginError.style.display = 'block';
      } finally {
        elements.btnLifecycleLogin.disabled = false;
        elements.btnLifecycleLogin.textContent = '🔓 ยืนยันตัวตนเข้าใช้งาน';
      }
    });
  }

  if (elements.btnLifecycleLogout) {
    elements.btnLifecycleLogout.addEventListener('click', () => {
      sessionStorage.removeItem('lifecycle_auth_token');
      sessionStorage.removeItem('lifecycle_auth_role');
      sessionStorage.removeItem('lifecycle_actor_name');
      showToast('ออกจากระบบเจ้าหน้าที่เรียบร้อยแล้ว', 'info');
      checkLifecycleAuth();
    });
  }

  // Copy Reminder Message for Segment 1: Employees with pending devices
  if (elements.btnCopyReminderSeg1) {
    elements.btnCopyReminderSeg1.addEventListener('click', () => {
      const pendingNames = state.employees.filter(e => !e.allVerified && e.devices && e.devices.length > 0 && !e.isResigned).map(e => e.name);
      const sampleNames = pendingNames.slice(0, 15).join(', ');
      const msg = `🚨 [แจ้งเตือนกลุ่ม 1: ยืนยันเครื่อง IT ประจำตัว - 7 Days Freeze]
สวัสดีครับทุกคน 👋
ระบบตรวจพบอุปกรณ์คอมพิวเตอร์/จอประจำตัวที่ผูกกับชื่อของคุณในระบบแล้ว แต่ **ยังรอการกดยืนยันความถูกต้อง** อยู่นะครับ

👉 **สิ่งที่ต้องทำ:**
1. กดเข้าสู่ระบบ: https://it-asset-portal.shine-toothbrush.workers.dev
2. ล็อกอินด้วย Lark ➔ ตรวจสอบเลขเครื่องและ Serial Number
3. กดปุ่มเขียว [✅ ข้อมูลถูกต้อง] ได้ทันที (ใช้เวลาไม่เกิน 10 วินาทีครับ)

📌 รายชื่อที่รอการยืนยัน (${pendingNames.length} ท่าน):
${sampleNames}${pendingNames.length > 15 ? ' ...และเพื่อนๆ อีก ' + (pendingNames.length - 15) + ' ท่าน' : ''}

ขอบคุณทุกคนที่ช่วยกันจัดระเบียบข้อมูลทรัพย์สิน IT กลางครับ! 🙏✨`;

      navigator.clipboard.writeText(msg).then(() => {
        if (elements.copySuccessMsg) {
          elements.copySuccessMsg.textContent = "✅ คัดลอกข้อความแจ้งเตือนกลุ่มที่ 1 สำเร็จ!";
          elements.copySuccessMsg.style.display = 'block';
          setTimeout(() => elements.copySuccessMsg.style.display = 'none', 4000);
        }
        showToast("คัดลอกข้อความกลุ่มที่ 1 เรียบร้อย", "success");
      });
    });
  }

  // Copy Reminder Message for Segment 2: Zero Devices / New Registration
  if (elements.btnCopyReminderSeg2) {
    elements.btnCopyReminderSeg2.addEventListener('click', () => {
      const msg = `📦 [แจ้งเตือนกลุ่ม 2: สำรวจ & ขึ้นทะเบียนอุปกรณ์ IT ประจำตัว - 7 Days Freeze]
สวัสดีครับทุกคน 👋
ขณะนี้บริษัทกำลังสำรวจและจัดระเบียบอุปกรณ์คอมพิวเตอร์ โน้ตบุ๊ก และจอมอนิเตอร์ของพนักงานทุกคนครับ

🔍 **สถานะของคุณ:** ขณะนี้ระบบยัง **ไม่มีข้อมูลอุปกรณ์ผูกกับบัญชี Lark ของคุณ**

👉 **สิ่งที่ต้องทำ:**
• **กรณีที่คุณมีคอมพิวเตอร์ / โน้ตบุ๊ก / จอ ประจำตัวใช้งานอยู่:**
กรุณาเข้าสู่ระบบ: https://it-asset-portal.shine-toothbrush.workers.dev แล้วไปที่ **แท็บ 2 (ลงทะเบียนเครื่องใหม่)** เพื่อกรอก Serial Number ใต้เครื่องขึ้นทะเบียนได้ทันทีครับ
• **กรณีที่คุณไม่มีอุปกรณ์ประจำตัว (ใช้เครื่องกองกลาง หรือตำแหน่งงานที่ไม่ใช้อุปกรณ์คอม):**
✅ ไม่ต้องดำเนินการใดๆ ครับ ถือว่าข้อมูลถูกต้องครบถ้วนแล้วครับผม

ขอบคุณทุกคนสำหรับความร่วมมือครับ! 🙏✨`;

      navigator.clipboard.writeText(msg).then(() => {
        if (elements.copySuccessMsg) {
          elements.copySuccessMsg.textContent = "✅ คัดลอกข้อความแจ้งเตือนกลุ่มที่ 2 สำเร็จ!";
          elements.copySuccessMsg.style.display = 'block';
          setTimeout(() => elements.copySuccessMsg.style.display = 'none', 4000);
        }
        showToast("คัดลอกข้อความกลุ่มที่ 2 เรียบร้อย", "success");
      });
    });
  }

  // Preview Lark Bot Card Segment 1
  if (elements.btnPreviewCardSeg1) {
    elements.btnPreviewCardSeg1.addEventListener('click', () => {
      openPreviewModal("🚨 ตัวอย่างการ์ดแจ้งเตือนกลุ่มที่ 1 (คนมีเครื่องรอการยืนยัน)", `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: -apple-system, sans-serif;">
          <div style="background: #ef4444; color: #ffffff; padding: 12px 16px; font-weight: 700; font-size: 0.9375rem; display: flex; align-items: center; gap: 8px;">
            <span>🚨</span> <span>แจ้งเตือน: แคมเปญยืนยันเครื่อง IT ประจำตัว (7 Days Freeze)</span>
          </div>
          <div style="padding: 16px; font-size: 0.875rem; color: #334155; line-height: 1.6;">
            <p>สวัสดีครับคุณ <strong>{ชื่อพนักงาน}</strong> 👋</p>
            <p>ขณะนี้บริษัทอยู่ในช่วง <strong>Freeze Period 7 วัน</strong> ขอความร่วมมือตรวจสอบอุปกรณ์ที่คุณถือครองอยู่ด้านล่างนี้ครับ:</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin: 12px 0;">
              <strong>• ThinkPad X280</strong><br>
              <small style="color: #64748b;">- เลขทรัพย์สิน: <code>COM-00047</code> | S/N: <code>PC-15WDMF</code><br>- สถานะ: ⏳ <strong>รอการยืนยัน</strong></small>
            </div>
            <button class="btn btn-primary btn-block" style="background: #2563eb; color: #ffffff; border: none; border-radius: 6px; padding: 10px; font-weight: 600; font-size: 0.875rem; cursor: default;">
              🔍 เข้าสู่ระบบเพื่อตรวจสอบและยืนยันเครื่อง (1 คลิก)
            </button>
          </div>
        </div>
      `);
    });
  }

  // Preview Lark Bot Card Segment 2
  if (elements.btnPreviewCardSeg2) {
    elements.btnPreviewCardSeg2.addEventListener('click', () => {
      openPreviewModal("📦 ตัวอย่างการ์ดแจ้งเตือนกลุ่มที่ 2 (คนที่ยังไม่มีเครื่องในระบบ)", `
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); font-family: -apple-system, sans-serif;">
          <div style="background: #0ea5e9; color: #ffffff; padding: 12px 16px; font-weight: 700; font-size: 0.9375rem; display: flex; align-items: center; gap: 8px;">
            <span>📦</span> <span>แจ้งเตือน: สำรวจ & ขึ้นทะเบียนอุปกรณ์ IT ประจำตัว (7-Day Freeze)</span>
          </div>
          <div style="padding: 16px; font-size: 0.875rem; color: #334155; line-height: 1.6;">
            <p>สวัสดีครับคุณ <strong>{ชื่อพนักงาน}</strong> 👋</p>
            <p>ขณะนี้บริษัทอยู่ในช่วง <strong>7-Day Freeze Campaign</strong> เพื่อสำรวจและจัดระเบียบอุปกรณ์คอมพิวเตอร์และจอประจำตัวของทุกคนครับ</p>
            <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 12px; margin: 12px 0;">
              🔍 <strong>สถานะปัจจุบัน:</strong> ยังไม่พบอุปกรณ์คอมพิวเตอร์หรือจอผูกกับบัญชี Lark ของคุณในระบบกลาง
            </div>
            <p style="font-size: 0.8125rem; color: #475569;">
              • <strong>หากมีคอม/จอประจำตัว:</strong> โปรดกดปุ่มด้านล่างเพื่อไปที่แท็บ 2 แล้วลงทะเบียนเครื่องใหม่<br>
              • <strong>หากไม่มีอุปกรณ์ประจำตัว:</strong> ไม่ต้องดำเนินการใดๆ ครับ
            </p>
            <button class="btn btn-primary btn-block" style="background: #0284c7; color: #ffffff; border: none; border-radius: 6px; padding: 10px; font-weight: 600; font-size: 0.875rem; cursor: default;">
              ➕ เข้าสู่ระบบเพื่อลงทะเบียนเครื่องใหม่ (เปิดบนเว็บ)
            </button>
          </div>
        </div>
      `);
    });
  }

  function openPreviewModal(title, htmlContent) {
    const existing = document.getElementById('previewBotModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'previewBotModal';
    modal.className = 'modal-backdrop active';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 480px; width: 90%;">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="document.getElementById('previewBotModal').remove()">&times;</button>
        </div>
        <div class="modal-body" style="padding: 16px;">
          ${htmlContent}
        </div>
        <div class="modal-footer" style="display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary" onclick="document.getElementById('previewBotModal').remove()">ปิดหน้าต่าง</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Refresh Button
  elements.btnRefreshData.addEventListener('click', () => {
    loadAllData(true);
    loadLifecycleTasks();
  });

  // Initialize
  startCountdown();
  checkAdminAuth();
  checkLifecycleAuth();
  loadAllData().then(() => {
    handleUrlParams();
    loadLifecycleTasks();
  });
});
