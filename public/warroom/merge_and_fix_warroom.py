import json

def merge_and_fix():
    data_json_path = '/home/aria/projects/portfolio/public/warroom/data.json'
    faeze_json_path = '/home/aria/projects/portfolio/public/warroom/incoming/faeze_received_data.json'

    with open(data_json_path, 'r', encoding='utf-8') as f:
        master = json.load(f)

    with open(faeze_json_path, 'r', encoding='utf-8') as f:
        faeze = json.load(f)

    faeze_map = {a['id']: a for a in faeze}

    # Shortcode mapping
    shortcodes = {
        'acc-1': '10000200002255',
        'acc-2': '90008691',
        'acc-4': '20006600033',
        'acc-7': '10001000196',
        'acc-8': '100004347',
    }

    for acc in master:
        aid = acc['id']
        # Set shortcode
        acc['shortcode'] = shortcodes.get(aid, '')

        # Merge from Faezeh if present
        if aid in faeze_map:
            fa = faeze_map[aid]
            # Restore assignees
            acc['assigneeResearcher'] = fa.get('assigneeResearcher', 'خانم فائزه')
            acc['assigneeDrafter'] = fa.get('assigneeDrafter', 'خانم خرم‌دل')
            acc['assigneeApprover'] = fa.get('assigneeApprover', 'خانم شهروزی')
            
            # Merge actions
            existing_act_ids = {a['id'] for a in acc.get('actions', [])}
            for act in fa.get('actions', []):
                if act['id'] not in existing_act_ids:
                    acc['actions'].append(act)

            # Merge comments
            existing_cmt_ids = {c['id'] for c in acc.get('comments', [])}
            for cmt in fa.get('comments', []):
                if cmt['id'] not in existing_cmt_ids:
                    acc['comments'].append(cmt)

            # Ensure stage matches Faezeh's operational dispatch
            if fa.get('stage') == 'outreach':
                acc['stage'] = 'outreach'
                acc['csuiteStatus'] = 'نامه فیزیکی ارسال شد (در حال مذاکره فعال)'

    with open(data_json_path, 'w', encoding='utf-8') as f:
        json.dump(master, f, ensure_ascii=False, indent=2)

    print('data.json merged and shortcodes populated for all accounts.')

if __name__ == '__main__':
    merge_and_fix()
