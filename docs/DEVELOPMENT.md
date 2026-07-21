# DEVELOPMENT

## 命名規則對照表

| 對象 | 規則 | 範例 |
|------|------|------|
| Scene 類別 | PascalCase，以 `Scene` 結尾 | `BootScene`、`PreloadScene`、`GameScene` |
| Scene key（`super()` 傳入的字串） | 與類別名稱相同 | `super('GameScene')` |
| Manager 類別 | PascalCase，以 `Manager` 結尾，置於 `src/managers/` | `AudioManager`、`GameManager` |
| GameObject 子類別 | PascalCase，置於 `src/objects/` | `Reel`、`Symbol`、`Button`、`WinLine` |
| Class 私有屬性 | camelCase，前綴不加 `_`（除非是 callback 參數刻意標示未使用） | `private scoreText!: Phaser.GameObjects.Text` |
| Callback 屬性函式（避免 `this` 遺失） | camelCase 箭頭屬性函式 | `private collectStar = (_player: any, star: any) => { ... }` |
| 未使用的 callback 參數 | 前綴 `_` | `(_player: any, star: any) => {}` |
| 素材 key（`this.load.image(key, path)`） | camelCase 或全小寫 | `'sky'`、`'ground'`、`'dude'` |
| 學習筆記檔名 | `dayNN.md`（NN 為兩位數流水號） | `day00.md`、`day01.md` |
| 靈感筆記檔名 | `YYYY-MM-DD.md` | `2026-07-20.md` |
| 計畫檔名 | `YYYY-MM-DD-<feature-name>.md` | `2026-07-25-reel-spin.md` |

## 模組系統

- ESM only（`package.json` 設定 `"type": "module"`）。
- `tsconfig.json` 使用 `moduleResolution: "bundler"`、`verbatimModuleSyntax: true`、`noEmit: true`（型別檢查用 `tsc`，實際打包交給 Vite）。
- 匯入 Phaser：`import Phaser from 'phaser'`（default export）。
- 每個 Scene/Manager/Object 檔案一律 `export default class ...`，對應檔名（PascalCase）。

## 新增一個 Scene 的步驟

1. 在 `src/scenes/` 建立 `XxxScene.ts`，繼承 `Phaser.Scene`，建構子呼叫 `super('XxxScene')`。
2. 依需求實作 `preload()`（載素材）、`create()`（建畫面/規則）、`update()`（每幀邏輯，非必要不用實作）。
3. 若有需要跨幀保存狀態的物件（如 `this.player`），宣告為 class 屬性並用 `!` non-null assertion（因為是在 `create()` 而非建構子中賦值），而非在建構子中初始化。
4. 在 `src/main.ts` 的 `scene: [...]` 陣列中依執行順序加入該 Scene class。
5. 場景間切換使用 `this.scene.start('TargetSceneKey')`。

## 新增一個 Manager 的步驟

1. 在 `src/managers/` 建立對應檔案（目前四個管理器檔案已預留：`AnimationManager`、`AssetManager`、`AudioManager`、`GameManager`）。
2. 決定是否需要單例模式（目前尚無任何實作可參考，導入前先在 `notes/dayNN.md` 記錄設計決策）。
3. 由 Scene 的 `create()` 中實例化或呼叫，避免跨 Scene 重複建立。

## 新增一個 GameObject 子類別的步驟

1. 在 `src/objects/` 建立檔案，繼承對應的 Phaser GameObject（如 `Phaser.GameObjects.Container`、`Phaser.GameObjects.Sprite`）。
2. 建構子接收 `scene: Phaser.Scene` 與初始化參數，內部呼叫 `scene.add.existing(this)` 註冊進場景。

## JSDoc 註解風格

沿用現有 Scene 的寫法，中文簡短描述用途，只在**非顯而易見**的地方加註解（例如參數預設值陷阱、業務邏輯原因）：

```ts
/**
 * 收集星星的函式
 * 關閉星星，true 代表同時停用物理效果，true 代表同時從畫面上移除
 * @param player - 玩家
 * @param star - 星星
 */
private collectStar = (_player: any, star: any) => { ... }
```

方法層級用一行 `/** 用途說明 */`；只有當參數的行為容易誤解時才加 `@param`。不要為每個屬性或顯而易見的方法寫大段 docstring。

## 環境變數

目前專案沒有任何環境變數（無 `.env`、無後端 API key）。若未來需要（例如後端 API base URL），應在此表補上：

| 變數 | 用途 | 必要性 | 預設值 |
|------|------|--------|--------|
| （目前無） | - | - | - |

## 計畫歸檔流程

1. 計畫檔案命名格式：`YYYY-MM-DD-<feature-name>.md`，放在 `docs/plans/`。
2. 計畫文件結構：User Story → Spec → Tasks。
3. 功能完成後：移至 `docs/plans/archive/`。
4. 更新 `docs/FEATURES.md` 和 `docs/CHANGELOG.md`。

## Git Commit 慣例

見 [`.claude/rules/git-commit.md`](../.claude/rules/git-commit.md)。簡述：`feat: 🎸 dayNN <描述>`。

## 學習筆記慣例

每日筆記依 `notes/template.md` 結構撰寫（今日目標 → 今日知識 → 完成畫面/Demo GIF → Git Commit → 學會的 API → AI Prompt 除錯歷程 → Reflection → 明日預告）。逆向工程分析筆記依 `game-analysis/template.md` 結構撰寫。
