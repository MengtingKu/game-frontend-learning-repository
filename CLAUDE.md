# CLAUDE.md

## 專案概述

2026 Game Frontend Learning Repository — 個人 HTML5 遊戲前端學習 repo，以每日筆記（`notes/dayXX.md`）記錄學習歷程。採「一個遊戲 = 一個獨立 Vite 專案」的模式，目前有 `projects/slot-game/`（以 **Phaser 3 + TypeScript + Vite** 開發的老虎機 Slot Game，進度為 Day01：已將 Phaser 官方星星收集教學拆成 `BootScene → PreloadScene → GameScene` 三個 Class Scene，尚未進入真正的 slot game 邏輯，`managers/`、`objects/`、`config/`、`types/` 仍是空殼）與 `projects/big-two/`（大老二，目前僅有 Scene 骨架，玩法未開始）。根目錄的 `index.html` 是列出所有遊戲專案的靜態 dashboard。

## 常用指令

每個遊戲都是獨立的 Vite 專案，指令需在對應的 `projects/<name>/` 目錄下執行：

```bash
cd projects/slot-game   # 或 cd projects/big-two
npm install       # 安裝依賴
npm run dev       # 啟動開發伺服器（slot-game: :5173，big-two: :5174）
npm run build     # tsc 型別檢查 + vite build
npm run preview   # 預覽 production build
```

想一次看到所有遊戲專案的進度與連結，直接用瀏覽器開啟根目錄的 `index.html`（純靜態 dashboard，不需要安裝或建置）。

## 關鍵規則

- 這是學習型 repo，**不要**為了「完整性」提前把 `managers/`、`objects/`、`types/` 的空檔案填滿——依照 `notes/dayXX.md` 當天目標循序漸進實作。
- Scene 的回呼函式（如 collider/overlap callback）一律用箭頭屬性函式（`private xxx = (...) => {}`）綁定 `this`，避免 Phaser callback context 遺失問題（day01 已踩過的坑，見 `notes/day01.md`）。
- 素材路徑：`public/assets/` 下有 `raw/`（原始 PNG）、`atlas/`（TexturePacker 產出的圖集）、`demo/`（Phaser 官方教學素材，屬暫時性，未來會被 slot game 素材取代）。`preload()` 用相對路徑載入（如 `'assets/demo/sky.png'`），對應 Vite 的 `public/` 根目錄。
- Commit message 沿用既有慣例：`feat: 🎸 dayNN <描述>`，詳見 `.claude/rules/git-commit.md`。
- 功能開發若牽涉多步驟規劃，使用 `docs/plans/` 記錄計畫；完成後移至 `docs/plans/archive/`。
- 新增遊戲一律建立新的 `projects/<name>/` 資料夾（比照 `slot-game`／`big-two` 的骨架），不要塞進既有專案的 `Phaser.Game` 實例；新增後記得在根目錄 dashboard（`index.html`）加卡片，並依 `docs/ARCHITECTURE.md` 的 port 對照表指定不衝突的 dev port。

## 詳細文件

- ./docs/README.md — 項目介紹與快速開始
- ./docs/ARCHITECTURE.md — 架構、目錄結構、Scene 生命週期與資料流
- ./docs/DEVELOPMENT.md — 開發規範、命名規則、計畫歸檔流程
- ./docs/FEATURES.md — 功能列表與完成狀態
- ./docs/TESTING.md — 測試規範與指南（目前現況：尚無測試框架）
- ./docs/CHANGELOG.md — 更新日誌

## 必要遵守項目

- `src/main.ts` 只負責組裝 `Phaser.Types.Core.GameConfig` 與註冊 Scene 列表，不寫遊戲邏輯。
- 新增 Scene 一律繼承 `Phaser.Scene`，建構子呼叫 `super('SceneKey')`，`SceneKey` 需與 `main.ts` 的 `scene: [...]` 註冊順序一致。
- 空的 `managers/`、`objects/`、`config/`、`types/` 檔案在真正需要時才實作，不要預先寫入未使用的抽象。
- `.claude/settings.json` 的 sandbox/hooks 設定為既有規範，異動前先確認不會破壞 `Edit|Write` 的 PreToolUse 保護。
