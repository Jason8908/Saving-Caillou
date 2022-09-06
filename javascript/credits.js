/*
	Jason, Elben, Lil1y, Fahad
	01/21/2020
	Credits JS File
	This is the JS file for the credits scene of our game.
*/
class credits extends Phaser.Scene {
	constructor() {
		super(config);
		this.creditsMusic = null;
		this.credits = null;
		this.backText = null;
		this.spaceBar = null;
	}//End of constructor
	preload() {

	}//End of preload
	create() {
		// Stopping sound from title scene
		game.scene.keys.title.mainTheme.stop();
		var credits = this.scene.get('credits'); //Getting scene object
		// Fade
		this.cameras.main.fadeFrom(200, 0, 0, 0);
		// Getting key objects
		this.spaceBar = this.input.keyboard.addKey('SPACE');

		this.cameras.main.setBackgroundColor(0x000000);
		// Config for music
		let config = {
			loop: true,
			volume: 0.1
		}
		// Assigning the sound to a variable.
		this.creditsMusic = this.sound.add('credits');
		// Playing sound
		this.creditsMusic.play(config);
		this.credits = this.add.image(0, 0, 'credits');
		this.credits.setOrigin(0, 0);

		// Adding text to go back.
		this.backText = this.add.bitmapText(30, 440, 'alagard', 'Press SPACE to go back.', 50);
		this.backText.setTintFill(0xffffff);

		credits = this.scene.get('credits'); //Updating scene object
		this.spaceBar.on('down', function(event) {
			credits.cameras.main.fade(1000, 0, 0, 0);
			setTimeout(function(event) {
				credits.creditsMusic.pause();
				game.scene.start('title');
    			game.scene.moveAbove('credits', 'title');
    			game.scene.pause('credits');
			}, 1000);
		});
	}//ENd of Create
	update() {
		
	}//End of update
} //End of Class Credit