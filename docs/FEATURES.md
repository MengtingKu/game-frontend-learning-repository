# FEATURES

狀態圖例：✅ 完成　🚧 進行中／部分完成　⬜ 未開始

## Scene 骨架

| 功能 | 狀態 | 行為描述 |
|------|------|----------|
| BootScene | ✅ | 不載入任何素材，`create()` 印出 `console.log('Boot')` 後立即 `this.scene.start('PreloadScene')`。用途是預留給未來「載入 loading 畫面本身所需的最小素材」（目前尚未這麼做）。 |
| PreloadScene | 🚧 | `preload()` 目前載入的是 **Phaser 官方教學 demo 素材**（`sky`、`ground`=platform、`star`、`bomb` 四張圖 + `dude` spritesheet，32×48 frame），並非 slot game 的符號素材。`create()` 直接切到 `GameScene`，無 loading bar / 進度顯示。 |
| GameScene | 🚧 | 目前是 Phaser 官方星星收集教學的 TypeScript Class 移植版（見下方「星星收集 Demo」），尚未包含任何老虎機邏輯。 |
| UIScene | ⬜ | 空檔案，未加入 `main.ts` 的 `scene: [...]` 列表，尚未被使用。 |

## 星星收集 Demo（GameScene 現況）

這是目前唯一可玩的完整迴圈，行為描述：

- **移動**：方向鍵左右控制玩家 `velocityX = ±160`，並播放對應 `left`/`right` 動畫；放開時 `velocityX = 0` 並播放 `turn`。
- **跳躍**：方向鍵上，且 `player.body.touching.down` 為真時，`velocityY = -330`。
- **收集星星**：玩家與任一星星 overlap 時觸發 `collectStar`：該星星 `disableBody(true, true)`（停用物理並隱藏），分數 `+10` 並更新 `scoreText`。
- **星星重生與炸彈生成**：當 12 顆星星全部被收集（`countActive(true) === 0`）時，所有星星重新 `enableBody(true, randomX, 0, true, true)` 並重設彈跳係數；同時依玩家目前位置在畫面另一側的隨機 x 座標生成一顆新炸彈（`setBounce(1)`、隨機水平速度）。
- **遊戲結束**：玩家與任一炸彈 collide 時觸發 `hitBomb`：暫停整個物理模擬（`this.physics.pause()`）、玩家變紅（`setTint(0xff0000)`）、播放 `turn` 動畫、設定 `gameOver = true`。`update()` 於下一幀起直接 return，畫面凍結。
- **無重新開始機制**：目前遊戲結束後沒有 restart 按鈕或畫面提示，需重新整理頁面。

## Slot Game 核心玩法

| 功能 | 狀態 | 說明 |
|------|------|------|
| Reel（捲軸）視覺與旋轉 | ⬜ | `src/objects/Reel.ts` 為空檔案 |
| Symbol（符號）定義與顯示 | ⬜ | `src/objects/Symbol.ts` 為空檔案 |
| Spin / Stop 流程 | ⬜ | 尚未設計狀態機 |
| Payline（連線）判定 | ⬜ | `src/objects/WinLine.ts` 為空檔案 |
| Bet（下注）UI 與邏輯 | ⬜ | `src/objects/Button.ts`、`src/ui/` 皆為空 |
| 音效（Spin/Win/Lose） | ⬜ | `src/managers/AudioManager.ts` 為空檔案 |
| 動畫管理（GSAP 整合） | ⬜ | `src/managers/AnimationManager.ts` 為空檔案；`package.json` 已安裝 GSAP 但程式碼尚未 import 使用 |
| 遊戲狀態管理 | ⬜ | `src/managers/GameManager.ts` 為空檔案 |
| 素材圖集（TexturePacker atlas） | ⬜ | `public/assets/atlas/` 目錄為空，流程規劃於 `notes/day00.md` |
| 型別定義 | ⬜ | `src/types/index.ts` 為空檔案 |

## 下一步（依 notes/day01.md「明日預告」）

1. 三個 Scene 職責分離（BootScene/PreloadScene/GameScene 各司其職）— ✅ 已於 2026-07-20 commit `9b5b00b` 完成。
2. 運用目前學到的 Phaser 知識，開始進入實際遊戲核心（依 `notes/day01.md` 原文為「棋牌大老二」，與 `ideas/2026-07-20.md`、`game-analysis/template.md` 的探索方向一致，可能會與 slot game 並行/交叉學習）。

## Big Two（`projects/big-two/`）

獨立的新專案，比照 `slot-game` 的骨架建立，目前只到能執行的空殼階段。

| 功能 | 狀態 | 說明 |
|------|------|------|
| 專案骨架 | ✅ | `package.json`/`tsconfig.json`/`vite.config.ts`/`index.html` 已建立，dev port 固定為 `5174` |
| BootScene → PreloadScene → GameScene | ✅ | 比照 slot-game 的 Scene 骨架；`GameScene` 目前僅顯示 `"Big Two - Coming Soon"` placeholder 文字，`preload()` 尚無素材可載入 |
| 遊戲規則（發牌/出牌/AI 回合/結算） | ⬜ | 尚未設計，需另開專屬的 brainstorm session |
| 素材與 UI | ⬜ | 尚未開始 |
