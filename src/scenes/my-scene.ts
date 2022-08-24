import Phaser from 'phaser';
import { ANIM_PLAYER_LEFT, ANIM_PLAYER_RIGHT, ANIM_PLAYER_TURN, BOMB, GROUND, PLAYER, SKY, STAR } from '../constant';

export class MyScene extends Phaser.Scene {

    private bombs: Phaser.Physics.Arcade.Group;

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    private platforms: Phaser.Physics.Arcade.StaticGroup;

    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private stars: Phaser.Physics.Arcade.Group;

    // scores
    private score = 0;

    private scoreText: Phaser.GameObjects.Text;

    private gameOver = false;

    preload() {
        this.load.image(SKY, 'assets/sky.png');
        this.load.image(GROUND, 'assets/platform.png');
        this.load.image(STAR, 'assets/star.png');
        this.load.image(BOMB, 'assets/bomb.png');
        this.load.spritesheet(PLAYER,
            'assets/player.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(400, 300, SKY);

        this.addPlatforms();

        this.addPlayer();
        this.physics.add.collider(this.player, this.platforms);

        this.addStars();
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });

        this.addBombs();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        this.addControlsToPlayer();
    }

    private addPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, GROUND).setScale(2).refreshBody();
        this.platforms.create(600, 400, GROUND);
        this.platforms.create(50, 250, GROUND);
        this.platforms.create(750, 220, GROUND);
    }

    private addPlayer() {
        this.player = this.physics.add.sprite(100, 450, PLAYER);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: ANIM_PLAYER_LEFT,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: ANIM_PLAYER_TURN,
            frames: [{ key: PLAYER, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: ANIM_PLAYER_RIGHT,
            frames: this.anims.generateFrameNumbers(PLAYER, { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    private addControlsToPlayer() {
        this.cursors = this.input.keyboard.createCursorKeys();

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play(ANIM_PLAYER_LEFT, true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play(ANIM_PLAYER_RIGHT, true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play(ANIM_PLAYER_TURN);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    private addStars() {
        this.stars = this.physics.add.group({
            key: STAR,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate((child: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    }

    private collectStar(
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    ) {
        star.disableBody(true, true);

        // scores
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);

        // after creating hitBomb method
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) => {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            const bomb: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody = this.bombs.create(x, 16, BOMB);
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    private addBombs() {
        this.bombs = this.physics.add.group();
    }

    private hitBomb(
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        bomb: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    ) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play(ANIM_PLAYER_TURN);

        this.gameOver = true;
    }
}
