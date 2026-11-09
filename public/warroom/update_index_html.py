import json

def update_index():
    with open('/home/aria/projects/portfolio/public/warroom/data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open('/home/aria/projects/portfolio/public/warroom/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Replace defaultAccounts
    start_token = 'const defaultAccounts = ['
    end_token = '];\n\n\n    // LocalStorage State Management'
    
    start_pos = html.find(start_token)
    if start_pos == -1:
        print('ERROR: start_token not found!')
        return

    # Find the matching closing bracket
    end_pos = html.find('];', start_pos)
    if end_pos == -1:
        print('ERROR: end_pos not found!')
        return

    formatted_json = json.dumps(data, ensure_ascii=False, indent=2)
    new_default_accounts = f"const defaultAccounts = {formatted_json};"

    html = html[:start_pos] + new_default_accounts + html[end_pos+2:]

    # 2. Bump version
    html = html.replace('const CURRENT_DATA_VERSION = "2026-11-04-v2-fixed-kanban-v9";', 'const CURRENT_DATA_VERSION = "2026-11-09-rasmio-enriched-v1";')

    # 3. Add registration section to detail modal (right before "<!-- Company Official Links -->")
    target_links = '<!-- Company Official Links -->'
    new_reg_section = '''<!-- Official Registration & Corporate Intelligence -->
          <div class="bg-[#292F2D] p-4 rounded-xl border border-[#46504B] space-y-3">
            <div class="flex items-center justify-between border-b border-[#46504B] pb-2">
              <span class="text-xs font-bold text-slate-200">مشخصات ثبتی و تماس رسمی (رسمیو):</span>
              <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">استعلام رسمی</span>
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">نام رسمی ثبتی شرکت:</label>
              <input type="text" id="dEditRegisteredName" class="w-full bg-[#343C38] text-white border border-[#46504B] focus:border-[#8FB4AA] text-xs rounded-lg px-3 py-2 font-medium">
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] text-slate-400 mb-1">شناسه ملی:</label>
                <input type="text" id="dEditNationalId" class="w-full bg-[#343C38] text-slate-200 border border-[#46504B] text-xs rounded-lg px-2.5 py-1.5 font-mono" dir="ltr">
              </div>
              <div>
                <label class="block text-[11px] text-slate-400 mb-1">تلفن دفتر مرکزی / دبیرخانه:</label>
                <div class="flex items-center gap-1.5">
                  <input type="text" id="dEditPhone" class="flex-1 bg-[#343C38] text-emerald-300 border border-[#46504B] text-xs rounded-lg px-2.5 py-1.5 font-mono font-bold" dir="ltr">
                  <a id="dPhoneCallBtn" href="tel:" class="p-1.5 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition" title="تماس مستقیم">📞</a>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[11px] text-slate-400 mb-1">نشانی دفتر مرکزی:</label>
              <input type="text" id="dEditAddress" class="w-full bg-[#343C38] text-slate-300 border border-[#46504B] text-xs rounded-lg px-3 py-1.5">
            </div>
          </div>

          '''
    if 'id="dEditRegisteredName"' not in html:
        html = html.replace(target_links, new_reg_section + target_links)

    # 4. Update openDetailDrawer to populate new fields
    dm_populate_target = 'document.getElementById("dEditDecisionMaker").value = acc.decisionMaker || "";'
    reg_populate_code = '''document.getElementById("dEditRegisteredName").value = acc.registeredName || "";
      document.getElementById("dEditNationalId").value = acc.nationalId || "";
      document.getElementById("dEditPhone").value = acc.phone || "";
      const phoneBtn = document.getElementById("dPhoneCallBtn");
      if (phoneBtn) phoneBtn.href = acc.phone ? `tel:${acc.phone}` : "tel:";
      document.getElementById("dEditAddress").value = acc.address || "";
      '''
    if 'document.getElementById("dEditRegisteredName").value' not in html:
        html = html.replace(dm_populate_target, reg_populate_code + dm_populate_target)

    # 5. Update saveDrawerEdits to save new fields
    dm_save_target = 'selectedAccount.decisionMaker = document.getElementById("dEditDecisionMaker").value.trim();'
    reg_save_code = '''selectedAccount.registeredName = document.getElementById("dEditRegisteredName").value.trim();
      selectedAccount.nationalId = document.getElementById("dEditNationalId").value.trim();
      selectedAccount.phone = document.getElementById("dEditPhone").value.trim();
      selectedAccount.address = document.getElementById("dEditAddress").value.trim();
      '''
    if 'selectedAccount.registeredName =' not in html:
        html = html.replace(dm_save_target, reg_save_code + dm_save_target)

    # 6. Update renderLayer2Contacts to render phone and purge search links
    old_render_contacts = '''        item.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-[11px]">${c.name || ""}</span>
            <span class="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">${c.role || ""}</span>
          </div>
          ${c.title ? `<div class="text-[10px] text-slate-300 leading-tight">${c.title}</div>` : ""}
          ${c.linkedin ? `
            <div class="pt-0.5">
              <a href="${c.linkedin}" target="_blank" class="text-[10px] text-[#8FB4AA] hover:underline font-mono inline-flex items-center gap-1">
                <span>${shortLi}</span> ↗
              </a>
            </div>
          ` : ""}
        `;'''

    new_render_contacts = '''        const hasRealLi = c.linkedin && !c.linkedin.includes('linkedin.com/search') && !c.linkedin.includes('keywords=');
        item.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="font-bold text-white text-[11px]">${c.name || ""}</span>
            <span class="text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">${c.role || ""}</span>
          </div>
          ${c.title ? `<div class="text-[10px] text-slate-300 leading-tight">${c.title}</div>` : ""}
          ${c.phone ? `
            <div class="pt-1 flex items-center justify-between text-[10px]">
              <a href="tel:${c.phone}" class="text-emerald-400 hover:text-emerald-300 hover:underline font-mono font-bold inline-flex items-center gap-1" dir="ltr">
                <span>📞</span> <span>${c.phone}</span>
              </a>
              <span class="text-slate-400 text-[9.5px] truncate max-w-[140px]">${c.channel || 'دفتر مرکزی'}</span>
            </div>
          ` : ""}
          ${hasRealLi ? `
            <div class="pt-0.5">
              <a href="${c.linkedin}" target="_blank" class="text-[10px] text-[#8FB4AA] hover:underline font-mono inline-flex items-center gap-1">
                <span>${shortLi}</span> ↗
              </a>
            </div>
          ` : ""}
        `;'''

    if old_render_contacts in html:
        html = html.replace(old_render_contacts, new_render_contacts)
    else:
        print('Note: old_render_contacts exact match not found; checking if already updated.')

    with open('/home/aria/projects/portfolio/public/warroom/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print('Successfully updated /home/aria/projects/portfolio/public/warroom/index.html')

if __name__ == '__main__':
    update_index()
