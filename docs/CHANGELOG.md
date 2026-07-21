# CHANGELOG

## 2026-07-20 (day01) — `9b5b00b`

feat: 🎸 day01 把在 main.ts 的內容拆到 scene 各司其職

- 將原本塞在 `main.ts` 的星星收集教學邏輯拆分為 `BootScene`、`PreloadScene`、`GameScene` 三個獨立 Class Scene。
- `main.ts` 收斂為只負責組裝 `GameConfig` 與註冊 Scene 列表。

## 2026-07-20 (day01) — `1b8e62a`

feat: 🎸 day01 用官網範例認識 phaser 架構和生命週期

- 導入 Phaser 官方星星收集 + 避炸彈教學範例，改寫為 TypeScript Class 架構。
- 新增 demo 素材（`sky`/`platform`/`star`/`bomb`/`dude`）至 `public/assets/demo/`。
- 建立 `notes/template.md`、`game-analysis/template.md`，新增 `ideas/2026-07-20.md`。

## 2026-07-20 (day00) — `566ad5e`

feat: 🎸 HTML5 Game Frontend 開發環境

- 建立 repo 骨架：`projects/slot-game/`（Vite + TypeScript + Phaser 3 + GSAP）。
- 預留 `managers/`、`objects/`、`scenes/`、`config/`、`types/` 空檔案結構。
- 新增 `README.md`、`notes/day00.md`。
