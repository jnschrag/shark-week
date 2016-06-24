
var player;
var sharks = [];
var dots = [];
var lives;
var livesEarned;
var defaultLives = 1;
var score;
var sharkRed, sharkGreen, sharkBlue, sharkOrange;
var playerLeft1, playerLeft2, playerLeft3, playerRight1, playerRight2, playerRight3;
var heart;
var biteSound, gameoverSound, startSound, scoreSound;
var gameStarted;
var quizFlag, pausedFlag;
var freePlayModeFlag = false;
var letters = ["a","b","c","d"];
var correctAnswer;
var numQuestions = Object.keys(questionsObj).length;
var questionsCorrect = {};
var questionsIncorrect = {};
var numQuestionsIncorrect;
var freePlayCounter = 0;

function preload()
{
  // load in shark images
  sharkRed = loadImage('assets/shark_red.png');
  sharkGreen = loadImage('assets/shark_purple.png');
  sharkOrange = loadImage('assets/shark_orange.png');
  sharkBlue = loadImage('assets/shark_blue.png');
  
  // load in player images
  playerLeft1 = loadImage('assets/robot_left_1.png');
  playerLeft2 = loadImage('assets/robot_left_2.png');
  playerLeft3 = loadImage('assets/robot_left_3.png');
  playerLeft4 = loadImage('assets/robot_left_4.png');
  playerLeft5 = loadImage('assets/robot_left_5.png');
  playerRight1 = loadImage('assets/robot_right_1.png');
  playerRight2 = loadImage('assets/robot_right_2.png');
  playerRight3 = loadImage('assets/robot_right_3.png');
  playerRight4 = loadImage('assets/robot_right_4.png');
  playerRight5 = loadImage('assets/robot_right_5.png');
  
  // load in heart image
  heart = loadImage('assets/heart.png');
  
  // load in sounds
  soundFormats('mp3', 'ogg');
  biteSound = loadSound('assets/bite.mp3');                 
  gameoverSound = loadSound('assets/game_over.mp3');
  scoreSound = loadSound('assets/pop.mp3');
  startSound = loadSound('assets/intro.mp3');
  soundArray = [biteSound,gameoverSound,scoreSound,startSound];
  
}

function setup() 
{
  // set canvas size
  var canvas = createCanvas(800, 500);                    //resize
  // Move Canvas to game-holder section, set the game-canvas class for styling
  canvas.parent("game-holder");
  canvas.addClass("game-canvas");
  
  // create player object
  player = new Player();
  
  // default lives and score values
  lives = defaultLives;
  score = 0;
  
  // set gameStarted equal to false
  gameStarted = false;

  // // Show start buttons once the canvas has loaded
  $(".game-canvas").load(function() {
    $(".start-buttons-container").show();
  });

  // Clicking either the start-quiz or free-play buttons starts the game
  $("#start-quiz").click(function() {
    // Set Flags
    quizFlag = true;
    freePlayModeFlag = false;

    // Set Question Counters
    questionNumber = 0;
    correctAnswer = "";
    numQuestionsIncorrect = 0;
    freePlayCounter = 0;

    // Reset questionsCorrect & questionsIncorrect
    questionsCorrect = {};
    questionsIncorrect = {};

    // Show 1st question; hide result
    $(".questions .q0").show();
    $("#quiz .result").empty();
    $("#game-over-results").hide().empty();
    $("#game-over-sharebuttons").hide().empty();

    // Uncheck any answers from previous games
    var ele = $(".questions input[type=radio]");
    for(var i=0;i<ele.length;i++) {
      ele[i].checked = false;
    }

    // Don't loop draw();
    noLoop();
    startGame();
  });
  $("#free-play").click(function() {
    $("#game-over-results").hide().empty();
    $("#game-over-sharebuttons").hide().empty();
    // Set Flags
    quizFlag = false;
    freePlayModeFlag = true;

    // Reset questionsCorrect & questionsIncorrect
    questionsCorrect = {};
    questionsIncorrect = {};

    // Set our lives to livesEarned or score cookie depending on logged in status
    if(livesEarned > 0) {
      lives = livesEarned;
    }
    else {
      // Increase counter
      freePlayCounter++;

      if(document.cookie.replace(/(?:(?:^|.*;\s*)anonScore\s*\=\s*([^;]*).*$)|^.*$/, "$1") <= (numQuestions * 2)) {
        lives = document.cookie.replace(/(?:(?:^|.*;\s*)anonScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      }
      else {
        return;
      }
    }

    startGame();
  });
  
}

function draw() 
{
  background(37,168,224);

  if(gameStarted == true)
  {

    // hide start buttons
    $(".start-buttons-container").hide();
  
    // Display number of lives (upper right) & the score if we're playing the free play version; else show bonus lives earned
    fill('#FFFFFF');
    noStroke();
    textSize(24);
    if(freePlayModeFlag == true) {
      // Display score 
      text("Ballots Collected: " + score, 30, 50);

      // Display Lives/Hearts
      var heartXPos = 730;
      for(var heartNum = 1; heartNum <= lives; heartNum++) {
        image(heart, heartXPos, 30);
        heartXPos += -40;
      }
    }
    else {
      // Display score 
      text("Lives Earned: ", 20, 50);
      // Display Lives/Hearts if we have at least one
      if(score >= 1) {
        var heartXPos = 170;
        for(var heartNum = 1; heartNum <= score; heartNum++) {
          image(heart, heartXPos, 30);
          heartXPos += 40;
        }
      }
    }


    // quizFlag = true, only show the quiz
    if(quizFlag == true) {
      $("#quiz").show();
      $("#quiz .questions").show();
      $("#quiz .submit").show();
    }
    // quizFlag = false, hide the quiz, show OEDI, Sharks, & Bubbles
    else {

      // freePlayModeFlag = false, hide only the questions; else hide the whole quiz
      if(freePlayModeFlag == false) {
        $("#quiz .questions").hide();
        $("#quiz .submit").hide();
      }
      else {
        // Hide the quiz
        $("#quiz").hide();
      }

      // display player
      player.display();
    
      // random shark hatching
      var sharkHatch = Math.ceil(random(50));
      if(sharkHatch == 1)
      {
        sharks.push(new Shark());
      }
    
      // random dot hatching
      var dotHatch = Math.ceil(random(30));
      if(dotHatch == 1)
      {
        dots.push(new Dot());
      }
    
      // loop through each shark
      for (var i=0; i<sharks.length; i++) 
      {
        // display shark
        sharks[i].display();
      
        // check if shark reaches top of the screen         
        if(sharks[i].ypos < 50)                               
        {
          // if does, remove shark
          sharks.splice(i, 1);
        
        } else {
        
          // check if player is touching shark
          var d1 = dist(sharks[i].xpos, sharks[i].ypos, player.xpos, player.ypos);
          if(d1 < 50)
          {
            // remove shark
            sharks.splice(i, 1);
           
            // play bite sound
            biteSound.play();

            // If freePlayModeFlag = false, then move to the next question; else lose a life
            if(freePlayModeFlag == false) {
              // Stop game, move to next question if this is not the last question; else lose a life
              if(questionNumber != numQuestions) {
                nextQuestion();
              }
              else {
                // decrease lives by one
                lives --;
              }
            }
            else {
              // decrease lives by one
              lives --;
            }

          }
        }
      }
    }

    // loop through each dot
    for (var j=0; j<dots.length; j++) 
    {
      // display dots
      dots[j].display();
    
      // check if dot reaches top of screen
      if(dots[j].ypos < 50)                               
      {
        // remove dot
        dots.splice(j, 1);
    
      } else {

        // If freePlayModeFlag = false, only count the score when we hit the correct bubble; else count every bubble
        var d2 = dist(dots[j].xpos, dots[j].ypos, player.xpos, player.ypos);
        if(freePlayModeFlag == false) {
          // check if player is touching dot & the letter is correct
          if(d2 < 25 && dots[j].letter == correctAnswer)
          {
            // remove dot
            dots.splice(j, 1);
          
            // increase score by one
            score++;
          
            // play score sound
            scoreSound.play();

            // Stop game, move to next question if this is not the last question
            if(questionNumber != numQuestions) {
              nextQuestion();
            }
            else {
              gameOver();
            }
          }
        }
        else {
          // check if player is touching dot
          if(d2 < 25)
          {
            // remove dot
            dots.splice(j, 1);
          
            // increase score by one
            score++;
          
            // play score sound
            scoreSound.play();
          }
        }
      }
    }
  
    // check for losing game over; If freePlayModeFlag = true, base it on lives; if freePlayModeFlag = false, base it on lives and questions answered correctly
    if(freePlayModeFlag == true && lives <= 0) {
      gameOver();
    }
    else if(freePlayModeFlag == false && (lives <= 0 || numQuestionsIncorrect == numQuestions)) {
      gameOver();
    }
  
  } else {
	  
    // show start button
    $(".start-buttons-container").show();
    if(!livesEarned && freePlayCounter > 0 ) {
      $("#free-play").hide();
      freePlayCounter = 0;
    }
  }
}

function startGame()
{

  // change gameStarted variable
  gameStarted = true;
  
  // play starting sound
  startSound.play();

  // reset score
  score = 0;

  // Delete cookies
  document.cookie = "anonScore=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
}

function gameOver() {

  // Hide the Quiz
  $("#quiz").hide();

  // Save the score as a cookie
  document.cookie = "anonScore="+score;

  // Update the leaderboard
  fb_updateLeaderboard(score, freePlayModeFlag);

  // Update the Games Played node
  if(freePlayModeFlag == true) {
    fb_updateGamesPlayed(livesEarned, false);
  }
  else {
    fb_updateGamesPlayed(score, true);
  }

  // reset lives
  lives = defaultLives;
  
  // reset player's position
  player.xpos = width*.5;
  player.direction = "stopped";

  // remove sharks and dots
  sharks = [];
  dots = [];
  
  // play gameover sound
  gameoverSound.play();
  
  // set gameStarted to false
  gameStarted = false;

  // Game Over Screen: if freePlayModeFlag = false, show # of bonus lives earned and option for free play; else game over & personal high score
  if(freePlayModeFlag == false) {
    if(score > 0) {
      $("#game-over-results").show().html("<span class='right'>FIN-tastic!</span><br />You earned <strong>"+score+" lives</strong> to help you and OEDI collect the missing ballots in our free play game!");

      // Show the share buttons
      shareButtons("I earned "+score+" extra lives in Ballots: Casted Away!");

      // Show the Free Play Button
      $("#free-play").show();
    }
    else {
      $("#game-over-results").show().html("<span class='wrong'>Uh-oh!</span><br />It looks like that quiz took a byte out of you.<br />Give it another try to unlock the free play version of the game!");
    }
  }
  else {
    // If freePlayCounter > 0, tell them to take the quiz again
    console.log("Game Over freePlayCounter: "+freePlayCounter);
    if(freePlayCounter > 0) {
      $("#game-over-results").show().html("<span>FIN-tastic!</span><br />You collected <strong>"+score+" missing ballots</strong>! To play again, take our quiz or sign in!");
    }
    else {
      // Personal High Score
      var bonus = "";
      if(score > prevScore) {
        var bonus = "That’s a JAWSdropping new personal high score!";
      }
      // Overall High Score
      if(score > highScore) {
        var bonus = "JAWesome! You have set the record with the highest score so far!";
      }

      $("#game-over-results").show().html("<span>FIN-tastic!</span><br />You saved <strong>"+score+" missing ballots</strong>!<br />"+bonus);
    }

    // Show the share buttons
    shareButtons("I rescued "+score+" missing ballots in Ballots: Casted Away!");

  }

  // Reset Flags
  quizFlag = false;
  freePlayModeFlag = false;
}

function keyPressed()
{

  // Only respond if quizFlag = false
  if(quizFlag == false) {

    // if the right arrow was pressed
    if(keyCode == RIGHT_ARROW)
    {
      // change player's direction property
      player.direction = 'right';
    }
    
    // if the left arrow was pressed
    if(keyCode == LEFT_ARROW)
    {
      // change player's direction property
      player.direction = 'left';
    }

    // if spacebar was pressed
    if(keyCode == 32) {
      pauseGame();
    }
  }
}

function touchStarted() {

  // Calculate difference between displayWidth and width. This becomes our touchX multiplier
  var touchDiff = round(width/displayWidth);
  var touchCalc = touchX * touchDiff;

  // Only move if the game has started. Necessary to avoid moving when touching the play button or quiz answers
  if(gameStarted == true && quizFlag == false) {

    if(player.xpos >= touchCalc) {
      player.direction = 'left';
    }
    else {
      player.direction = 'right';
    }
  }
}

function pauseGame() {
  // If game is paused
  if(pausedFlag == true) {
    pausedFlag = false;
    loop();
  }
  else {
    pausedFlag = true;
    noLoop();
  }
}

/*===================================================================
// player 
/*==================================================================*/

function Player()
{
  // set default properties
  this.xpos = width*.5;
  this.ypos = 150;                              
  this.speed = 3;
  this.direction = "stopped";
  
  // strokeCounter will determine which player sprite to display (1, 2 or 3)
  this.strokeCounter = 1;
}

Player.prototype.display = function()
{
  // check for every fifth frame
  // is the current frameCount divisible by 5?
  if(frameCount % 5 === 0)
  {
    // if the strokeCounter is equal to 5, reset strokeCounter by setting it equal to 1
    // otherwise, increment strokeCounter
    if(this.strokeCounter == 5)
    {
      this.strokeCounter = 1;
    } else {
      this.strokeCounter++;
    }
  }
  
  imageMode(CENTER);
  
  // if player is facing right
  if(this.direction == 'right')
  {
    // display the correct sprite image based on the strokeCounter
    switch(this.strokeCounter)
    {
      case 1: 
        image(playerRight1, this.xpos, this.ypos); 
      break;
      case 2: 
        image(playerRight2, this.xpos, this.ypos); 
      break;
      case 3: 
        image(playerRight3, this.xpos, this.ypos); 
      break;
      case 4: 
        image(playerRight4, this.xpos, this.ypos);
      break;
      case 5: 
        image(playerRight5, this.xpos, this.ypos);
      break;
    }
    
    // move player to the right
    this.xpos = this.xpos + this.speed;
  }
  
  // if player is facing left
  if(this.direction == 'left')
  {
    // display the correct sprite image based on the strokeCounter
    switch(this.strokeCounter)
    {
      case 1: 
        image(playerLeft1, this.xpos, this.ypos); 
      break;
      case 2: 
        image(playerLeft2, this.xpos, this.ypos); 
      break;
      case 3: 
        image(playerLeft3, this.xpos, this.ypos); 
      break;
      case 4: 
        image(playerLeft4, this.xpos, this.ypos); 
      break;
      case 5: 
        image(playerLeft5, this.xpos, this.ypos); 
      break;
    }
    
    // move player to the left
    this.xpos = this.xpos - this.speed;
  }
  
  // if player is just starting out and hasn't started moving yet
  if(this.direction == 'stopped')
  {
    image(playerLeft1, this.xpos, this.ypos);
  }
  
  // wrap player if player reaches the edge of the screen
  if(this.xpos > 800)
  {
    this.xpos = 0;
  }
  if(this.xpos < 0)
  {
    this.xpos = width;
  }
}

/*\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
// Shark 
/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\*/

function Shark()
{
  // set default properties
  this.xpos = random(0, width);
  this.ypos = height-50;        
  this.speed = random(1, 4);
  this.type = Math.ceil(random(4));
}

Shark.prototype.display = function()
{
  imageMode(CENTER);
  
  // show different color shark based on it's random 'type' value
  switch(this.type)
  {
    case 1: image(sharkRed, this.xpos, this.ypos, 46, 100); break;
    case 2: image(sharkGreen, this.xpos, this.ypos, 46, 100); break;
    case 3: image(sharkOrange, this.xpos, this.ypos, 46, 100); break;
    case 4: image(sharkBlue, this.xpos, this.ypos, 46, 100); break; 
  }
  this.ypos = this.ypos - this.speed;         //subtracts speed instead of adds
}

/* O O O O O O O O O O O O O O O O O O O O O O O O O O O O O O /
// DOT 
/  O O O O O O O O O O O O O O O O O O O O O O O O O O O O O O */

function Dot()
{
  // set default properties
  this.xpos = random(0, width);
  this.ypos = height;                        
  this.speed = random(1, 4);
  this.letter = letters[Math.floor(Math.random() * letters.length)];
  this.boxFilled = Math.random() < 0.5 ? 0 : 1;
}

Dot.prototype.display = function()
{

  rectMode(CENTER);
  strokeWeight(2);
  stroke(0,0,0);
  fill(255);
  rect(this.xpos, this.ypos, 25, 29);

  // Add the randomized letter if freePlayModeFlag = false; else show the boxes
  if(freePlayModeFlag == false) {
    strokeWeight(1);
    fill(5);
    textSize(18);
    text(String(this.letter), this.xpos + 7.5, this.ypos + 4, 25, 29);
  }
  else {
    // 1st box & line
    rectMode(CORNER);
    strokeWeight(1);
    if(this.boxFilled == 0) {
      fill('red');
    }
    else {
      noFill();
    }
    rect(this.xpos - 9, this.ypos - 9, 7, 7);

    stroke(0,0,0);
    strokeWeight(2);
    line(this.xpos + 2, this.ypos - 5, this.xpos + 8, this.ypos - 5);

    // 2nd box & line
    rectMode(CORNER);
    strokeWeight(1);
    if(this.boxFilled == 1) {
      fill('red');
    }
    else {
      noFill();
    }
    rect(this.xpos - 9, this.ypos + 1, 7, 7);

    stroke(0,0,0);
    strokeWeight(2);
    line(this.xpos + 2, this.ypos + 5, this.xpos + 8, this.ypos + 5);

  }
  this.ypos = this.ypos - this.speed;       
}

/*===================================================================
// Quiz Mode Functions
/*==================================================================*/
function nextQuestion() {

  // Hide the result if it was correct
  $("#quiz .result.right").empty();

  // reset lives
  lives = defaultLives;
      
  // reset player's position
  player.xpos = width*.5;
  player.direction = "stopped";
    
  // remove sharks and dots
  sharks = [];
  dots = [];

  // set gameStarted to false
  quizFlag = true;
}

/*===================================================================
// Sound Control
/*==================================================================*/
$(".sound-play").click(function() {
  $.each(soundArray, function(key,value) {
    value.setVolume(0);
  })
  $(this).hide();
  $(".sound-mute").show();
});

$(".sound-mute").click(function() {
  $.each(soundArray, function(key,value) {
    value.setVolume(1);
  })
  $(this).hide();
  $(".sound-play").show();
});

// Pause Game: Call pauseGame() function when pause button clicked or modal is active
$(".btn-pause").click(function() {
  pauseGame();
});

$(".btn-instructions").click(function() {
  if(($("#game_instructions_modal").data('bs.modal') || {}).isShown == (false || undefined)) {
    pauseGame();
  }
});

$("#game_instructions_modal .close").click(function() {
    pauseGame();
});
