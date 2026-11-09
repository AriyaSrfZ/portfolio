import os
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, 'data.json')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'c-levels.html')

def generate():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        accounts = json.load(f)

    doc_map = {
        'acc-1': 'طلاین.docx',
        'acc-2': 'ترابرنت.docx',
        'acc-3': 'زرپی24.docx',
        'acc-4': 'اوبار.docx',
        'acc-5': 'سندپرداز.docx',
        'acc-6': 'چارگون.docx',
        'acc-7': 'گلدیکا.docx',
        'acc-8': 'قسطا.docx',
        'acc-9': 'وال گلد.docx',
        'acc-10': 'پست بار.docx',
    }

    rows_html = []

    for acc in accounts:
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
        phase = acc.get('phase', 'phase1')
        is_phase2 = (phase == 'phase2')

        # DM parsing
        dm_raw = acc.get('decisionMaker', '')
        dm_parts = dm_raw.split(' — ')
        dm_title = dm_parts[0].strip() if dm_parts else ''
        dm_handle = dm_parts[1].strip() if len(dm_parts) > 1 else ''
        
        dm_li_html = ''
        if dm_handle and 'in/' in dm_handle:
            clean_handle = dm_handle.replace('in/', '').strip('/')
            dm_li_html = f'''<div class="mt-1.5">
              <a href="https://www.linkedin.com/in/{clean_handle}/" target="_blank" class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 text-sky-300 hover:text-white border border-[#0A66C2]/30 transition font-mono font-medium" dir="ltr">
                <span>in/{clean_handle}</span> <span class="text-xs">↗</span>
              </a>
            </div>'''
        elif is_phase2:
            dm_li_html = '''<div class="mt-1.5 flex items-center gap-1 text-[10px] text-cyan-300/80 font-medium">
              <span>عضو ارشد کمیته تصمیم‌گیری</span>
            </div>'''
        else:
            dm_li_html = '''<div class="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-400/80 font-medium">
              <span>عضو ارشد کمیته تصمیم‌گیری</span>
            </div>'''

        # Layer 2 contacts (Clean Digital View: Name, Role, and direct LinkedIn profile link)
        l2_list = acc.get('layer2Contacts', [])
        l2_cards = []
        for c in l2_list:
            c_name = c.get('name', '')
            c_role = c.get('role', '')
            c_li = c.get('linkedin', '')

            li_link_html = ''
            if c_li and c_li.strip() and 'linkedin.com/search' not in c_li:
                accent_btn = 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30' if is_phase2 else 'bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 text-sky-300 border-[#0A66C2]/30'
                li_link_html = f'''<div class="pt-1">
                  <a href="{c_li}" target="_blank" class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] {accent_btn} hover:text-white border transition font-medium">
                    <span>مشاهده در لینکدین</span> <span class="text-xs">↗</span>
                  </a>
                </div>'''

            if is_phase2:
                card_html = f'''            <div class="p-2.5 rounded-xl bg-[#142326]/90 hover:bg-[#182C30] border border-cyan-500/30 hover:border-cyan-400/60 transition space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white text-[11px]">{c_name}</span>
                <span class="text-[9px] text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30 font-medium">رابط لایه ۲</span>
              </div>
              <div class="text-[10px] text-slate-300 leading-tight">{c_role}</div>
              {li_link_html}
            </div>'''
            else:
                card_html = f'''            <div class="p-2.5 rounded-xl bg-[#1E2422]/90 hover:bg-[#1E2422] border border-[#46504B]/70 hover:border-[#8FB4AA]/50 transition space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white text-[11px]">{c_name}</span>
                <span class="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">فعال</span>
              </div>
              <div class="text-[10px] text-slate-300 leading-tight">{c_role}</div>
              {li_link_html}
            </div>'''
            l2_cards.append(card_html)
        l2_cards_html = '\n'.join(l2_cards)

        # Status column
        stage = acc.get('stage', '')

        if is_phase2:
            status_html = '''<div class="space-y-1.5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>استراتژی ملایم Hot Failover</span>
          <div class="text-[10px] text-slate-400 mt-1">تست ۵۰k پیامک بدون تعهد قرارداد</div>
        </div>'''
        else:
            shortcode = acc.get('shortcode', '')
            if not shortcode:
                for com in acc.get('comments', []):
                    t = com.get('text', '')
                    if 'سرشماره' in t:
                        parts = t.split()
                        if len(parts) > 1:
                            shortcode = parts[1]

            if stage == 'outreach':
                shortcode_html = ''
                if shortcode:
                    shortcode_html = f'''\n          <div class="text-[11px] text-white font-mono mt-0.5"><span class="text-[#8FB4AA]">سرشماره:</span> <span class="bg-[#1E2422] px-1.5 py-0.5 rounded border border-[#46504B]" dir="ltr">{shortcode}</span></div>'''

                status_html = f'''<div class="space-y-1.5">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              نامه ارسال شد
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              مذاکره فعال
            </span>
          </div>{shortcode_html}
          <div class="text-[10px] text-slate-400">ارسال فیزیکی و ممیزی توسط فائزه</div>
        </div>'''
            else:
                status_html = '''<div class="space-y-1.5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 whitespace-nowrap">
            📝 تدوین نامه و روت
          </span>
          <div class="text-[10px] text-slate-400">آماده‌سازی پکیج پیشنهادی و سناریوی فنی</div>
        </div>'''

        # Tier badge
        tier = acc.get('tier', '')
        score = acc.get('score', '')
        if is_phase2:
            badge_cls = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        elif 'Tier A' in tier:
            badge_cls = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        elif 'Strategic' in tier:
            badge_cls = 'bg-[#527C78]/25 text-[#8FB4AA] border border-[#527C78]/40'
        else:
            badge_cls = 'bg-amber-500/20 text-amber-300 border border-amber-500/40'

        # Metadata popover details (clean modal drawer popover instead of raw table clutter)
        metadata_details_html = f'''<details class="group mt-2 relative">
            <summary class="cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 transition select-none">
              <span>🏛️ متادیتا و تلفن ثبتی</span>
              <span class="text-[8px] transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div class="mt-1.5 p-2.5 rounded-xl bg-[#141B1E] border border-white/10 text-[10.5px] space-y-1.5 text-slate-300 shadow-2xl">
              <div><span class="text-slate-500">نام ثبتی:</span> <span class="font-medium text-slate-200">{reg_name}</span></div>
              {f'<div><span class="text-slate-500 font-mono">شناسه ملی:</span> <span class="font-mono text-cyan-300 font-bold">{nat_id}</span></div>' if nat_id else ''}
              {f'<div><span class="text-slate-500 font-mono">شماره ثبت:</span> <span class="font-mono text-slate-300">{reg_num}</span></div>' if reg_num else ''}
              {f'<div><span class="text-slate-500">تلفن دفتر:</span> <a href="tel:{phone}" class="font-mono text-emerald-400 hover:underline font-bold" dir="ltr">{phone}</a></div>' if phone else ''}
              {f'<div><span class="text-slate-500">نشانی دفتر:</span> <span class="text-slate-300 text-[10px]">{address}</span></div>' if address else ''}
            </div>
          </details>'''

        # Digital Channels Column (Website & Company LinkedIn)
        li_company_btn = f'''<div>
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
          {li_company_btn}
        </div>'''

        if is_phase2:
            row_cls = "phase-row bg-cyan-950/20 hover:bg-cyan-950/40 border-b border-cyan-500/20 transition"
            num_html = f'<td class="py-3.5 px-4 text-center font-mono text-cyan-400 font-bold w-12">{num}</td>'
            company_col = f'''<div class="font-bold text-white text-sm">{name}</div>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium"><span>⚡ پایلوت V2</span></span>
          </div>
          {metadata_details_html}'''
            l2_col_cls = "py-3.5 px-4 min-w-[280px] bg-cyan-950/30"
        else:
            row_cls = "phase-row hover:bg-[#343C38]/50 transition"
            num_html = f'<td class="py-3.5 px-4 text-center font-mono text-slate-400 w-12">{num}</td>'
            doc_file = doc_map.get(acc_id, f"{name.split()[0]}.docx")
            company_col = f'''<div class="font-bold text-white text-sm">{name}</div>
          <div class="flex items-center gap-2 mt-1.5">
            <a href="/docs/{doc_file}" download class="inline-flex items-center gap-1 text-[10px] text-[#D8B486] hover:text-[#E8C496] bg-[#B39A77]/15 px-2 py-0.5 rounded border border-[#B39A77]/30 font-medium"><span>📄 {doc_file}</span></a>
          </div>
          {metadata_details_html}'''
            l2_col_cls = "py-3.5 px-4 min-w-[280px] bg-black/10"

        row_html = f'''      <tr data-phase="{phase}" class="{row_cls}">
        {num_html}
        <td class="py-3.5 px-4 min-w-[230px]">
          {company_col}
        </td>
        <td class="py-3.5 px-4 text-slate-300 min-w-[130px]">{vertical}</td>
        <td class="py-3.5 px-4 min-w-[160px]">
          {contact_col}
        </td>
        <td class="py-3.5 px-4 min-w-[230px]">
          <div class="font-bold text-white text-xs leading-snug">{dm_title}</div>
          {dm_li_html}
        </td>
        <td class="{l2_col_cls}">
          <div class="space-y-2">
{l2_cards_html}
          </div>
        </td>
        <td class="py-3.5 px-4 min-w-[240px]">
          {status_html}
        </td>
        <td class="py-3.5 px-4 w-32 text-center whitespace-nowrap">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold {badge_cls} whitespace-nowrap">{tier} ({score})</span>
        </td>
      </tr>'''
        rows_html.append(row_html)

    tbody_content = '\n'.join(rows_html)

    html_template = f'''<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <title>فهرست مدیران ارشد، رابطین لایه دوم و اولویت‌ها — پرشیا فاوا (فِرِستا)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap">
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/misc/Farsi-Digits/Vazirmatn-FD-font-face.css" rel="stylesheet" type="text/css" />
  <style>
    body {{
      font-family: 'Vazirmatn FD', 'IBM Plex Sans', system-ui, sans-serif;
      background-color: #202725;
      background-image: 
        radial-gradient(at 0% 0%, rgba(82, 124, 120, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(179, 154, 119, 0.1) 0px, transparent 50%);
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
    <header class="bg-[#292F2D] border border-[#46504B] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#8FB4AA] font-mono mb-1.5">
          <span class="w-2 h-2 rounded-full bg-[#8FB4AA] animate-pulse"></span>
          <span>B2B ACCOUNT-BASED MARKETING — DIGITAL ROUTE & C-SUITE DIRECTORY (20 ACCOUNTS)</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-[#F0EEE7]">شناسنامه دیجیتال، مدیران ارشد و رابطین لایه دوم ۲۰ حساب هدف</h1>
        <p class="text-xs text-[#B5BDB6] mt-1.5">تمرکز بر روت دیجیتال (لینکدین و وب‌سایت) جهت تسهیل ارتباط تیم، با دسترسی به متادیتای ثبتی و تلفن از طریق دکمه اطلاعات</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <button onclick="window.openAuditChat()" class="px-3.5 py-2 bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 text-amber-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-amber-400/40 shadow-lg shadow-amber-950/40">
          <span>✍️ ثبت خطا و یادداشت ممیزی (فائزه)</span>
        </button>
        <a href="/index.html" class="px-4 py-2 bg-[#527C78] hover:bg-[#436763] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#527C78]/25 transition flex items-center gap-1.5">
          <span>← بازگشت به اتاق جنگ</span>
        </a>
        <a href="/list2.html" class="px-3.5 py-2 bg-cyan-800/80 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-cyan-500/40">
          <span>⚡ فهرست ۱۰ تایی فاز ۲</span>
        </a>
        <a href="/meeting-nov2.html" class="px-3.5 py-2 bg-[#B39A77] hover:bg-[#9E8664] text-[#202725] rounded-xl text-xs font-bold transition flex items-center gap-1.5">
          <span>📋 صورتجلسه ۱۱ آبان</span>
        </a>
      </div>
    </header>

    <!-- Phase Switcher Tabs -->
    <div class="flex items-center gap-3 bg-[#292F2D] border border-[#46504B] p-2 rounded-2xl">
      <button onclick="switchPhase('all')" id="tab-all" class="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-2 whitespace-nowrap">
        <span>همه حساب‌ها (۲۰)</span>
        <span class="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono">۲۰</span>
      </button>
      <button onclick="switchPhase('phase1')" id="tab-phase1" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#527C78] shadow-md border border-emerald-400/40 transition flex items-center gap-2 whitespace-nowrap">
        <span>🌿 فاز ۱: ۱۰ حساب سازمانی (پیگیری ثانویه)</span>
        <span class="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-mono font-bold">۱۰</span>
      </button>
      <button onclick="switchPhase('phase2')" id="tab-phase2" class="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/30 transition flex items-center gap-2 whitespace-nowrap">
        <span>⚡ فاز ۲: ۱۰ حساب بکر V2 (استراتژی ملایم Hot Failover)</span>
        <span class="px-2 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300 text-[10px] font-mono font-bold">۱۰</span>
      </button>
    </div>

    <!-- Table Container -->
    <div class="bg-[#292F2D] border border-[#46504B] rounded-2xl shadow-2xl overflow-hidden">
      <div class="p-4 border-b border-[#46504B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#232927]">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#8FB4AA]"></span>
          <span class="font-bold text-xs text-[#F0EEE7]">ماتریس روت دیجیتال، تصمیم‌گیرندگان و متادیتای حقوقی</span>
        </div>
        <div class="text-xs text-slate-400">
          نمایش تفکیک‌شده: <span id="currentPhaseLabel" class="text-emerald-300 font-semibold">فاز ۱ (۱۰ حساب سازمانی)</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right text-xs">
          <thead class="bg-[#1E2422] text-[#B5BDB6] border-b border-[#46504B]">
            <tr>
              <th class="py-4 px-4 text-center font-bold text-xs w-12 whitespace-nowrap">#</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[230px] whitespace-nowrap">شرکت و متادیتا</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[130px] whitespace-nowrap">حوزه فعالیت</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[160px] whitespace-nowrap">کانال‌های دیجیتال</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[230px] whitespace-nowrap">مدیر ارشد (C-Level)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[280px] whitespace-nowrap">رابطین لایه دوم (فنی و محصول)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[240px] whitespace-nowrap">وضعیت اقدام و روت</th>
              <th class="py-4 px-4 font-bold text-xs text-center w-32 whitespace-nowrap">اولویت</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#46504B]/60" id="cLevelsTableBody">
{tbody_content}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    let activePhase = 'phase1';

    function switchPhase(phase) {{
      activePhase = phase;
      const rows = document.querySelectorAll('.phase-row');
      const label = document.getElementById('currentPhaseLabel');

      // Update Tab Styles
      ['all', 'phase1', 'phase2'].forEach(p => {{
        const btn = document.getElementById('tab-' + p);
        if (!btn) return;
        if (p === phase) {{
          if (p === 'phase2') {{
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-700 shadow-md border border-cyan-400/40 transition flex items-center gap-2 whitespace-nowrap";
          }} else {{
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#527C78] shadow-md border border-emerald-400/40 transition flex items-center gap-2 whitespace-nowrap";
          }}
        }} else {{
          if (p === 'phase2') {{
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/30 transition flex items-center gap-2 whitespace-nowrap";
          }} else {{
            btn.className = "px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition flex items-center gap-2 whitespace-nowrap";
          }}
        }}
      }});

      // Filter Rows
      rows.forEach(row => {{
        const rowPhase = row.getAttribute('data-phase');
        if (phase === 'all' || rowPhase === phase) {{
          row.style.display = '';
        }} else {{
          row.style.display = 'none';
        }}
      }});

      if (label) {{
        if (phase === 'all') label.innerHTML = '<span class="text-slate-200">همه ۲۰ حساب</span>';
        if (phase === 'phase1') label.innerHTML = '<span class="text-emerald-300">فاز ۱ (۱۰ حساب سازمانی)</span>';
        if (phase === 'phase2') label.innerHTML = '<span class="text-cyan-300">فاز ۲ (۱۰ حساب بکر V2)</span>';
      }}
    }}

    // Init with Phase 1 by default
    document.addEventListener('DOMContentLoaded', () => {{
      switchPhase('phase1');
    }});
  </script>
  <script src="/warroom/audit-chat.js"></script>
</body>
</html>'''

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(html_template)

    print(f"Successfully generated clean digital-first {OUTPUT_FILE}")

if __name__ == '__main__':
    generate()
