import Phaser from 'phaser'
import MainMenuScene from './scenes/MainMenuScene'
import Level1Scene from './scenes/Level1Scene'

const config = {
  parent: 'phaser-app',
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.FIT,
    width: 1024,
    height: 768,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  input: {
    activePointers: 3,
  },
  scene: [MainMenuScene, Level1Scene],
  audio: {
    disableWebAudio: true
  }
}

new Phaser.Game(config)
