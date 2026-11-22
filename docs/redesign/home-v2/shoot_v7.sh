#!/usr/bin/env bash
# Screenshots for the home v2 comparison. Serves dist/ briefly, then stops the server.
cd /home/aria/projects/portfolio || exit 1
O=docs/redesign/home-v2
python3 -m http.server 4331 --bind 127.0.0.1 --directory dist >/dev/null 2>&1 &
SRV=$!
sleep 1.5
shot() { timeout 120 chromium --headless=new --user-data-dir=/tmp/v2shot-profile --no-first-run --disable-gpu --hide-scrollbars --window-size="$1" --screenshot="$O/$2" "http://127.0.0.1:4331/$3" 2>/dev/null; }


shot 1440,2300 board_v7.png ""
shot 390,4600 board-phone_v7.png ""
kill $SRV
ls -la $O
echo SHOTS_DONE
