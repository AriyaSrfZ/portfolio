import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, 'data.json')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'list2.html')
MODAL_SNIPPET_FILE = os.path.join(SCRIPT_DIR, 'audit_modal_snippet.html')

def generate_list2():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        accounts = json.load(f)

    modal_snippet = ''
    if os.path.exists(MODAL_SNIPPET_FILE):
        with open(MODAL_SNIPPET_FILE, 'r', encoding='utf-8') as mf:
            modal_snippet = mf.read()

    p2_accounts = [a for a in accounts if a.get('phase') == 'phase2']

    rows_html = []
    for acc in p2_accounts:
        acc_id = acc.get('id', '')
        num = acc.get('num', '')
        name = acc.get('name', '')
        reg_name = acc.get('registeredName', '')
        nat_id = acc.get('nationalId', '')
        reg_num = acc.get('regNum', '')
        phone = acc.get('phone', '')
        address = acc.get('address', '')
        vertical = acc.get('vertical', '')
        website = acc.get('website', '')
        clean_web = website.replace('https://', '').replace('http://', '').strip('/')
        linkedin = acc.get('linkedin', '')
        score = acc.get('score', '')
        tier = acc.get('tier', 'Tier A')
        dm = acc.get('decisionMaker', '')
        pain = acc.get('pain', '')

        # Decision maker handle parsing
        dm_parts = dm.split(' — ')
        dm_title = dm_parts[0].strip() if dm_parts else ''
        dm_handle = dm_parts[1].strip() if len(dm_parts) > 1 else ''
        dm_li_html = ''
        if dm_handle and 'in/' in dm_handle:
            clean_handle = dm_handle.replace('in/', '').strip('/')
            dm_li_html = f'''<div class="mt-1.5">
              <a href="https://www.linkedin.com/in/{clean_handle}/" target="_blank" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/30 transition font-mono font-medium" dir="ltr">
                <span>in/{clean_handle}</span> <span class="text-xs">↗</span>
              </a>
            </div>'''
        else:
            dm_li_html = '''<div class="text-[10px] text-cyan-300/80 mt-1 flex items-center gap-1 font-medium">
              <span>عضو ارشد کمیته تصمیم‌گیری</span>
            </div>'''

        # Layer 2 cards (Clean Digital Focus)
        l2_list = acc.get('layer2Contacts', [])
        l2_cards = []
        for c in l2_list:
            c_name = c.get('name', '')
            c_role = c.get('role', '')
            c_li = c.get('linkedin', '')

            li_link_html = ''
            if c_li and c_li.strip() and 'linkedin.com/search' not in c_li:
                li_link_html = f'''<div class="pt-1">
                  <a href="{c_li}" target="_blank" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 hover:text-white border border-cyan-500/30 transition font-medium">
                    <span>مشاهده در لینکدین</span> <span class="text-xs">↗</span>
                  </a>
                </div>'''

            card_html = f'''            <div class="p-2.5 rounded-xl bg-[#101A1D] hover:bg-[#162327] border border-cyan-500/25 transition space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white text-[11.5px]">{c_name}</span>
                <span class="text-[9px] text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30 font-medium">رابط لایه ۲</span>
              </div>
              <div class="text-[10px] text-slate-300 leading-tight">{c_role}</div>
              {li_link_html}
            </div>'''
            l2_cards.append(card_html)
        l2_cards_html = '\n'.join(l2_cards)

        # Metadata popover details (Discreet collapsible button for legal & landline metadata)
        metadata_details_html = f'''<details class="group mt-2 relative">
            <summary class="cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition select-none">
              <span>🏛️ متادیتا و تلفن ثبتی</span>
              <span class="text-[8px] transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div class="mt-1.5 p-2.5 rounded-xl bg-[#141B1E] border border-cyan-500/30 text-[10.5px] space-y-1.5 text-slate-300 shadow-2xl">
              <div><span class="text-slate-500">نام ثبتی:</span> <span class="font-medium text-slate-200">{reg_name}</span></div>
              {f'<div><span class="text-slate-500 font-mono">شناسه ملی:</span> <span class="font-mono text-cyan-300 font-bold">{nat_id}</span></div>' if nat_id else ''}
              {f'<div><span class="text-slate-500 font-mono">شماره ثبت:</span> <span class="font-mono text-slate-300">{reg_num}</span></div>' if reg_num else ''}
              {f'<div><span class="text-slate-500">تلفن دفتر:</span> <a href="tel:{phone}" class="font-mono text-emerald-400 hover:underline font-bold" dir="ltr">{phone}</a></div>' if phone else ''}
              {f'<div><span class="text-slate-500">نشانی دفتر:</span> <span class="text-slate-300 text-[10px]">{address}</span></div>' if address else ''}
            </div>
          </details>'''

        # Digital Channels Column (Website & Company LinkedIn)
        li_company_html = f'''<div>
            <a href="{linkedin}" target="_blank" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 border border-[#0A66C2]/30 text-sky-300 hover:text-white transition">
              <span>💼</span> <span>لینکدین شرکت</span> <span class="text-[10px]">↗</span>
            </a>
          </div>''' if linkedin and 'linkedin.com' in linkedin else ''

        contact_col = f'''<div class="space-y-1.5">
          <div>
            <a href="{website}" target="_blank" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 hover:text-cyan-200 transition" dir="ltr">
              <span>🌐</span> <span>{clean_web}</span> <span class="text-[10px]">↗</span>
            </a>
          </div>
          {li_company_html}
        </div>'''

        row_html = f'''      <tr class="hover:bg-cyan-950/30 transition">
        <td class="py-4 px-4 text-center font-mono text-cyan-400 font-bold w-12">{num}</td>
        <td class="py-4 px-4 min-w-[220px]">
          <div class="font-bold text-white text-sm">{name}</div>
          <div class="flex items-center gap-2 mt-1.5 flex-wrap">
            <span class="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium"><span>⚡ پایلوت V2</span></span>
            <button onclick="openAuditModal('{acc_id}')" class="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 font-medium transition cursor-pointer"><span>✏️</span> <span>ثبت اصلاح / خطا</span></button>
          </div>
          {metadata_details_html}
        </td>
        <td class="py-4 px-4 text-slate-300 min-w-[140px] leading-relaxed">{vertical}</td>
        <td class="py-4 px-4 min-w-[160px]">
          {contact_col}
        </td>
        <td class="py-4 px-4 min-w-[230px]">
          <div class="font-bold text-white text-xs leading-snug">{dm_title}</div>
          {dm_li_html}
        </td>
        <td class="py-4 px-4 min-w-[300px] bg-cyan-950/20">
          <div class="space-y-2">
{l2_cards_html}
          </div>
        </td>
        <td class="py-4 px-4 min-w-[260px]">
          <div class="space-y-1.5">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              استراتژی ملایم Hot Failover
            </span>
            <div class="text-[10.5px] text-slate-200 leading-relaxed font-medium">{pain}</div>
            <div class="text-[10px] text-cyan-300/80 font-medium">پیشنهاد: ۵۰k پیامک هدیه تست Hot Failover بدون تعهد اولیه</div>
          </div>
        </td>
        <td class="py-4 px-4 w-36 text-center whitespace-nowrap">
          <span class="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 whitespace-nowrap">امتیاز IEI: {score}</span>
          <div class="text-[9.5px] text-slate-400 mt-1">{tier}</div>
        </td>
      </tr>'''
        rows_html.append(row_html)

    tbody_content = '\n'.join(rows_html)

    html = f'''<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <title>فهرست ۱۰ حساب منتخب فاز دوم (V2) — پرشیا فاوا (فِرِستا)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/misc/Farsi-Digits/Vazirmatn-FD-font-face.css" rel="stylesheet" type="text/css" />
  <style>
    body {{
      font-family: 'Vazirmatn FD', 'IBM Plex Sans', system-ui, sans-serif;
      background-color: #0F171A;
      background-image: 
        radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.12) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(20, 184, 166, 0.08) 0px, transparent 50%);
      background-attachment: fixed;
      color: #F0EEE7;
    }}
    .font-mono {{ font-family: 'IBM Plex Mono', monospace; }}
    details > summary::-webkit-details-marker {{ display: none; }}
  </style>
</head>
<body class="min-h-screen py-6">
  <div class="max-w-[1680px] mx-auto space-y-6 px-4 sm:px-8">
    <!-- Header -->
    <header class="bg-[#162226] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-cyan-400 font-mono mb-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>B2B LOW-INCUMBENT ENTRENCHMENT PIPELINE — PHASE 2 DIRECTORY (10 ACCOUNTS)</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>فهرست ۱۰ حساب بکر فاز دوم (روت دیجیتال و تصمیم‌گیرندگان)</span>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">استراتژی ملایم Hot Failover</span>
        </h1>
        <p class="text-xs text-slate-300 mt-1.5">حساب‌های چابک زیر رادار با شاخص نفوذ رقبا (IEI) پایین، تمرکز کامل بر کانال‌های دیجیتال لینکدین، و دسترسی به متادیتای ثبتی با دکمه اطلاعات</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <a href="/faezeh.html" class="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
          <span>💬 صندوق مستقیم چت (فائزه)</span>
        </a>
        <button onclick="openAuditModal()" class="px-3.5 py-2 bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 text-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-amber-400/40 shadow-lg shadow-amber-950/40 cursor-pointer">
          <span>✍️ ثبت خطا و یادداشت ممیزی</span>
        </button>
        <a href="/index.html" class="px-4 py-2 bg-[#527C78] hover:bg-[#436763] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#527C78]/25 transition flex items-center gap-1.5">
          <span>← داشبورد کانبان</span>
        </a>
        <a href="/c-levels.html" class="px-3.5 py-2 bg-[#292F2D] hover:bg-[#343C38] text-slate-200 border border-[#46504B] rounded-xl text-xs font-semibold transition">
          <span>👥 بورد جامع ۲۰ حساب (C-Levels)</span>
        </a>
        <a href="/dossier/06_THE_REAL_LIST_2_AND_SOFTENING_STRATEGY.md" target="_blank" class="px-3.5 py-2 bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
          <span>📖 سند استراتژی ملایم‌سازی</span>
        </a>
      </div>
    </header>

    <!-- Permanent Inline Quick-Chat Box (Faezeh Direct Line) -->
    <div class="bg-[#182326] border border-cyan-500/40 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 font-sans">
      <div class="flex items-center gap-2.5 whitespace-nowrap">
        <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-lg shadow-inner">💬</div>
        <div>
          <div class="font-bold text-xs text-white">ارسال سریع پیام یا تصحیح خطا (فائزه):</div>
          <div class="text-[10px] text-slate-400">هر پیام، سایت، لینکدین، شماره یا خطایی دارید مستقیم وارد کنید و ارسال را بزنید</div>
        </div>
      </div>
      <div class="flex-1 w-full flex items-center gap-2">
        <input type="text" id="quickAuditInlineInput" onkeydown="if(event.key==='Enter') submitQuickInlineAudit()" placeholder="مثال: لینکدین اکوگلد: https://www.linkedin.com/company/Ecogold یا سایت بیدارز https://..." dir="auto" class="flex-1 text-xs bg-[#0E1517] text-white placeholder-slate-500 border border-[#2B3B3F] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-400 transition" />
        <button onclick="submitQuickInlineAudit()" id="quickAuditInlineBtn" class="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-md transition flex items-center gap-1.5 cursor-pointer">
          <span>ارسال</span> <span>🚀</span>
        </button>
      </div>
      <div class="flex items-center gap-2 text-xs">
        <a href="/faezeh.html" class="text-cyan-400 hover:underline text-[11px] font-medium whitespace-nowrap">صفحه کامل چت ↗</a>
        <span id="quickAuditInlineStatus" class="text-xs"></span>
      </div>
    </div>

    <!-- Strategy Highlights Banner -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-[#162226] border border-cyan-500/20 rounded-xl p-4 space-y-1">
        <div class="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
          <span>🛡️ ورود به عنوان بیمه‌نامه اضطراری</span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed">بدون ادعای وجود اختلال در روت فعلی شرکت؛ صرفاً به عنوان خط نجات موازی (Hot Failover) در ساعات پیک بازار.</p>
      </div>
      <div class="bg-[#162226] border border-cyan-500/20 rounded-xl p-4 space-y-1">
        <div class="text-xs font-bold text-teal-400 flex items-center gap-1.5">
          <span>🎁 ۵۰k پیامک تست رایگان</span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed">ارائه فوری API Key بدون امضای قرارداد اولیه، بدون تعویض خط و با امکان تست بلادرنگ تیم توسعه.</p>
      </div>
      <div class="bg-[#162226] border border-cyan-500/20 rounded-xl p-4 space-y-1">
        <div class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
          <span>⚡ مستندات سبک دو صفحه‌ای</span>
        </div>
        <p class="text-[11px] text-slate-300 leading-relaxed">نمونه کدهای آماده پایتون، نود و PHP جهت اتصال سریع ظرف ۱۰ دقیقه با وب‌هوک مستقیم تایید دریافت گوشی.</p>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-[#142024] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right text-xs min-w-[1450px]">
          <thead class="bg-[#1B2B30] text-slate-300 border-b border-cyan-500/30">
            <tr>
              <th class="py-4 px-4 text-center font-bold text-xs w-12 whitespace-nowrap">#</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[220px] whitespace-nowrap">نام شرکت و متادیتا</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[140px] whitespace-nowrap">حوزه تخصصی</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[160px] whitespace-nowrap">کانال‌های دیجیتال</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[230px] whitespace-nowrap">مدیر ارشد (C-Level)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[300px] whitespace-nowrap">رابطین لایه دوم (فنی و محصول)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[260px] whitespace-nowrap">اسب تروجان و استراتژی ورود</th>
              <th class="py-4 px-4 font-bold text-xs text-center w-36 whitespace-nowrap">شاخص نفوذ (IEI)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-cyan-500/15">
{tbody_content}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <script>
    window.accounts = {json.dumps(accounts, ensure_ascii=False)};

    async function submitQuickInlineAudit() {{
      const input = document.getElementById('quickAuditInlineInput');
      const btn = document.getElementById('quickAuditInlineBtn');
      const status = document.getElementById('quickAuditInlineStatus');
      if (!input || !input.value.trim()) return;

      const val = input.value.trim();
      if (btn) {{ btn.disabled = true; btn.innerText = '...'; }}
      if (status) {{ status.innerHTML = '<span class="text-amber-400 text-[11px]">در حال ارسال...</span>'; }}

      const now = new Date();
      const timeStr = now.toLocaleTimeString('fa-IR', {{ hour: '2-digit', minute: '2-digit' }}) + ' — ' + now.toLocaleDateString('fa-IR');

      try {{
        await fetch('https://gen-lang-client-0338096411-default-rtdb.firebaseio.com/warroom/faezeh_chat.json', {{
          method: 'POST',
          headers: {{ 'Content-Type': 'application/json' }},
          body: JSON.stringify({{
            id: 'inline-' + Date.now(),
            sender: 'سرکار خانم کوشکشتانی (فائزه)',
            role: 'ممیز داده و عملیات',
            accountId: 'all',
            accountName: 'عمومی',
            text: val,
            timestamp: Date.now(),
            timeStr: timeStr,
            status: 'pending'
          }})
        }});
        input.value = '';
        if (status) {{ status.innerHTML = '<span class="text-emerald-400 font-bold text-[11px]">✅ ثبت شد و پایشگر در حال اعمال است</span>'; }}
        setTimeout(() => {{ if (status) status.innerText = ''; }}, 6000);
      }} catch(e) {{
        if (status) {{ status.innerHTML = '<span class="text-red-400 text-[11px]">خطای شبکه!</span>'; }}
      }} finally {{
        if (btn) {{ btn.disabled = false; btn.innerHTML = '<span>ارسال</span> <span>🚀</span>'; }}
      }}
    }}
  </script>
</body>
</html>'''

    full_html = html.replace('</body>', f'\n{modal_snippet}\n</body>') if modal_snippet else html

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(full_html)

    print(f'Successfully generated clean digital-first {OUTPUT_FILE}')

if __name__ == '__main__':
    generate_list2()
