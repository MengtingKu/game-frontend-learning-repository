import Phaser from 'phaser'

/**
 * 大老二遊戲邏輯
 * - 目前僅為 placeholder，確認 Scene 骨架可以正常執行
 * - 實際玩法（發牌、選牌、出牌、AI 回合、結算）留到專屬的 brainstorm session 再設計
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    this.add
      .text(400, 300, 'Big Two - Coming Soon', {
        fontSize: '32px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
  }
}
