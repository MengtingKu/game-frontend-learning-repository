import Phaser from 'phaser'

/**
 * 初始化不載素材
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  /**
   * 載入資源
   */
  preload() {}

  /**
   * 建立畫面
   */
  create() {
    console.log('Boot')
    this.scene.start('PreloadScene') // 切換到下一個 Scene
  }
}
