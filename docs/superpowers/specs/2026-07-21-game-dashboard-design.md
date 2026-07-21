# 多專案 Dashboard + 大老二 Scaffold 設計

> 📆 2026-07-21

## 背景與動機

目前 repo 只有 `projects/slot-game/` 一個實作專案。使用者接下來要開始開發大老二（`big-two`），之後第二週再開始老虎機（`slot-machine`）。因此出現一個問題：多個獨立的 Phaser 遊戲專案要怎麼組織，才能方便在它們之間切換／回顧，同時不打亂正在學習的 Phaser Scene 生命週期概念？

## 決策紀錄（brainstorm 過程中確認的事）

- **維持「一個遊戲 = 一個獨立 Vite 專案」的模式**，不把多個遊戲塞進同一個 `Phaser.Game` 實例。理由：不同遊戲的 physics、畫布尺寸、素材命名空間各自獨立，硬塞同一個 Game 實例會製造不必要的複雜度，且會模糊掉「一個專案 = 一組完整 Scene 生命週期」的學習概念。
- **slot-game 現況不動**：原本考慮在 slot-game 內用 `MenuScene` 拆出「Day1 官方範例」與「客製化版本」兩條分支，但確認主管要求的客製化功能要等學完 container、particle 之後才會動手，屆時需求與作法都可能不同。現在硬做是過度設計，Day1 範例目前已完整保留在 git 歷史（commit `1b8e62a`、`9b5b00b`），需要回顧時用 `git show`/`git checkout` 即可，**這次設計不涉及 slot-game 任何程式碼變動**。
- **Dashboard 現在就先搭骨架**，不用等大老二做完。
- **大老二現在就 scaffold 骨架**（package.json/Vite/Scene 骨架），但不寫任何玩法、規則、UI——那些留到之後專門為大老二開的 brainstorm session。

## 目標（本次 spec 範圍）

1. 建立一個不依賴 Phaser、不依賴任何前端框架的純靜態 dashboard 頁面，列出目前有的遊戲專案，之後新增專案只要加一張卡片。
2. 讓 `slot-game` 與 `big-two` 可以同時啟動 dev server 而不搶 port。
3. 建立 `projects/big-two/` 骨架，比照 `slot-game` 現有的專案結構慣例（見 `docs/DEVELOPMENT.md`「新增一個 Scene 的步驟」與 `docs/ARCHITECTURE.md`）。
4. 同步更新 `docs/DEVELOPMENT.md`、`docs/ARCHITECTURE.md`、`CLAUDE.md`、`docs/FEATURES.md`，把「多專案 + dashboard」的慣例記錄下來，讓之後新增 `slot-machine` 等專案時有步驟可循。

## 非目標（明確排除）

- 大老二的實際玩法、牌型判斷、UI 設計——留給之後大老二專屬的 brainstorm。
- slot-game 的任何程式碼變動（含 Day1 保留機制）——留到主管要求的客製化任務真正開始時再設計。
- Dashboard 的部署/正式上線（例如 GitHub Pages CI）——目前只服務本機開發，之後有部署需求再另外設計。
- 老虎機（`slot-machine`）專案——第二週之後才開始，不在本次範圍。

## 架構設計

### 1. Dashboard（純靜態頁面）

- 位置：repo 根目錄 `index.html` + `dashboard.css`（同層）。不建 Vite 專案、不用任何框架；直接用瀏覽器開啟該檔案，或掛任意靜態伺服器即可檢視，本身沒有建置步驟。
- 內容：每個 `projects/` 底下的專案一張卡片，卡片資訊：
  - 遊戲名稱
  - 簡短狀態說明（對應 `docs/FEATURES.md` 的當前狀態）
  - 連結：`http://localhost:<port>`（該專案的 dev server 網址）
  - 啟動指令提示文字：`cd projects/<name> && npm run dev`（純文字顯示，方便複製，dashboard 本身不會、也不需要主動幫你啟動 server）
- 新增一個專案時的更新步驟：在 `index.html` 加一張卡片 + 在該專案指定 dev port（見下）。不需要改 dashboard 本身的架構或程式碼結構。

### 2. Dev port 分配

- `projects/slot-game/`：維持現狀，不新增 `vite.config.ts`，沿用 Vite 預設 port `5173`。
- `projects/big-two/`：新增 `vite.config.ts`，明確設定 `server.port: 5174`。
- 之後新專案（例如 `slot-machine`）依序往下累加（`5175`...），並在 `docs/DEVELOPMENT.md` 的新增專案步驟中記錄「下一個可用 port」。

### 3. `projects/big-two/` Scaffold

完全比照 `projects/slot-game/` 現有骨架風格，僅搭建可執行的空殼，不含任何大老二規則：

```
projects/big-two/
├── package.json          # name: big-two, scripts: dev/build/preview（同 slot-game 寫法）, dependencies: phaser（不預先加 gsap）
├── tsconfig.json          # 與 slot-game 相同設定（target es2023、bundler moduleResolution、noEmit、嚴格 lint 選項）
├── vite.config.ts         # { server: { port: 5174 } }
├── index.html             # <div id="app"></div> + <script type="module" src="/src/main.ts">
├── .gitignore              # 與 slot-game 相同內容（node_modules/dist/.DS_Store/編輯器目錄等）
├── public/
│   └── favicon.svg        # 沿用 Vite 預設 favicon 即可，不特別客製
└── src/
    ├── main.ts             # 組裝 Phaser.Types.Core.GameConfig，scene: [BootScene, PreloadScene, GameScene]
    └── scenes/
        ├── BootScene.ts     # constructor 呼叫 super('BootScene')；create() 印 log 後 this.scene.start('PreloadScene')，preload() 留空
        ├── PreloadScene.ts  # constructor 呼叫 super('PreloadScene')；preload() 留空（尚無素材）；create() 呼叫 this.scene.start('GameScene')
        └── GameScene.ts     # constructor 呼叫 super('GameScene')；create() 放一行 placeholder 文字（例如 this.add.text(..., 'Big Two - Coming Soon')），確保 npm run dev 看得到畫面而非全黑
```

### 4. 文件更新

- `docs/DEVELOPMENT.md`：新增「新增一個遊戲專案的步驟」小節，內容涵蓋：複製 slot-game 骨架的檔案清單、指定下一個可用 dev port、在根目錄 `index.html` dashboard 加卡片、更新 `docs/FEATURES.md`。
- `docs/ARCHITECTURE.md`：在最上層補充一段「repo 是多個獨立 Vite/Phaser 專案 + 根目錄靜態 dashboard」的說明，並列出目前的 port 對照表。
- `CLAUDE.md`：常用指令區塊補充 dashboard 的開啟方式；關鍵規則補充「新遊戲 = 新的 `projects/<name>/` 資料夾，不要塞進既有專案的 Phaser Game 實例」。
- `docs/FEATURES.md`：新增「Big Two」區塊，狀態標示為 ⬜／🚧（骨架已建立，玩法未開始）。

## 驗證方式

- `cd projects/big-two && npm install && npm run dev`，瀏覽器開 `http://localhost:5174` 應看到 placeholder 畫面（非全黑、非錯誤畫面）。
- `cd projects/slot-game && npm run dev`（另開一個終端機）應仍在 `http://localhost:5173` 正常運作，兩者可同時開啟不衝突。
- 直接用瀏覽器開啟根目錄 `index.html`（或 `npx serve .`），應看到至少 slot-game、big-two 兩張卡片，連結分別指向 `:5173`、`:5174`。
- `npm run build`（在 `projects/big-two/` 下）應能成功跑過 `tsc && vite build`，不因空殼程式碼報型別錯誤。

## 風險與待確認事項

- Dashboard 目前只服務本機（`localhost:<port>` 連結），如果之後要放到 GitHub Pages 等靜態託管，連結策略需要改成相對路徑＋各專案的 build 產物，這部分留到有實際部署需求時再設計，目前的靜態卡片頁架構可以直接沿用、不需要重寫。
- `big-two` 目前只裝 `phaser`，若之後大老二設計需要 GSAP（例如發牌動畫），屆時再加 `dependencies`，不預先安裝未使用的套件。
