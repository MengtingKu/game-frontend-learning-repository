---
paths:
  - "projects/slot-game/src/**"
---

# Phaser / TypeScript 遊戲開發規則

- Scene 一律繼承 `Phaser.Scene`，建構子只做 `super('SceneKey')`，`SceneKey` 需與該類別名稱一致，且與 `main.ts` 的 `scene: [...]` 註冊順序一致。
- `preload()` 只放資源載入（`this.load.image/spritesheet/atlas/audio`），`create()` 只放畫面/物件/規則初始化，`update()` 只放每幀邏輯；不要把載入邏輯寫進 `create()`，也不要把一次性初始化寫進 `update()`。
- 跨 `create()`/`update()` 使用的物件宣告為 class 屬性並用 `!` non-null assertion（因為賦值時機在 `create()` 而非建構子），例如 `private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody`。
- 碰撞／重疊回呼（`this.physics.add.collider/overlap` 的 callback）一律宣告為箭頭屬性函式，避免 `this` context 遺失：
  ```ts
  private collectStar = (_player: any, star: any) => { ... }
  ```
- 回呼函式中未使用的參數前綴 `_`（如 `_player`）。
- 素材路徑對應 `public/assets/`：`raw/` 放原始 PNG、`atlas/` 放 TexturePacker 產出的圖集、`demo/` 放暫時性的 Phaser 官方教學素材。`preload()` 中用相對路徑（如 `'assets/demo/sky.png'`），不要加開頭斜線以外的絕對路徑寫法。
- `src/managers/`、`src/objects/`、`src/config/`、`src/types/` 目前多為空檔案佔位，只在真正需要該職責時才實作，不要預先寫入未被任何 Scene 使用的抽象或介面。
- JSDoc 只在非顯而易見處加註解（例如 Phaser API 參數的隱藏預設值行為、業務邏輯原因），方法層級用一行 `/** 用途 */`，避免整段大量描述顯而易見的行為。
