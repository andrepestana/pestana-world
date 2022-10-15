import Phaser from 'phaser'
import MyButton from './MyButton'
import resizeApp from '../utils/resize'

export default class Level1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1Scene' })
    }
    preload() {
        // 
    }
    create() {
        try {

            // Add to resize event
            window.addEventListener('resize', resizeApp);

            // Set correct size when page loads the first time
            resizeApp();

            this.scale.refresh();

            this.restarting = false
            this.gameOver = false
            this.score = 0

            this.soundtrack = this.sound.play('soundtrack', {
                loop: true,
                volume: 0.6,
                detune: 0,
                seek: 0
            })

            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background-game');

            this.createPlatforms()

            this.createPlayer()

            if (!this.sys.game.device.os.desktop) {
                this.setVirtualJoystick()
            }
            this.cursors = this.input.keyboard.createCursorKeys();

            this.createCollectableObjects()

            this.enemies = this.physics.add.group();

            //  The score
            this.scoreText = this.add.text(16, 16, 'score:0', {
                fontFamily: '"Press Start 2P"',
                fontSize: '20px'
            });

            //  Collide the player and the collectableObjects with the platforms
            this.physics.add.collider(this.player, this.platforms);
            this.physics.add.collider(this.collectableObjects, this.platforms);
            this.physics.add.collider(this.enemies, this.platforms);

            //  Checks to see if the player overlaps with any of the collectableObjects, if he does call the collectObject function
            this.physics.add.overlap(this.player, this.collectableObjects, this.collectObject, null, this);

            this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

            this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

            this.input.on('pointerdown', function (event) {
                // if (this.gameOver)
                //     this.restart();
            }, this);
        } catch (e) {
            console.log('create()', e)
        }

    }
    restart() {
        if (!this.restarting) {
            this.restarting = true
            this.scene.restart();
        }
    }
    update() {

        this.spaceBar
        if (this.gameOver && (this.spaceBar.isDown)) {
            this.scene.restart()
        }

        if (this.gameOver) {
            return;
        }
        if (this.cursors.left.isDown || this.touchingLeft) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown || this.touchingRight) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if ((this.cursors.up.isDown || this.touchingJumpButton) && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
    collectObject(player, collectableObject) {
        collectableObject.disableBody(true, true);

        //  Add and update the score
        this.score += 10;

        this.scoreText.setText('score:' + this.score);

        if (this.score % 1000 == 0) {
            this.sound.play('yeah')
            this.scoreText.setStyle({
                fontFamily: '"Press Start 2P"',
                fontSize: '80px',
                color: 'red'
            })
            setTimeout(() => {
                this.scoreText.setStyle({
                    fontFamily: '"Press Start 2P"',
                    fontSize: '20px',
                    color: 'white'
                })
            }, 2000);
        } else if (this.score % 500 == 0) {
            this.sound.play('sweet')
            this.scoreText.setStyle({
                fontFamily: '"Press Start 2P"',
                fontSize: '40px',
                color: 'red'
            })
            setTimeout(() => {
                this.scoreText.setStyle({
                    fontFamily: '"Press Start 2P"',
                    fontSize: '20px',
                    color: 'white'
                })
            }, 1000);
        } else if (this.score % 100 == 0) {
            this.sound.play('good')
            this.scoreText.setStyle({
                fontFamily: '"Press Start 2P"',
                fontSize: '30px',
                color: 'purple'
            })
            setTimeout(() => {
                this.scoreText.setStyle({
                    fontFamily: '"Press Start 2P"',
                    fontSize: '20px',
                    color: 'white'
                })
            }, 1000)
        } else {
            this.sound.play('score')
        }

        if (this.collectableObjects.countActive(true) === 0) {
            //  A new batch of collectableObjects to collect
            this.collectableObjects.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < this.cameras.main.centerX) ?
                Phaser.Math.Between(this.cameras.main.centerX, this.cameras.main._width) :
                Phaser.Math.Between(0, this.cameras.main.centerX);

            var enemy = this.enemies.create(x, 16, 'enemy');
            enemy.setTint(0x00ff00);
            enemy.setBounce(1);
            enemy.setCollideWorldBounds(true);
            enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
            enemy.allowGravity = false;
            enemy.displayWidth = 40
            enemy.displayHeight = 40
        }
    }
    hitEnemy(player, enemy) {
        this.physics.pause();
        this.sound.stopAll()
        // this.soundtrack = this.sound.play('soundtrack', {
        //     loop: true,
        //     volume: 0.6,
        //     detune: -250,
        //     seek: 0
        // })

        setTimeout(() => {
            this.sound.stopAll()
            this.sound.setDetune(0)
            this.sound.play('oh-oh')

        }, 500)
        player.setTint(0xff0000);

        player.anims.play('turn');
        this.gameOver = true;

        // Disable input
        this.input.keyboard.enabled = false;
        setTimeout(() => {
            this.input.keyboard.enabled = true;
            this.txt = this.make.text({
                x: this.cameras.main.centerX,
                y: this.cameras.main.height - 150,
                text: 'Press space bar or touch the screen to restart',
                origin: { x: 0.5, y: 0.5 },
                style: {
                    fontFamily: '"Press Start 2P"',
                    fontSize: '35px',
                    fill: 'black',
                    align: "center",
                    wordWrap: { width: this.cameras.main.width - 100 }
                }
            })
            this.input.on('pointerdown', function (event) {
                if (this.gameOver)
                    this.restart();
            }, this);
        }, 3000)

        this.txt = this.make.text({
            x: this.cameras.main.centerX,
            y: this.cameras.main.centerY,
            text: 'GAME OVER',
            origin: { x: 0.5, y: 0.5 },
            style: {
                fontFamily: '"Press Start 2P"',
                fontSize: '90px',
                fill: 'red',
                wordWrap: { width: this.cameras.main.width }
            }
        })


    }
    setVirtualJoystick() {
        //Set left button
        let leftButton = new MyButton(this, 80, this.cameras.main.height - 130, 'arrowLeft');
        leftButton.displayHeight = 150
        leftButton.displayWidth = 150
        leftButton.setAlpha(0.2)
        leftButton.setDepth(1);
        this.add.existing(leftButton);
        leftButton.onPressed = () => {
            this.touchingLeft = true;
        };
        leftButton.onReleased = () => {
            this.touchingLeft = false;
        };

        //Set right button
        let arrowRight = new MyButton(this, 260, this.cameras.main.height - 130, 'arrowRight');
        arrowRight.displayWidth = 150
        arrowRight.displayHeight = 150
        arrowRight.setAlpha(0.2)
        arrowRight.setDepth(1);
        this.add.existing(arrowRight);
        arrowRight.onPressed = () => {
            this.touchingRight = true;
        };
        arrowRight.onReleased = () => {
            this.touchingRight = false;
        };

        //Set jump button
        let jumpButton = new MyButton(this, this.cameras.main.width - 70, this.cameras.main.height - 130, 'jumpButton');
        jumpButton.displayWidth = 150
        jumpButton.displayHeight = 150
        jumpButton.setAlpha(0.2)
        jumpButton.setDepth(1);
        this.add.existing(jumpButton);
        jumpButton.onPressed = () => {
            this.touchingJumpButton = true;
        };
        jumpButton.onReleased = () => {
            this.touchingJumpButton = false;
        };
    }
    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(this.cameras.main.centerX, this.cameras.main.height - 20, 'ground').setScale(3).refreshBody();
        this.platforms.create(this.cameras.main.width - 180, this.cameras.main.height - 200, 'ground');
        this.platforms.create(this.cameras.main.width, 240, 'ground');
        this.platforms.create(100, 300, 'ground');
        this.platforms.create(this.cameras.main.width - 50, this.cameras.main.height - 350, 'ground');
        this.platforms.create(300, 450, 'ground');
    }
    createPlayer() {
        this.player = this.physics.add.sprite(650, 450, 'character');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'character', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }
    createCollectableObjects() {
        this.collectableObjects = this.physics.add.group({
            key: 'collectableObject',
            repeat: 14,
            setXY: { x: 20, y: 0, stepX: 70 }
        });

        this.collectableObjects.children.iterate(function (child) {

            //  Give each collectableObject a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
    }
}