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
      .text(cx, 40, 'Game Logic', {
        fontSize: '24px',
        color: '#ffffff',
        fontStyle: 'bold',
        fontFamily: 'Roboto'
      })
      .setOrigin(0.5)

    // this.add
    //   .text(cx - 250, 100, 'pointerover', {
    //     fontSize: '20px',
    //     color: '#aaaaff'
    //   })
    //   .setOrigin(0.5)

    // this.add
    //   .text(cx + 250, 100, 'pointermove', {
    //     fontSize: '20px',
    //     color: '#A8FF00'
    //   })
    //   .setOrigin(0.5)

    // 左邊：建立並渲染靜態圖片 Image（靜態，沒有 play()）
    // const leftCardBack = this.add.image(cx - 250, cy, 'image').setScale(1.2)
    // const leftCard = this.add
    //   .image(cx - 250, cy, 'image')
    //   .setScale(1)
    //   .setTint(0x7cfc00)
    // const eventTriggeredCardBack = this.add
    //   .image(cx + 250, cy, 'image')
    //   .setScale(1.2)
    // const eventTriggeredCard = this.add
    //   .image(cx + 250, cy, 'image')
    //   .setScale(1)
    //   .setTint(0x7cfc00)
    // const eventTriggeredCard = this.add
    //   .image(cx - 250, cy, 'image')
    //   .setTint(0xe0ebaf)

    /** 建立一個全域事件監聽：只要滑鼠/觸控點下，就在該位置生成一張新牌 */
    // this.input.on('pointerdown', pointer => {
    //   this.add.image(pointer.x, pointer.y, 'sprite')
    // })

    /** 讓 leftCard 可以被點擊 */
    // leftCard
    //   .setScale(1.8)
    //   .setInteractive()
    //   .on('pointerdown', () => {
    //     console.log('leftCard pointerdown')
    //     leftCard.x += 30
    //     leftCard.y += 10
    //   })

    /** DEMO3 case1：讓 eventTriggeredCard 可以有類似 css hover 效果，移入時放大，移出時回復 */
    // eventTriggeredCard.setInteractive({ draggable: true })

    // let multiple = 1
    // eventTriggeredCard
    //   .on('pointerover', () => {
    //     eventTriggeredCard.setScale((multiple *= 1.1))
    //     eventTriggeredCard.setTint(0xf8de7e)
    //   })
    //   .on('pointerout', () => {
    //     eventTriggeredCard.setScale(1)
    //     eventTriggeredCard.setTint(0xffffff)
    //   })

    /** DEMO4 建立可拖曳事件 */
    // eventTriggeredCard
    //   .on('dragstart', () => {
    //     console.log('dragstart')
    //     eventTriggeredCard.setScale(multiple * 0.9)
    //   })
    //   .on('drag', (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
    //     console.log('drag')
    //     eventTriggeredCard.setPosition(dragX, dragY)
    //   })
    //   .on('dragend', () => {
    //     console.log('dragend')
    //     eventTriggeredCard.setScale(multiple)
    //     eventTriggeredCard.setTint(0xd7e854)
    //   })

    /** DEMO5 case1: 相同花色 13 張牌組中選牌，點一下後浮起 */
    const CARD_COUNT = 13 // 牌組數量
    const spacing = 50 // 牌間距
    const totalWidth = (CARD_COUNT - 1) * spacing // 總寬度
    const startX = cx - totalWidth / 2 // 置中起點

    // for (let i = 0; i < CARD_COUNT; i++) {
    //   const card = this.add
    //     .image(startX + i * spacing, cy, `d${i + 1}`)
    //     .setOrigin(0.5)
    //     .setInteractive()

    //   card.on('pointerdown', () => {
    //     console.log('pointerdown => card is picked up')
    //     card.y -= 50
    //   })

    //   card.on('pointerup', () => {
    //     console.log('pointerup => card is put down')
    //   })
    // }

    /** DEMO5 case2: Fisher-Yates shuffle + 發13張牌 */
    // step1 建立完整牌組
    const suits = ['s', 'h', 'd', 'c']

    const allCards: string[] = []

    for (const suit of suits) {
      for (let rank = 1; rank <= CARD_COUNT; rank++) {
        allCards.push(`${suit}${rank}`)
      }
    }

    // step2 Fisher-Yates shuffle（原地洗牌）
    for (let i = allCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[allCards[i], allCards[j]] = [allCards[j], allCards[i]]
    }

    // step3 取 13 張發給玩家並且要保存所有卡片的資料
    const hand = allCards.slice(0, CARD_COUNT)
    const cards: Phaser.GameObjects.Image[] = []

    // step4 建立手牌並建立互動事件
    hand.forEach((key, i) => {
      const card = this.add
        .image(startX + i * spacing, cy, key)
        .setOrigin(0.5)
        .setInteractive()

      cards.push(card)

      card.setData('selected', false) // 記錄哪些牌被選取
      card.setData('originY', card.y) // 記錄原始 y 座標，用來放回原位

      card.on('pointerdown', () => {
        const selected = !card.getData('selected')
        card.setData('selected', selected)
        const originY = card.getData('originY')
        card.y = selected ? originY - 30 : originY
      })
    })

    // step5 建立按鈕，取消選牌 和 重新發牌
    const passButton = this.add
      .text(cx + 250, cy + 170, '重新選擇')
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setStyle({
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })

    passButton.on('pointerup', () => {
      cards.forEach(card => {
        if (card.getData('selected')) {
          card.y = card.getData('originY')
          card.setData('selected', false)
        }
      })
    })

    const reDealButton = this.add
      .text(cx - 250, cy + 170, '重新發牌')
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setStyle({
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'Arial'
      })

    reDealButton.on('pointerup', () => {
      this.scene.restart()
    })

    /** DEMO6  */
    // leftCard.setInteractive()
    // leftCard.on('pointerover', () => {
    //   console.log('pointerover')
    //   leftCard.setTint(0xf8de7e)
    // })
    // eventTriggeredCard.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    //   console.log('pointermove')
    //   eventTriggeredCard.setPosition(pointer.x, pointer.y)
    // })

    /** DEMO3 case2：建立一個矩形按鈕，模擬按鈕有 hover、pointerdown、pointerup 效果 */
    // const button = this.add
    //   .rectangle(cx, 1.5 * cy, 180, 50, 0xf8de7e, 1)
    //   .setOrigin(0.5)
    //   .setInteractive({ useHandCursor: true })

    // button
    //   .on('pointerover', () => {
    //     console.log('pointerover')
    //     button.setFillStyle(0xffcc00)
    //   })
    //   .on('pointerout', () => {
    //     console.log('pointerout')
    //     button.setFillStyle(0xff0000)
    //   })
    //   .on('pointerdown', () => {
    //     console.log('pointerdown')
    //     button.setScale(0.9)
    //     button.setFillStyle(0x00ff00)
    //   })
    //   .on('pointerup', () => {
    //     console.log('pointerup')
    //     button.setScale(1)
    //     button.setFillStyle(0x87ceeb)
    //   })

    // 右邊：建立並建立並渲染 Sprite（可以動，有 play()）
    // const rightCard = this.add.sprite(cx + 150, cy, 'sprite')

    // ── day02.1 setScale(1.8) ─────────────────────────────────
    // leftCard.setScale(1.8)

    // ── day02.2 setDisplaySize(width, height) ──────────────────
    // leftCard.setDisplaySize(200, 400)
    // rightCard.setDisplaySize(200, 400)

    // ── day02.3 setAngle(180) ──────────────────────────────────
    // leftCard.setAngle(180)
    // rightCard.setAngle(180)

    // ── day02.4 setFlipX(true) ────────────────────────────────
    // leftCard.setFlipX(true)
    // rightCard.setFlipX(true)

    // ── day02.5 play('left') ──────────────────────────────────
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
