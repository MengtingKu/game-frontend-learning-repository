import Phaser from 'phaser'

import BootScene from './scenes/BootScene'
import PreloadScene from './scenes/PreloadScene'
import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
