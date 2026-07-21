# FEATURES

狀態圖例：✅ 完成　🚧 進行中／部分完成　⬜ 未開始

## Scene 骨架

| 功能 | 狀態 | 行為描述 |
|------|------|----------|
| BootScene | ✅ | 不載入任何素材，`create()` 印出 `console.log('Boot')` 後立即 `this.scene.start('PreloadScene')`。用途是預留給未來「載入 loading 畫面本身所需的最小素材」（目前尚未這麼做）。 |
| PreloadScene | 🚧 | `preload()` 目前載入的是 **Phaser 官方教學 demo 素材**（`sky`、`ground`=platform、`star`、`bomb` 四張圖 + `dude` spritesheet，32×48 frame）。`create()` 直接切到 `GameScene`，無 loading bar / 進度顯示。 |
| GameScene | 🚧 | 目前是 Phaser 官方星星收集教學的 TypeScript Class 移植版（見下方「星星收集 Demo」），客製化功能（結算畫面、加速）尚未開始。 |
| UIScene | ⬜ | 空檔案，未加入 `main.ts` 的 `scene: [...]` 列表，尚未被使用。 |

## 星星收集 Demo（GameScene 現況）

這是目前唯一可玩的完整迴圈，行為描述：

- **移動**：方向鍵左右控制玩家 `velocityX = ±160`，並播放對應 `left`/`right` 動畫；放開時 `velocityX = 0` 並播放 `turn`。
- **跳躍**：方向鍵上，且 `player.body.touching.down` 為真時，`velocityY = -330`。
- **收集星星**：玩家與任一星星 overlap 時觸發 `collectStar`：該星星 `disableBody(true, true)`（停用物理並隱藏），分數 `+10` 並更新 `scoreText`。
- **星星重生與炸彈生成**：當 12 顆星星全部被收集（`countActive(true) === 0`）時，所有星星重新 `enableBody(true, randomX, 0, true, true)` 並重設彈跳係數；同時依玩家目前位置在畫面另一側的隨機 x 座標生成一顆新炸彈（`setBounce(1)`、隨機水平速度）。
- **遊戲結束**：玩家與任一炸彈 collide 時觸發 `hitBomb`：暫停整個物理模擬（`this.physics.pause()`）、玩家變紅（`setTint(0xff0000)`）、播放 `turn` 動畫、設定 `gameOver = true`。`update()` 於下一幀起直接 return，畫面凍結。
- **無重新開始機制**：目前遊戲結束後沒有 restart 按鈕或畫面提示，需重新整理頁面。

## Collect Stars 客製化功能（規劃中）

`collect-stars` 不會變成老虎機（那是另一個獨立專案，見下方「Slot Machine」），而是持續在星星收集 demo 上加客製化功能：

| 功能 | 狀態 | 說明 |
|------|------|------|
| 結算畫面（GameOver / Win） | ⬜ | 目前遊戲結束只是凍結畫面，沒有任何 UI 提示 |
| 玩家加速機制 | ⬜ | 尚未設計 |

`src/managers/`、`src/objects/`、`src/config/`、`src/types/` 底下的空檔案（`Reel.ts`、`Symbol.ts`、`WinLine.ts` 等）是 Day00 建立骨架時預留的老虎機相關命名，現在已經不適用於這個專案，之後有實際客製化需求時會重新規劃檔案結構，不會照原本的老虎機命名繼續填。

## Slot Machine（規劃中，另開新專案）

老虎機會是一個全新的獨立專案（`projects/slot-machine/`，尚未建立），第二週後才開始，不會延續 `collect-stars`。詳見 `docs/ARCHITECTURE.md` 的 port 對照表。

## 下一步（依 notes/day01.md「明日預告」）

1. 三個 Scene 職責分離（BootScene/PreloadScene/GameScene 各司其職）— ✅ 已於 2026-07-20 commit `9b5b00b` 完成。
2. 大老二專案骨架 — ✅ 已建立（`projects/big-two/`），玩法設計待後續 brainstorm。
3. `collect-stars` 客製化功能（結算畫面、加速）— 待學完 container、particle 等 Phaser 知識後再開始設計。

## Big Two（`projects/big-two/`）

獨立的新專案，比照 `collect-stars` 的骨架建立，目前只到能執行的空殼階段。

| 功能 | 狀態 | 說明 |
|------|------|------|
| 專案骨架 | ✅ | `package.json`/`tsconfig.json`/`vite.config.ts`/`index.html` 已建立，dev port 固定為 `5174` |
| BootScene → PreloadScene → GameScene | ✅ | 比照 collect-stars 的 Scene 骨架；`GameScene` 目前僅顯示 `"Big Two - Coming Soon"` placeholder 文字，`preload()` 尚無素材可載入 |
| 遊戲規則（發牌/出牌/AI 回合/結算） | ⬜ | 尚未設計，需另開專屬的 brainstorm session |
| 素材與 UI | ⬜ | 尚未開始 |
