#!/bin/bash
# PreToolUse(Edit|Write) guard: block edits to sensitive/lock files.
FILE_PATH="$1"

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

case "$FILE_PATH" in
  *.env | *.env.*)
    echo "禁止編輯環境變數檔案：$FILE_PATH" >&2
    exit 2
    ;;
  *package-lock.json | *.lock)
    echo "禁止手動編輯 lock 檔案，請透過 npm/pnpm 指令更新：$FILE_PATH" >&2
    exit 2
    ;;
  *.sqlite | *.sqlite3 | *.db)
    echo "禁止直接編輯資料庫檔案：$FILE_PATH" >&2
    exit 2
    ;;
  */node_modules/* | */dist/* | */dist-ssr/*)
    echo "禁止編輯建置產物或依賴目錄：$FILE_PATH" >&2
    exit 2
    ;;
esac

exit 0
