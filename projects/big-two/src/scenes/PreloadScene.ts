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
   * - 目前尚未設計大老二的美術素材，之後有牌面圖集時再補上 this.load.atlas(...)
   */
  preload() {}

  create() {
    this.scene.start('GameScene') // 切換到下一個 Scene
  }
}
