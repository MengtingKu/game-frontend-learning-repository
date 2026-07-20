# Day01：建立第一個 Phaser Scene

> 📆 2026-07-20

> [Phaser 3 官方繁體中文教學](https://phaser.io/tutorials/making-your-first-phaser-3-game-chinese)
> [Phaser 3 API 文件](https://docs.phaser.io/api-documentation/)

# 今日目標

完成第一個 Phaser Scene（星星收集與避開炸彈遊戲），並將程式碼重構為現代化的 TypeScript Class 架構。

# 今日知識

- **reel**：捲軸，老虎機等遊戲中縱向轉動的軸。
- **row**：軸高，每條 reel 裡面顯示的符號（symbol）數量。
- **bet**：下注額。
- **payline**：連線規則（中獎線）。

## Scene

**用途：**
Phaser 中的「場景（Scene）」，是遊戲畫面的核心單元。每個場景都有獨立的生命週期與狀態，負責管理該畫面中的相機、物理引擎、遊戲物件與資源。

## preload()

**用途：**
資源預載入階段。在場景準備啟動時執行，用來將圖片、精靈圖（spritesheet）、音效等靜態資源讀取到記憶體中，確保後續 `create()` 繪製畫面時資源已經就緒。

## create()

**用途：**
畫面與物件初始化階段。在此階段中配置遊戲世界、建立物理群組（Group）、繪製背景與角色、設定動畫、定義鍵盤監聽，以及註冊物理碰撞/重疊（Collider / Overlap）規則。

## update()

**用途：**
遊戲主循環（Game Loop）。由系統每幀自動呼叫（通常每秒 60 次），專門用來處理需要持續偵測的邏輯，例如每幀監聽玩家方向鍵輸入並即時改變角色的物理速度（Velocity）。

---

# 學會的 Phaser API

- `new Phaser.Game(config)`：初始化遊戲實例。
- `this.load.image()` / `this.load.spritesheet()`：載入素材。
- `this.physics.add.staticGroup()`：建立靜態物理群組（如地面與平台，不會受重力或碰撞影響）。
- `this.physics.add.group()`：建立動態物理群組（如星星與炸彈，具備完整的重力與速度物理特性）。
- `this.physics.add.collider()`：註冊實體碰撞，碰撞後物件會互相阻擋不會重疊。
- `this.physics.add.overlap()`：註冊重疊偵測，當兩個物件交疊時觸發 Callback，但不會物理互撞。
- `sprite.disableBody(disableGameObject, hideGameObject)`：停用物理並隱藏物件。
- `sprite.enableBody(reset, x, y, enableGameObject, showGameObject)`：重新啟用物理，重設位置並重新顯示。

---

# 除錯與重構歷程 (AI Prompt)

### 1. 修正新版 TextStyle 屬性

- **問題**：TypeScript 報錯 `Object literal may only specify known properties, and 'fill' does not exist in type 'TextStyle'`。
- **原因**：Phaser 3 新版型別定義中，TextStyle 的文字顏色欄位已統一為 `color`，不再支援 `fill`。
- **解決**：將 `{ fill: '#000' }` 改為 `{ color: '#000' }`。

### 2. 重構為 Class Scene

- **解決**：為了讓專案更有結構、減少 `this` 隱式為 `any` 的 TS 報錯，將原先零散的函式重構為繼承 `Phaser.Scene` 的 `MainScene` 類別，變數改為 Class Properties。
- **Callback 綁定**：將 `collectStar` 和 `hitBomb` 宣告為箭頭屬性函式（Property Initializers），解決 Phaser 回呼函數 `this` 丟失的問題：
  ```typescript
  private collectStar = (_player: any, star: any) => { ... }
  ```

### 3. 修復炸彈與星星重置機制

- **問題**：收集完一輪星星後，星星沒有重生，且炸彈沒有正常觸發運作。
- **原因**：在重設星星時呼叫 `sprite.enableBody(true, x, 0)`，漏傳了第 4 與第 5 個參數。在 Phaser 內部若這兩個參數為 `undefined` 會判定為 `false`，導致星星雖然重設了位置，但仍然保持「停用且隱藏」的狀態。
- **解決**：補上最後兩個 Boolean 參數，寫成 `sprite.enableBody(true, x, 0, true, true)`。

### 4. 效能優化 (Cursors 緩存)

- **問題**：原本在 `update()` 中每幀執行 `this.input.keyboard!.createCursorKeys()`，這會造成記憶體垃圾與潛在的鍵盤偵測問題。
- **解決**：改在 `create()` 中呼叫一次並將結果存至 `this.cursors` 成員變數，`update()` 中直接讀取該成員。

---

# Reflection

- **今天最難的點**：Phaser 的 API 一些參數預設值（例如 `enableBody` 的後面兩個參數）與常規直覺不符，需要深入閱讀源碼才能精準定位 Bug。
- **今天最大的收穫**：學會了如何在 TypeScript 中把範例程式碼的老舊 Phaser 架構重構為強型別的 Class 架構，並學會以箭頭屬性函式解決回呼 context (`this`) 的問題。

# 明日預告

1. 建立三個 Scene，且每一個 Scene 只做一件事（BootScene.ts、PreloadScene.ts、GameScene.ts）
2. 運用今天的知識點，進入棋牌大老二的核心
