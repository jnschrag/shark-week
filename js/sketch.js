
var player;
var sharks = [];
var dots = [];
var lives;
var score;
var sharkRed, sharkGreen, sharkBlue, sharkOrange;
var playerLeft1, playerLeft2, playerLeft3, playerRight1, playerRight2, playerRight3;
var heart;
var biteSound, gameoverSound, startSound, scoreSound;
var gameStarted;


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
  
}

function setup() 
{
  // set canvas size
  var canvas = createCanvas(800, 500);                    //resize
  // Move Canvas to game-holder section
  canvas.parent('game-holder');
  
  // create player object
  player = new Player();
  
  // default lives and score values
  lives = 3;
  score = 0;
  
  instructP = createP('<b>Some intro text. Help the robot</b> <br> Use the left and right arrows to swim.<br> Get the bubbles to score but avoid the sharks');
  instructP.position(275, 350);
  
  
  // create clear button
  startButton = createButton('Play Game');
  startButton.position(350, 500);
  startButton.mousePressed(startGame);
  
  // set gameStarted equal to false
  gameStarted = false;
  
}

function draw() 
{
  background(23,237,250);

  if(gameStarted == true)
  {
  
    // hide start button
    startButton.hide();
    //hide beginning text
    instructP.hide();
  
    // display score 
    fill(5);
    noStroke();
    textSize(24);
    text("Score: " + score, 30, 50);
  
    // display number of lives  (upper right)
    switch(lives)
    {
      case 3:
        image(heart, 650, 30);
        image(heart, 690, 30);
        image(heart, 730, 30);
      break;
      case 2:
        image(heart, 690, 30);
        image(heart, 730, 30);
      break;
      case 1:
        image(heart, 730, 30);
      break;
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
         
          // decrease lives by one
          lives --;
         
          // play bite sound
          biteSound.play();
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
    
        // check if player is touching dot
        var d2 = dist(dots[j].xpos, dots[j].ypos, player.xpos, player.ypos);
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
  
    // check for game over
    if(lives <= 0)
    {
      // Update the leaderboard and reset the score
      fb_updateLeaderboard(score);

      // reset lives and score
      lives = 3;
      score = 0;
      
      // reset player's position
      player.xpos = displayWidth*.5;
      player.direction = "stopped";
    
      // remove sharks and dots
      sharks = [];
      dots = [];
      
      // play gameover sound
      gameoverSound.play();
      
      // set gameStarted to false
      gameStarted = false;
    }
  
  } else {
	  
    // show start button
    startButton.show();
    //show instructions again
	   instructP.show();
  }
}

function startGame()
{
  // change gameStarted variable
  gameStarted = true;
  
  // play starting sound
  startSound.play();
  
}

function keyPressed()
{
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
  this.ypos = this.ypos - this.speed;         //subtracts speed intead of adds
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
}

Dot.prototype.display = function()
{
  ellipseMode(CENTER);
  fill(255);
  noStroke();
  ellipse(this.xpos, this.ypos, 25, 25);
  this.ypos = this.ypos - this.speed;       
}