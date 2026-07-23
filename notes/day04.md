# Day04：Input（玩家如何與遊戲互動）- PART02

> 📆 2026-07-23

## 今日目標

- 掌握 Phaser Input 事件（pointerover, pointerdown, drag 等）
- 實作卡牌選取浮起、取消選取與重新發牌按鈕
- 實作洗牌演算法（Fisher-Yates shuffle）與卡牌置中計算

## 今日知識

### Phaser API

#### Image.setTint vs Rectangle.setFillStyle

```javascript
/**
 * setTint：
 * - 只作用在 Phaser.GameObjects.Image「圖片」上，不作用在其他 object 上
 * - 對「圖片」原本顏色做疊加（疊色），會影響圖片原本的 alpha（透明度）
 */
const card = this.add.image(cx, cy, 'image').setInteractive()
card.setTint(0xff0000)

/**
 * setFillStyle：
 * - 只作用在 Phaser.GameObjects.Rectangle「幾何圖形」Shape 上，不作用在其他 object 上
 * - 是幾何圖形，不走 texture pipeline，所以沒有 setTint()。要改顏色只能用 setFillStyle(color)
 * - 重新填滿整個物件，不考慮圖片原本的 alpha，可以設定 transparency（透明度）
 * - 官方文件：rectangle(x, y, width, height, fillColor, fillAlpha): Phaser.GameObjects.Rectangle;
 */
const button = this.add.rectangle(cx, cy, 100, 50, 0xff0000).setInteractive()
button.setFillStyle(0xff0000, 0.5)
```

### mouse pointer與觸控的差異

| **事件**      | **桌面（滑鼠）**  | **手機（觸控）**        |
| ------------- | ----------------- | ----------------------- |
| `pointerover` | ✅ 游標進入範圍時 | ❌ 沒有游標，無法 hover |
| `pointerout`  | ✅ 游標離開範圍時 | ❌ 無法 hover           |
| `pointerdown` | ✅ 按下           | ✅ 手指觸碰             |
| `pointerup`   | ✅ 放開           | ✅ 手指離開             |

### drag 與 pointer 的事件參數比較

|                  | **`dragX` / `dragY`**           | **`this.input.activePointer.x/y`** |
| ---------------- | ------------------------------- | ---------------------------------- |
| 來源             | Phaser drag 系統計算後的值      | 原始滑鼠座標                       |
| 座標系           | 世界座標（world space）         | 螢幕座標（screen/canvas space）    |
| 考慮 camera      | ✅ 有，已換算                   | ❌ 沒有                            |
| 考慮 drag offset | ✅ 有，考慮滑鼠點在物件哪個位置 | ❌ 沒有，永遠是指標中心            |

### setData / getData 的用法

```javascript
/**
 * setData(key, value)：為物件設定任意資料
 * - key：資料鍵名（字串）
 * - value：資料值
 */
const card = this.add.image(cx, cy, 'image')
card.setData('selected', false)
card.setData('originY', card.y)

/**
 * getData(key)：取得物件資料
 */
const selected = card.getData('selected')
const originY = card.getData('originY')
```

### Summary

1. **為什麼一定要 `setInteractive()`？**
   - Phaser 預設不會監聽 GameObject 的點擊事件。必須呼叫 `setInteractive()` 建立 Hit Area（點擊區域）並將物件加入輸入處理系統。

2. **`pointerdown` 和 DOM 的 `click` 有什麼差別？**
   - `pointerdown` 是按下的瞬間立即觸發；DOM `click` 則需要完整的按下並放開（pointerdown + pointerup）才會觸發。遊戲中多採用 `pointerdown` 以達到更即時的反應感。

3. **`pointerover` 和 `pointermove` 有什麼不同？**
   - `pointerover` 只在指標「進入物件碰撞區」時觸發一次（相當於 css hover）；`pointermove` 則是在指標「於物件上方移動」時會持續連續觸發。
   - [pointerover vs pointermove](https://youtu.be/CUlbdSGQovY)

4. **Drag 的完整生命週期是什麼？**
   - `dragstart`（開始拖曳時觸發） $\rightarrow$ `drag`（拖曳移動中持續觸發） $\rightarrow$ `dragend`（放開滑鼠/手指結束拖曳時觸發）。

5. **如果一張牌不能點，你會先檢查哪三件事？**
   - 是否漏掉呼叫 `.setInteractive()`。
   - 是否有其他透明或層級更高（Depth 較大）的物件遮檔住它。
   - 物件的 `visible` 是否為 `true`，或是 Hit Area 範圍/尺寸設定錯誤。

## 完成畫面

[Game Logic](https://youtu.be/qFu0eepvGZ0)

## Demo List

- [Hover 放大](https://app.notion.com/p/Day03-Input-3a3b543aa3fc8019a323f9ac0b9259c7?source=copy_link#3a4b543aa3fc8077b0e0c15f8033da79)
- [拖曳](https://app.notion.com/p/Day03-Input-3a3b543aa3fc8019a323f9ac0b9259c7?source=copy_link#3a4b543aa3fc80539d1bc3abc01c516c)
- [點牌](https://app.notion.com/p/Day03-Input-3a3b543aa3fc8019a323f9ac0b9259c7?source=copy_link#3a4b543aa3fc8009a29ff3466160c6f4)

## Git Commit

feat(day04): implement card selection and shuffle logic

# AI Prompt

今天問了：

> 1. Property 'setTint' does not exist on type 'Rectangle'
> 2. drag 有兩個取位置的方法（dragX/Y vs activePointer），差異在哪？
> 3. 載入牌資源，如何使用迴圈載入？
> 4. 牌組水平置中與 Fisher-Yates 隨機發牌

# Reflection

- 今天最難？
  > 處理牌組水平置中時起點 `startX` 的計算，以及洗牌演算法的理解。
- 今天最大的收穫？
  > 學會用 Phaser 的 `setData`/`getData` 儲存狀態，並了解 `setInteractive` 與各類 Input 事件處理。
- 明天要改善什麼？
  > 1. 目前用很多狀態，查資料和 AI 討論後應該要用建立資料管理
  >
  > ```typescript
  > interface CardState {
  >   image: Phaser.GameObjects.Image
  >   selected: boolean
  >   originY: number
  >   rank: number
  >   suit: string
  > }
  > ```
  >
  > 2. 嘗試將卡牌發牌動畫化（Tween），讓視覺呈現更生動。

# 明日預告

加入卡牌發牌 Tween 動畫與牌型判斷邏輯。
