/*
    Jason, Elben, Lily, Fahad
    01/21/2020
    Game Over JS File
    This is the scoreboard screen for the game.
*/

class scoreBoard extends Phaser.Scene {
    constructor() {
        super(config);
        this.currentInitial = null;
        this.score = null;
        this.playerName = null;
        this.spaceBar = null;
        this.scoreBoardEntries = [];
        this.enterInitialsText = null;
        this.nameEntered = false;
    }
    preload() {

    }
    create() {
        // Resetting variables
        this.nameEntered = false;
        this.scoreBoardEntries = [];
        // Checking if the player has entered a name or not yet.
        this.enterInitialsText = this.add.bitmapText(4, this.cameras.main.centerY, 'alagard', 'Please enter your name in the box below...', 45);
        this.enterInitialsText.setTintFill(0xffffff);
    }
    update() {
        let playerName = localStorage.getItem('initials');
        // Checking if the player has entered a name.
        this.input.keyboard.removeKey('W', true);
        this.input.keyboard.removeKey('A', true);
        this.input.keyboard.removeKey('S', true);
        this.input.keyboard.removeKey('D', true);
        this.input.keyboard.removeKey('R', true);
        if(playerName) {
            if(playerName.replace(/\s/g, '') != "") {
                if(!this.nameEntered) {
                    // Creating the scoreboard
                    this.nameEntered = true;
                    // Adding scores to array.
                    this.score =+ localStorage.getItem('score');
                    playerScores.push(this.score);
                    // Making the initials all uppercase
                    // As well as checking for length of string
                    playerName = playerName.toUpperCase();
                    if(playerName.length > 3) {
                        playerName = playerName.substring(0, 3);
                    }
                    // Adding initial to the array of names.
                    playerInitial.push(playerName);
                    this.enterInitialsText.destroy();

                    // Adding text at the top of the screen
                    let scoreboardTitle = this.add.bitmapText(300, 40, 'alagard', 'Scoreboard', 50);
                    scoreboardTitle.setTintFill(0xffffff);
                    playerScores = bubbleSort(playerScores); //Sorting arrays using function

                    // Adding entries to the scoreboard
                    for(let i = 0; i < playerScores.length; i++) {
                        this.scoreBoardEntries.push(game.scene.keys.scoreBoard.add.bitmapText(180, 90+(75*i), 'alagard', `${playerInitial[i]}                   ${playerScores[i]}`, 60));
                        this.scoreBoardEntries[i].setTintFill(0xffffff);
                        if(i > 4) {
                            break;
                        } 
                    }

                    // Returning to main screen after a while.
                    setTimeout(function(event) {
                        game.scene.keys.scoreBoard.cameras.main.fade(2000, 0, 0, 0);
                        setTimeout(function(event) {
                            game.scene.start('title');
                            game.scene.moveAbove('scoreBoard', 'title');
                            game.scene.pause('scoreBoard');
                        }, 2000);
                    }, 8000);
                }
            }
        }//If bracket
    }//End of Update Bracket
}// End Of Class Brackets

$(document).ready(function() {
    $("#btnInitials").click(function(event) {
        /* Act on the event */
        let playerName = $("#txtInitials").val();
        localStorage.setItem('initials', playerName);
        $("#lblInitials").text('Name successfully changed!');
        setTimeout(function(event) {
            $("#lblInitials").text('...');
        }, 1000);
    }); //End of btnInitials click
});