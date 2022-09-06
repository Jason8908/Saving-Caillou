/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Preload JS File
    This is the main JS file for our game.
*/ 

class preload extends Phaser.Scene {
	constructor() {
		super(config);
	}//End of Cornstructor

	preload() {
		// Loading fonts
		this.load.bitmapFont('textFont', 'assets/fonts/textFont.png', 'assets/fonts/textFont.fnt');
	}//End of Preload

	create() {
		game.scene.start("load");
	}//End of Create
};//End of Class preload
