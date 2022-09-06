/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Main JS File
    This is the main JS file for out game.
*/ 

// Creating width and height variables
// Used in multiple functions and/or scenes

// Audio used in the title screen and the main game
// scene objects.
let menuSound = null; 
let selectSound = null;
let menuClose = null;
let backgroundMusic1 = null;
let laserSound = null;
let hitSound = null;
let reloadSound = null;

// Global variables
// the cursor is used in the main title screen as well as the game screen
// which is why we need a global variables for the two scene objects
var cursor = null;

// Arrays for scoreboard... multi-use accross multiple play throughs
let playerArray = [];
let scoresArray = [];

// Variable for whether or not user has completed tutorial so they will not
// have to do it again every time they click play.
let tutorialComp = false;
let creditsClick = false;

// Variables for scoreboards
let playerScores = [];
let playerInitial = [];

// Function to update the cursor
function updateCursor(newX, newY) {
	if(cursor == null) {
		return false;
	};
	cursor.x = newX;
	cursor.y = newY;
}//End of updateCursor

// Creating a method to swap elements of an array.
Array.prototype.swap = function(index1, index2) {
	let temp = 0;
	temp = this[index1];
	this[index1] = this[index2];
	this[index2] = temp;
};//End of array swap

// Bubble sorting algorithm that returns a sorted array.
function bubbleSort(scoreArray) {
	for(let i = 0; i < scoreArray.length; i++) {
		for(let x = 0; x < scoreArray.length; x++) {
			if(scoreArray[x] < scoreArray[x+1]) {
				scoreArray.swap(x, x+1);
				playerInitial.swap(x, x+1);
			};
		};
	};
	return scoreArray;
};//End of bubbleSort

// Used to update the position of the gun.
function updateGun(weapon, player, cursor) {
	// Checking if the player is still alive
	if(!player.alive) {
		weapon.destroy();
		return false;
	}
	weapon.x = player.x+11;
	weapon.y = player.y+15;
}//End on updateGun

// Function to rotate the gun. 
// Points the gun at the cursor.
function rotateGun(weapon, cursor) {
	let angle = Phaser.Math.RAD_TO_DEG * Phaser.Math.Angle.Between(weapon.x, weapon.y, cursor.x, cursor.y);
    weapon.setAngle(angle);
    // Flipping gun when angle is less than or greater than 90 degrees
    if(weapon.angle > 90 || weapon.angle < -90) {
    	weapon.flipY = true;
    }
    else {
    	weapon.flipY = false;
    }
}//End of rotateGun

// Function to move the player.
// Returns false if player alive is false.
function movePlayer(player, scene) {
	// Checking if player is still alive
	if(!player.alive) {
		return false;
	}
	// Moving the player.
	if (scene.s.isDown) {
		player.setVelocityY(150);
	}
	if (scene.w.isDown) {
		player.setVelocityY(-150);
	}
	if (scene.a.isDown) {
		player.setVelocityX(-150);
	}
	if (scene.d.isDown) {
		player.setVelocityX(150);
	}
	try {
		// Stopping the player from moving when WASD is not down.
		if(!scene.s.isDown && !scene.w.isDown) {
			
			player.setVelocityY(0);
		}
		if(!scene.a.isDown && !scene.d.isDown) {
			player.setVelocityX(0);
		}
		if (!scene.a.isDown && !scene.d.isDown && !scene.s.isDown && !scene.w.isDown) {
			player.anims.pause();
			player.setFrame(11);
		}	
	}
	catch(err) {

	}
}//End of movePlayer

function flicker(sprite, count) {
	if(count < 1) {
		return false;
	};
	sprite.setTintFill(0xffffff);
	setTimeout(function(event) {
		sprite.clearTint();
		setTimeout(function(event) {
			return flicker(sprite, count-1);
		}, 70);
	}, 70);
}//End of fllicker

// Function to return a random number between 1 and 100.
function randomVelocity() {
	return Math.round(Math.random()*400-200);
}//End of renadomVelocity

class load extends Phaser.Scene {
	constructor() {
		super(config);
		// Audio varables
		this.gunshot = null;

		// Used for checking key press.
		this.keyDown = false;

		// Images
		this.crack = null;

		// Width and height
		this.width = 900;
		this.height = 500;
	}//End of constructor
	preload() {
		//Creating Loading Bar
		let loadingBar = this.add.graphics(); //Creating loading bar
		let loadingBox = this.add.graphics(); //Creating loading box/border

		// Creating loading text
		let loadingText = this.make.text({
			//Setting the X and Y values
		    x: this.width / 2,
		    y: this.height / 2 - 50,
		    text: 'Loading...',
		    style: {
		        font: '30px monospace',
		        fill: '#ffffff'
    		}
		});

		// Creating current file text.
		let currentFile = this.make.text({
			//Setting the X and Y values
		    x: this.width / 2,
		    y: this.height / 2 + 23,
		    text: ' ',
		    style: {
		        font: '21px monospace',
		        fill: '#ffffff'
    		}
		})

		// Graphics objects don't have an 'origin' so we do some math
		// In order to center the loading bar.
		loadingBox.fillStyle(0x222222, 0.8);
		loadingBox.fillRect(this.width/2-195, this.height/2, 390, 50);

		// Setting anchor to center
		loadingText.setOrigin(0.5, 0.5);
		currentFile.setOrigin(0.5, 0.5);

		//Loading begins
		// ******************************************************************************************************************************************
		// Audio
		this.load.audio('mainTheme', 'assets/audio/mainTheme.mp3');
		this.load.audio('pistolSound', 'assets/audio/gunshot.mp3');
		this.load.audio('pistolReload', 'assets/audio/reload.mp3');
		this.load.audio('menuClose', 'assets/audio/menuClose.mp3');
		this.load.audio('menuSound', 'assets/audio/menuSound.mp3');
		this.load.audio('pistolReload', 'assets/audio/reload.mp3');
		this.load.audio('select1', 'assets/audio/select1.mp3');
		this.load.audio('select2', 'assets/audio/select2.mp3');
		this.load.audio('selectSound', 'assets/audio/selectSound.mp3');
		this.load.audio('backMus1', 'assets/audio/backgroundMusic1.mp3');
		this.load.audio('laserSound', 'assets/audio/laser.mp3');
		this.load.audio('hitSound', 'assets/audio/hitSound.mp3');
		this.load.audio('wahSound', 'assets/audio/wahSound.mp3');
		this.load.audio('credits', 'assets/audio/credits.mp3');

		// Images/Sprites
		this.load.image('crackImage', 'assets/sprites/crack.png');
		this.load.image('cursor', 'assets/sprites/cursor.png');
		this.load.image('bullet', 'assets/sprites/bullet.png');
		this.load.image('pistolFrame', 'assets/sprites/pistol.png');
		this.load.image('gameOver', 'assets/sprites/gameOver.png');
		this.load.image('credits', 'assets/sprites/credits.png');
		this.load.image('ammoIcon', '../images/ammoIcon.png');
		

		// Spritesheets
		this.load.spritesheet('background', 
	        'assets/spritesheets/background.png',
	        { frameWidth: 900, frameHeight: 500 }
	    );
	    this.load.spritesheet('mainOne', 
	        'assets/spritesheets/mainMove.png',
	        { frameWidth: 56, frameHeight: 71 }
	    );
	    this.load.spritesheet('mainOneFall', 
	        'assets/spritesheets/mainFall.png',
	        { frameWidth: 80, frameHeight: 71 }
	    );
	    this.load.spritesheet('pistol', 
	        'assets/spritesheets/pistol.png',
	        { frameWidth: 31, frameHeight: 24 }
	    );
	    this.load.spritesheet('hearts', 
	        'assets/spritesheets/hearts.png',
	        { frameWidth: 135, frameHeight: 45 }
	    );
	    this.load.spritesheet('reloadIcon', 
	        'assets/spritesheets/reloadIcon.png',
	        { frameWidth: 320, frameHeight: 320 }
	    );
	    this.load.spritesheet('scarecrow', 
	        'assets/spritesheets/dummy.png',
	        { frameWidth: 56, frameHeight: 71 }
	    );
	    this.load.spritesheet('enemies', 
	        'assets/spritesheets/enemy.png',
	        { frameWidth: 49, frameHeight: 33 }
	    );

	    // Fonts
	    this.load.bitmapFont('alagard', 'assets/fonts/alagard.png', 'assets/fonts/alagard.fnt');

	    // Tilemaps and Tilesets
	    //this.load.image('zeldaTiles', 'assets/maps/tileset_complete1.png');
	    //this.load.tilemapTiledJSON('tutorial', 'assets/maps/tutorial.json');
	    this.load.image('mainMapSet', 'assets/maps/mainMap.png');
	    this.load.tilemapTiledJSON('mainMap', 'assets/maps/mainMap.json');

		// Loading Ends *****************************************************************************************************************************

		// Checking for file finish loading
		// Will return a value between 0 and 1 based how many files loaded. (Stored in local var value).
		this.load.on('progress', function (value) {
			// Code
		    loadingBar.clear();
		    loadingBar.fillStyle(0xffffff, 1);

		    // Fills the graphic as a rectangle using an x and y coord, as well as a width and height value.
		    // Activates when progress is called.
		    loadingBar.fillRect(this.width/2-182.5, this.height/2+10, 365 * value, 30);
		    loadingText.setText(`Loading... ${parseInt(value * 100)}%`);
		});
		
		// Checks for file finish loading and returns properties of file in an object.
		// Used to display name of file currently loading
		this.load.on('fileprogress', function (file) {
			// Code
			// Displaying loaded file name.
			currentFile.setText(file.src);
		});

		// Activates when loading is complete
		this.load.on('complete', function () {
			// Code
			// Removes all of the loading assets from the screen
			currentFile.destroy();
			loadingBar.destroy();
			loadingText.destroy();
			loadingBox.destroy();
		});
	}//End of Preload
	create() {
		// Creating continue text
		let continueText = this.make.text({
			x: this.width / 2,
		    y: this.height / 2,
		    text: 'Press any key to continue...',
		    style: {
		        font: '25px monospace',
		        fill: '#ffffff'
    		}
		});

		// Setting anchor to center of object
		continueText.setOrigin(0.5, 0.5);

		// Assigning varibles to assets
		// Audio
		// Class Sounds
		this.gunshot = this.sound.add('pistolSound');
		reloadSound = this.sound.add('pistolReload');

		// Global Sounds
		selectSound = this.sound.add('selectSound');
		menuSound = this.sound.add('menuSound');
		menuClose = this.sound.add('menuClose');
		backgroundMusic1 = this.sound.add('backMus1');
		laserSound = this.sound.add('laserSound');
		hitSound = this.sound.add('hitSound');

		// Creating animations
		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNames('mainOne', {start:0, end:4}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNames('mainOne', {start:41, end:45}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNames('mainOne', {start:11, end:15}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNames('mainOne', {start:26, end:30}),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: 'pistolShoot',
			frames: this.anims.generateFrameNames('pistol', {start:0, end:6}),
			frameRate: 20,
			repeat: 0
		});
		this.anims.create({
			key: 'playerDeath',
			frames: this.anims.generateFrameNames('mainOneFall', {start:0, end:36}),
			frameRate: 10,
			repeat: 0
		});
		this.anims.create({
			key: 'reload',
			frames: this.anims.generateFrameNames('reloadIcon', {start:0, end:11}),
			frameRate:12,
			repeat: -1
		});
		this.anims.create({
			key: 'scarecrowDeath',
			frames: this.anims.generateFrameNames('scarecrow', {start:1, end:5}),
			frameRate:6,
			repeat: 0
		});
		this.anims.create({
		    key: 'play',
		    frames: this.anims.generateFrameNumbers('background', { start: 0, end: 13 }),
		    frameRate: 16,
		    repeat: -1
		});
		this.anims.create({
		    key: 'slimeMove',
		    frames: this.anims.generateFrameNumbers('enemies', { start: 0, end: 4 }),
		    frameRate: 10,
		    repeat: -1
		});
		this.anims.create({
		    key: 'slimeDeath',
		    frames: this.anims.generateFrameNumbers('enemies', { start: 5, end: 11 }),
		    frameRate: 10,
		    repeat: 0
		});// Allowing inputs when game loses focus
	}//End of create

	update() {
		// Checking for any keyboard input.
		this.input.keyboard.on('keydown', function (eventName, event) {
			if (!game.scene.keys.load.keyDown) {
				game.scene.keys.load.keyDown = true;
				game.scene.keys.load.gunshot.play();
				this.crack = game.scene.keys.load.add.sprite(350, 200, 'crackImage');
				setTimeout(function(){
					reloadSound.play();
				}, 490);
				setTimeout(function(){
					game.scene.start('title');
					game.scene.sleep('load');
				}, 900);
			};
		});
	}//End of update function
}//End of class load
