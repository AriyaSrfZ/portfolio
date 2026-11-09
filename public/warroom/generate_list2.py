import json

def generate_list2():
    with open('/home/aria/projects/portfolio/public/warroom/data.json', 'r', encoding='utf-8') as f:
        accounts = json.load(f)

    p2_accounts = [a for a in accounts if a.get('phase') == 'phase2']

    rows_html = []
    for acc in p2_accounts:
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
        score = acc.get('score', '')
        tier = acc.get('tier', 'Tier A')
        dm = acc.get('decisionMaker', '')
        pain = acc.get('pain', '')
        hook_ceo = acc.get('hookCeo', '')

        # Layer 2 cards
        l2_list = acc.get('layer2Contacts', [])
        l2_cards = []
        for c in l2_list:
            c_name = c.get('name', '')
            c_role = c.get('role', '')
            c_phone = c.get('phone', phone)
            c_channel = c.get('channel', f"دفتر مرکزی ({phone})")

            card_html = f'''            <div class="p-2.5 rounded-xl bg-[#101A1D] hover:bg-[#162327] border border-cyan-500/25 transition space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white text-[11.5px]">{c_name}</span>
                <span class="text-[9px] text-cyan-300 bg-cyan-500/15 px-1.5 py-0.5 rounded border border-cyan-500/30 font-medium">احراز شده</span>
              </div>
              <div class="text-[10px] text-slate-300 leading-tight">{c_role}</div>
              <div class="flex items-center justify-between text-[10px] pt-0.5">
                <a href="tel:{c_phone}" class="text-cyan-300 hover:text-cyan-100 hover:underline font-mono font-semibold inline-flex items-center gap-1" dir="ltr">
                  <span>📞</span> <span>{c_phone}</span>
                </a>
                <span class="text-slate-400 text-[9px] truncate max-w-[130px]">{c_channel}</span>
              </div>
            </div>'''
            l2_cards.append(card_html)
        l2_cards_html = '\n'.join(l2_cards)

        row_html = f'''      <tr class="hover:bg-cyan-950/30 transition">
        <td class="py-4 px-4 text-center font-mono text-cyan-400 font-bold w-12">{num}</td>
        <td class="py-4 px-4 min-w-[220px]">
          <div class="font-bold text-white text-sm">{name}</div>
          <div class="text-[10.5px] text-cyan-300/90 font-medium mt-1">🏛 {reg_name}</div>
          <div class="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
            <span>شناسه ملی: <span class="text-slate-200 font-bold">{nat_id}</span></span>
            {f'<span>ثبت: <span class="text-slate-200">{reg_num}</span></span>' if reg_num else ''}
          </div>
          <div class="flex items-center gap-2 mt-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-medium"><span>⚡ پایلوت V2</span></span>
          </div>
        </td>
        <td class="py-4 px-4 text-slate-300 min-w-[140px] leading-relaxed">{vertical}</td>
        <td class="py-4 px-4 min-w-[160px]">
          <div class="space-y-1.5">
            <a href="tel:{phone}" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition" dir="ltr">
              <span>📞</span> <span>{phone}</span>
            </a>
            <div>
              <a href="{website}" target="_blank" class="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-200 hover:underline font-mono" dir="ltr">
                <span>{clean_web}</span> <span class="text-xs">↗</span>
              </a>
            </div>
            <div class="text-[9.5px] text-slate-400 truncate max-w-[160px]" title="{address}">{address}</div>
          </div>
        </td>
        <td class="py-4 px-4 min-w-[230px]">
          <div class="font-bold text-white text-xs leading-snug">{dm}</div>
          <div class="text-[10px] text-cyan-300/80 mt-1 flex items-center gap-1 font-medium">
            <span>🏛 استعلام ثبتی رسمی (رسمیو)</span>
          </div>
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
          <span>فهرست ۱۰ حساب بکر فاز دوم (استعلام رسمی رسمیو و ثبت شرکت‌ها)</span>
          <span class="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">استراتژی ملایم Hot Failover</span>
        </h1>
        <p class="text-xs text-slate-300 mt-1.5">اطلاعات حقوقی ثبتی، شماره‌های مستقیم دفتر مرکزی و دبیرخانه‌ها، و تصمیم‌گیرندگان تاییدشده با شاخص نفوذ رقبا (IEI) پایین</p>
      </div>
      <div class="flex items-center gap-2.5 flex-wrap">
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

    <!-- Table Container -->
    <div class="bg-[#142024] border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-right text-xs min-w-[1450px]">
          <thead class="bg-[#1B2B30] text-slate-300 border-b border-cyan-500/30">
            <tr>
              <th class="py-4 px-4 text-center font-bold text-xs w-12 whitespace-nowrap">#</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[220px] whitespace-nowrap">شرکت و مشخصات ثبتی (رسمیو)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[140px] whitespace-nowrap">حوزه تخصصی</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[160px] whitespace-nowrap">تلفن دفتر مرکزی و وب‌سایت</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[230px] whitespace-nowrap">مدیر ارشد واقعی (C-Level / بنیان‌گذار)</th>
              <th class="py-4 px-4 font-bold text-xs min-w-[300px] whitespace-nowrap">رابطین لایه دوم و خط مستقیم</th>
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
</body>
</html>
'''

    with open('/home/aria/projects/portfolio/public/warroom/list2.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print('Successfully generated /home/aria/projects/portfolio/public/warroom/list2.html')

if __name__ == '__main__':
    generate_list2()
