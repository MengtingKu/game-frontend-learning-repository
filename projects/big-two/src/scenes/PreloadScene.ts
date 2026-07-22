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
   * - 用程式生成一張假卡牌 texture（key: 'card'），不依賴外部圖檔
   * - 之後有牌面圖集時再替換成 this.load.atlas(...)
   */
  preload() {
    // 載入 assets 中的撲克牌圖片
    this.load.image('image', 'assets/img_poker_s1_simplify.png')
    this.load.image('sprite', 'assets/img_poker_h1_simplify.png')
  }

  create() {
    // 建立 animation 'left'，供 Sprite.play() 示範
    // Image 沒有 play()，所以這個 anim 只有 Sprite 能用
    this.anims.create({
      key: 'left', // 關鍵字，後面 update 會用到
      frames: [{ key: 'image' }],
      frameRate: 1,
      repeat: -1
    })

    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
