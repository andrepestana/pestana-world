import Phaser from 'phaser'
import WebFontFile from '../font/WebFontFile'
import resizeApp from '../utils/resize'

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' })
    }

    preload() {
        this.load.addFile(new WebFontFile(this.load, ['Press Start 2P']))
        this.load.image('background', './assets/background.png');
        this.load.image('background-game', './assets/background-new.png');
        this.load.spritesheet('character', './assets/andre.png', { frameWidth: 60, frameHeight: 100 });


        this.load.audio('soundtrack', 'assets/soundtrack.mp3');
        this.load.audio('good', 'assets/good.mp3');
        this.load.audio('yeah', 'assets/yeah.mp3');
        this.load.audio('oh-oh', 'assets/oh-oh.mp3');
        this.load.audio('sweet', 'assets/sweet.mp3');
        this.load.audio('score', 'assets/score.mp3');

        this.touchingLeft = false

        this.load.image('ground', './assets/platform.png');

        this.load.image('collectableObject', './assets/beer.png');
        this.load.image('enemy', './assets/virus.png');

        this.load.image('arrowLeft', './assets/arrow-left.png');
        this.load.image('arrowRight', './assets/arrow-right.png');
        this.load.image('jumpButton', './assets/button_grey.png');

    }

    create() {
        // Add to resize event
        window.addEventListener('resize', resizeApp);

        // Set correct size when page loads the first time
        resizeApp();

        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');

        this.txt = this.make.text({
            x: this.cameras.main.centerX,
            y: 170,
            text: '  Pestana   ',
            origin: { x: 0.5, y: 0.5 },
            style: {
                fontFamily: '"Press Start 2P"',
                fontSize: '85px',
                fill: '#532382',
                wordWrap: { width: this.cameras.main.x },
                align: 'center',
                strokeThickness: 2
            }
        })
        this.txt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        this.txt = this.make.text({
            x: this.cameras.main.centerX,
            y: 280,
            text: '    World ',
            origin: { x: 0.5, y: 0.5 },
            style: {
                fontFamily: '"Press Start 2P"',
                fontSize: '85px',
                fill: '#532382',
                wordWrap: { width: this.cameras.main.x },
                align: 'center',
                strokeThickness: 2
            },
            thickness: 5
        })
        this.txt.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

        this.txt = this.make.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.height - 50,
            text: 'Press space bar \nor touch the screen to start',
            origin: { x: 0.5, y: 0.5 },
            style: {
                fontFamily: '"Press Start 2P"',
                fontSize: '30px',
                fill: 'black',
                wordWrap: { width: this.cameras.main.x },
                align: 'center'
            }
        })

        this.player = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 130, 'character', 4);
        this.player.displayWidth = 180
        this.player.displayHeight = 300


        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        this.input.on('pointerdown', function () {
            this.touchingScreen = true;
        }, this);
    }

    update() {
        if (this.spaceBar.isDown || this.touchingScreen) {
            this.scene.start('Level1Scene')
        }
    }
}