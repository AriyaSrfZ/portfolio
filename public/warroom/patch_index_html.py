import json

def patch_index():
    index_path = '/home/aria/projects/portfolio/public/warroom/index.html'
    data_path = '/home/aria/projects/portfolio/public/warroom/data.json'

    with open(data_path, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update defaultAccounts
    start_token = 'const defaultAccounts = ['
    end_pos = html.find('];\n\n\n    // LocalStorage State Management', html.find(start_token))
    if end_pos == -1:
        end_pos = html.find('];', html.find(start_token))

    formatted_json = json.dumps(master_data, ensure_ascii=False, indent=2)
    new_default = f"const defaultAccounts = {formatted_json};"
    html = html[:html.find(start_token)] + new_default + html[end_pos+2:]

    # 2. Bump version to force fresh reload with restored data
    html = html.replace('const CURRENT_DATA_VERSION = "2026-11-09-rasmio-enriched-v1";', 'const CURRENT_DATA_VERSION = "2026-11-09-faeze-restored-v2";')
    html = html.replace('const CURRENT_DATA_VERSION = "2026-11-04-v2-fixed-kanban-v9";', 'const CURRENT_DATA_VERSION = "2026-11-09-faeze-restored-v2";')

    # 3. Fix activeFilterPhase declaration at top (around line 3085)
    target_role = 'let activeFilterRole = "all";\n    let activeSearch = "";\n    let selectedAccount = accounts[0];'
    replacement_role = 'let activeFilterRole = "all";\n    let activeFilterPhase = "all";\n    let activeSearch = "";\n    let selectedAccount = accounts[0];'
    if target_role in html and 'let activeFilterPhase = "all";' not in html:
        html = html.replace(target_role, replacement_role)

    # 4. Remove duplicate let activeFilterPhase = 'all'; at bottom
    dup_str = "let activeFilterPhase = 'all';\n\n    function filterByPhase(phase) {"
    clean_filter = "function filterByPhase(phase) {"
    if dup_str in html:
        html = html.replace(dup_str, clean_filter)

    # 5. Add dEditShortcode input to drawer HTML
    target_address_div = '''            <div>
              <label class="block text-[11px] text-slate-400 mb-1">نشانی دفتر مرکزی:</label>
              <input type="text" id="dEditAddress" class="w-full bg-[#343C38] text-slate-300 border border-[#46504B] text-xs rounded-lg px-3 py-1.5">
            </div>'''
    shortcode_input_html = '''            <div>
              <label class="block text-[11px] text-amber-300 font-bold mb-1">سرشماره پیامکی فعلی مشتری (Shortcode):</label>
              <input type="text" id="dEditShortcode" placeholder="مثلاً: 10000200002255" class="w-full bg-[#1F2523] text-amber-300 border border-amber-500/40 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono font-bold" dir="ltr">
            </div>
'''
    if 'id="dEditShortcode"' not in html:
        html = html.replace(target_address_div, target_address_div + '\n' + shortcode_input_html)

    # 6. Bind dEditShortcode in openDetailDrawer
    target_drawer_addr = 'document.getElementById("dEditAddress").value = acc.address || "";'
    shortcode_open_code = 'document.getElementById("dEditAddress").value = acc.address || "";\n      document.getElementById("dEditShortcode").value = acc.shortcode || "";'
    if 'document.getElementById("dEditShortcode").value' not in html:
        html = html.replace(target_drawer_addr, shortcode_open_code)

    # 7. Bind dEditShortcode in saveDrawerEdits
    target_save_addr = 'selectedAccount.address = document.getElementById("dEditAddress").value.trim();'
    shortcode_save_code = 'selectedAccount.address = document.getElementById("dEditAddress").value.trim();\n      selectedAccount.shortcode = document.getElementById("dEditShortcode").value.trim();'
    if 'selectedAccount.shortcode =' not in html:
        html = html.replace(target_save_addr, shortcode_save_code)

    # 8. Enhance card shortcode rendering in renderBoard
    old_card_shortcode = '''                ${(acc.comments && acc.comments.some(c => c.text && c.text.includes("سرشماره"))) ? `
                  <span class="font-mono text-amber-300 bg-black/40 px-1.5 py-0.5 rounded border border-amber-500/25">
                    ${acc.comments.find(c => c.text && c.text.includes("سرشماره")).text.replace("سرشماره", "").trim()}
                  </span>
                ` : ""}'''
    new_card_shortcode = '''                ${(acc.shortcode || (acc.comments && acc.comments.some(c => c.text && c.text.includes("سرشماره")))) ? `
                  <span class="font-mono text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-500/40 font-bold" title="سرشماره پیامکی فعال">
                    ${acc.shortcode || acc.comments.find(c => c.text && c.text.includes("سرشماره")).text.replace("سرشماره", "").trim()}
                  </span>
                ` : ""}'''
    if old_card_shortcode in html:
        html = html.replace(old_card_shortcode, new_card_shortcode)

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print('index.html successfully patched!')

if __name__ == '__main__':
    patch_index()
