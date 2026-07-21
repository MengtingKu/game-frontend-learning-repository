# 多專案 Dashboard + Big Two Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個純靜態、不依賴 Phaser 的根目錄 dashboard 頁面（列出所有遊戲專案卡片），並比照 `projects/slot-game/` 的骨架新建 `projects/big-two/`（只搭可執行的空殼，不含大老二玩法），同時把「一個遊戲 = 一個獨立 Vite 專案」的慣例記錄進文件。

**Architecture:** `projects/big-two/` 是完全獨立的 Vite + TypeScript + Phaser 專案（固定 dev port `5174`，`slot-game` 維持 Vite 預設 `5173` 不動），兩者互不共用 `Phaser.Game` 實例。根目錄新增 `index.html` + `dashboard.css`，純 HTML/CSS 靜態頁，卡片連結指向各專案的 `localhost:<port>`，不涉及任何建置流程。

**Tech Stack:** Vite、TypeScript、Phaser 3（沿用 `projects/slot-game/` 現有版本：`vite@^8.1.1`、`typescript@~6.0.2`、`phaser@^3.90.0`）；dashboard 為純 HTML/CSS，無框架、無建置步驟。

**依據 spec：** `docs/superpowers/specs/2026-07-21-game-dashboard-design.md`

---

## 專案沒有測試框架，怎麼驗證？

依 `docs/TESTING.md`，這個 repo 目前沒有安裝任何測試框架。本計畫的「驗證步驟」一律用實際指令觀察結果（`npm run build` 是否成功、`curl` 打 dev server 是否回應預期內容），取代單元測試斷言。每個 Task 的驗證步驟都會列出「執行的指令」與「預期輸出」。

## File Structure

**新建檔案（`projects/big-two/`，完全獨立的新專案）：**
- `projects/big-two/package.json` — 專案設定，`name: "big-two"`，只裝 `phaser`（不預先裝 `gsap`）
- `projects/big-two/tsconfig.json` — 直接複製 `slot-game` 的設定（無差異）
- `projects/big-two/vite.config.ts` — 唯一與 slot-game 不同之處：固定 `server.port: 5174`
- `projects/big-two/index.html` — entry HTML，`title` 改為 `big-two`
- `projects/big-two/.gitignore` — 直接複製 `slot-game` 的內容（無差異）
- `projects/big-two/public/favicon.svg` — 直接複製 `slot-game` 的 favicon（無差異，未來要換再改）
- `projects/big-two/src/main.ts` — 組裝 `Phaser.Types.Core.GameConfig`，註冊 3 個 Scene，**不含 physics 設定**（大老二不需要重力/碰撞物理）
- `projects/big-two/src/scenes/BootScene.ts` — 空殼，切到 PreloadScene
- `projects/big-two/src/scenes/PreloadScene.ts` — 空殼（尚無素材），切到 GameScene
- `projects/big-two/src/scenes/GameScene.ts` — 只顯示 `"Big Two - Coming Soon"` placeholder 文字

**新建檔案（repo 根目錄 dashboard）：**
- `index.html`（根目錄）— 純靜態 dashboard，列出 Slot Game、Big Two 兩張卡片
- `dashboard.css`（根目錄）— dashboard 樣式，支援亮／暗色模式

**修改檔案（文件同步）：**
- `docs/DEVELOPMENT.md` — 新增「新增一個遊戲專案的步驟」章節 + 命名規則表補一列
- `docs/ARCHITECTURE.md` — 新增「Repo 層級：多專案 + Dashboard」章節（含 port 對照表）
- `CLAUDE.md` — 常用指令補 dashboard 開啟方式；關鍵規則補「新遊戲=新專案」規則
- `docs/FEATURES.md` — 新增「Big Two」功能狀態區塊

---

### Task 1: Big Two 專案設定檔骨架

**Files:**
- Create: `projects/big-two/package.json`
- Create: `projects/big-two/tsconfig.json`
- Create: `projects/big-two/vite.config.ts`
- Create: `projects/big-two/.gitignore`
- Create: `projects/big-two/index.html`
- Create: `projects/big-two/public/favicon.svg`

- [ ] **Step 1: 建立目錄與 `package.json`**

```bash
mkdir -p projects/big-two/src/scenes projects/big-two/public
```

寫入 `projects/big-two/package.json`：

```json
{
  "name": "big-two",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "typescript": "~6.0.2",
    "vite": "^8.1.1"
  },
  "dependencies": {
    "phaser": "^3.90.0"
  }
}
```

- [ ] **Step 2: 複製 `tsconfig.json` 與 `.gitignore`（與 slot-game 完全相同）**

```bash
cp projects/slot-game/tsconfig.json projects/big-two/tsconfig.json
cp projects/slot-game/.gitignore projects/big-two/.gitignore
cp projects/slot-game/public/favicon.svg projects/big-two/public/favicon.svg
```

- [ ] **Step 3: 寫入 `vite.config.ts`（固定 dev port 5174，避免跟 slot-game 的 5173 衝突）**

`projects/big-two/vite.config.ts`：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5174
  }
})
```

- [ ] **Step 4: 寫入 `index.html`**

`projects/big-two/index.html`：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>big-two</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: 確認檔案都在**

Run: `find projects/big-two -type f | sort`

Expected:
```
projects/big-two/.gitignore
projects/big-two/index.html
projects/big-two/package.json
projects/big-two/public/favicon.svg
projects/big-two/tsconfig.json
projects/big-two/vite.config.ts
```

- [ ] **Step 6: Commit**

```bash
git add projects/big-two/package.json projects/big-two/tsconfig.json projects/big-two/vite.config.ts projects/big-two/.gitignore projects/big-two/index.html projects/big-two/public/favicon.svg
git commit -m "chore: 🧹 建立 big-two 專案設定檔骨架"
```

---

### Task 2: Big Two Scene 骨架

**Files:**
- Create: `projects/big-two/src/main.ts`
- Create: `projects/big-two/src/scenes/BootScene.ts`
- Create: `projects/big-two/src/scenes/PreloadScene.ts`
- Create: `projects/big-two/src/scenes/GameScene.ts`

- [ ] **Step 1: 寫入 `BootScene.ts`（比照 slot-game 現有寫法）**

`projects/big-two/src/scenes/BootScene.ts`：

```ts
import Phaser from 'phaser'

/**
 * 初始化不載素材
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  /**
   * 載入資源
   */
  preload() {}

  /**
   * 建立畫面
   */
  create() {
    console.log('Boot')
    this.scene.start('PreloadScene') // 切換到下一個 Scene
  }
}
```

- [ ] **Step 2: 寫入 `PreloadScene.ts`（目前無素材，preload 留空）**

`projects/big-two/src/scenes/PreloadScene.ts`：

```ts
import Phaser from 'phaser'

/**
 * 素材載入場景
 */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene')
  }

  /**
   * 載入資源
   * - 目前尚未設計大老二的美術素材，之後有牌面圖集時再補上 this.load.atlas(...)
   */
  preload() {}

  create() {
    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
```

- [ ] **Step 3: 寫入 `GameScene.ts`（placeholder，確保畫面不是全黑）**

`projects/big-two/src/scenes/GameScene.ts`：

```ts
import Phaser from 'phaser'

/**
 * 大老二遊戲邏輯
 * - 目前僅為 placeholder，確認 Scene 骨架可以正常執行
 * - 實際玩法（發牌、選牌、出牌、AI 回合、結算）留到專屬的 brainstorm session 再設計
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.add
      .text(400, 300, 'Big Two - Coming Soon', {
        fontSize: '32px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
  }
}
```

- [ ] **Step 4: 寫入 `main.ts`（不含 physics 設定，因為大老二不需要重力/碰撞物理）**

`projects/big-two/src/main.ts`：

```ts
import Phaser from 'phaser'

import BootScene from './scenes/BootScene'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1a1a2e',

  scene: [BootScene, PreloadScene, GameScene]
}

new Phaser.Game(config)
```

- [ ] **Step 5: Commit**

```bash
git add projects/big-two/src/main.ts projects/big-two/src/scenes/BootScene.ts projects/big-two/src/scenes/PreloadScene.ts projects/big-two/src/scenes/GameScene.ts
git commit -m "chore: 🧹 建立 big-two Scene 骨架（Boot/Preload/GameScene）"
```

---

### Task 3: 安裝依賴並驗證建置與 dev server

**Files:**
- Create: `projects/big-two/package-lock.json`（`npm install` 產生）

- [ ] **Step 1: 安裝依賴**

```bash
cd projects/big-two
npm install
```

Expected: 安裝成功結束，無 error；產生 `node_modules/`（已被 `.gitignore` 排除）與 `package-lock.json`。

- [ ] **Step 2: 驗證型別檢查與建置**

```bash
npm run build
```

Expected: `tsc` 無型別錯誤，接著 `vite build` 印出 `✓ built in ...` 並產生 `dist/`（已被 `.gitignore` 排除）。若 `tsc` 報 `noUnusedLocals`/`noUnusedParameters` 相關錯誤，檢查 Task 2 寫入的檔案是否有未使用的 import 或參數。

- [ ] **Step 3: 驗證 dev server 能正常回應**

```bash
npm run dev & DEV_PID=$!
sleep 2
curl -s http://localhost:5174/ | grep -o '<div id="app"></div>'
kill $DEV_PID
```

Expected: `curl` 輸出 `<div id="app"></div>`，代表 dev server 在 `5174` port 正常serve `index.html`。

- [ ] **Step 4: Commit（只 commit lock 檔，`node_modules`/`dist` 已被 gitignore）**

```bash
cd ../..
git add projects/big-two/package-lock.json
git commit -m "chore: 🧹 安裝 big-two 依賴並鎖定版本"
```

---

### Task 4: 根目錄 Dashboard

**Files:**
- Create: `index.html`（repo 根目錄）
- Create: `dashboard.css`（repo 根目錄）

- [ ] **Step 1: 寫入根目錄 `index.html`**

`index.html`（repo 根目錄，注意不是 `projects/slot-game/index.html` 或 `projects/big-two/index.html`）：

```html
<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2026 Game Frontend Learning Dashboard</title>
    <link rel="stylesheet" href="./dashboard.css" />
  </head>
  <body>
    <h1>2026 Game Frontend Learning Dashboard</h1>
    <p class="intro">
      每個遊戲都是獨立的 Vite 專案，點卡片連結前，記得先在對應目錄執行
      <code>npm run dev</code>。
    </p>
    <div class="card-grid">
      <article class="card">
        <h2>Slot Game</h2>
        <p class="status">
          🚧 進行中 — Day01 官方星星收集教學移植版，尚未加入老虎機邏輯
        </p>
        <p class="cmd"><code>cd projects/slot-game &amp;&amp; npm run dev</code></p>
        <a class="link" href="http://localhost:5173" target="_blank" rel="noopener">
          開啟 → localhost:5173
        </a>
      </article>
      <article class="card">
        <h2>Big Two</h2>
        <p class="status">⬜ 骨架已建立 — Scene 骨架就緒，玩法尚未開始</p>
        <p class="cmd"><code>cd projects/big-two &amp;&amp; npm run dev</code></p>
        <a class="link" href="http://localhost:5174" target="_blank" rel="noopener">
          開啟 → localhost:5174
        </a>
      </article>
    </div>
  </body>
</html>
```

- [ ] **Step 2: 寫入 `dashboard.css`**

`dashboard.css`（repo 根目錄）：

```css
:root {
  color-scheme: light dark;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}

body {
  margin: 0;
  padding: 2rem;
  max-width: 960px;
  margin-inline: auto;
}

h1 {
  font-size: 1.75rem;
}

.intro {
  color: #666;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.25rem;
}

.card h2 {
  margin-top: 0;
}

.card .status {
  font-size: 0.9rem;
  color: #555;
}

.card .cmd code {
  background: #f2f2f2;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.card .link {
  display: inline-block;
  margin-top: 0.75rem;
  font-weight: 600;
  text-decoration: none;
}

.card .link:hover {
  text-decoration: underline;
}

@media (prefers-color-scheme: dark) {
  .intro {
    color: #aaa;
  }
  .card {
    border-color: #333;
  }
  .card .status {
    color: #bbb;
  }
  .card .cmd code {
    background: #2a2a2a;
    color: #eee;
  }
}
```

- [ ] **Step 3: 驗證 dashboard 內容正確（起一個暫時的靜態伺服器）**

```bash
python3 -m http.server 8099 & SERVER_PID=$!
sleep 1
curl -s http://localhost:8099/ | grep -o 'Slot Game'
curl -s http://localhost:8099/ | grep -o 'Big Two'
curl -s http://localhost:8099/ | grep -o 'localhost:5173'
curl -s http://localhost:8099/ | grep -o 'localhost:5174'
kill $SERVER_PID
```

Expected: 四個 `grep` 都各自印出一行符合的文字（`Slot Game`、`Big Two`、`localhost:5173`、`localhost:5174`），代表兩張卡片與連結都正確渲染在 HTML 裡。

- [ ] **Step 4: Commit**

```bash
git add index.html dashboard.css
git commit -m "chore: 🧹 建立根目錄多專案 dashboard"
```

---

### Task 5: 文件更新

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/DEVELOPMENT.md`
- Modify: `docs/FEATURES.md`

- [ ] **Step 1: 更新 `CLAUDE.md` 的常用指令，補上 dashboard 開啟方式**

在 `CLAUDE.md` 找到這一段：

```markdown
## 常用指令

所有指令需在 `projects/slot-game/` 目錄下執行：

```bash
cd projects/slot-game
npm install       # 安裝依賴
npm run dev       # 啟動開發伺服器 http://localhost:5173
npm run build     # tsc 型別檢查 + vite build
npm run preview   # 預覽 production build
```
```

改成：

```markdown
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
```

- [ ] **Step 2: 更新 `CLAUDE.md` 的關鍵規則，補上新遊戲=新專案的規則**

在 `CLAUDE.md` 的「## 關鍵規則」清單最後一項（`功能開發若牽涉多步驟規劃...`）後面，加一條新的項目：

```markdown
- 新增遊戲一律建立新的 `projects/<name>/` 資料夾（比照 `slot-game`／`big-two` 的骨架），不要塞進既有專案的 `Phaser.Game` 實例；新增後記得在根目錄 dashboard（`index.html`）加卡片，並依 `docs/ARCHITECTURE.md` 的 port 對照表指定不衝突的 dev port。
```

- [ ] **Step 3: 在 `docs/ARCHITECTURE.md` 開頭補上 Repo 層級章節**

在 `docs/ARCHITECTURE.md` 找到：

```markdown
# ARCHITECTURE

## 目錄結構
```

改成：

```markdown
# ARCHITECTURE

## Repo 層級：多專案 + Dashboard

這個 repo 底下每個遊戲都是獨立的 Vite + Phaser 專案，彼此不共用同一個 `Phaser.Game` 實例：

| 專案 | 路徑 | Dev Port | 狀態 |
|------|------|----------|------|
| Slot Game | `projects/slot-game/` | 5173（Vite 預設） | 🚧 進行中 |
| Big Two | `projects/big-two/` | 5174 | ⬜ 骨架已建立，玩法未開始 |
| Slot Machine（規劃中，第二週後開始） | `projects/slot-machine/`（尚未建立） | 5175（預留） | 未開始 |

根目錄的 `index.html` + `dashboard.css` 是一個不依賴 Phaser、不依賴任何前端框架的純靜態頁面，列出以上專案的卡片與連結，方便在瀏覽器分頁之間切換查看不同遊戲的進度。開發時仍需在對應的 `projects/<name>/` 下各自執行 `npm run dev`，dashboard 本身不會幫你啟動任何 server。

新增遊戲專案的步驟見 `docs/DEVELOPMENT.md`「新增一個遊戲專案的步驟」。

以下章節（目錄結構、啟動流程、Scene 生命週期等）是針對 `projects/slot-game/` 的說明；`big-two` 目前僅有骨架（`BootScene → PreloadScene → GameScene`，`GameScene` 顯示 placeholder 文字），尚無等效的詳細內容可寫，待實際玩法設計後再補充。

## 目錄結構
```

- [ ] **Step 4: 在 `docs/DEVELOPMENT.md` 的命名規則表加一列**

在 `docs/DEVELOPMENT.md` 找到命名規則對照表中的這一行：

```markdown
| 計畫檔名 | `YYYY-MM-DD-<feature-name>.md` | `2026-07-25-reel-spin.md` |
```

改成（在後面加一列）：

```markdown
| 計畫檔名 | `YYYY-MM-DD-<feature-name>.md` | `2026-07-25-reel-spin.md` |
| 遊戲專案資料夾 | kebab-case，置於 `projects/` | `slot-game`、`big-two` |
```

- [ ] **Step 5: 在 `docs/DEVELOPMENT.md` 新增「新增一個遊戲專案的步驟」章節**

在 `docs/DEVELOPMENT.md` 找到：

```markdown
## 新增一個 GameObject 子類別的步驟

1. 在 `src/objects/` 建立檔案，繼承對應的 Phaser GameObject（如 `Phaser.GameObjects.Container`、`Phaser.GameObjects.Sprite`）。
2. 建構子接收 `scene: Phaser.Scene` 與初始化參數，內部呼叫 `scene.add.existing(this)` 註冊進場景。

## JSDoc 註解風格
```

改成：

```markdown
## 新增一個 GameObject 子類別的步驟

1. 在 `src/objects/` 建立檔案，繼承對應的 Phaser GameObject（如 `Phaser.GameObjects.Container`、`Phaser.GameObjects.Sprite`）。
2. 建構子接收 `scene: Phaser.Scene` 與初始化參數，內部呼叫 `scene.add.existing(this)` 註冊進場景。

## 新增一個遊戲專案的步驟

repo 採「一個遊戲 = 一個獨立 Vite 專案」的模式（見 `docs/ARCHITECTURE.md`「Repo 層級：多專案 + Dashboard」），新增遊戲時：

1. 在 `projects/` 下建立新資料夾 `projects/<name>/`，比照 `projects/slot-game/` 或 `projects/big-two/` 的骨架，複製 `tsconfig.json`、`.gitignore`、`public/favicon.svg`（三者可直接 `cp`，內容不需調整），並各自寫入 `package.json`（`name` 欄位改成新專案名）、`index.html`（`title` 改成新專案名）、`src/main.ts`、`src/scenes/{Boot,Preload,Game}Scene.ts`。
2. 新增 `vite.config.ts`，指定專屬的 `server.port`（目前已使用：`slot-game` 用 Vite 預設 `5173`；`big-two` 用 `5174`；下一個新專案請依序使用 `5175`，並更新 `docs/ARCHITECTURE.md` 的 port 對照表）。
3. 在根目錄 `index.html`（dashboard）的 `.card-grid` 裡加入一張新的 `<article class="card">`，包含遊戲名稱、狀態說明、啟動指令、`http://localhost:<port>` 連結，格式比照既有卡片。
4. 更新 `docs/FEATURES.md`，新增該專案的功能狀態區塊。

## JSDoc 註解風格
```

- [ ] **Step 6: 在 `docs/FEATURES.md` 新增 Big Two 區塊**

在 `docs/FEATURES.md` 檔案最末（`## 下一步（依 notes/day01.md「明日預告」）` 章節之後）加上：

```markdown

## Big Two（`projects/big-two/`）

獨立的新專案，比照 `slot-game` 的骨架建立，目前只到能執行的空殼階段。

| 功能 | 狀態 | 說明 |
|------|------|------|
| 專案骨架 | ✅ | `package.json`/`tsconfig.json`/`vite.config.ts`/`index.html` 已建立，dev port 固定為 `5174` |
| BootScene → PreloadScene → GameScene | ✅ | 比照 slot-game 的 Scene 骨架；`GameScene` 目前僅顯示 `"Big Two - Coming Soon"` placeholder 文字，`preload()` 尚無素材可載入 |
| 遊戲規則（發牌/出牌/AI 回合/結算） | ⬜ | 尚未設計，需另開專屬的 brainstorm session |
| 素材與 UI | ⬜ | 尚未開始 |
```

- [ ] **Step 7: 確認四份文件都改到了**

Run: `git diff --stat CLAUDE.md docs/ARCHITECTURE.md docs/DEVELOPMENT.md docs/FEATURES.md`

Expected: 四個檔案都顯示有異動（insertions > 0）。

- [ ] **Step 8: Commit**

```bash
git add CLAUDE.md docs/ARCHITECTURE.md docs/DEVELOPMENT.md docs/FEATURES.md
git commit -m "docs: ✏️ 記錄多專案 + dashboard 慣例，新增 Big Two 功能狀態"
```

---

### Task 6: 端對端驗證（不需要 commit）

**Files:** 無新增/修改檔案，純驗證。

- [ ] **Step 1: 驗證 slot-game 與 big-two 可以同時啟動、互不衝突**

```bash
(cd projects/slot-game && npm run dev > /tmp/slot-game-dev.log 2>&1 &)
(cd projects/big-two && npm run dev > /tmp/big-two-dev.log 2>&1 &)
sleep 3
curl -s -o /dev/null -w "slot-game (5173): %{http_code}\n" http://localhost:5173/
curl -s -o /dev/null -w "big-two (5174): %{http_code}\n" http://localhost:5174/
```

Expected: 兩行輸出都顯示 `200`。

- [ ] **Step 2: 清理背景 process**

```bash
lsof -ti:5173 | xargs -r kill
lsof -ti:5174 | xargs -r kill
```

Expected: 無殘留的 `vite` process（可用 `lsof -i:5173 -i:5174` 再檢查一次應為空）。

- [ ] **Step 3: 人工確認（無法自動化的部分）**

在瀏覽器打開根目錄 `index.html`，確認：
- 兩張卡片版面正常（亮色/暗色模式都檢查一次，切換系統外觀設定或瀏覽器 DevTools 的 rendering 面板模擬）。
- 點擊卡片連結（在對應 dev server 開著的狀態下）能正確導到該遊戲畫面。
- `projects/big-two/` 的畫面顯示深色背景 + 白色文字 `"Big Two - Coming Soon"`，不是全黑或錯誤畫面。

這步驟只能由使用者本人在瀏覽器裡確認，agent 執行到這裡即完成本計畫，請回報使用者進行最後的視覺確認。

---

## Self-Review 記錄

- **Spec coverage**：spec 的 4 個目標（dashboard、port 分配、big-two scaffold、文件更新）分別對應 Task 4、Task 1/3、Task 1-3、Task 5，皆有對應任務覆蓋。spec 明確排除的項目（大老二玩法、slot-game 程式碼異動、部署/CI、老虎機專案）本計畫皆未觸碰，範圍一致。
- **Placeholder scan**：已移除所有「之後再補」「TBD」字樣，改為具體待辦說明（例如「preload() 留空，之後有牌面圖集時再補上 this.load.atlas(...)」屬於明確的現況描述，非佔位符）。
- **Type consistency**：`GameScene`、`BootScene`、`PreloadScene` 的類別名稱、`super()` 傳入的 key、`this.scene.start(...)` 的目標字串在 Task 2 全文一致；`vite.config.ts` 的 `5174` 與 dashboard 卡片連結、`docs/ARCHITECTURE.md` port 表、`docs/DEVELOPMENT.md` 步驟說明中的 port 數字全部一致。
