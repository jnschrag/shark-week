/*===================================================================
// Firebase - Leaderboard
/*==================================================================*/

// Initialize Firebase
var config = {
	apiKey: "AIzaSyBpz9yAldgWgjQug-cfBWHZb-7pRGKUPt4",
	authDomain: "shark-week-leaderboard.firebaseapp.com",
	databaseURL: "https://shark-week-leaderboard.firebaseio.com",
	storageBucket: "",
};
firebase.initializeApp(config);

var LEADERBOARD_SIZE = 5;
var provider;
var user = firebase.auth().currentUser;
var displayName = "";
var prevScore;
var uid, isAnonymous;
var redirect = false;
var highScore;

// Build some firebase references.
var rootRef = firebase.database().ref();
var scoreListRef = firebase.database().ref("scoreList");
var highestScoreRef = firebase.database().ref("highestScore");

/**
 * initApp handles setting up the Firebase context and registering
 * callbacks for the auth status.
 */
function initApp() {
  // Result from Redirect auth flow.
  firebase.auth().getRedirectResult().then(function(result) {
    if (result.credential) {
      // This gives you an Access Token
      var token = result.credential.accessToken;
    }
    // The signed-in user info
    if(result.user) {
      var user = result.user;
      var displayName = user.displayName;
      redirect = true;
    }

  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var credential = error.credential;
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different social media site for that email.');
    } else {
      console.error(error);
    }
  });

  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      uid = user.uid;
      var email = user.email;
      var isAnonymous = user.isAnonymous;
      var refreshToken = user.refreshToken;
      var providerData = user.providerData;

      if(isAnonymous == false) {
        displayName = user.displayName;
      }
      else {
        displayName = "";
      }

      displayName = cleanDisplayName(displayName);

      // Update the leaderboard now that they've logged in with the stored cookie score; else get their existing info
      if(redirect == true) {
        var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)anonScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(cookieValue) {
          fb_updateLeaderboard(cookieValue, false);
        }
        else {
          fb_setUserEarnedInfo();
        }
      }
      else {
        fb_setUserEarnedInfo();
      }

      // Set Welcome Message
      $("#welcomeUser").html("Welcome back, <strong>"+displayName+"</strong>!<br />");
      $("#userInfo").show();

      // Sign Out Option
      $(".sign-out").show();
      $(".sign-out").click(function() {
        authenticateSignOut();
      });
      $("#authentication").hide();
      console.log("signed in");

    } else {
      // User is signed out.
      console.log("signed out");
      $("#welcomeUser").html("To save your high score, sign in!");
      $("#userInfo").hide();
      $(".sign-out").hide();
      $("#free-play").hide();
      $("#authentication").show();
      $(".btn-twitter").click(function() {
        authenticateUser("Twitter");
      });
      $(".btn-facebook").click(function() {
        authenticateUser("Facebook");
      });
      $(".btn-google").click(function() {
        authenticateUser("Google");
      });
      $("#shark_signin").click(function() {
        authenticateEmailSignIn();
      });
      
    }
  });

}
window.onload = function() {
  initApp();
};

// Set livesEarned & prevScore global variables
function fb_setUserEarnedInfo() {
  firebase.database().ref("scoreList/"+uid).once("value").then(function(snapshot) {
    livesEarned = snapshot.child("lives").val(); // Current Lives Earned
    prevScore = snapshot.child("score").val(); // Current Personal High Score
    var timestamp = snapshot.child("timestamp").val(); // Timestamp of last game
    var priority = snapshot.getPriority();

    var scoreListing = scoreListRef.orderByPriority().startAt(priority);
    scoreListing.once("value").then(function(snapshot) {
      var currentRank = snapshot.numChildren();
      $("#currentRanking").html("Current Overall Ranking: "+getOrdinal(currentRank)+"<br />");
    });

    // Update Lives Counter if timestamp is from previous days, only if date is before 7/1/16
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if( dd<10 ) { dd='0'+dd } 
    if( mm<10 ) { mm='0'+mm } 
    var currentDate = mm+'/'+dd+'/'+yyyy;

    var userDate = new Date(timestamp);
    var userdd = userDate.getDate();
    var usermm = userDate.getMonth()+1; //January is 0!
    var useryyyy = userDate.getFullYear();
    if( userdd<10 ) { userdd='0'+userdd } 
    if( usermm<10 ) { usermm='0'+usermm } 
    var currentUserDate = usermm+'/'+userdd+'/'+useryyyy;

    if(currentDate < "07/01/2016") {
      if(currentUserDate < currentDate) {
        livesEarned = 0;
        firebase.database().ref("scoreList/"+uid).update({lives: 0});
      }
    }

    // If user has a previous score
    if(prevScore != null) {
      $("#personalHighScore").html("Personal High Score: "+prevScore+"<br />");
    }
    // If user has bonus lives
    if(livesEarned != null && livesEarned != 0) {
      $("#free-play").show();
      $("#livesEarnedContainer").html("Lives Earned: "+livesEarned+"<br /><br />");

    }
    else {
      $("#free-play").hide();
    }


  });
}

// Update the leaderboard with the new score; replace preexisting score if there is one
function fb_updateLeaderboard(score, freePlay) {

    var name = displayName;
    var newScore = Number(score);
    var newLives = Number(score);

    if(freePlay == false) {
      if(newLives > (numQuestions * 2)) {
        return;
      }
    }

    if (name.length === 0)
      return;

    console.log("Update Leaderboard Function");

    var userScoreRef = scoreListRef.child(uid);

    // Check what the current score is if the user already has a record. If the new score is greater, update it.
    firebase.database().ref("scoreList/"+uid).once('value').then(function(snapshot) {
      if(snapshot.val() != null) {
        var oldScore = snapshot.val().score;
        if(oldScore === undefined || newScore > oldScore) {
          // Update the old score; use setPriority to reset the priority to the new score
          userScoreRef.update({score:newScore, timestamp:Date.now()});
          userScoreRef.setPriority(newScore);
          // Update the user's lives earned if freePlay = false
          if(freePlay == false) {
            userScoreRef.update({lives:newLives, timestamp:Date.now()});
          }
        }
        else {
          // Update the user's lives earned if freePlay = false
          if(freePlay == false) {
            userScoreRef.update({lives:newLives, timestamp:Date.now()});
          }
          //return;
        }
      }
      else {
        // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
        userScoreRef.setWithPriority({ name:name, score:newScore, timestamp:Date.now() }, newScore);
        // Update the user's lives earned if freePlay = false
        if(freePlay == false) {
          userScoreRef.update({lives:newLives, timestamp:Date.now()});
        }
      }

      // Update our earned values to reflect what was just added to the database
      fb_setUserEarnedInfo();

    });

    // Track the highest score using a transaction.  A transaction guarantees that the code inside the block is
    // executed on the latest data from the server, so transactions should be used if you have multiple
    // clients writing to the same data and you want to avoid conflicting changes.
    highestScoreRef.transaction(function (currentHighestScore) {
      if (currentHighestScore === null || newScore > currentHighestScore) {
        // The return value of this function gets saved to the server as the new highest score.
        return newScore;
      }
      // if we return with no arguments, it cancels the transaction.
      return;
    }); 
}

/**
 * Update the Games Played Node for all users
 * @param  {string} lives     # of lives either earned (in quiz mode) or started out with (in free play)
 * @param  {flag} freePlay    true or false
 * @return none
 */ 
function fb_updateGamesPlayed(lives, freePlay) {
  // Push new game_played
  if(!uid) {
    uid = "null";
  }
  var gamesPlayedRef = firebase.database().ref("gamesPlayed");
  var newGamesPlayedRef = gamesPlayedRef.push();
  newGamesPlayedRef.set({ 'uid': uid, 'timestamp': Date.now(), 'score': score, 'lives': lives, 'questionsCorrect': questionsCorrect, 'questionsIncorrect': questionsIncorrect, 'quiz': freePlay });
}

// Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
var htmlForPath = {};

// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded(scoreSnapshot, prevScoreName) {
  var newScoreRow = $("<tr/>");
  newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val()['name'])));
  newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

  // Store a reference to the table row so we can get it again later.
  htmlForPath[scoreSnapshot.key] = newScoreRow;

  // Insert the new score in the appropriate place in the table.
  if (prevScoreName === null) {
    $("#leaderboardTable").append(newScoreRow);
  }
  else {
    var lowerScoreRow = htmlForPath[prevScoreName];
    lowerScoreRow.before(newScoreRow);
  }
}

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved(scoreSnapshot) {
  var removedScoreRow = htmlForPath[scoreSnapshot.key];
  removedScoreRow.remove();
  delete htmlForPath[scoreSnapshot.key];
}

// Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
var scoreListView = scoreListRef.limitToLast(LEADERBOARD_SIZE);

// Add a callback to handle when a new score is added.
scoreListView.on('child_added', function (newScoreSnapshot, prevScoreName) {
  handleScoreAdded(newScoreSnapshot, prevScoreName);
});

// Add a callback to handle when a score is removed
scoreListView.on('child_removed', function (oldScoreSnapshot) {
  handleScoreRemoved(oldScoreSnapshot);
});

// Add a callback to handle when a score changes or moves positions.
var changedCallback = function (scoreSnapshot, prevScoreName) {
  handleScoreRemoved(scoreSnapshot);
  handleScoreAdded(scoreSnapshot, prevScoreName);
};
scoreListView.on('child_moved', changedCallback);
scoreListView.on('child_changed', changedCallback);

// Add a callback to the highest score in Firebase so we can update the GUI any time it changes.
highestScoreRef.on('value', function (newHighestScore) {
  $(".highestScoreDiv").text(newHighestScore.val());
  highScore = newHighestScore.val();
});

// Get Full Leaderboard
$("#fullLeaderboardLink").click(function() {
  fb_leaderboardFull();
});

function fb_leaderboardFull() {
  // Clear Previous Table Results
  $("#leaderboardTableFull").empty();

  // Get scores ordered by priority
  firebase.database().ref("scoreList").orderByPriority().once("value").then(function(snapshot) {
    $.each(snapshot.val(), function(child_id,child_value) {
      var newScoreRow = $("<tr/>");
      newScoreRow.append($("<td/>").append($("<em/>").text(snapshot.child(child_id).child("name").val())));
      newScoreRow.append($("<td/>").text(snapshot.child(child_id).child("score").val()));

      $("#leaderboardTableFull").prepend(newScoreRow);
    });
  });
};

function getOrdinal(n) {
  var s=["th","st","nd","rd"],
  v=n%100;
  return n+(s[(v-20)%10]||s[v]||s[0]);
};

/**
 * Updates the Total Correct/Incorrect Answers Counter
 * @param  {string} answersRef  Firebase reference
 * @return {value}              The new total Correct/Incorrect answer count
 */
function fb_updateCorrectIncorrectAnswers(answersRef) {
  answersRef.transaction(function(currentValue) {
    return currentValue + 1;
  });
}