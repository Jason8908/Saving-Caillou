/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Main JS File
    This is the main JS file for our game.
*/
var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 500,
    physics: {
        default: 'arcade',
    }
}; 
 
// Creating game var
var game = new Phaser.Game(config);

// Adding and starting first scene(s).
game.scene.add("preload", preload);
game.scene.add("load", load);
game.scene.add("title", title);
game.scene.add("gameOver", gameOver);
game.scene.add("scoreBoard", scoreBoard);
game.scene.add("mainGame", mainGame);
game.scene.add("credits", credits);
game.scene.start("preload");