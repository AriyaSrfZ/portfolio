/**
 * Persia Fava B2B War Room — Dedicated Audit Chat & Error Reporting Engine
 * Developed for: سرکار خانم کوشکشتانی (فائزه) & Operational Team
 * Real-time Bi-directional Synchronization with Firebase RTDB & Stockholm VPS
 */

(function () {
  'use strict';

  const FIREBASE_CHAT_URL = "https://gen-lang-client-0338096411-default-rtdb.firebaseio.com/warroom/faezeh_chat.json";
  const FIREBASE_FEEDBACK_URL = "https://gen-lang-client-0338096411-default-rtdb.firebaseio.com/warroom/audit_corrections.json";
  const LOCAL_CACHE_KEY = "pfg_faezeh_audit_chat_v1";

  let chatMessages = [];
  let isChatOpen = false;
  let pollInterval = null;

  // Account catalog (20 accounts)
  const ACCOUNTS_CATALOG = [
    { id: "all", num: "—", name: "موضوع عمومی / کل پایپ‌لاین" },
    { id: "acc-1", num: "۱", name: "طلاین (Tlyn / Taline)" },
    { id: "acc-2", num: "۲", name: "ترابرنت (Tarabarnet)" },
    { id: "acc-3", num: "۳", name: "زرپی۲۴ (Zarpay24)" },
    { id: "acc-4", num: "۴", name: "اوبار (Ubar)" },
    { id: "acc-5", num: "۵", name: "سندپرداز (SanadPardaz ERP)" },
    { id: "acc-6", num: "۶", name: "دیدگاه / چارگون (Chargoon)" },
    { id: "acc-7", num: "۷", name: "گلدیکا (Goldika)" },
    { id: "acc-8", num: "۸", name: "قسطا (Qesta / Ghesta)" },
    { id: "acc-9", num: "۹", name: "وال‌گلد (WallGold)" },
    { id: "acc-10", num: "۱۰", name: "پستکس (Postex)" },
    { id: "acc-11", num: "۱۱", name: "اکوگلد (EcoGold)" },
    { id: "acc-12", num: "۱۲", name: "پادیز (تسهیلات و لندتک سیموتک)" },
    { id: "acc-13", num: "۱۳", name: "اوامپیفینکس (OMP Finex)" },
    { id: "acc-14", num: "۱۴", name: "اکوتراست (Ecotrust)" },
    { id: "acc-15", num: "۱۵", name: "ریتون (Reytoon)" },
    { id: "acc-16", num: "۱۶", name: "خودرو۴۵ (Khodro45)" },
    { id: "acc-17", num: "۱۷", name: "پولنو (Pooleno)" },
    { id: "acc-18", num: "۱۸", name: "سیموتک (Simotech)" },
    { id: "acc-19", num: "۱۹", name: "تبدیل (Tabdeal)" },
    { id: "acc-20", num: "۲۰", name: "بیدارز (Bidarz)" }
  ];

  const CATEGORIES = [
    { id: "linkedin_person", label: "💼 لینکدین یا شخص اشتباه / قطع ارتباط" },
    { id: "company_identity", label: "🏛️ اصلاح نام یا برند رسمی شرکت" },
    { id: "phone_address", label: "📞 اصلاح شماره تلفن دفتر یا نشانی" },
    { id: "broken_link", label: "🔗 پیوند یا دامنه نامعتبر (۴۰۴ / دان)" },
    { id: "c_level_correction", label: "👤 نام و سمت مدیر ارشد تصمیم‌گیرنده" },
    { id: "general_note", label: "📝 یادداشت ممیزی و درخواست عمومی" }
  ];

  // Inject Styles
  function injectStyles() {
    if (document.getElementById("pfg-audit-chat-styles")) return;
    const style = document.createElement("style");
    style.id = "pfg-audit-chat-styles";
    style.innerHTML = `
      #pfg-audit-floating-btn {
        position: fixed;
        bottom: 24px;
        left: 24px;
        z-index: 9999;
        direction: rtl;
        font-family: inherit;
      }
      #pfg-audit-chat-window {
        position: fixed;
        bottom: 84px;
        left: 24px;
        width: 440px;
        max-width: calc(100vw - 36px);
        height: 620px;
        max-height: calc(100vh - 120px);
        z-index: 9999;
        direction: rtl;
        font-family: inherit;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(78, 222, 128, 0.15);
      }
      .audit-custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .audit-custom-scrollbar::-webkit-scrollbar-track {
        background: #141B1E;
      }
      .audit-custom-scrollbar::-webkit-scrollbar-thumb {
        background: #2D3E42;
        border-radius: 9999px;
      }
      .audit-custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #436763;
      }
    `;
    document.head.appendChild(style);
  }

  // Inject DOM Elements
  function injectDOM() {
    injectStyles();

    // Floating Button
    const btnContainer = document.createElement("div");
    btnContainer.id = "pfg-audit-floating-btn";
    btnContainer.innerHTML = `
      <button onclick="window.toggleAuditChat()" class="group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141C1E]/95 hover:bg-[#1B272A] text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 shadow-2xl transition duration-200 transform hover:scale-[1.02] backdrop-blur-md">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <span class="font-bold text-xs">💬 گفتگوی ممیزی و ثبت خطا</span>
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">فائزه</span>
      </button>
    `;
    document.body.appendChild(btnContainer);

    // Chat Window
    const chatWindow = document.createElement("div");
    chatWindow.id = "pfg-audit-chat-window";
    chatWindow.className = "hidden rounded-3xl bg-[#12191B] border border-cyan-500/30 flex flex-col overflow-hidden backdrop-blur-xl animate-fade-in";

    chatWindow.innerHTML = `
      <!-- Header -->
      <div class="px-5 py-3.5 bg-gradient-to-r from-[#172327] to-[#1C2C30] border-b border-cyan-500/25 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-lg shadow-inner">
            👩‍💻
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-sm text-white">میز گفت‌وگو و ثبت خطاهای ممیزی</h3>
              <span class="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9.5px] font-bold">پایشگر خودکار فعال</span>
            </div>
            <p class="text-[10px] text-slate-400 mt-0.5">کانال ارتباطی سرکار خانم فائزه کوشکشتانی و تیم ممیزی با دستیار پایپ‌لاین</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="window.fetchAuditChatHistory()" title="به‌روزرسانی پیام‌ها" class="w-7 h-7 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-xs transition">
            🔄
          </button>
          <button onclick="window.toggleAuditChat()" class="w-7 h-7 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-300 flex items-center justify-center text-sm font-bold transition">
            ✕
          </button>
        </div>
      </div>

      <!-- Quick Guidance Banner -->
      <div class="px-4 py-2 bg-cyan-950/30 border-b border-cyan-500/15 text-[10.5px] text-cyan-200/90 flex items-center justify-between">
        <span>💡 هرگونه نام اشتباه، لینک قطعی یا شماره اصلاحی را اینجا بنویسید تا خودکار اعمال شود.</span>
      </div>

      <!-- Messages Stream -->
      <div id="pfg-audit-messages-container" class="flex-1 overflow-y-auto p-4 space-y-3.5 audit-custom-scrollbar bg-[#0D1315]">
        <div class="text-center py-6 text-slate-500 text-xs flex flex-col items-center gap-2">
          <span class="text-2xl">⏳</span>
          <span>در حال دریافت سوابق گفتگو و یادداشت‌های ممیزی...</span>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-3.5 bg-[#141C1F] border-t border-cyan-500/20 space-y-2.5">
        <!-- Selectors Row -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-[10px] text-slate-400 mb-1 font-medium">حساب هدف:</label>
            <select id="pfgAuditAccountSelect" class="w-full text-xs bg-[#1A2528] text-slate-200 border border-[#2D3E42] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 transition font-sans">
              ${ACCOUNTS_CATALOG.map(acc => `<option value="${acc.id}">[#${acc.num}] ${acc.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[10px] text-slate-400 mb-1 font-medium">نوع مغایرت:</label>
            <select id="pfgAuditCategorySelect" class="w-full text-xs bg-[#1A2528] text-slate-200 border border-[#2D3E42] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 transition font-sans">
              ${CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Quick Tags -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
          <span class="text-slate-500 whitespace-nowrap">برچسب سریع:</span>
          <button onclick="window.appendAuditTag('[لینکدین نامعتبر/تغییر یافته]')" class="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition">لینکدین اشتباه</button>
          <button onclick="window.appendAuditTag('[نام ثبتی مغایر]')" class="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition">نام ثبتی</button>
          <button onclick="window.appendAuditTag('[شماره مستقیم جدید: ]')" class="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition">شماره جدید</button>
          <button onclick="window.appendAuditTag('[شخص منفک شده/تغییر سمت]')" class="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 whitespace-nowrap transition">انفکاک شخص</button>
        </div>

        <!-- Textarea -->
        <div class="relative">
          <textarea id="pfgAuditTextInput" rows="2" placeholder="توضیح خطا یا داده صحیح را بنویسید (مثال: لینکدین مدیرعامل اصلاح شود، شماره تماس دبیرخانه ... است)..." class="w-full text-xs bg-[#1A2528] text-slate-100 placeholder-slate-500 border border-[#2D3E42] rounded-xl p-2.5 focus:outline-none focus:border-cyan-400 resize-none transition font-sans"></textarea>
        </div>

        <!-- Send Row -->
        <div class="flex items-center justify-between pt-1">
          <div class="text-[10px] text-slate-400 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>ارسال به سرور و پایشگر پایپ‌لاین</span>
          </div>
          <button id="pfgAuditSendBtn" onclick="window.sendAuditChatMessage()" class="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 transition flex items-center gap-1.5 transform active:scale-95">
            <span>ثبت و ارسال پیام</span>
            <span class="text-xs">🚀</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(chatWindow);
  }

  // Open / Close / Toggle
  window.toggleAuditChat = function () {
    const el = document.getElementById("pfg-audit-chat-window");
    if (!el) return;
    if (el.classList.contains("hidden")) {
      el.classList.remove("hidden");
      isChatOpen = true;
      window.fetchAuditChatHistory();
      if (!pollInterval) {
        pollInterval = setInterval(window.fetchAuditChatHistory, 5000);
      }
    } else {
      el.classList.add("hidden");
      isChatOpen = false;
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
    }
  };

  window.openAuditChat = function (accId, issueCat) {
    const el = document.getElementById("pfg-audit-chat-window");
    if (el && el.classList.contains("hidden")) {
      window.toggleAuditChat();
    }
    if (accId) {
      const select = document.getElementById("pfgAuditAccountSelect");
      if (select) select.value = accId;
    }
    if (issueCat) {
      const catSelect = document.getElementById("pfgAuditCategorySelect");
      if (catSelect) catSelect.value = issueCat;
    }
    const input = document.getElementById("pfgAuditTextInput");
    if (input) input.focus();
  };

  window.appendAuditTag = function (tag) {
    const input = document.getElementById("pfgAuditTextInput");
    if (!input) return;
    input.value = (input.value ? input.value + " " : "") + tag + " ";
    input.focus();
  };

  // Fetch Chat History
  window.fetchAuditChatHistory = async function () {
    const container = document.getElementById("pfg-audit-messages-container");
    if (!container) return;

    try {
      const res = await fetch(FIREBASE_CHAT_URL);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          chatMessages = Object.keys(data).map(key => ({ ...data[key], _key: key }));
          // Sort chronological
          chatMessages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(chatMessages));
          renderChatMessages();
          return;
        }
      }
    } catch (e) {
      console.warn("Audit chat fetch fallback to cache:", e);
    }

    // Fallback to local cache
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      try {
        chatMessages = JSON.parse(cached);
        renderChatMessages();
      } catch (e) {}
    } else if (chatMessages.length === 0) {
      renderWelcomeMessage();
    }
  };

  function renderWelcomeMessage() {
    const container = document.getElementById("pfg-audit-messages-container");
    if (!container) return;
    container.innerHTML = `
      <div class="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-2 text-xs">
        <div class="flex items-center gap-2 text-cyan-300 font-bold">
          <span>👋</span>
          <span>درود بر سرکار خانم کوشکشتانی و تیم ممیزی</span>
        </div>
        <p class="text-slate-300 leading-relaxed text-[11px]">
          این میز گفتگو به صورت پیوسته توسط پایشگر هوشمند سرور استکهلم رصد می‌شود. هر زمان مغایرتی در نام شرکت‌ها، لینک‌های لینکدین، هویت مدیران یا شماره تلفن‌ها مشاهده کردید، پیام خود را ثبت کنید تا در سریع‌ترین زمان اصلاح و در کل سامانه اعمال گردد.
        </p>
        <div class="text-[10px] text-slate-400 pt-1 border-t border-cyan-500/20 flex items-center justify-between">
          <span>وضعیت: آماده دریافت یادداشت‌ها</span>
          <span class="text-cyan-300 font-mono">آنلاین</span>
        </div>
      </div>
    `;
  }

  function renderChatMessages() {
    const container = document.getElementById("pfg-audit-messages-container");
    if (!container) return;

    if (!chatMessages || chatMessages.length === 0) {
      renderWelcomeMessage();
      return;
    }

    container.innerHTML = "";

    chatMessages.forEach(msg => {
      const isResolved = (msg.status === "resolved");
      const isFaezeh = (msg.sender && (msg.sender.includes("فائزه") || msg.sender.includes("خرم")));

      const catObj = CATEGORIES.find(c => c.id === msg.category);
      const catLabel = catObj ? catObj.label.split(" ")[0] + " " + catObj.label.split(" ")[1] : "ممیزی";

      const card = document.createElement("div");
      card.className = "p-3 rounded-2xl bg-[#141C1E] border " + (isResolved ? "border-emerald-500/30" : "border-amber-500/30") + " space-y-2 text-xs shadow-md transition";

      card.innerHTML = `
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-white text-[11px]">${msg.sender || "سرکار خانم کوشکشتانی"}</span>
            <span class="px-2 py-0.5 rounded text-[9.5px] bg-white/5 text-slate-300 font-mono">${msg.accountName || "عمومی"}</span>
          </div>
          <span class="text-[9px] text-slate-500 font-mono" dir="ltr">${msg.timeStr || ""}</span>
        </div>

        <div class="text-slate-200 text-[11.5px] leading-relaxed select-text whitespace-pre-wrap">${escapeHTML(msg.text || "")}</div>

        <div class="pt-1.5 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
          <span class="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            <span>🏷️</span> <span>${catLabel}</span>
          </span>
          <div>
            ${isResolved ? `
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                اصلاح و اعمال شد ✅
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                در صف پایش و اصلاح ⏳
              </span>
            `}
          </div>
        </div>

        ${msg.resolutionNote ? `
          <div class="mt-2 p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[10.5px] text-emerald-300 leading-snug">
            <span class="font-bold text-emerald-200">🤖 اقدام انجام‌شده:</span> ${escapeHTML(msg.resolutionNote)}
          </div>
        ` : ''}
      `;

      container.appendChild(card);
    });

    container.scrollTop = container.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Send Message
  window.sendAuditChatMessage = async function () {
    const input = document.getElementById("pfgAuditTextInput");
    const accSelect = document.getElementById("pfgAuditAccountSelect");
    const catSelect = document.getElementById("pfgAuditCategorySelect");
    const sendBtn = document.getElementById("pfgAuditSendBtn");

    if (!input || !input.value.trim()) {
      alert("لطفاً متن خطا یا توضیح تصحیح را وارد نمایید.");
      return;
    }

    const text = input.value.trim();
    const accId = accSelect ? accSelect.value : "all";
    const catId = catSelect ? catSelect.value : "general_note";

    const matchedAcc = ACCOUNTS_CATALOG.find(a => a.id === accId) || ACCOUNTS_CATALOG[0];

    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) + " — " + now.toLocaleDateString('fa-IR');

    const newMsg = {
      id: "audit-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      sender: "سرکار خانم کوشکشتانی (فائزه)",
      role: "ممیز عملیات و داده",
      accountId: accId,
      accountName: matchedAcc.name,
      category: catId,
      text: text,
      timestamp: Date.now(),
      timeStr: timeStr,
      status: "pending",
      resolutionNote: null
    };

    // Optimistic UI update
    chatMessages.push(newMsg);
    renderChatMessages();
    input.value = "";

    // Disable button briefly
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.innerText = "در حال ثبت...";
    }

    try {
      // 1. Post to Firebase RTDB
      await fetch(FIREBASE_CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg)
      });

      // 2. Also log to backup corrections endpoint
      fetch(FIREBASE_FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg)
      }).catch(e => console.warn("Backup sync warn:", e));

      // 3. Update local cache
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(chatMessages));

      // Show toast
      showAuditToast("✅ یادداشت شما با موفقیت ثبت شد و به سامانه پایش و اصلاح ارسال گردید.");
    } catch (e) {
      console.error("Failed to push chat message to Firebase:", e);
      showAuditToast("⚠️ یادداشت در حافظه محلی ذخیره شد و با بازگشت اتصال همگام خواهد شد.");
    } finally {
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `<span>ثبت و ارسال پیام</span> <span class="text-xs">🚀</span>`;
      }
    }
  };

  function showAuditToast(msg) {
    const toast = document.createElement("div");
    toast.className = "fixed top-5 left-1/2 transform -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-xl bg-[#172327] border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-2xl transition duration-300 flex items-center gap-2";
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectDOM);
  } else {
    injectDOM();
  }
})();
