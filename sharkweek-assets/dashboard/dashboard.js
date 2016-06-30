var questionsInfoObj = {};
var usersInfoObj = {};
var staffUIDs = ["F1zqKL0uQWSy7mmeKmek8Du1zIt1","m5Ry2ixq44XiTNBHBZN7qAZYn0E2","6cwe32Uh5cWVcF0nQjzwtrYZYYm1","vZ2UPMDBJ9QqZbSg7N8bMqFHdk13","uw4ps4gMstaI7tMD25P6mJxaTzw2","iJuxwpRvtlZDgfErI1BE6oUBJkq1","LjUSOAk6jBftQiKJHrTX8hG9IjC2","GLo9poPP6PT9dZWJRULDycAhBZ63"];

$(function() {

	// Build some firebase references.
	var gamesPlayedRef = firebase.database().ref("gamesPlayed");
	var correctAnswersRef = firebase.database().ref("correctAnswers");
	var incorrectAnswersRef = firebase.database().ref("incorrectAnswers");

	/*==================================================
	=            Dashboard Overview Numbers            =
	==================================================*/

	fb_overallGamesPlayed(gamesPlayedRef, "#gamesPlayedBreakdownTable", function(){
		fb_createAnswersTable();
		fb_processUsers();
	});

	fb_getNumChildren(gamesPlayedRef, "#gamesPlayedNum");
	fb_getNumChildren(scoreListRef, "#usersNum");

	/*=====  End of Dashboard Overview Numbers  ======*/
	
});

/**
 * Gets the number of child nodes for a firebase reference
 * @param  {string} ref Firebase reference
 * @return {int}     Number of child nodes
 */
function fb_getNumChildren(ref, element) {
	ref.once("value").then(function(snapshot) {
		var children = snapshot.numChildren();
		return $(element).html(children);
	});
}

/**
 * Populates the overall correct/incorrect question counters
 * @param  {string} ref       Firebase reference
 * @param  {string} element   HTML element to populate
 * @param  {int} counterID    Counter to update
 * @return {int}           	  Total number of correct/incorrect answered questions
 */
function fb_overallGamesPlayed(ref, tableID, callback) {
	ref.once("value").then(function(snapshot) {
		var itemsProcessed = 0;
	    snapshot.forEach(function(childSnapshot) {
	    	var game_id = childSnapshot.key;
	    	var value = childSnapshot.val();
	    	var uid = value.uid;
	    	var timestamp = timeConverter(value.timestamp);
	    	var score = value.score;
	    	var lives = value.lives;
	    	var isQuiz = value.quiz;
	    	var questionsCorrect = value.questionsCorrect;
	    	var questionsIncorrect = value.questionsIncorrect;
	    	var name = value.name;

	    	// Populate usersInfoObj
	    	if(uid != null) {
	    		usersInfoObj[uid] = usersInfoObj[uid] || {};
	    		usersInfoObj[uid].name = name || "";
	    		usersInfoObj[uid].numGamesPlayed = usersInfoObj[uid].numGamesPlayed + 1 || 1;
	    		var date = timeConverter(value.timestamp, true);
	    		usersInfoObj[uid].dates = usersInfoObj[uid].dates || {};
	    		usersInfoObj[uid].dates[date] = usersInfoObj[uid].dates[date] + 1 || 1;
	    		if(questionsCorrect != undefined) {
					childSnapshot.child("questionsCorrect").forEach(function(answersSnapshot) {
						var question_id = answersSnapshot.key;
						var answer_given = answersSnapshot.val();
						usersInfoObj[uid].numIncorrect = usersInfoObj[uid].numIncorrect || 0;
						usersInfoObj[uid].numCorrect = usersInfoObj[uid].numCorrect + 1 || 1;
					});
				};
				if(questionsIncorrect != undefined) {
					childSnapshot.child("questionsIncorrect").forEach(function(answersSnapshot) {
						var question_id = answersSnapshot.key;
						var answer_given = answersSnapshot.val();
						usersInfoObj[uid].numCorrect = usersInfoObj[uid].numCorrect || 0;
						usersInfoObj[uid].incorrectAnswers = usersInfoObj[uid].incorrectAnswers || {};
						usersInfoObj[uid].numIncorrect = usersInfoObj[uid].numIncorrect + 1 || 1;
						if(value.timestamp > 1467156439999) {
							usersInfoObj[uid].incorrectAnswers[answer_given] = usersInfoObj[uid].incorrectAnswers[answer_given] + 1 || 1;
						}
					});
				};
	    	}
	    	
	    	// Filter by Staff IDs; If the UID matches one in the object, do not display it or add it to our counters
	    	if($.inArray( uid, staffUIDs ) === -1) {

		    	if(!name) {
		    		name = "---";
		    	}
				$(tableID).append("<tr><td>"+timestamp+"</td><td>"+isQuiz+"</td><td>"+name+"</td><td>"+score+"</td><td>"+lives+"</td></tr>");

				// Create Correct & Incorrect Answer Objects
				if(questionsCorrect != undefined) {
					childSnapshot.child("questionsCorrect").forEach(function(answersSnapshot) {
						
						var question_id = answersSnapshot.key;
						var answer_given = answersSnapshot.val();
						questionsInfoObj[question_id] = questionsInfoObj[question_id] || {};
						questionsInfoObj[question_id].numIncorrect = questionsInfoObj[question_id].numIncorrect || 0;
						questionsInfoObj[question_id].numCorrect = questionsInfoObj[question_id].numCorrect + 1 || 1;
						
					});
				};
				if(questionsIncorrect != undefined) {
					childSnapshot.child("questionsIncorrect").forEach(function(answersSnapshot) {

						var question_id = answersSnapshot.key;
						var answer_given = answersSnapshot.val();
						questionsInfoObj[question_id] = questionsInfoObj[question_id] || {};
						questionsInfoObj[question_id].numCorrect = questionsInfoObj[question_id].numCorrect || 0;
						questionsInfoObj[question_id].incorrectAnswers = questionsInfoObj[question_id].incorrectAnswers || {};

						questionsInfoObj[question_id].numIncorrect = questionsInfoObj[question_id].numIncorrect + 1 || 1;
						if(value.timestamp > 1467156439999) {
							questionsInfoObj[question_id].incorrectAnswers[answer_given] = questionsInfoObj[question_id].incorrectAnswers[answer_given] + 1 || 1;
						}
					});
				};

			}

			itemsProcessed++;
		    if(itemsProcessed === snapshot.numChildren()) {
		      callback();
		    }
	    });
	});
}

function fb_createAnswersTable() {
	$.each(questionsInfoObj, function(index, information) {
		var question_id = index;
    	var numCorrect = information.numCorrect;
    	var numIncorrect = information.numIncorrect;
    	var incorrectAnswers = information.incorrectAnswers;
    	var result = fridayQuestions.filter(function( obj ) {
		  return obj.question_id == question_id;
		});
    	var questionText = result[0].question;

    	// Loop through the incorrect questions
    	var answerBreakdown = "";
    	var numIncorrectLink = "";
    	var containsAnswers = false;
    	if(incorrectAnswers) {
    		answerBreakdown += "<ul id='answerInfo"+question_id+"' style='display:none;'>";
    		$.each(incorrectAnswers, function (answer_id, responseCounter) {
    			containsAnswers = true;
    			var answerTextObj = result[0].answers.filter(function( obj ) {
				  return obj.answer_id == answer_id;
				});
				var answerText = answerTextObj[0].answer;
    			answerBreakdown += "<li><strong>"+responseCounter+"</strong> players answered \""+answerText+"\"</li>";
    		});
    		answerBreakdown += "</ul>";
    	}

    	if(containsAnswers == false) {
		  numIncorrectLink = numIncorrect;
		}
		else {
			numIncorrectLink = "<a id='answerInfo"+question_id+"Link' title='Click for more details' style='cursor:pointer;'>"+numIncorrect+"</a>";
		}

    	$("#correctAnswersTable").append("<tr><td id='q"+question_id+"_corect'>"+numCorrect+"</td><td id='q"+question_id+"_incorect'>"+numIncorrectLink+"</td><td>"+question_id+". "+questionText+answerBreakdown+"</td></tr>");

    	$("#answerInfo"+question_id+"Link").click(function() {
    		$("#answerInfo"+question_id).toggle();
    	});
	});
}

function fb_processUsers() {
	$.each(usersInfoObj, function(index, information) {
		var uid = index;
		var name = information.name;
		var numGamesPlayed = information.numGamesPlayed;
    	var numCorrect = information.numCorrect;
    	var numIncorrect = information.numIncorrect;
    	var incorrectAnswers = information.incorrectAnswers;

    	if(numCorrect == undefined) {
    		numCorrect = "---";
    	}
    	if(numIncorrect == undefined) {
    		numIncorrect = "---";
    	}

    	// Loop Through Dates
    	var dates = "";
    	$.each(information.dates, function(date, counter) {
    		dates += date+": "+counter+"<br />";
    	});
  
    	$("#usersBreakdownTable").append("<tr><td>"+name+"</td><td>"+numGamesPlayed+"</td><td>"+numCorrect+"</td><td>"+numIncorrect+"</td><td>"+dates+"</td></tr>");
	});
}


function timeConverter(UNIX_timestamp, dayOnly = false){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  if(dayOnly == true) {
  	var time = date + ' ' + month + ' ' + year;
  }
  else {
  	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  }
  return time;
}