#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Persia Fava War Room — Unified Sovereign Backend & Web Server
Listens on Port 8085 (Web + API) and Port 3001 (API Compatibility)
Enforces strict Zero-Cache headers on all HTML, JSON, and API endpoints.
"""

import os
import json
import datetime
import mimetypes
import threading
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_DIR = os.path.join(BASE_DIR, "web") if os.path.exists(os.path.join(BASE_DIR, "web")) else BASE_DIR
DB_FILE = os.path.join(BASE_DIR, "data.json")
SHOWCASE_FILE = os.path.join(BASE_DIR, "showcases.json")
AUDIT_LOG_FILE = os.path.join(BASE_DIR, "audit_log.json")
BACKUP_DIR = os.path.join(BASE_DIR, "backups")

os.makedirs(BACKUP_DIR, exist_ok=True)

# Register custom MIME types
mimetypes.init()
mimetypes.add_type("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx")
mimetypes.add_type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".xlsx")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")

for fpath, default_val in [(DB_FILE, []), (SHOWCASE_FILE, {}), (AUDIT_LOG_FILE, [])]:
    if not os.path.exists(fpath):
        with open(fpath, "w", encoding="utf-8") as f:
            json.dump(default_val, f, ensure_ascii=False, indent=2)

class WarroomHandler(BaseHTTPRequestHandler):
    server_version = "WarRoomSovereign/4.0"

    def _send_common_headers(self, content_type="application/json; charset=utf-8"):
        self.send_header("Content-Type", content_type)
        # Strict zero-cache headers to eliminate stale browser cache
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        # CORS
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-User-Name, X-Client-IP, Cache-Control, Pragma")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Content-Length", "0")
        self._send_common_headers()
        self.end_headers()

    def do_HEAD(self):
        self.send_response(200)
        self._send_common_headers()
        self.end_headers()

    def get_client_ip(self):
        forwarded = self.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        cf_ip = self.headers.get("CF-Connecting-IP")
        if cf_ip:
            return cf_ip.strip()
        real_ip = self.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        return self.client_address[0]

    def send_json(self, status_code, data_bytes):
        self.send_response(status_code)
        self.send_header("Content-Length", str(len(data_bytes)))
        self._send_common_headers("application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(data_bytes)

    def serve_static_file(self, raw_path):
        parsed = urlparse(raw_path)
        clean_path = unquote(parsed.path)
        if clean_path in ["", "/"]:
            clean_path = "/index.html"

        # Resolve path safely inside WEB_DIR
        target = os.path.normpath(os.path.join(WEB_DIR, clean_path.lstrip("/")))
        if not target.startswith(os.path.normpath(WEB_DIR)):
            self.send_json(403, b'{"error":"Forbidden"}')
            return

        if not os.path.exists(target) or os.path.isdir(target):
            # Try index.html inside directory if directory
            if os.path.isdir(target) and os.path.exists(os.path.join(target, "index.html")):
                target = os.path.join(target, "index.html")
            else:
                self.send_json(404, b'{"error":"Static file not found"}')
                return

        ctype, _ = mimetypes.guess_type(target)
        if not ctype:
            ctype = "application/octet-stream"
        if ("text" in ctype or "javascript" in ctype or "json" in ctype) and "charset" not in ctype:
            ctype += "; charset=utf-8"

        try:
            with open(target, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Length", str(len(content)))
            self._send_common_headers(ctype)
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            err = json.dumps({"error": str(e)}).encode("utf-8")
            self.send_json(500, err)

    def do_GET(self):
        path = urlparse(self.path).path
        client_ip = self.get_client_ip()

        # 1. API: IP detection
        if path == "/api/warroom/ip":
            payload = json.dumps({"ip": client_ip}).encode("utf-8")
            self.send_json(200, payload)
            return

        # 2. API: System Version & Health
        if path in ["/api/warroom/version", "/api/warroom/health"]:
            payload = json.dumps({
                "status": "healthy",
                "version": "2026-11-04-faeze-v4",
                "server_time": datetime.datetime.now().isoformat(),
                "client_ip": client_ip
            }).encode("utf-8")
            self.send_json(200, payload)
            return

        # 3. API: Accounts Database
        if path in ["/api/warroom/accounts", "/api/warroom/accounts.json"]:
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    payload = f.read().encode("utf-8")
                self.send_json(200, payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        # 4. API: Showcases
        if path in ["/api/warroom/showcases", "/api/warroom/showcases.json"]:
            try:
                with open(SHOWCASE_FILE, "r", encoding="utf-8") as f:
                    payload = f.read().encode("utf-8")
                self.send_json(200, payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        # 5. API: Audit Log
        if path in ["/api/warroom/audit", "/api/warroom/audit.json"]:
            try:
                with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                    payload = f.read().encode("utf-8")
                self.send_json(200, payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        # 6. API: Backups list
        if path in ["/api/warroom/backups", "/api/warroom/backups.json"]:
            try:
                bks = sorted([f for f in os.listdir(BACKUP_DIR) if f.endswith(".json")], reverse=True)
                payload = json.dumps({"backups": bks[:30]}).encode("utf-8")
                self.send_json(200, payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        # 7. Fallback to Static File Serving
        self.serve_static_file(self.path)

    def do_PUT(self):
        self.do_POST()

    def do_POST(self):
        path = urlparse(self.path).path
        client_ip = self.get_client_ip()
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        user_name = self.headers.get("X-User-Name", "کاربر ناشناس")
        now_str = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

        if path in ["/api/warroom/accounts", "/api/warroom/accounts.json"]:
            try:
                data = json.loads(post_data.decode("utf-8"))
                safe_user = "".join(c for c in user_name if c.isalnum() or c in ("-", "_", " ")).strip().replace(" ", "_") or "user"
                backup_file = os.path.join(BACKUP_DIR, f"accounts_{now_str}_{safe_user}.json")
                with open(backup_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                # Write to authoritative DB_FILE
                with open(DB_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                # Also sync web/data.json if separate
                web_db = os.path.join(WEB_DIR, "data.json")
                if web_db != DB_FILE:
                    with open(web_db, "w", encoding="utf-8") as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)

                try:
                    with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                        logs = json.load(f)
                except Exception:
                    logs = []

                logs.append({
                    "user": user_name,
                    "ip": client_ip,
                    "timestamp": datetime.datetime.now().isoformat(),
                    "action": "Sync accounts database",
                    "accounts_count": len(data) if isinstance(data, list) else 0,
                    "backup": os.path.basename(backup_file)
                })
                with open(AUDIT_LOG_FILE, "w", encoding="utf-8") as f:
                    json.dump(logs[-500:], f, ensure_ascii=False, indent=2)

                res_payload = json.dumps({
                    "status": "ok",
                    "user": user_name,
                    "ip": client_ip,
                    "count": len(data) if isinstance(data, list) else 0,
                    "backup": os.path.basename(backup_file),
                    "timestamp": datetime.datetime.now().isoformat()
                }).encode("utf-8")
                self.send_json(200, res_payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        if path in ["/api/warroom/showcases", "/api/warroom/showcases.json"]:
            try:
                data = json.loads(post_data.decode("utf-8"))
                backup_file = os.path.join(BACKUP_DIR, f"showcases_{now_str}.json")
                with open(backup_file, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                with open(SHOWCASE_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)

                try:
                    with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                        logs = json.load(f)
                except Exception:
                    logs = []

                logs.append({
                    "user": user_name,
                    "ip": client_ip,
                    "timestamp": datetime.datetime.now().isoformat(),
                    "action": "Sync showcase sessions",
                    "sessions_count": len(data.get("sessions", {})) if isinstance(data, dict) else 0
                })
                with open(AUDIT_LOG_FILE, "w", encoding="utf-8") as f:
                    json.dump(logs[-500:], f, ensure_ascii=False, indent=2)

                res_payload = json.dumps({
                    "status": "ok",
                    "user": user_name,
                    "ip": client_ip
                }).encode("utf-8")
                self.send_json(200, res_payload)
            except Exception as e:
                err_payload = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_json(500, err_payload)
            return

        self.send_json(404, b'{"error":"API endpoint not found"}')

def run_server(port):
    server = ThreadingHTTPServer(("0.0.0.0", port), WarroomHandler)
    print(f"🚀 Persia Fava War Room Sovereign Server running on port {port}...")
    server.serve_forever()

if __name__ == "__main__":
    # Run port 3001 in background daemon thread for legacy/internal tools
    t = threading.Thread(target=run_server, args=(3001,), daemon=True)
    t.start()
    # Run port 8085 in main thread (Unified Sovereign Web & API)
    run_server(8085)
