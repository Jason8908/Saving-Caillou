/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Game/Tutorial
    This is the tutorial and game JS file for our game.
*/

class mainGame extends Phaser.Scene {
	constructor() {
		super(config);
		this.scarecrow = null;
		this.scoreText = null;
		this.ammoText = null;
		this.player = null;
		this.gun = null;
		this.healthSprites = null;
		this.gunSprite = null;
		this.reloadIcon = null;
		this.reloading = false;
		this.reloadCoolDown = false;
		this.enemies = null;
		this.numberOfEnemies = 0;
		this.config = null;
		this.score = 0; 
		this.slimeMove = false;
		this.startSpawn = false;
		this.waveText = null;
		this.waves = 'Tutorial';
		this.maxEnemies = 0;
		this.wasd = null;
		// Getting keyboard object
		this.w = null;
		this.a = null;
		this.s = null;
		this.d = null;
		this.r = null;
	}//End of Constructor

	preload() {
		this.load.scenePlugin({
	        key: 'WeaponPlugin',
	        url: 'javascript/weaponPlugin.js',
	        sceneKey: 'mainGame'
	    });

	}//End of Preload

	create() {
		//Getting keyboard objects
		game.input.enabled = true;

		if(tutorialComp) {
			// Resetting waves to 1 every time.
			// This is to make sure the player does not
			// start at they wave they died at last game
			// if they choose to play again.
			this.waves = 1;
		}

		// Variable to dictate when to spawn slimes
		this.startSpawn = false;
		if(tutorialComp) {
			setTimeout(function(event) {
				game.scene.keys.mainGame.startSpawn = true;
			}, 500);
		}

		this.cameras.main.fadeFrom(200, 0, 0, 0);
		this.score = 0;
		let mainGame = this.scene.get('mainGame');
		//Playing a sound
		setTimeout(function() {
			menuClose.play();
		}, 500);

		// Background Music 
		var backConfig = {
			mute: false,
		    volume: 0.8,
		    rate: 1,
		    detune: 0,
		    seek: 0,
		    loop: true,
		    delay: 0
		}
		setTimeout(function() {
			backgroundMusic1.play(backConfig);
		}, 1200);

		// Setting up the map and its layers.
		this.map = this.add.tilemap('mainMap');
		var tileset = this.map.addTilesetImage('16x16_horizontal_Denzi140721-1','mainMapSet');
		this.backgroundLayer = this.map.createStaticLayer('floor', tileset);
		//this.floorLayer = this.map.createStaticLayer('floor', tileset);
		this.wallLayer = this.map.createStaticLayer('Walls', tileset);

		// Colliding with the walls
		this.map.setCollision(2);

		// Creating the sprites
		// Player
		this.player = this.physics.add.sprite(503, 350, 'mainOne');
		this.player.setFrame(11);
		this.player.body.setAllowGravity(false);

		// Health bar
		this.healthSprites = this.add.sprite(100, 50, 'hearts');

		// Reload GIF
		this.reloadIcon = this.add.sprite(697, 462, 'reloadIcon');
		this.reloadIcon.displayWidth = 31;
		this.reloadIcon.displayHeight = 31;
		this.reloadIcon.visible = false;
		//Ammo Icon
		this.ammoIcon = this.add.image(850, 462, 'ammoIcon')
		this.ammoIcon.displayWidth = 61;
		this.ammoIcon.displayHeight = 61;
		this.ammoIcon = this.add.image(870, 462, 'ammoIcon')
		this.ammoIcon.displayWidth = 61;
		this.ammoIcon.displayHeight = 61;

		// Checks if tutorial is not completed
		if(!tutorialComp) {
			// Scarecrow Sprite
			this.scarecrow = this.physics.add.sprite(450, 250, 'scarecrow');
			this.scarecrow.setImmovable(true);
			this.scarecrow.HP = 20;
			this.scarecrow.alive = true;
			this.scarecrow.displayWidth = 71;
			this.scarecrow.displayHeight = 101;
		};
		
		// Cursor
		cursor = this.physics.add.sprite(-100, -100, 'cursor');

		// Pistol
		this.gunSprite = this.add.sprite(this.player.x+11, this.player.y+15, 'pistolFrame');
		this.gunSprite.setDisplaySize(40, 29);
		this.gunSprite.setOrigin(0, 0.5);
		
		// Setting the world bounds
		this.physics.world.setBounds(0, 0, 960, 640, true, true, true, true);

		// Setting up weapons
		this.gun = this.add.weapon(25, 'bullet');
		this.gun.bulletLifespan =  150;
		this.gun.bulletKillType = 5;
		this.gun.bulletSpeed = 350;
		this.gun.fireRate = 180; 
		this.gun.bulletAngleVariance = 1;
		this.gun.fireLimit = 25;
		this.gun.trackSprite(this.gunSprite, 0, 0, true);

		// Playing the reload animation for the sprite
		this.reloadIcon.anims.play('reload');
		mainGame = this.scene.get('mainGame');

		// Getting keyboard object
		this.w = this.input.keyboard.addKey('W');
		this.a = this.input.keyboard.addKey('A');
		this.s = this.input.keyboard.addKey('S');
		this.d = this.input.keyboard.addKey('D');
		this.r = this.input.keyboard.addKey('R');

		// Creating animation keyboard events
		this.w.on('down', function(event) {
			if(mainGame.player.alive) {
				mainGame.player.anims.play('up');
			}
		});
		this.a.on('down', function(event) {
			if(mainGame.player.alive) {
				mainGame.player.anims.play('left');
			}
		});
		this.s.on('down', function(event) {
			if(mainGame.player.alive) {
				mainGame.player.anims.play('down');
			}
		});
		this.d.on('down', function(event) {
			if(mainGame.player.alive) {
				mainGame.player.anims.play('right');
			}
		});

		mainGame = this.scene.get('mainGame'); //Updating scene object
		this.r.on('down', function(event) {
			if(mainGame.gun.ammo == 25) {
				return false;
			};
			if(mainGame.reloadCoolDown && mainGame.gun.ammo > 1) {
				return false;
			}
			mainGame.reloading = true;
			mainGame.reloadCoolDown = true;
			reloadSound.play();
			mainGame.reloadIcon.visible = true;

			//Function for reload
			setTimeout(function(event) {
				mainGame.gun.resetShots();
				mainGame.gun.ammo = 25;
				mainGame.reloadIcon.visible = false;
				mainGame.reloading = false;
			}, 1000);//Sets how long would it take for the bullet to fill
			setTimeout(function(event) {
				mainGame.reloadCoolDown = false;
			}, 2000);//Sets the time interval for reload function (previous amount is 7k)
		});

		// Checking for click to shoot
		mainGame = this.scene.get('mainGame'); //Updating mainGame object
		this.input.on('pointerdown', function(pointer) {
			if(!mainGame.player.alive) {
				return false;
			}
			if(mainGame.reloading) {
				return false;
			}
			if(mainGame.gun.fire() != null) {
				mainGame.gunSprite.anims.play('pistolShoot');
				laserSound.play();
				mainGame.gun.ammo--;
			};
		});

		//Ammo Counter
		this.ammoText = this.add.bitmapText(720, 440, 'alagard', `${this.gun.ammo}/25`, 45);
		this.ammoText.setTintFill(0xffffff);
	    //Score Counter
		this.scoreText = this.add.bitmapText(630, 40, 'alagard', 'Score:' + this.score, 45);
		this.scoreText.setTintFill(0xffffff);
		// Wave counter
		this.waveText = this.add.bitmapText(10, 450, 'alagard', 'Wave: ' + this.waves, 45);
		this.waveText.setTintFill(0xffffff);
	    if(tutorialComp) {
			// Enemies group
			mainGame = this.scene.get('mainGame');
			this.enemies = this.physics.add.group();
			//Creating a certain number of enemies
			//Based on the wave number according to a formula created.
			this.maxEnemies = 3+(this.waves*2);
			// Checking if slimes is over max amount
			if (this.enemies.getChildren().length < this.maxEnemies) {
				// Spawning is certain amount of slimes/enemies.
				for(let i = 0; i < this.maxEnemies; i++) {
					mainGame.enemies.create(100 + Math.random() * 500, 100 + Math.random() * 200,'enemies');
				}
				this.maxEnemies = this.enemies.getChildren().length;
				this.numberOfEnemies = this.enemies.getChildren().length;

				// Playing the animation for when the slimes move
				let slimes = this.enemies.getChildren();
				for(let i = 0; i < slimes.length; i++) {
					slimes[i].anims.play('slimeMove');
					slimes[i].alive = true;
				}
			}

			// Adding collisions for enemies
			mainGame = this.scene.get('mainGame');
			this.physics.add.collider(this.player, this.enemies, function(player, enemy) {
				if(!enemy.alive) {
					return false;
				}
				if(player.justHit) {
					return false;
				};
				if(!player.alive) {
					return false;
				}
				enemy.alive = false;
				player.justHit = true;
				player.health--;
				mainGame.score = mainGame.score - 5;
				enemy.anims.play('slimeDeath');
				enemy.setVelocity(0);
				setTimeout(function(event) {
					enemy.destroy();
				}, 500);
				mainGame.numberOfEnemies = mainGame.enemies.getChildren().length;
				flicker(player, 3);
				hitSound.play();
				setTimeout(function(event) {
					player.justHit = false;
				}, 200);//Sets the player invincible for 200 milliseconds
			});

			//Hitting the enemies using the gun
			this.physics.add.collider(this.gun.bullets, this.enemies, function(bullet, enemy) {
				bullet.kill();
				if(!enemy.alive) {
					return false;
				}
				enemy.alive = false;
				enemy.setVelocity(0);
				mainGame.score = mainGame.score + 10;// add score everytime you hit the enemies
				hitSound.play();
				flicker(enemy, 3);
				enemy.anims.play('slimeDeath');
				enemy.setVelocity(0);
				setTimeout(function(event) {
					enemy.destroy();
				}, 500);
				mainGame.numberOfEnemies = mainGame.enemies.getChildren().length;
			});
			this.physics.add.collider(this.enemies, this.wallLayer);
			this.physics.add.collider(this.enemies, this.enemies);
		}

	    // Collision
	    mainGame = this.scene.get('mainGame');
		this.physics.add.collider(this.player, this.wallLayer);
		this.physics.add.collider(this.gun.bullets, this.wallLayer, function(bullet, wallLayer) {
			bullet.kill();
		});
		this.physics.add.collider(this.player, this.scarecrow);
		this.physics.add.collider(this.gun.bullets, this.scarecrow, function(bullet, scarecrow) {
			bullet.kill();
			if(scarecrow.alive) {
				flicker(scarecrow, 3);
				scarecrow.HP -= 5;
				hitSound.play();
			};
		});

		// Adding player alive property
		this.player.alive = true;
		this.player.health = 6;
		this.player.justHit = false
		//Adding gun ammo
		this.gun.ammo = 25; 

		// Checks if tutorial is completed
		if(!tutorialComp) {
			// Displaying text at the top of the screen for tutorial
			var howToMove = this.add.bitmapText(60, 100, 'alagard', 'Use the WASD keys to move!');
			howToMove.setTintFill(0xffffff);
			setTimeout(function(event) {
				howToMove.destroy();
				var howToShoot = game.scene.keys.mainGame.add.bitmapText(60, 100, 'alagard', 'Click the mouse to shoot!');
				howToShoot.setTintFill(0xffffff);
				setTimeout(function(event) {
					howToShoot.destroy();
					var howToAmmo = game.scene.keys.mainGame.add.bitmapText(40, 100, 'alagard', 'Watch your ammo, reload with R!', 40);
					howToAmmo.setTintFill(0xffffff);
					setTimeout(function(event) {
					   howToAmmo.destroy();
					}, 2000);
				}, 2000);
			}, 2000);
		};
		mainGame = this.scene.get('mainGame');
	}//End of Create

	update() {
		// Checks if the player has already done the tutorial
		if(!tutorialComp) {
			// Checking for scarecrow health
			if(this.scarecrow.HP < 1) {
				var tutorial = this.scene.get('tutorial');
				this.scarecrow.alive = false;
				this.scarecrow.anims.play('scarecrowDeath');
				tutorialComp = true;
				game.scene.keys.mainGame.cameras.main.fade(2000, 0, 0, 0);
				setTimeout(function(event) {
					backgroundMusic1.stop();
					game.scene.keys.mainGame.scene.restart('mainGame');
					setTimeout(function(event) {
						game.scene.keys.mainGame.startSpawn = true;
					}, 500);
				}, 2000);
			}
		};// END OF TUTORIAL STAGE
		if(this.player.alive) {
			this.healthSprites.setFrame(this.player.health);
		}

		// Updating functions
		movePlayer(this.player, this);

		rotateGun(this.gunSprite, cursor);

		//Updating ammo text
		this.ammoText.setText(`${this.gun.ammo}/25`);

		// Moving sprites (gun and cursor)
		updateGun(this.gunSprite, this.player, this.cursor);
		updateCursor(game.input.mousePointer.x, game.input.mousePointer.y);

		// Updating wave counter
		this.waveText.setText(`Wave: ${this.waves}`);

		//Updating score text
		this.scoreText.setText('Score:' + this.score);
		
		// MAIN GAME BEGINS
		try {
			if(this.player.health < 1) {
				// Checking if player is alive.
				// Needed because this is in the update loop so it
				// will run multiple times if we don't stop it from doing so.
				if(this.player.alive) {
					this.player.alive = false;
					this.player.play('playerDeath');
					this.player.setVelocityX(0);
					this.player.setVelocityY(0);
					this.cameras.main.fade(2000, 0, 0, 0);
					localStorage.setItem('score', this.score);
					setTimeout(function(event) {
						backgroundMusic1.stop();
						game.scene.start('gameOver');
		    			game.scene.moveAbove('mainGame', 'gameOver');
		    			game.scene.pause('mainGame');
					}, 2000);
				}
			}
		}
		catch(err) {
		}
		// Mostly main game code here
		if(tutorialComp) {
			if (this.startSpawn) {
				let scene = this.scene.get('mainGame');
				setTimeout(function(event) {
					// Getting number of enemies
					scene.numberOfEnemies = scene.enemies.getChildren().length;
				}, 600);
				if(!this.slimeMove) {
					this.slimeMove = true;
					setTimeout(function(event) {
						let slimes = game.scene.keys.mainGame.enemies.getChildren();
						for(let i = 0; i < slimes.length;i++) {
							slimes[i].setVelocity(randomVelocity(), randomVelocity());
						}
						setTimeout(function(event) {
							game.scene.keys.mainGame.slimeMove = false;
						}, 500);
					}, 400);
				}

				// Checking for number of enemies
				let mainGame = this.scene.get('mainGame');
				if (this.numberOfEnemies < 1) 
				{
					this.numberOfEnemies = 1;
					this.waves++;
					this.maxEnemies = 3+(this.waves*2);
					for(let i = 0; i < this.maxEnemies; i++) {
						mainGame.enemies.create(100 + Math.random() * 500, 100 + Math.random() * 200,'enemies');
					}
					this.maxEnemies = this.enemies.getChildren().length-1;
					this.numberOfEnemies = this.enemies.getChildren().length-1;

					// Playing the animation for when the slimes move
					let slimes = this.enemies.getChildren();
					for(let i = 0; i < slimes.length; i++) {
						slimes[i].anims.play('slimeMove');
						slimes[i].alive = true;
					}
				}
			}
		}//Main game code
	} //End of Update Bracket
}//End of Class Tutorial 