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
    // 建立玩家動畫（全域共享）
    this.anims.create({
      key: 'left', // 關鍵字，後面 update 會用到
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), // 幫我挑出哪些圖片來播放(從 0 開始，到 3 結束，因為 4th 是面向玩家的姿勢)
      frameRate: 10, // 一秒播放 10 張圖片
      repeat: -1 // -1 代表無限重複播放，0 代表只播放一次(總共 1 次)，1 代表重複播放一次(總共 2 次)，以此類推
    })

    this.anims.create({
      key: 'turn', // 關鍵字，後面 update 會用到
      frames: [{ key: 'dude', frame: 4 }], // 幫我挑出哪些圖片來播放(從 0 開始，到 3 結束，因為 4th 是面向玩家的姿勢)
      frameRate: 20 // 一秒播放 20 張圖片
    })

    this.anims.create({
      key: 'right', // 關鍵字，後面 update 會用到
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), // 幫我挑出哪些圖片來播放(從 5 開始，到 8 結束，因為 4th 是面向玩家的姿勢)
      frameRate: 10, // 一秒播放 10 張圖片
      repeat: -1 // -1 代表無限重複播放，0 代表只播放一次(總共 1 次)，1 代表重複播放一次(總共 2 次)，以此類推
    })

    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
