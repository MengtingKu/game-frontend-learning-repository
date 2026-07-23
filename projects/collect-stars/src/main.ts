import Phaser from 'phaser'

import BootScene from './scenes/BootScene'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // AUTO 、 CANVAS 、 WEBGL 、 HEADLESS
  scale: {
    mode: Phaser.Scale.FIT, // 自動按等比例縮放至最大可容納尺寸
    autoCenter: Phaser.Scale.CENTER_BOTH, // 水平垂直自動置中
    width: 800, // 遊戲內邏輯寬度
    height: 600 // 遊戲內邏輯高度
  },
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 300
      },

      debug: false
    }
  },

  scene: [BootScene, PreloadScene, GameScene]
}

new Phaser.Game(config)
