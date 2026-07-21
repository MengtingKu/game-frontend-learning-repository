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
    // 用 Graphics 畫一張 80×120 的假卡牌，再轉成 texture
    const gfx = this.make.graphics({ x: 0, y: 0, add: false })

    // 卡底：白色圓角矩形
    gfx.fillStyle(0xffffff)
    gfx.fillRoundedRect(0, 0, 80, 120, 8)

    // 邊框
    gfx.lineStyle(3, 0x333333)
    gfx.strokeRoundedRect(0, 0, 80, 120, 8)

    // 中心裝飾：紅色菱形
    gfx.fillStyle(0xe63946)
    gfx.fillTriangle(40, 30, 60, 60, 40, 90)
    gfx.fillTriangle(40, 30, 20, 60, 40, 90)

    gfx.generateTexture('card', 80, 120)
    gfx.destroy()
  }

  create() {
    // 建立一個只有單幀的假 animation 'left'，供 Sprite.play() 示範
    // Image 沒有 play()，所以這個 anim 只有 Sprite 能用
    this.anims.create({
      key: 'left',
      frames: [{ key: 'card', frame: 0 }],
      frameRate: 1,
      repeat: -1
    })

    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
