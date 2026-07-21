#!/bin/bash
# SessionStart(compact) hook: re-inject key project rules after context compaction.
cat <<'EOF'
## 專案關鍵規則提醒（compact 後重新注入，詳見 CLAUDE.md）

- 學習型 repo：不要提前把 src/managers/、src/objects/、src/types/ 的空檔案填滿，依 notes/dayNN.md 當天目標循序漸進。
- Scene 的碰撞/重疊回呼一律用箭頭屬性函式綁定 this，避免 Phaser callback context 遺失。
- 素材路徑：public/assets/ 下分 raw/（原始檔）、atlas/（TexturePacker 產出）、demo/（暫時性教學素材）。
- Commit message 格式：feat: 🎸 dayNN <描述>，詳見 .claude/rules/git-commit.md。
- 所有指令需在 projects/collect-stars/ 目錄下執行（npm run dev/build/preview）。
EOF
