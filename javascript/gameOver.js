/*
	Jason, Elben, Lily, Fahad
	01/21/2020
	Game Over JS File
	This is the game over screen for the game.
*/

class gameOver extends Phaser.Scene {
	constructor() {
		super(config);
	}//End of Cornstructor

	preload() {
		
	}//End of Preload

	create() {
		let background = this.add.sprite(0, 0, 'gameOver');
		background.setOrigin(0, 0);
		let wahSound = this.sound.add('wahSound');
		wahSound.play();
		setTimeout(function(event) {
			game.scene.keys.gameOver.cameras.main.fade(2000, 0, 0, 0);
			setTimeout(function(event) {
				game.scene.start('scoreBoard');
    			game.scene.moveAbove('gameOver', 'scoreBoard');
    			game.scene.pause('gameOver');
			}, 2000);
		}, 3000);
	}//End of Create

	update() {
		
	}//End of Update
};//End of Class gameOver