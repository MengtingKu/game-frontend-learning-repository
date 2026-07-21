# CLAUDE.md

## 專案概述

2026 Game Frontend Learning Repository — 個人 HTML5 遊戲前端學習 repo，以每日筆記（`notes/dayXX.md`）記錄學習歷程，並在 `projects/slot-game/` 實作一款以 **Phaser 3 + TypeScript + Vite** 開發的老虎機（Slot Game）。目前進度為 Day01：已將 Phaser 官方星星收集教學拆成 `BootScene → PreloadScene → GameScene` 三個 Class Scene，尚未進入真正的 slot game 邏輯（`managers/`、`objects/`、`config/`、`types/` 仍是空殼）。

## 常用指令

所有指令需在 `projects/slot-game/` 目錄下執行：

```bash
cd projects/slot-game
npm install       # 安裝依賴
npm run dev       # 啟動開發伺服器 http://localhost:5173
npm run build     # tsc 型別檢查 + vite build
npm run preview   # 預覽 production build
```

## 關鍵規則

- 這是學習型 repo，**不要**為了「完整性」提前把 `managers/`、`objects/`、`types/` 的空檔案填滿——依照 `notes/dayXX.md` 當天目標循序漸進實作。
- Scene 的回呼函式（如 collider/overlap callback）一律用箭頭屬性函式（`private xxx = (...) => {}`）綁定 `this`，避免 Phaser callback context 遺失問題（day01 已踩過的坑，見 `notes/day01.md`）。
- 素材路徑：`public/assets/` 下有 `raw/`（原始 PNG）、`atlas/`（TexturePacker 產出的圖集）、`demo/`（Phaser 官方教學素材，屬暫時性，未來會被 slot game 素材取代）。`preload()` 用相對路徑載入（如 `'assets/demo/sky.png'`），對應 Vite 的 `public/` 根目錄。
- Commit message 沿用既有慣例：`feat: 🎸 dayNN <描述>`，詳見 `.claude/rules/git-commit.md`。
- 功能開發若牽涉多步驟規劃，使用 `docs/plans/` 記錄計畫；完成後移至 `docs/plans/archive/`。

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
