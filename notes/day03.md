# Day03：Input（玩家如何與遊戲互動）

> 📆 2026-07-22

## 今日目標

理解 Phaser Input System，讓 GameObject 能夠接受玩家操作。

## 今日知識

### Input System

用途：

- Phaser 的輸入管理機制，處理滑鼠點擊、觸控點擊、滑鼠移動與拖曳等事件。
- 分為「全域輸入」（`this.input.on(...)`）與「單一物件輸入」（`gameObject.setInteractive()`）。

### setInteractive() 的真正作用

用途：

- 為 `GameObject` 啟用點擊碰撞區（Hit Area），使其可以接收輸入事件。
- `setInteractive()` 並不會回傳 `InteractiveObject`，它只是替 `GameObject` 建立 `input` 屬性後回傳 `GameObject` 本身（`return this`），因此可以繼續鏈式呼叫 `.on()`、`.setScale()` 等方法。
- **事件 (`on`) 屬於 `GameObject`（繼承自 EventEmitter）**。
- `input` 屬性（`InteractiveObject`）負責保存互動狀態設定（`enabled`、`draggable`、`hitArea`...），它不是 EventEmitter，不能直接接 `.on()`。

### destroy()

用途：

- 完全銷毀 `GameObject`，將其從 Scene 的顯示列表（Display List）與更新列表（Update List）中移除，並自動清理綁定的事件與記憶體。

### setInteractive().on('pointerdown', callback)

用途：

- 使特定 `GameObject` 監聽點擊/觸控事件。當玩家在該物件的 HitsArea 上按下點擊時，觸發指定的 callback 函式（例如：點擊卡牌移位或出牌）。

## 完成畫面

（截圖）

## Demo GIF

- [DEMO1 認識 input 互動事件] (https://app.notion.com/p/Day03-Input-3a3b543aa3fc8019a323f9ac0b9259c7?source=copy_link#3a4b543aa3fc80459ce6f097fe5c881b)

- [DEMO2 建立卡牌嘗試點牌] (https://app.notion.com/p/Day03-Input-3a3b543aa3fc8019a323f9ac0b9259c7?source=copy_link#3a4b543aa3fc80a0a579d7c716b8dd98)

## Git Commit

feat(day03): add input system

## 學會的 Phaser API

- `setInteractive()`
- `on('pointerdown', callback)`
- `destroy()`

## AI Prompt

今天問了：

> `leftCard.setInteractive().input.on(...)` 為什麼不能這樣寫？
> `setOrigin` 是拿來做什麼的？點擊和座標對齊該怎麼設定？

得到：

> 1. `setInteractive()` 回傳的是 `GameObject` 本身，`leftCard` 才是 EventEmitter；`.input` 只是保存互動狀態設定的物件，並沒有 `.on()` 方法。
> 2. `setOrigin` 改變的是卡牌身上的錨點/旋轉軸心，座標 `(x, y)` 才是決定它在畫面的位置。

## Reflection

#### 今天最難？

1. `leftCard.setInteractive().input.on(...)` 無效會噴，但是明明官網文件寫法是 `.input.on(...)`
   - `leftCard.input` 不是 EventEmitter，所以不能 `.input.on(...)`。
   - InteractiveObject 只是 Input 的設定資料，不是事件中心，所以沒辦法接 `.on()`。
   - 應該是 `leftCard.setInteractive().on('pointerdown', ...)` 才可以觸發事件，因為它才是繼承 EventEmitter 的 Image/Sprite 物件。

#### 今天最大的收穫？

理解 Phaser 的輸入事件鏈（Event Chain）以及 `setInteractive()` 的設計細節，搞懂了 `GameObject` 與 `InteractiveObject` 的職責區分。

#### 明天要改善什麼？

繼續完成 input 後半部 Hover、Drag、Input、Event、Game Logic

## 明日預告

卡牌拖曳與放開（Drag & Drop）系統。
