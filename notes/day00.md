# Day00 Environment Setup

> 📆 2026-07-20

## 參考文件

- [Phaser 3](https://phaser.io)
- [Phaser 3 (中文)](https://phaser.io/tutorials/making-your-first-phaser-3-game-chinese)
- [iThome 鐵人賽: 遊戲製作新手救星---Phaser3網頁遊戲教學與實作 系列](https://ithelp.ithome.com.tw/m/users/20152515/ironman/5774)

## 任務

建立 HTML5 Game Frontend 開發環境，並建立 slot game prototype

## 已安裝

| 項目                     | 狀態 | 版本                                            |
| ------------------------ | ---- | ----------------------------------------------- |
| Git Repo 建立            | ✅   | -                                               |
| 本地資料夾               | ✅   | -                                               |
| projects/slot-game       | ✅   | -                                               |
| Vite + TS                | ✅   | 8.1.5                                           |
| Phaser (遊戲引擎)        | ✅   | 3.90.0                                          |
| GSAP (動畫函式庫)        | ✅   | 3.15.0                                          |
| TexturePacker (圖資打包) | ✅   | only 7 days free, so on-line is the best choice |
| README                   | ✅   | -                                               |

## TexturePacker 在 Slot Game 的建議流程

```ts
設計師提供 PNG

        ↓
assets/raw/symbols/

        ↓
TexturePacker
        ↓
assets/atlas/symbols.png
assets/atlas/symbols.json

        ↓
PreloadScene

this.load.atlas(
    'symbols',
    'assets/atlas/symbols.png',
    'assets/atlas/symbols.json'
)

        ↓
GameScene

this.add.image(x, y, 'symbols', 'seven.png');
```

## 下一步

- 建立 slot game prototype
