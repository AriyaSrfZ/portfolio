import json

def generate():
    with open('/home/aria/projects/portfolio/public/warroom/data.json', 'r', encoding='utf-8') as f:
        accounts = json.load(f)

    # Strictly 10 phase 1 accounts
    accounts = [a for a in accounts if a.get('phase') == 'phase1' or 'phase1' in str(a.get('phase', ''))][:10]

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
        acc_id = acc.get('id')
        num = acc.get('num', '')
        name = acc.get('name', '')
        vertical = acc.get('vertical', '')
        website = acc.get('website', '')
        clean_web = website.replace('https://', '').replace('http://', '').strip('/')
        linkedin = acc.get('linkedin', '')
        
        # doc
        doc_file = doc_map.get(acc_id, f"{name.split()[0]}.docx")
        
        # DM
        dm_raw = acc.get('decisionMaker', '')
        dm_parts = dm_raw.split(' — ')
        dm_title = dm_parts[0].strip() if dm_parts else ''
        dm_handle = dm_parts[1].strip() if len(dm_parts) > 1 else ''
        
        # Layer 2 contacts
        l2_list = acc.get('layer2Contacts', [])
        l2_cards = []
        for c in l2_list:
            c_name = c.get('name', '')
            c_role = c.get('role', '')
            c_li = c.get('linkedin')
            
            li_link_html = ''
            if c_li and c_li.strip():
                li_link_html = f'<a href="{c_li}" target="_blank" class="text-[10px] text-[#8FB4AA] hover:text-[#B5D6CC] hover:underline font-medium inline-flex items-center gap-1"><span>مشاهده در لینکدین</span><span class="text-xs">↗</span></a>'
                
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
        
        # shortcode
        shortcode = ''
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
        if 'Tier A' in tier:
            badge_cls = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
        elif 'Strategic' in tier:
            badge_cls = 'bg-[#527C78]/25 text-[#8FB4AA] border border-[#527C78]/40'
        else:
            badge_cls = 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            
        dm_handle_html = f'<div class="text-[10px] text-slate-400 mt-0.5 font-mono" dir="ltr">{dm_handle}</div>' if dm_handle else ''
        
        row_html = f'''      <tr class="hover:bg-[#343C38]/50 transition">
        <td class="py-3.5 px-4 text-center font-mono text-slate-400 w-12">{num}</td>
        <td class="py-3.5 px-4 min-w-[200px]">
          <div class="font-bold text-white text-sm">{name}</div>
          <div class="text-[11px] text-slate-400 mt-0.5"><a href="{website}" target="_blank" class="hover:text-[#8FB4AA] hover:underline font-mono" dir="ltr">{clean_web}</a></div>
          <a href="/docs/{doc_file}" download class="inline-flex items-center gap-1 mt-1 text-[10px] text-[#D8B486] hover:text-[#E8C496] bg-[#B39A77]/15 px-2 py-0.5 rounded border border-[#B39A77]/30 font-medium"><span>📄 {doc_file}</span></a>
        </td>
        <td class="py-3.5 px-4 text-slate-300 min-w-[140px]">{vertical}</td>
        <td class="py-3.5 px-4 min-w-[130px]">
          <a href="{linkedin}" target="_blank" class="inline-flex items-center gap-1 text-[#8FB4AA] hover:text-[#A6C8BE] hover:underline font-medium"><span>صفحه شرکت</span> <span class="text-xs">↗</span></a>
        </td>
        <td class="py-3.5 px-4 min-w-[220px]">
          <div class="font-bold text-white text-xs leading-snug">{dm_title}</div>
          {dm_handle_html}
        </td>
        <td class="py-3.5 px-4 min-w-[280px] bg-black/10">
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
    :root {{
      --canvas: #202725;
      --surface: #292F2D;
      --surface-elevated: #343C38;
      --surface-hover: #3D4742;
      --border: #46504B;
      --border-subtle: #36403C;
      --text-primary: #F0EEE7;
      --text-secondary: #B5BDB6;
      --accent-primary: #8FB4AA;
      --accent-deep: #527C78;
      --ochre: #B39A77;
    }}
    body {{
      font-family: 'Vazirmatn FD', 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--canvas);
      background-image: 
        radial-gradient(at 0% 0%, rgba(143, 180, 170, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(179, 154, 119, 0.06) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-primary);
    }}
    .font-mono {{ font-family: 'IBM Plex Mono', monospace; }}
  </style>
</head>
<body class="min-h-screen py-6">
  <div class="max-w-[1680px] mx-auto space-y-6 px-4 sm:px-8">
    <!-- Header -->
    <header class="bg-[#292F2D] border border-[#46504B] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-xs text-[#8FB4AA] font-mono mb-1.5">
          <span class="w-2 h-2 rounded-full bg-[#8FB4AA] animate-pulse"></span>
          <span>B2B ACCOUNT-BASED MARKETING — VERIFIED C-SUITE & LAYER-2 DIRECTORY (10 ACCOUNTS)</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-[#F0EEE7]">شناسنامه مدیران ارشد و رابطین لایه دوم ۱۰ حساب کلیدی هدف</h1>
        <p class="text-xs text-[#B5BDB6] mt-1.5">پایگاه جامع پروفایل‌های فردی لینکدین جهت برقراری ارتباط هدفمند، پیگیری نامه‌ها و ممیزی شبکه‌ای</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
        <a href="/index.html" class="px-4 py-2 bg-[#527C78] hover:bg-[#436763] text-white rounded-xl text-xs font-bold shadow-lg shadow-[#527C78]/25 transition flex items-center gap-1.5">
          <span>← بازگشت به اتاق جنگ</span>
        </a>
        <a href="/meeting-nov2.html" class="px-3.5 py-2 bg-[#B39A77] hover:bg-[#9E8664] text-[#202725] rounded-xl text-xs font-bold transition flex items-center gap-1.5">
          <span>📋 صورتجلسه ۱۱ آبان</span>
        </a>
        <a href="/docs/قرارداد.docx" download class="px-3 py-2 bg-[#343C38] hover:bg-[#3D4742] text-[#F0EEE7] border border-[#46504B] rounded-xl text-xs font-semibold transition">
          <span>📑 پیش‌نویس قرارداد</span>
        </a>
        <a href="/pfg_b2b_tracker.xlsx" download class="px-3 py-2 bg-[#343C38] hover:bg-[#3D4742] text-[#F0EEE7] border border-[#46504B] rounded-xl text-xs font-semibold transition">
          <span>📥 دانلود اکسل</span>
        </a>
      </div>
    </header>

    <!-- Table of Accounts & C-Levels -->
    <div class="bg-[#292F2D] border border-[#46504B] rounded-2xl shadow-2xl overflow-hidden">
      <!-- Section 1 Header Banner -->
      <div class="p-4 bg-[#252C29] border-b border-[#46504B] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <h2 class="font-bold text-sm text-white">فاز اول: ۱۰ حساب فعال با پیگیری نامه‌های فیزیکی ارسالی</h2>
        </div>
        <span class="text-xs font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded border border-emerald-500/30 font-bold">۱۰ حساب فاز ۱</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right text-xs min-w-[1400px]">
          <thead class="bg-[#343C38] text-[#B5BDB6] border-b border-[#46504B]">
            <tr>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs text-center font-mono w-12">#</th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[200px]">شرکت و برند</th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[140px]">حوزه فعالیت</th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[130px]">لینکدین سازمانی</th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[220px]">
                <span>مدیر ارشد / تصمیم‌گیرنده</span>
                <span class="whitespace-nowrap font-mono inline-block" dir="ltr">(C-Level)</span>
              </th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[280px] bg-black/10">
                <div class="flex items-center gap-1.5 text-emerald-400">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>رابطین لایه دوم (فنی، محصول، عملیات)</span>
                </div>
              </th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs min-w-[240px]">وضعیت نامه و اقدام عملیاتی</th>
              <th class="whitespace-nowrap py-4 px-4 font-bold text-xs text-center w-32">اولویت شورا</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#36403C]">
{tbody_content}
          </tbody>
        </table>
      </div>

    </div>
  </div>
</body>
</html>
'''

    with open('/home/aria/projects/portfolio/public/warroom/c-levels.html', 'w', encoding='utf-8') as f:
        f.write(html_template)

    print('Successfully generated /home/aria/projects/portfolio/public/warroom/c-levels.html')

if __name__ == '__main__':
    generate()
