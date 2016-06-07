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
var uid, isAnonymous;
var redirect = false;

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
  // [START getidptoken]
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
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // [START_EXCLUDE]
    if (errorCode === 'auth/account-exists-with-different-credential') {
      alert('You have already signed up with a different auth provider for that email.');
      // If you are using multiple auth providers on your app you should handle linking
      // the user's accounts here.
    } else {
      console.error(error);
    }
    // [END_EXCLUDE]
  });
  // [END getidptoken]
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      displayName = user.displayName;
      uid = user.uid;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var refreshToken = user.refreshToken;
      var providerData = user.providerData;
      if(isAnonymous == false) {
        displayName = user.displayName;
      }

      // Update the leaderboard now that they've logged in with the stored cookie score
      if(redirect == true) {
        console.log("Redirect is true:");
        var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)anonScore\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        console.log("Cookie Value: "+cookieValue);
        fb_updateLeaderboard(cookieValue);
      }

      $("#welcomeMessage").html("Welcome back, <strong>"+user.displayName+"</strong>!");
      // Sign Out Option
      $(".sign-out").show();
      $(".sign-out").click(function() {
        authenticateSignOut();
      });
      $("#authentication").hide();

    } else {
      // User is signed out.
      console.log("signed out");
      $("#welcomeMessage").html("You're not currently logged in. Your high score will not be saved. You will be able to log in after the game and save your score.");
      $(".sign-out").hide();
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
  // [END authstatelistener]

}
window.onload = function() {
  initApp();
};

// Update the leaderboard with the new score; replace preexisting score if there is one
function fb_updateLeaderboard(score) {

    var name = displayName;
    var newScore = Number(score);

    if (name.length === 0)
      return;

    console.log("Update Leaderboard Function");

    var userScoreRef = scoreListRef.child(uid);

    // Check what the current score is if the user already has a record. If the new score is greater, update it.
    firebase.database().ref("scoreList/"+uid).once('value').then(function(snapshot) {
      if(snapshot.val() != null) {
        var oldScore = snapshot.val().score;
        if(oldScore === null || newScore > oldScore) {
          // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
          userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);
        }
        else {
          return;
        }
      }
      else {
        // Use setWithPriority to put the name / score in Firebase, and set the priority to be the score.
        userScoreRef.setWithPriority({ name:name, score:newScore }, newScore);
      }

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
  $("#highestScoreDiv").text(newHighestScore.val());
});