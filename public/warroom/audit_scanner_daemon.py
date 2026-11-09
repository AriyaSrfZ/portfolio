#!/usr/bin/env python3
"""
Persia Fava B2B War Room — Autonomous Audit Scanner & Auto-Fix Daemon
Runs on Stockholm VPS (109.120.131.224) standing by 24/7.
Zero LLM tokens burned. Continuous background monitoring of Faezeh's audit chat.
"""

import os
import sys
import time
import json
import logging
import urllib.request
import urllib.error
import subprocess
from datetime import datetime

# Configuration
FIREBASE_CHAT_URL = "https://gen-lang-client-0338096411-default-rtdb.firebaseio.com/warroom/faezeh_chat"
FIREBASE_ACCOUNTS_URL = "https://gen-lang-client-0338096411-default-rtdb.firebaseio.com/warroom/accounts.json"
DATA_JSON_PATH = "/var/www/portfolio/warroom/data.json"
WEB_DATA_JSON_PATH = "/var/www/warroom/web/data.json"
GENERATE_C_LEVELS_PATH = "/var/www/portfolio/warroom/generate_c_levels.py"
GENERATE_LIST2_PATH = "/var/www/portfolio/warroom/generate_list2.py"
LOG_FILE = "/var/www/warroom/audit_scanner.log"

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)

def log(msg):
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}")
    logging.info(msg)

def fetch_chat_messages():
    try:
        url = f"{FIREBASE_CHAT_URL}.json"
        req = urllib.request.Request(url, headers={"User-Agent": "WarroomAuditDaemon/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                data = resp.read().decode("utf-8")
                if data and data != "null":
                    return json.loads(data)
    except Exception as e:
        log(f"Fetch chat messages err: {e}")
    return {}

def update_message_in_firebase(msg_key, updates):
    try:
        url = f"{FIREBASE_CHAT_URL}/{msg_key}.json"
        data_bytes = json.dumps(updates, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(url, data=data_bytes, method="PATCH", headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        log(f"Update message {msg_key} err: {e}")
    return False

def push_accounts_to_firebase(accounts_data):
    try:
        data_bytes = json.dumps(accounts_data, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(FIREBASE_ACCOUNTS_URL, data=data_bytes, method="PUT", headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        log(f"Push accounts to firebase err: {e}")
    return False

def regenerate_and_deploy():
    try:
        if os.path.exists(GENERATE_C_LEVELS_PATH):
            subprocess.run([sys.executable, GENERATE_C_LEVELS_PATH], check=True, cwd="/var/www/portfolio/warroom")
        if os.path.exists(GENERATE_LIST2_PATH):
            subprocess.run([sys.executable, GENERATE_LIST2_PATH], check=True, cwd="/var/www/portfolio/warroom")
        # Copy to /var/www/warroom/web/
        os.system("cp /var/www/portfolio/warroom/c-levels.html /var/www/warroom/web/c-levels.html 2>/dev/null")
        os.system("cp /var/www/portfolio/warroom/list2.html /var/www/warroom/web/list2.html 2>/dev/null")
        os.system("cp /var/www/portfolio/warroom/index.html /var/www/warroom/web/index.html 2>/dev/null")
        os.system("cp /var/www/portfolio/warroom/data.json /var/www/warroom/web/data.json 2>/dev/null")
        os.system("chown -R aria:aria /var/www/portfolio/warroom /var/www/warroom/web 2>/dev/null")
        log("Successfully regenerated HTML files and deployed to both web targets.")
        return True
    except Exception as e:
        log(f"Regenerate and deploy err: {e}")
        return False

def process_single_message(key, msg):
    text = msg.get("text", "")
    acc_id = msg.get("accountId", "all")
    acc_name = msg.get("accountName", "")
    sender = msg.get("sender", "تیم ممیزی")
    cat = msg.get("category", "general_note")

    log(f"Processing message {key} from {sender} for account [{acc_name}]: {text[:80]}...")

    # Load current accounts
    if not os.path.exists(DATA_JSON_PATH):
        log(f"Data file {DATA_JSON_PATH} not found.")
        return

    with open(DATA_JSON_PATH, "r", encoding="utf-8") as f:
        accounts = json.load(f)

    COMPANY_KEYWORDS = {
        "acc-1": ["طلاین", "taline", "tlyn"],
        "acc-2": ["ترابرنت", "tarabarnet"],
        "acc-3": ["زرپی", "zarpay"],
        "acc-4": ["اوبار", "ubar"],
        "acc-5": ["سندپرداز", "sanadpardaz"],
        "acc-6": ["دیدگاه", "چارگون", "chargoon"],
        "acc-7": ["گلدیکا", "goldika"],
        "acc-8": ["قسطا", "qesta", "ghesta"],
        "acc-9": ["وال گلد", "وال‌گلد", "والکس", "wallgold", "wallex"],
        "acc-10": ["پستکس", "پست بار", "پست‌بار", "postex", "postbar"],
        "acc-11": ["اکوگلد", "اکو گلد", "ecogold"],
        "acc-12": ["پادیز", "پادیس", "padiz"],
        "acc-13": ["اوامپیفینکس", "او ام پی فینکس", "او‌ام‌پی‌فینکس", "ompfinex", "omp finex"],
        "acc-14": ["اکوتراست", "اکو تراست", "ecotrust"],
        "acc-15": ["ریتون", "reytoon", "riton"],
        "acc-16": ["خودرو۴۵", "خودرو 45", "khodro45"],
        "acc-17": ["پولنو", "پول نو", "pooleno"],
        "acc-18": ["سیموتک", "simotech", "سیمرغ تجارت", "stts"],
        "acc-19": ["تبدیل", "tabdeal"],
        "acc-20": ["بیدارز", "bidarz"]
    }

    target_acc = None
    if acc_id and acc_id != "all":
        target_acc = next((a for a in accounts if a.get("id") == acc_id), None)
    elif acc_name and acc_name != "عمومی":
        target_acc = next((a for a in accounts if a.get("name", "").strip() in acc_name or acc_name.strip() in a.get("name", "")), None)

    # Smart fallback: auto-detect company mentioned in text
    if not target_acc and text:
        text_lower = text.lower()
        for aid, kw_list in COMPANY_KEYWORDS.items():
            if any(kw in text_lower for kw in kw_list):
                target_acc = next((a for a in accounts if a.get("id") == aid), None)
                if target_acc:
                    acc_name = target_acc.get("name", "")
                    log(f"Auto-resolved target account from text keywords: [{acc_name}] (ID: {aid})")
                    break

    resolution_note = ""
    updated = False

    # Check for specific actionable corrections
    if target_acc:
        # Add comment/audit entry to account
        if "comments" not in target_acc:
            target_acc["comments"] = []
        
        now_fa = datetime.now().strftime("%H:%M — ۱۴۰۵/۰۸/%d")
        target_acc["comments"].append({
            "id": f"com-audit-{int(time.time()*1000)}",
            "author": f"ممیزی ({sender})",
            "text": text,
            "time": now_fa
        })

        # Add action log
        if "actions" not in target_acc:
            target_acc["actions"] = []
        target_acc["actions"].append({
            "id": f"act-audit-{int(time.time()*1000)}",
            "type": "audit",
            "performer": sender,
            "ip": "109.120.131.224",
            "text": f"ثبت یادداشت ممیزی و تصحیح اطلاعات: {text[:100]}",
            "time": now_fa,
            "timestamp": int(time.time()*1000)
        })

        # Auto-parse website updates
        import re
        new_web = msg.get("newWebsite")
        if not new_web:
            web_matches = re.findall(r"https?://(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)", text)
            for w in web_matches:
                if "linkedin.com" not in w:
                    new_web = w.rstrip(").,;")
                    break
        if new_web:
            target_acc["website"] = new_web
            resolution_note += f"آدرس وب‌سایت به {new_web} به‌روزرسانی شد. "
            updated = True

        # Auto-parse linkedin updates
        new_li = msg.get("newLinkedin")
        if not new_li:
            li_matches = re.findall(r"https?://(?:www\.)?linkedin\.com/[^\s]+", text)
            if li_matches:
                new_li = li_matches[0].rstrip(").,;")
        if new_li:
            target_acc["linkedin"] = new_li
            resolution_note += f"پیوند لینکدین به {new_li} به‌روزرسانی شد. "
            updated = True

        # Auto-parse phone updates
        new_phone = msg.get("newPhone")
        if not new_phone:
            phones = re.findall(r"(?:021-?\d{8}|۰۲۱-?[۰-۹]{۸}|\b0\d{10}\b)", text)
            if phones and ("تلفن" in text or "شماره" in text or "تماس" in text):
                new_phone = phones[0]
        if new_phone:
            target_acc["phone"] = new_phone
            resolution_note += f"شماره تلفن به {new_phone} به‌روزرسانی شد. "
            updated = True

        # Auto-parse CEO update
        new_ceo = msg.get("newCeo")
        if new_ceo:
            target_acc["decisionMaker"] = new_ceo
            resolution_note += f"نام تصمیم‌گیرنده ارشد به {new_ceo} اصلاح گردید. "
            updated = True

        if not resolution_note:
            resolution_note = f"یادداشت ممیزی برای «{target_acc.get('name')}» در پرونده ثبت و به مسئول پیگیری ارجاع شد."
            updated = True
    else:
        resolution_note = "یادداشت عمومی ممیزی در آرشیو لاگ سیستم ثبت گردید و در پایش مستمر قرار گرفت."

    # Save to file
    with open(DATA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(accounts, f, ensure_ascii=False, indent=2)

    with open(WEB_DATA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(accounts, f, ensure_ascii=False, indent=2)

    # Regenerate & Deploy
    regenerate_and_deploy()

    # Push to Firebase accounts
    push_accounts_to_firebase(accounts)

    # Mark message as resolved
    update_message_in_firebase(key, {
        "status": "resolved",
        "resolutionNote": resolution_note.strip(),
        "resolvedAt": datetime.now().isoformat()
    })

    log(f"Message {key} resolved with note: {resolution_note}")

def run_loop():
    log("🚀 Persia Fava Autonomous Audit Scanner Daemon started.")
    while True:
        try:
            messages = fetch_chat_messages()
            if isinstance(messages, dict):
                for key, msg in messages.items():
                    if isinstance(msg, dict) and msg.get("status") == "pending":
                        process_single_message(key, msg)
        except Exception as e:
            log(f"Loop error: {e}")
        time.sleep(5)

if __name__ == "__main__":
    run_loop()
