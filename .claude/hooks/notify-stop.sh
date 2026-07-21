#!/bin/bash
# Stop hook: macOS-only (osascript + afplay). No-op on Windows/Linux so the
# hook never errors out on machines without these binaries.
if [[ "$(uname)" == "Darwin" ]]; then
  osascript -e 'display notification "任務已完成" with title "Claude Code"'
  afplay /System/Library/Sounds/Glass.aiff
fi

exit 0
