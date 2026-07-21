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
   * - 任務：把 Phaser 官方教學 demo 的圖片載入
   * - 相關知識：preload() 裡面的 this.load，然後根據 spec 選擇要用的載入函式 image, audio, spritesheet, tilemap...
   */
  preload() {
    this.load.image('sky', 'assets/demo/sky.png')
    this.load.image('ground', 'assets/demo/platform.png')
    this.load.image('star', 'assets/demo/star.png')
    this.load.image('bomb', 'assets/demo/bomb.png')
    this.load.spritesheet('dude', 'assets/demo/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })
  }

  create() {
    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
