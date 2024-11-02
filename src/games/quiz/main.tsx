import { useEffect, useState, useRef } from 'react'
import Phaser, { Game as GameType } from 'phaser'

const GAME_CONFIG = {
  DEFAULT_WIDTH: 480,
  DEFAULT_HEIGHT: 720,
  DEFAULT_FONT: {
    fontFamily: 'Nikumaru',
    fontSize: '32px',
    color: '#000000',
    stroke: '#ffffff',
    strokeThickness: 4,
  } as Phaser.Types.GameObjects.Text.TextStyle,
}

class TitleScene extends Phaser.Scene {
  constructor() {
    super('titleScene')
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#91fff0')
    this.add
      .text(
        GAME_CONFIG.DEFAULT_WIDTH / 2,
        GAME_CONFIG.DEFAULT_HEIGHT / 2 - 100,
        'クイズゲーム',
        GAME_CONFIG.DEFAULT_FONT,
      )
      .setFontSize(64)
      .setOrigin(0.5, 0.5)
    this.add
      .text(
        GAME_CONFIG.DEFAULT_WIDTH / 2,
        GAME_CONFIG.DEFAULT_HEIGHT / 2 + 100,
        'スタート',
        GAME_CONFIG.DEFAULT_FONT,
      )
      .setFontSize(32)
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on('pointerup', () => {
        this.scene.start('gameScene')
      })
  }
}

const questions = [
  {
    question: '日本の首都はどこでしょう？',
    options: ['東京', '大阪', '京都', '名古屋'],
    answer: '東京',
  },
  {
    question: '次のうち、アメリカの通貨単位はどれでしょう？',
    options: ['ドル', 'ユーロ', '円', 'ウォン'],
    answer: 'ドル',
  },
  {
    question: '水の化学式は次のうちどれでしょう？',
    options: ['H2O', 'CO2', 'O2', 'N2'],
    answer: 'H2O',
  },
  {
    question: '日本で一番面積が広い都道府県はどこでしょう？',
    options: ['北海道', '青森', '岩手', '福島'],
    answer: '北海道',
  },
  {
    question: '次のうち、五円玉に描かれている植物はどれでしょう？',
    options: ['稲', '松', '桜', '梅'],
    answer: '稲',
  },
]

class GameScene extends Phaser.Scene {
  private questionManager: QuestionManager

  init(data: { questionManager: QuestionManager }) {
    if (data.questionManager && data.questionManager.currentQuestionIndex !== 0) {
      this.questionManager = data.questionManager
    }
  }

  constructor() {
    super('gameScene')
    this.questionManager = new QuestionManager(questions)
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor('#91fff0')
    const currentQuestion = this.questionManager.getCurrentQuestion()
    new QuestionNumber(this, this.questionManager.currentQuestionIndex + 1)
    new Question(this, currentQuestion.question)
    new Options(this, currentQuestion.options, currentQuestion.answer, this.questionManager)
    // タイトルに戻るボタン
    this.add
      .text(348, 8, 'EXIT＞', GAME_CONFIG.DEFAULT_FONT)
      .setInteractive()
      .on('pointerup', () => {
        this.questionManager.reset()
        this.scene.start('titleScene')
      })
  }
}

// 問題を管理するクラス
class QuestionManager {
  private questions: { question: string; options: string[]; answer: string }[] = []
  currentQuestionIndex: number = 0
  constructor(questions: { question: string; options: string[]; answer: string }[]) {
    this.questions = Phaser.Math.RND.shuffle(questions)
  }
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex]
  }
  nextQuestion() {
    this.currentQuestionIndex++
  }
  // 問題が最後まで行ったかどうか
  isFinished() {
    return this.currentQuestionIndex >= this.questions.length - 1
  }
  // 問題を最初に戻す
  reset() {
    this.currentQuestionIndex = 0
  }
}

// 問題番号を表示するためのクラス
class QuestionNumber extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, number: number) {
    super(scene, 32, 30, 'Q.' + number.toString(), GAME_CONFIG.DEFAULT_FONT)
    scene.add.existing(this)
  }
}

// 長文の問題文を折り返して表示するためのクラス
class Question extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, text: string) {
    super(scene, 32, 32, text, GAME_CONFIG.DEFAULT_FONT)
    scene.add.existing(this)
    this.setWordWrapWidth(400)
    this.setWordWrapCallback((word: string) => {
      return word
        .split('')
        .map((char, index) => (index % 12 === 0 ? '\n' + char : char))
        .join('')
        .replace(/[A-Za-z0-9]/g, function (s) {
          return String.fromCharCode(s.charCodeAt(0) + 0xfee0)
        })
    })
  }
}

// 4つの単語を入れたらTextBoxクラスを4つ作成するクラス
class Options extends Phaser.GameObjects.Group {
  public select: string = ''
  private answer: string

  constructor(
    scene: Phaser.Scene,
    words: string[],
    answer: string,
    private questionManager: QuestionManager,
  ) {
    super(scene)
    this.answer = answer
    const shuffledWords = Phaser.Math.RND.shuffle(words)
    shuffledWords.forEach((word, index) => {
      this.add(
        new TextBox(scene, 40, 380 + 80 * index, word, index + 1)
          .setInteractive()
          .on('pointerup', () => {
            this.select = word
            this.checkAnswer()
          }),
      )
    })
  }

  checkAnswer() {
    if (this.select === this.answer) {
      // 正解とTextBoxで一定時間表示
      this.scene.add
        .rectangle(0, 0, GAME_CONFIG.DEFAULT_WIDTH, GAME_CONFIG.DEFAULT_HEIGHT, 0x000000)
        .setAlpha(0.5)
        .setOrigin(0, 0)
      this.scene.add
        .text(240, 300, '正解', GAME_CONFIG.DEFAULT_FONT)
        .setFontSize(128)
        .setStroke('#ffffff', 16)
        .setOrigin(0.5, 0.5)
      setTimeout(() => {
        if (this.questionManager.isFinished()) {
          this.questionManager.reset()
          this.scene.scene.start('titleScene')
        } else {
          this.questionManager.nextQuestion()
          this.scene.scene.restart({ questionManager: this.questionManager })
        }
      }, 1000)
    } else {
      alert('不正解です。')
    }
  }
}

// 文字を入れられる400x64のrectangleクラスを作成
class TextBox extends Phaser.GameObjects.Rectangle {
  text: Phaser.GameObjects.Text
  constructor(scene: Phaser.Scene, x: number, y: number, text: string, number?: number) {
    super(scene, x, y, 400, 64, 0xffffff)
    scene.add.existing(this)
    this.setOrigin(0, 0)
    this.setStrokeStyle(4, 0x000000)
    this.text = scene.add.text(
      x + 16,
      y + 13,
      number ? number + '. ' + text : text,
      GAME_CONFIG.DEFAULT_FONT,
    )
  }
}

const Game = () => {
  const parentEl = useRef<HTMLDivElement>(null)
  const [, setGame] = useState<GameType | null>(null)

  useEffect(() => {
    if (!parentEl.current || document.querySelectorAll('#phaser-game canvas').length > 0) return
    const phaserGame = new GameType({
      type: Phaser.AUTO,
      width: GAME_CONFIG.DEFAULT_WIDTH, // ゲーム画面の横幅
      height: GAME_CONFIG.DEFAULT_HEIGHT, // ゲーム画面の高さ
      scale: {
        parent: parentEl.current,
        mode: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: parentEl.current,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [TitleScene, GameScene],
    })
    setGame(phaserGame)

    return () => {}
  }, [parentEl])

  return (
    <>
      <div ref={parentEl} id="phaser-game"></div>
    </>
  )
}

export default Game