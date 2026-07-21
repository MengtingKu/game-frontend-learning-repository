import Phaser from 'phaser'

/**
 * 真正遊戲邏輯
 */
export default class GameScene extends Phaser.Scene {
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private stars!: Phaser.Physics.Arcade.Group
  private bombs!: Phaser.Physics.Arcade.Group
  private score = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameOver = false
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('GameScene')
  }

  /**
   * 建立畫面
   * - Phaser 3 預設用圖片中心定位，因此 (x, y) 代表中心，而不是左上角
   * - 將 Origin 改為 (0, 0) 後，(x, y) 就會代表圖片左上角的位置，這也是許多 UI 或網頁座標系統的行為
   * - 對於任務而言，畫背景、畫牌、建立按鈕 都是放在 create
   */
  create() {
    /**
     * 天空背景圖片
     */
    this.add.image(400, 300, 'sky')

    /**
     * 建立一個放「平台」的盒子 (Group)
     * - Group就是一個管理很多物件的集合
     * - 這裡的 static 意思是這個群組內的物件，在物理模擬中不會動（靜態）
     */
    this.platforms = this.physics.add.staticGroup()

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody() // 建立一個在 (400, 568) 的圖片，setScale(2) 把大小設成 2 倍，refreshBody() 更新物理邊界

    this.platforms.create(600, 400, 'ground')
    this.platforms.create(50, 250, 'ground')
    this.platforms.create(750, 220, 'ground')

    /**
     * 建立一個玩家代表的小人
     * - SpriteWithDynamicBody = Group 的子類別，多了物理屬性且是動態的
     */
    this.player = this.physics.add.sprite(100, 450, 'dude')

    this.player.setBounce(0.2) // 跳起後著地時始終會彈起那麼一點點 bounce 值 (0~1，1 是完全不減損，0 是完全不彈)
    this.player.setCollideWorldBounds(true) // 讓玩家不能離開遊戲世界（World）的邊界
    this.physics.add.collider(this.player, this.platforms) // 從現在開始持續檢查 player 和 platforms 有沒有撞到，如果撞到，就不要讓它們重疊

    // 建立玩家動畫
    this.anims.create({
      key: 'left', // 關鍵字，後面 update 會用到
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), // 幫我挑出哪些圖片來播放(從 0 開始，到 3 結束，因為 4th 是面向玩家的姿勢)
      frameRate: 10, // 一秒播放 10 張圖片
      repeat: -1 // -1 代表無限重複播放，0 代表只播放一次(總共 1 次)，1 代表重複播放一次(總共 2 次)，以此類推
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    /**
     * 建立一堆星星
     */
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70
      }
    })

    this.stars.children.iterate(child => {
      const sprite = child as Phaser.Physics.Arcade.Sprite
      sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      return true
    })

    this.physics.add.collider(this.stars, this.platforms)
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    ) // 註冊一個規則：當 player 和 stars 有重疊時，就執行 collectStar 函式

    /**
     * 分數
     */
    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '26px',
      color: '#000'
    })

    /**
     * 炸彈
     */
    this.bombs = this.physics.add.group()

    this.physics.add.collider(this.bombs, this.platforms)
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this
    )

    this.cursors = this.input.keyboard!.createCursorKeys()
  }

  /**
   * 收集星星的函式
   * 關閉星星，true 代表同時停用物理效果，true 代表同時從畫面上移除
   * @param player - 玩家
   * @param star - 星星
   */
  private collectStar = (_player: any, star: any) => {
    star.disableBody(true, true)

    this.score += 10
    this.scoreText.setText(`Score: ${this.score}`)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(child => {
        const sprite = child as Phaser.Physics.Arcade.Sprite
        sprite.enableBody(true, Phaser.Math.Between(0, 800), 0, true, true)
        sprite.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))

        return true
      })

      const x =
        this.player.x < 400
          ? Phaser.Math.Between(400, 800)
          : Phaser.Math.Between(0, 400)

      const bomb = this.bombs.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }

  /**
   * 撞到炸彈的函式
   * @param player - 玩家
   * @param bomb - 炸彈
   */
  private hitBomb = (player: any, _bomb: any) => {
    this.physics.pause()

    player.setTint(0xff0000)

    player.anims.play('turn')

    this.gameOver = true
  }

  /**
   * 更新遊戲狀態，每一幀都會執行
   * @returns void
   */
  update() {
    if (this.gameOver) return

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160)

      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160)

      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)

      this.player.anims.play('turn')
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330)
    }
  }
}
