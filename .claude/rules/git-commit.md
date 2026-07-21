# Git Commit 規則

## 格式

```
<type>: <emoji> dayNN <描述>
```

- `dayNN` 對應該次改動所屬的學習日（`notes/dayNN.md`），若改動與特定天數無關（例如純 repo 維護），可省略 `dayNN`。
- 描述使用中文，簡短說明「做了什麼」，不需要句號結尾。

## Type / Emoji 對照表

| type | emoji | 用途 | 範例（本 repo 既有 commit） |
|------|-------|------|------------------------------|
| feat | 🎸 | 新增功能或學習進度推進（目前所有 commit 皆為此類型） | `feat: 🎸 day01 用官網範例認識 phaser 架構和生命週期` |
| fix | 🐛 | 修正 bug | `fix: 🐛 dayNN 修正 xxx` |
| refactor | 💡 | 重構，行為不變 | `refactor: 💡 dayNN 拆分 xxx` |
| docs | ✏️ | 純文件異動（notes、docs、README） | `docs: ✏️ 補充 ARCHITECTURE.md` |
| chore | 🧹 | 雜項維護（設定檔、依賴升級） | `chore: 🧹 升級 vite` |

> 目前 repo 三筆歷史 commit 皆為 `feat: 🎸`，此對照表的其他 type/emoji 為延伸建議，非既有慣例，可依實際使用調整。

## 禁止 commit 的檔案

依 `.gitignore`（`projects/slot-game/.gitignore`）：`node_modules`、`dist`、`dist-ssr`、`*.log`、`.DS_Store`、`.vscode/*`（除 `extensions.json`）、`.idea`。額外注意：不要 commit `.env`（目前專案無此檔案，若未來新增需補進 `.gitignore`）。

## Commit 前檢查

- 確認 `notes/dayNN.md` 是否需要同步更新（本 repo 的慣例是程式碼與筆記同一次 commit 一起送出）。
- 大量二進位素材（`public/assets/**`）異動時，commit message 應說明素材用途，方便未來追溯。
