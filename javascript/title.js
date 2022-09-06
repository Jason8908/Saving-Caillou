/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Title JS File
    This is the title screen JS file for our game.
*/ 

class title extends Phaser.Scene {
	constructor() {
		super(config);
		this.playText = null;
		this.creditsText = null;
		this.background = null;
		this.mainTheme = null;
		this.select1 = null;
		this.select2 = null;
	}
	preload() {

	} 
	create() {
		let title = this.scene.get('title');
		// Sound variables
		this.select1 = this.sound.add('select1');
		this.select2 = this.sound.add('select2');
		this.cameras.main.fadeFrom(200, 0, 0, 0);
		if(!tutorialComp && !creditsClick) {
			// Adding music to variable
			this.mainTheme = this.sound.add('mainTheme');
		}
		// Creating background image
		this.background = this.add.sprite(this.cameras.main.width/2,this.cameras.main.height/2, 'background');
		this.playText = this.add.bitmapText(40, 450, 'alagard', 'Play', 35);
		this.creditsText = this.add.bitmapText(150, 450, 'alagard', 'Credits', 35);
		// Creating background animation.
		
		this.background.anims.play('play', true);

		// Enabling inputs
		this.playText.inputEnabled = true;
		this.playText.pixelPerfectOver = true;
		this.playText.setInteractive();
		this.creditsText.setInteractive();

		// Playing main theme song.
		// Creating config variable for mainTheme
		let configMainTheme = {
			mute: false,
		    volume: 0.8,
		    rate: 1,
		    detune: 0,
		    seek: 0,
		    loop: true,
		    delay: 0
		}
		// Playing song with configuration argument
		this.mainTheme.play(configMainTheme);

		// Creating events
		// Hovers
		this.playText.on('pointerover', function(pointer) {
			game.scene.keys.title.playText.setTintFill(0xa9a9a9);
			selectSound.play();
		});
		this.playText.on('pointerout', function(pointer) {
			game.scene.keys.title.playText.setTintFill(0x000000);
		});
		this.creditsText.on('pointerover', function(pointer) {
			game.scene.keys.title.creditsText.setTintFill(0xa9a9a9);
			selectSound.play();
		});
		this.creditsText.on('pointerout', function(pointer) {
			game.scene.keys.title.creditsText.setTintFill(0x000000);
		});

		// Clicks
		title = this.scene.get('title'); //Updating scene object
		this.playText.on('pointerdown', function(pointer) {
			var mainGame = title.scene.get('mainGame');
			title.select2.play();
			title.mainTheme.stop();
			title.scene.start('mainGame');
			title.scene.moveAbove('title', 'mainGame');
			title.scene.pause('title');
		});
		title = this.scene.get('title'); //Updating scene object
		this.creditsText.on('pointerdown', function(pointer) {
			var mainGame = title.scene.get('mainGame');
			creditsClick = true;
			title.select2.play();
			title.mainTheme.stop();
			title.scene.start('credits');
			title.scene.moveAbove('title', 'credits');
			title.scene.pause('title');
		});
		// Setting cursor to image.
		cursor = this.physics.add.sprite(-100, -100, 'cursor');
	}
	update() {
		// Updating cursor
		updateCursor(game.input.mousePointer.x, game.input.mousePointer.y);
	}
}