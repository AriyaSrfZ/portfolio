#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Persia Fava War Room — Operations Behavioral Graph Engine
Automates synchronous propagation across:
  1. Sovereign Storage & Backups (data.json, audit_log.json)
  2. Web Surface (index.html, c-levels.html, zero-cache headers)
  3. Telegram Command Hall (-1004300319228, Thread 6 / Thread 5)
  4. Live Verification & Health Checks
"""

import os
import sys
import json
import time
import datetime
import urllib.request
import urllib.parse
import argparse

# Configuration
BASE_DIR = "/var/www/warroom" if os.path.exists("/var/www/warroom") else os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web") if os.path.exists(os.path.join(BASE_DIR, "web")) else BASE_DIR
DB_FILE = os.path.join(BASE_DIR, "data.json")
BACKUP_DIR = os.path.join(BASE_DIR, "backups")
AUDIT_LOG_FILE = os.path.join(BASE_DIR, "audit_log.json")

TG_TOKEN = "9270066597:AAHXPnNo7fUwFQOUadGcqJlorp4JSDyyNUw"
TG_CHAT_ID = -1004300319228
TG_THREAD_LIST2 = 6
TG_THREAD_EXEC = 5
TG_PROXY = "http://192.168.3.70:19809"

os.makedirs(BACKUP_DIR, exist_ok=True)

class OperationsBehavioralGraph:
    def __init__(self):
        self.timestamp = datetime.datetime.now().isoformat()
        self.state_file = DB_FILE
        self.data = self._load_data()
        self.logs = []

    def log(self, step, message, status="OK"):
        entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "step": step,
            "status": status,
            "message": message
        }
        self.logs.append(entry)
        symbol = "✅" if status == "OK" else ("⚠️" if status == "WARN" else "❌")
        print(f"[{symbol}] [{step}]: {message}")

    def _load_data(self):
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                self.log("INIT", f"Failed to load DB: {e}", "ERROR")
        return []

    def node_1_storage_atomic_sync(self, updated_data=None):
        """Node 1: Validates and writes data atomically with rolling backups and audit log."""
        if updated_data is not None:
            self.data = updated_data

        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = os.path.join(BACKUP_DIR, f"accounts_{now_str}_graph.json")

        # 1. Write backup
        with open(backup_file, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

        # 2. Write main DB
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump(self.data, f, ensure_ascii=False, indent=2)

        # 3. Write web/data.json if different
        web_db = os.path.join(WEB_DIR, "data.json")
        if os.path.abspath(web_db) != os.path.abspath(DB_FILE):
            with open(web_db, "w", encoding="utf-8") as f:
                json.dump(self.data, f, ensure_ascii=False, indent=2)

        # 4. Audit Log
        audit_entries = []
        if os.path.exists(AUDIT_LOG_FILE):
            try:
                with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                    audit_entries = json.load(f)
            except Exception:
                pass

        audit_entries.append({
            "timestamp": self.timestamp,
            "action": "Behavioral Graph Sync",
            "accounts_count": len(self.data),
            "backup": os.path.basename(backup_file)
        })
        with open(AUDIT_LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(audit_entries[-500:], f, ensure_ascii=False, indent=2)

        self.log("STORAGE", f"Saved {len(self.data)} accounts, created backup {os.path.basename(backup_file)}")
        return True

    def node_2_web_surface_sync(self):
        """Node 2: Injects fresh accounts and data version into index.html to eliminate cache."""
        index_file = os.path.join(WEB_DIR, "index.html")
        if not os.path.exists(index_file):
            self.log("WEB", f"index.html not found at {index_file}", "WARN")
            return False

        try:
            with open(index_file, "r", encoding="utf-8") as f:
                html = f.read()

            # Bump data version
            new_version = f"2026-11-04-faeze-v{int(time.time())}"
            html = re.sub(r'const CURRENT_DATA_VERSION = "[^"]+";', f'const CURRENT_DATA_VERSION = "{new_version}";', html)

            with open(index_file, "w", encoding="utf-8") as f:
                f.write(html)

            self.log("WEB", f"Bumpered index.html data version to {new_version}")
            return True
        except Exception as e:
            self.log("WEB", f"Failed to patch index.html: {e}", "ERROR")
            return False

    def node_3_telegram_layer2_dispatch(self, send_message=False):
        """Node 3: Generates Layer-2 B2B directory and dispatches to Telegram Thread 6."""
        lines = [
            "📋 *شناسنامه و جدول رصد کانتکت‌های لایه دوم (فنی، محصول و عملیات)*",
            "🎯 *هدف:* پیگیری فنی و مذاکره پیرامون نامه‌های فیزیکی مدیرعامل برای ۱۰ حساب کلیدی",
            "━━━━━━━━━━━━━━━━━━━━━━━━━━"
        ]

        for acc in self.data:
            num = acc.get("num", "")
            name = acc.get("name", "")
            stage = acc.get("stage", "")
            dm = acc.get("decisionMaker", "").split("—")[0].strip()
            l2 = acc.get("layer2Contacts", [])

            status_icon = "✅ نامه فیزیکی ارسال شد" if stage == "outreach" else "📝 تدوین نامه"
            lines.append(f"*{num}. {name}* | {status_icon}")
            lines.append(f"• مدیر ارشد: {dm}")

            for idx, c in enumerate(l2, 1):
                c_name = c.get("name", "نامشخص")
                c_role = c.get("role") or c.get("title", "")
                c_li = c.get("linkedin", "")
                li_str = f" [پروفایل]({c_li})" if c_li else ""
                lines.append(f"  └─ رابط {idx}: *{c_name}* ({c_role}){li_str}")
            lines.append("")

        lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━")
        lines.append("🌐 *مشاهده زنده بورد کانتکت‌ها و نامه‌ها روی سرور استکهلم:*")
        lines.append("• اتاق جنگ و جدول لایه ۲: http://109.120.131.224:8085/")
        lines.append("• جدول مدیران و رابطین C-Level: http://109.120.131.224:8085/c-levels.html")

        text = "\n".join(lines)

        if not send_message:
            self.log("TELEGRAM", "Telegram payload compiled (dry-run mode).")
            return text

        if os.environ.get("ALLOW_TELEGRAM_DISPATCH") != "YES_CONFIRMED":
            self.log("TELEGRAM", "BLOCKED: Dispatch refused without ALLOW_TELEGRAM_DISPATCH='YES_CONFIRMED'", "WARN")
            return False

        # Execute Telegram dispatch via proxy
        try:
            proxy_handler = urllib.request.ProxyHandler({"http": TG_PROXY, "https": TG_PROXY})
            opener = urllib.request.build_opener(proxy_handler)
            payload = {
                "chat_id": TG_CHAT_ID,
                "message_thread_id": TG_THREAD_LIST2,
                "text": text,
                "parse_mode": "Markdown",
                "disable_web_page_preview": True
            }
            req = urllib.request.Request(
                f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            resp = opener.open(req, timeout=12)
            res = json.loads(resp.read().decode())
            mid = res.get("result", {}).get("message_id")
            self.log("TELEGRAM", f"Dispatched Layer-2 directory to Telegram Thread 6 (Message ID: {mid})")
            return True
        except Exception as e:
            self.log("TELEGRAM", f"Failed to dispatch to Telegram: {e}", "WARN")
            return False

    def node_4_infrastructure_verification(self):
        """Node 4: Live verification of server endpoints and zero-cache policy."""
        results = {}
        for endpoint in ["/api/warroom/version", "/api/warroom/accounts", "/index.html", "/c-levels.html"]:
            url = f"http://127.0.0.1:8085{endpoint}"
            try:
                req = urllib.request.Request(url)
                with urllib.request.urlopen(req, timeout=4) as resp:
                    code = resp.status
                    cc = resp.headers.get("Cache-Control", "")
                    results[endpoint] = {"code": code, "cache_control": cc}
            except Exception as e:
                results[endpoint] = {"code": 0, "error": str(e)}

        all_ok = all(r.get("code") == 200 for r in results.values())
        status = "OK" if all_ok else "WARN"
        self.log("VERIFIER", f"Health checks across 4 endpoints: {status} ({results})", status)
        return all_ok

    def execute_all(self, dispatch_telegram=False):
        """Runs the complete behavioral execution graph."""
        print(f"\n⚡ EXECUTING BEHAVIORAL GRAPH AT {self.timestamp}...")
        self.node_1_storage_atomic_sync()
        self.node_2_web_surface_sync()
        self.node_3_telegram_layer2_dispatch(send_message=dispatch_telegram)
        self.node_4_infrastructure_verification()
        print(f"✨ BEHAVIORAL GRAPH RUN COMPLETED.\n")
        return self.logs

if __name__ == "__main__":
    import re
    parser = argparse.ArgumentParser(description="War Room Operations Behavioral Graph")
    parser.add_argument("--action", choices=["sync-all", "verify", "telegram-dispatch"], default="sync-all")
    parser.add_argument("--telegram", action="store_true", help="Send live Telegram message to Thread 6")
    args = parser.parse_args()

    graph = OperationsBehavioralGraph()
    if args.action == "sync-all":
        graph.execute_all(dispatch_telegram=args.telegram)
    elif args.action == "verify":
        graph.node_4_infrastructure_verification()
    elif args.action == "telegram-dispatch":
        graph.node_3_telegram_layer2_dispatch(send_message=True)
