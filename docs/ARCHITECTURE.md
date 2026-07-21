# ARCHITECTURE

## Repo 層級：多專案 + Dashboard

這個 repo 底下每個遊戲都是獨立的 Vite + Phaser 專案，彼此不共用同一個 `Phaser.Game` 實例：

| 專案 | 路徑 | Dev Port | 狀態 |
|------|------|----------|------|
| Collect Stars | `projects/collect-stars/` | 5173（Vite 預設） | 🚧 進行中 |
| Big Two | `projects/big-two/` | 5174 | ⬜ 骨架已建立，玩法未開始 |
| Slot Machine（規劃中，第二週後開始） | `projects/slot-machine/`（尚未建立） | 5175（預留） | ⬜ 未開始 |

根目錄的 `index.html` + `dashboard.css` 是一個不依賴 Phaser、不依賴任何前端框架的純靜態頁面，列出以上專案的卡片與連結，方便在瀏覽器分頁之間切換查看不同遊戲的進度。開發時仍需在對應的 `projects/<name>/` 下各自執行 `npm run dev`，dashboard 本身不會幫你啟動任何 server。

新增遊戲專案的步驟見 `docs/DEVELOPMENT.md`「新增一個遊戲專案的步驟」。

以下章節（目錄結構、啟動流程、Scene 生命週期等）是針對 `projects/collect-stars/` 的說明；`big-two` 目前僅有骨架（`BootScene → PreloadScene → GameScene`，`GameScene` 顯示 placeholder 文字），尚無等效的詳細內容可寫，待實際玩法設計後再補充。

## 目錄結構

```
projects/collect-stars/
├── index.html                    # 唯一 HTML entry，掛載 #app，載入 src/main.ts
├── tsconfig.json                 # target ES2023、bundler moduleResolution、noEmit（型別檢查交給 tsc，打包交給 vite）
├── package.json
├── public/
│   ├── favicon.svg / icons.svg
│   └── assets/
│       ├── demo/                 # Phaser 官方教學素材（sky/platform/star/bomb/dude），暫時性，會被客製化素材取代
│       ├── raw/                  # 設計師提供的原始 PNG 序列（symbols 等），供 TexturePacker 打包用
│       └── atlas/                # TexturePacker 產出的圖集（*.png + *.json），目前為空，尚未產生
└── src/
    ├── main.ts                   # 入口：組裝 Phaser.Types.Core.GameConfig，註冊 Scene 列表，new Phaser.Game(config)
    ├── game.ts                   # 空檔案（保留位置，可能用於未來拆分 Game 實例建立邏輯）
    ├── config/
    │   ├── constants.ts          # 空檔案（預留：遊戲常數，如 reel 數量、payline 定義）
    │   └── gameConfig.ts         # 空檔案（預留：Phaser.Types.Core.GameConfig 從 main.ts 拆出）
    ├── scenes/
    │   ├── BootScene.ts          # 已實作：初始化用，不載素材，create() 直接切到 PreloadScene
    │   ├── PreloadScene.ts       # 已實作：preload() 載入素材，目前載入的是 Phaser 官方教學 demo 素材
    │   ├── GameScene.ts          # 已實作：目前是 Phaser 官方「星星收集 + 避炸彈」教學的 TS Class 版本，客製化功能尚未開始
    │   └── UIScene.ts            # 空檔案（預留：UI 疊加層 Scene，如按鈕、分數等）
    ├── managers/                 # 全部空檔案，預留單例式管理器
    │   ├── AnimationManager.ts   # 預留：集中管理 GSAP/Phaser tween 動畫
    │   ├── AssetManager.ts       # 預留：集中管理素材 key 與載入邏輯
    │   ├── AudioManager.ts       # 預留：集中管理音效播放
    │   └── GameManager.ts        # 預留：集中管理遊戲狀態（分數、遊戲階段）
    ├── objects/                  # 全部空檔案，預留 GameObject 子類別
    │   ├── Button.ts             # 預留：可互動按鈕元件
    │   ├── Reel.ts                # Day00 建骨架時預留的老虎機捲軸命名，已不適用於本專案（老虎機是另一個獨立專案），之後有實際需求會重新規劃
    │   ├── Symbol.ts             # 同上，Day00 遺留的老虎機命名，已不適用
    │   └── WinLine.ts            # 同上，Day00 遺留的老虎機命名，已不適用
    ├── ui/                        # 空資料夾，預留 UI 元件
    └── types/
        └── index.ts               # 空檔案，預留共用型別定義
```

> 「空檔案」代表 Day00 建立專案骨架時先佔位，尚未實作。`objects/` 下的 `Reel.ts`／`Symbol.ts`／`WinLine.ts` 是當初以為這個專案會變成老虎機時取的命名，現在這個專案的方向是持續客製化星星收集 demo，這幾個檔名已經不準確，之後真的要加物件時會重新命名。新增內容前請先讀 [FEATURES.md](./FEATURES.md) 確認目前進度，避免搶跑或做出與當天學習目標衝突的抽象。

## 啟動流程

```
index.html
  → src/main.ts
      → new Phaser.Game({ scene: [BootScene, PreloadScene, GameScene] })
          → BootScene.create()        # 印出 log，立即切到 PreloadScene，不載入任何素材
              → PreloadScene.preload() # 載入 demo 素材（sky/ground/star/bomb + dude spritesheet）
                  → PreloadScene.create() # 切到 GameScene
                      → GameScene.create()  # 建立背景、平台（靜態物理群組）、玩家（動態物理精靈）、動畫、星星群組、炸彈群組、碰撞/重疊規則、分數文字、鍵盤輸入
                          → GameScene.update()  # 每幀依方向鍵控制玩家速度與動畫
```

Scene 之間透過 `this.scene.start('SceneKey')` 切換，`SceneKey` 字串在各 Scene 建構子 `super('SceneKey')` 中宣告，需與 `main.ts` 的 `scene: [...]` 陣列成員一致。

## Scene 生命週期慣例

| 階段 | 用途 | 目前這三個 Scene 的實際行為 |
|------|------|------------------------------|
| `constructor()` | 呼叫 `super('SceneKey')` 註冊 Scene 名稱 | 三者皆僅呼叫 `super()`，無其他初始化 |
| `preload()` | 載入圖片/spritesheet/音效等靜態資源 | 只有 `PreloadScene` 使用，載入 5 個 demo 素材 |
| `create()` | 建立畫面物件、物理群組、動畫、輸入監聽、碰撞規則 | `BootScene` 只切場景；`PreloadScene` 只切場景；`GameScene` 建立完整遊戲畫面（見下方） |
| `update()` | 每幀執行的遊戲主循環 | 只有 `GameScene` 使用，處理方向鍵移動與動畫播放 |

## GameScene 現況（Phaser 官方教學移植版）

`GameScene.ts`（202 行）目前的職責與資料流：

1. **背景與地形**：`this.add.image` 畫天空，`this.physics.add.staticGroup()` 建立 4 個平台。
2. **玩家**：`this.physics.add.sprite()` 建立動態物理精靈，設定 bounce、世界邊界碰撞，並與平台建立 `collider`。三組動畫（`left`/`turn`/`right`）在 `create()` 中一次性註冊。
3. **星星群組**：`this.physics.add.group()` 建立 12 顆星星（`repeat: 11`），與平台碰撞，與玩家設定 `overlap` → 觸發 `collectStar`。
4. **炸彈群組**：與平台碰撞，與玩家設定 `collider` → 觸發 `hitBomb`。
5. **分數**：`this.scoreText`，每次 `collectStar` 加 10 分。
6. **遊戲結束**：`hitBomb` 觸發後 `this.physics.pause()`、玩家變紅、播放 `turn` 動畫、`gameOver = true`，`update()` 檢查此旗標提前 return。

碰撞回呼（`collectStar`、`hitBomb`）皆宣告為箭頭屬性函式（`private xxx = (...) => {}`），避免 Phaser 呼叫時 `this` context 遺失（詳見 `notes/day01.md` 的除錯歷程）。

**尚未串接的部分**（下一步規劃見 `notes/day01.md` 「明日預告」與 `docs/FEATURES.md`）：客製化功能（結算畫面、玩家加速等）完全未開始，`managers/` 與 `objects/` 尚為空殼。

## 資源載入與 TexturePacker 流程

```
設計師提供 PNG 序列 → public/assets/raw/symbols/
                    → TexturePacker 打包
                    → public/assets/atlas/symbols.png + symbols.json
                    → PreloadScene: this.load.atlas('symbols', 'assets/atlas/symbols.png', 'assets/atlas/symbols.json')
                    → GameScene: this.add.image(x, y, 'symbols', 'seven.png')
```

此流程目前只在 `notes/day00.md` 中規劃，`atlas/` 目錄尚無實際檔案。

## 無適用章節說明

此專案是純前端單機學習用小遊戲，不涉及後端服務，因此以下一般 Web 專案常見的架構章節目前不適用：API 路由總覽、統一回應格式、認證/授權機制、資料庫 schema、金流/第三方整合。若未來加入後端（例如記錄分數的 API），應在此文件補上對應章節。
