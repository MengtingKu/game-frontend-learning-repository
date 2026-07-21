#!/bin/bash
# Notification hook: macOS-only (osascript). No-op on Windows/Linux so the
# hook never errors out on machines without osascript.
if [[ "$(uname)" == "Darwin" ]]; then
  osascript -e 'display notification "Claude Code 需要你的確認" with title "Claude Code"'
fi

exit 0
