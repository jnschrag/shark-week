// User Authentication
function authenticateUser(chosenProvider) {
	switch(chosenProvider)
    {
      case "Twitter":
        provider = new firebase.auth.TwitterAuthProvider();
      break;
      case "Facebook":
        provider = new firebase.auth.FacebookAuthProvider();
        provider.addScope('public_profile');
      break;
      case "Google":
        provider = new firebase.auth.GoogleAuthProvider();
      break;
    }

    firebase.auth().signInWithRedirect(provider);
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

// Display Name Parser
function cleanDisplayName(name) {
	fullName = name.split(/\s+/);
	count = fullName.length;
	firstName = fullName[0];
	lastName = fullName[1];

	// If we have a first & last name
	if(count > 1) {
		cleanedName = firstName+" "+lastName.charAt(0)+".";
	}
	else {
		cleanedName = firstName;
	}

	//cleanedName = firstName+" "+lastName.charAt(0)+".";
	console.log(cleanedName);
	return cleanedName;
}