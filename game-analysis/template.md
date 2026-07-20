# Day?? Reverse Engineering：Slot Game

> 📆 2026-??-??

# 遊戲流程

```ts
Spin

↓
洗牌 Reel Spin

↓
發牌 Reel Stop

↓
玩家回合

↓
AI 回合結算

↓
有人出完

↓
結算

↓
Restart
```

# UI

- Start Button
- Pass Button
- Card Area
- Player Hand
- Opponent Hand

# 動畫

- 發牌
- 選牌放大
- 出牌飛出
- 收牌

# 音效

- 發牌
- 點牌
- 出牌
- Win
- Lose

# 特效

- 發光
- Shadow
- Particle

# 我猜 Phaser 會怎麼做

```ts
Scene

↓
GameScene Container

↓
Player Hand Tween

↓
發牌動畫 Input

↓
點牌 Depth

↓
牌浮起
```

# 可以偷學的地方

- 發牌速度
- Hover 效果
- 選牌動畫
- UI Layout
- 顏色搭配

# 我想自己試做

- 發牌動畫
- Hover
- 選牌效果
