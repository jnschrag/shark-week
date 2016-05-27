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

// Build some firebase references.
var rootRef = firebase.database().ref();
var scoreListRef = firebase.database().ref("scoreList");
var highestScoreRef = firebase.database().ref("highestScore");

// Authentication
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var name = $("#nameInput").val();
    // ...
  } else {
    // User is signed out.
    // ...
  }
  // ...
});

// Keep a mapping of firebase locations to HTML elements, so we can move / remove elements as necessary.
var htmlForPath = {};

// Helper function that takes a new score snapshot and adds an appropriate row to our leaderboard table.
function handleScoreAdded(scoreSnapshot, prevScoreName) {
  var newScoreRow = $("<tr/>");
  newScoreRow.append($("<td/>").append($("<em/>").text(scoreSnapshot.val().name)));
  newScoreRow.append($("<td/>").text(scoreSnapshot.val().score));

  // Store a reference to the table row so we can get it again later.
  htmlForPath[scoreSnapshot.name()] = newScoreRow;

  // Insert the new score in the appropriate place in the table.
  if (prevScoreName === null) {
    $("#leaderboardTable").append(newScoreRow);
  }
  else {
    var lowerScoreRow = htmlForPath[prevScoreName];
    lowerScoreRow.before(newScoreRow);
  }
}

// Update the leaderboard with the new score; replace preexisting score if there is one
function fb_updateLeaderboard(score) {
  var newScore = Number(score);
  var name = $("#nameInput").val();

  if (name.length === 0)
    return;

  var userScoreRef = scoreListRef.child(name);

  // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
  userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);

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

// Helper function to handle a score object being removed; just removes the corresponding table row.
function handleScoreRemoved(scoreSnapshot) {
  var removedScoreRow = htmlForPath[scoreSnapshot.name()];
  removedScoreRow.remove();
  delete htmlForPath[scoreSnapshot.name()];
}

// Create a view to only receive callbacks for the last LEADERBOARD_SIZE scores
var scoreListView = scoreListRef.limitToFirst(LEADERBOARD_SIZE);

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
  $("#highestScoreDiv").text(newHighestScore.val());
});