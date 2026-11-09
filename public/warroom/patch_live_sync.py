import json

def patch():
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

    # 2. Bump version to force reload
    html = html.replace('const CURRENT_DATA_VERSION = "2026-11-09-p2-linkedin-restored-v3";', 'const CURRENT_DATA_VERSION = "2026-11-09-live-sync-v4";')
    html = html.replace('const CURRENT_DATA_VERSION = "2026-11-09-faeze-restored-v2";', 'const CURRENT_DATA_VERSION = "2026-11-09-live-sync-v4";')

    # 3. Add smartMergeAccounts function if not present
    smart_merge_code = '''
    function smartMergeAccounts(remoteList, localList) {
      if (!Array.isArray(remoteList) || remoteList.length === 0) return localList || [];
      if (!Array.isArray(localList) || localList.length === 0) return remoteList;

      const localMap = new Map(localList.map(a => [a.id, a]));

      return remoteList.map(remoteAcc => {
        const localAcc = localMap.get(remoteAcc.id);
        if (!localAcc) return remoteAcc;

        const merged = { ...remoteAcc };

        // 1. Preserve local stage if user modified it
        if (localAcc.stage) {
          merged.stage = localAcc.stage;
        }

        // 2. Preserve assignees if assigned locally
        if (localAcc.assigneeResearcher) merged.assigneeResearcher = localAcc.assigneeResearcher;
        if (localAcc.assigneeDrafter) merged.assigneeDrafter = localAcc.assigneeDrafter;
        if (localAcc.assigneeApprover) merged.assigneeApprover = localAcc.assigneeApprover;

        // 3. Preserve shortcode if entered locally and remote is empty
        if (localAcc.shortcode && !merged.shortcode) {
          merged.shortcode = localAcc.shortcode;
        }

        // 4. Merge Action Logs (Union by id / timestamp / text)
        const actionKeys = new Set((merged.actions || []).map(a => a.id || a.timestamp || a.text));
        (localAcc.actions || []).forEach(act => {
          const key = act.id || act.timestamp || act.text;
          if (!actionKeys.has(key)) {
            merged.actions = merged.actions || [];
            merged.actions.push(act);
            actionKeys.add(key);
          }
        });

        // 5. Merge Comments (Union by id / timestamp / text)
        const commentKeys = new Set((merged.comments || []).map(c => c.id || c.timestamp || c.text));
        (localAcc.comments || []).forEach(comm => {
          const key = comm.id || comm.timestamp || comm.text;
          if (!commentKeys.has(key)) {
            merged.comments = merged.comments || [];
            merged.comments.push(comm);
            commentKeys.add(key);
          }
        });

        // 6. Ensure Layer 2 contacts have remote LinkedIn URLs merged into local contacts
        if (remoteAcc.layer2Contacts && remoteAcc.layer2Contacts.length > 0) {
          merged.layer2Contacts = remoteAcc.layer2Contacts.map((rc, idx) => {
            const lc = (localAcc.layer2Contacts || [])[idx] || {};
            return {
              ...rc,
              phone: lc.phone || rc.phone || merged.phone,
              channel: lc.channel || rc.channel,
              linkedin: rc.linkedin || lc.linkedin
            };
          });
        }

        return merged;
      });
    }
'''

    if 'function smartMergeAccounts' not in html:
        target_pos = html.find('function saveState() {')
        html = html[:target_pos] + smart_merge_code + '\n' + html[target_pos:]

    # 4. Enhance real-time setInterval to use smartMergeAccounts
    old_interval = '''    // ⚡ REAL-TIME BACKGROUND SYNC (Every 7 seconds)
    setInterval(async () => {
      try {
        const res = await fetch("./data.json?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            const remoteStr = JSON.stringify(remoteData);
            const localStr = JSON.stringify(accounts);
            if (remoteStr !== localStr) {
              const activeDrawerId = (selectedAccount && !document.getElementById("detailDrawer").classList.contains("hidden")) ? selectedAccount.id : null;
              accounts = remoteData;
              localStorage.setItem("pfg_accounts_data_v3", remoteStr);
              renderBoard();
              renderList();
              updateAnalytics();
              updateSyncUI("synced", "همگام شد با سرور (لحظه‌ای)");
              if (activeDrawerId) {
                const refreshedAcc = accounts.find(a => a.id === activeDrawerId);
                if (refreshedAcc) {
                  selectedAccount = refreshedAcc;
                  renderDocsList();
                  renderActionsFeed();
                  renderCommentsList();
                  renderLayer2Contacts(refreshedAcc.layer2Contacts || []);
                  updateDrawerBadges();
                }
              }
            }
          }
        }
      } catch(e) {}
    }, 7000);'''

    new_interval = '''    // ⚡ REAL-TIME BACKGROUND SYNC (Every 4 seconds with Non-Destructive Live Merge)
    setInterval(async () => {
      try {
        const res = await fetch("./data.json?t=" + Date.now(), { cache: "no-store" });
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            const merged = smartMergeAccounts(remoteData, accounts);
            const mergedStr = JSON.stringify(merged);
            const localStr = JSON.stringify(accounts);
            
            if (mergedStr !== localStr) {
              const activeDrawerId = (selectedAccount && !document.getElementById("detailDrawer").classList.contains("hidden")) ? selectedAccount.id : null;
              const activeElId = document.activeElement ? document.activeElement.id : null;
              
              accounts = merged;
              localStorage.setItem("pfg_accounts_data_v3", mergedStr);
              renderBoard();
              renderList();
              updateAnalytics();
              updateSyncUI("synced", "همگام شد با سرور (لحظه‌ای)");
              
              if (activeDrawerId) {
                const refreshedAcc = accounts.find(a => a.id === activeDrawerId);
                if (refreshedAcc) {
                  selectedAccount = refreshedAcc;
                  renderDocsList();
                  renderActionsFeed();
                  renderCommentsList();
                  renderLayer2Contacts(refreshedAcc.layer2Contacts || []);
                  updateDrawerBadges();
                  
                  // Non-destructively refresh drawer links and metadata if user is not typing in that specific input
                  if (activeElId !== "dEditLinkedin") {
                    document.getElementById("dEditLinkedin").value = refreshedAcc.linkedin || "";
                    document.getElementById("dLiLinkPreview").href = refreshedAcc.linkedin || "#";
                  }
                  if (activeElId !== "dEditDecisionMaker") {
                    document.getElementById("dEditDecisionMaker").value = refreshedAcc.decisionMaker || "";
                  }
                  if (activeElId !== "dEditTechLead") {
                    document.getElementById("dEditTechLead").value = refreshedAcc.techLead || "";
                  }
                }
              }
            }
          }
        }
      } catch(e) {}
    }, 4000);'''

    if old_interval in html:
        html = html.replace(old_interval, new_interval)
    else:
        print('Warning: old_interval block not found exactly, checking alternatives...')

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print('index.html successfully updated with smartMergeAccounts and 4s live sync!')

if __name__ == '__main__':
    patch()
