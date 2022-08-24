import Phaser from 'phaser';
import { MyScene } from './scenes/my-scene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MyScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        }
    }
};

new Phaser.Game(config);
