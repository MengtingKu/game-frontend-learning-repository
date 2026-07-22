import Phaser from 'phaser'

/**
 * 大老二遊戲邏輯
 * Day02 示範：Image vs Sprite，以及 Transform API
 */
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    const cx = this.scale.width / 2 // 400
    const cy = this.scale.height / 2 // 300

    // ── 標題文字 ──────────────────────────────────────────
    this.add
      .text(cx, 40, 'Image  vs  Sprite', {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5)

    this.add
      .text(cx - 150, 80, 'this.add.image()', {
        fontSize: '14px',
        color: '#aaaaff'
      })
      .setOrigin(0.5)

    this.add
      .text(cx + 150, 80, 'this.add.sprite()', {
        fontSize: '14px',
        color: '#aaffaa'
      })
      .setOrigin(0.5)

    // ── 1. 建立兩張一模一樣的卡牌 ────────────────────────
    // 左邊：建立並渲染靜態圖片 Image（靜態，沒有 play()）
    const leftCard = this.add.image(cx - 150, cy, 'image')
    console.log('leftCard =>', leftCard)

    // 右邊：建立並建立並渲染 Sprite（可以動，有 play()）
    const rightCard = this.add.sprite(cx + 150, cy, 'sprite')
    console.log('rightCard =>', rightCard)

    // ── 2. setScale(1.5) ─────────────────────────────────
    leftCard.setScale(1.5)
    rightCard.setScale(1.5)

    // ── 2. setDisplaySize(width, height) ──────────────────
    // leftCard.setDisplaySize(200, 400)
    // rightCard.setDisplaySize(200, 400)

    // ── 3. setAngle(180) ──────────────────────────────────
    // leftCard.setAngle(180)
    // rightCard.setAngle(180)

    // ── 4. setFlipX(true) ────────────────────────────────
    // leftCard.setFlipX(true)
    // rightCard.setFlipX(true)

    // ── 5. play('left') ──────────────────────────────────
    // Image 沒有 play()，TypeScript 甚至不讓你呼叫（compile error）
    // 這裡用 type assertion 強制示範，執行期會拋 TypeError
    // try {
    //   // @ts-expect-error Image 沒有 play()，故意示範它會壞掉
    // leftCard.play('left')
    // } catch (e) {
    //   console.warn('[Image] play("left") 失敗 →', (e as Error).message)
    // }

    // Sprite 有 play()，正常執行
    // rightCard.play('left')
  }
}
