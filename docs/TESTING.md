# TESTING

## 現況

此專案**目前沒有安裝任何測試框架**，`package.json` 的 `devDependencies` 只有 `typescript` 與 `vite`，沒有 `vitest`、`jest` 或 `@testing-library/*`。目前的驗證方式是手動在瀏覽器（`npm run dev` → `http://localhost:5173`）操作遊戲確認行為，以及 `npm run build` 跑 `tsc` 型別檢查。

## 型別檢查作為最低限度驗證

```bash
cd projects/slot-game
npm run build   # 內部執行 tsc && vite build，tsc 失敗會中止 build
```

`tsconfig.json` 已開啟 `noUnusedLocals`、`noUnusedParameters`、`noFallthroughCasesInSwitch` 等嚴格檢查，可攔截一部分低階錯誤。

## 若未來要導入自動化測試

因為建置工具是 Vite，建議優先選用 [Vitest](https://vitest.dev/)（與 Vite 共用設定、啟動快）。導入時建議：

1. `npm install -D vitest`，在 `package.json` 加入 `"test": "vitest"`。
2. Phaser 場景邏輯（如 `collectStar`、`hitBomb` 的分數計算）若要單元測試，需將純邏輯（分數計算、payline 判定等）從 Scene 中抽離成不依賴 `Phaser.Scene` 實例的純函式，放在 `src/managers/` 或獨立的邏輯模組中，避免測試需要 mock 整個 Phaser runtime。
3. 視覺/物理相關行為（碰撞、動畫播放）不易用單元測試覆蓋，仍以手動瀏覽器驗證為主。

本文件應在實際導入測試框架後更新為：測試檔案表、執行順序與依賴關係、輔助函式說明、撰寫新測試的步驟與範例、常見陷阱。
