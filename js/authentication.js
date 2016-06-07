// User Authentication
function authenticateUser(chosenProvider) {
	switch(chosenProvider)
    {
      case "Twitter":
        provider = new firebase.auth.TwitterAuthProvider();
      break;
      case "Facebook":
        provider = new firebase.auth.FacebookAuthProvider();
      break;
      case "Google":
        provider = new firebase.auth.GoogleAuthProvider();
      break;
    }

    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
	  if (result.credential) {
	    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
	    var token = result.credential.accessToken;
	    // ...
	  }
	  // The signed-in user info.
	  var user = result.user;
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});

}

// Give the user an option to sign out
function authenticateSignOut() {
	firebase.auth().signOut().then(function() {
	  // Sign-out successful.
	  displayName = "";
	  uid = "";
	}, function(error) {
	  // An error happened.
	});
}