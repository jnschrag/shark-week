/*=============================================
=            Questions Objects                 =
=============================================*/
var sundayQuestions = [
{
  "question": "Polling station data may include all of the following EXCEPT:",
  "answers": [
    {"answer": "The address of polling stations", "correctAnswer": false},
    {"answer": "The number of registered voters per polling station", "correctAnswer": false},
    {"answer": "The names and titles on the electoral officials per polling station", "correctAnswer": false},
    {"answer": "The methods for stealing ballot boxes", "correctAnswer": true}
  ]
},
{
  "question": "What is NOT an example of information that may be found on a voters list?",
  "answers": [
    {"answer": "Date of registration", "correctAnswer": false},
    {"answer": "Gender", "correctAnswer": false},
    {"answer": "Address", "correctAnswer": false},
    {"answer": "Fin size", "correctAnswer": true}
  ]
},
{
  "question": "When should voter education initiatives take place?",
  "answers": [
    {"answer": "In the months leading up to the election", "correctAnswer": true},
    {"answer": "Only the day before the election", "correctAnswer": false},
    {"answer": "Only during Shark Week", "correctAnswer": false},
    {"answer": "Never", "correctAnswer": false}
  ]
}];

var mondayQuestions = [
{
  "question": "Which is an acceptable example of a usage restriction on data?",
  "answers": [
    {"answer": "Data restricted to those who pay", "correctAnswer": false},
    {"answer": "Data restricted to the residents of Sharkville", "correctAnswer": false},
    {"answer": "Data restricted to political parties", "correctAnswer": false},
    {"answer": "None; data should be non-discriminatory", "correctAnswer": true}
  ]
}, {
  "question": "Which is NOT an example of useful data related to election campaigns?",
  "answers": [
    {"answer": "Campaign regulations", "correctAnswer": false},
    {"answer": "Media allocations for candidates", "correctAnswer": false},
    {"answer": "Applications for rally permits", "correctAnswer": false},
    {"answer": "The mayor of Sharkville’s vacation schedule", "correctAnswer": true}
  ]
}, {
  "question": "When considering electoral boundaries, what data should be made available?",
  "answers": [
    {"answer": "Number of registered voters", "correctAnswer": true},
    {"answer": "Number of sharks", "correctAnswer": false},
    {"answer": "Information on the nearest beach", "correctAnswer": false},
    {"answer": "None of the above", "correctAnswer": false}
  ]
}];

var tuesdayQuestions = [
{
  "question": "Which is NOT a goal of voter registration?",
  "answers": [
    {"answer": "To make sure eligible citizens have the real opportunity to vote", "correctAnswer": false},
    {"answer": "Prevents ineligible people from voting", "correctAnswer": false},
    {"answer": "Prevents multiple voting", "correctAnswer": false},
    {"answer": "Allows great white sharks to vote more than hammerhead sharks", "correctAnswer": true}
  ]
}, {
  "question": "Which is NOT an example of electoral complaints, disputes and resolutions data?",
  "answers": [
    {"answer": "Parties filing complaints", "correctAnswer": false},
    {"answer": "How to file a complaint", "correctAnswer": false},
    {"answer": "Type of complaint or dispute", "correctAnswer": false},
    {"answer": "Number of shark bytes", "correctAnswer": true}
  ]
}, {
  "question": "Before election day, an example of important election data is:",
  "answers": [
    {"answer": "Voters list", "correctAnswer": false},
    {"answer": "Polling station list", "correctAnswer": false},
    {"answer": "Both A & B", "correctAnswer": true},
    {"answer": "Shark list", "correctAnswer": false}
  ]
}];

var wednesdayQuestions = [
{
  "question": "Which one of these groups is NOT responsible for providing election security?",
  "answers": [
    {"answer": "The Dolphin Defenders", "correctAnswer": true},
    {"answer": "The Police", "correctAnswer": false},
    {"answer": "The Election Management Body", "correctAnswer": false},
    {"answer": "The Media", "correctAnswer": false}
  ]
}, {
  "question": "What should guide procurement decisions in election management bodies’ decision-making processes?",
  "answers": [
    {"answer": "Transparency and objective criteria", "correctAnswer": true},
    {"answer": "Competition", "correctAnswer": false},
    {"answer": "All of the above", "correctAnswer": false},
    {"answer": "None of these; procurement decisions are made by sharkuitous logic", "correctAnswer": false}
  ]
}, {
  "question": "What are the entities called with the mandate of administering electoral processes?",
  "answers": [
    {"answer": "Election management bodies", "correctAnswer": true},
    {"answer": "Election movement buoys", "correctAnswer": false},
    {"answer": "Everyday management beaches", "correctAnswer": false},
    {"answer": "Elusive mediary bodies", "correctAnswer": false}
  ]
}];

var thursdayQuestions = [
{
  "question": "The \"rules of the game\" for conducting Sharkville’s elections are determined by the ____?",
  "answers": [
    {"answer": "Legal Framework", "correctAnswer": true},
    {"answer": "Great White Shark Wikipedia Page", "correctAnswer": false},
    {"answer": "Message in a Bottle", "correctAnswer": false},
    {"answer": "Individual election commissioners", "correctAnswer": false}
  ]
},  {
  "question": "Which of these is not a source of campaign financing?",
  "answers": [
    {"answer": "Loan sharks", "correctAnswer": true},
    {"answer": "Private donations", "correctAnswer": false},
    {"answer": "Allocated state funding", "correctAnswer": false},
    {"answer": "Equal access to public media", "correctAnswer": false}
  ]
},     {
  "question": "Which is an example of a non-proprietary file format?",
  "answers": [
    {"answer": "CSV", "correctAnswer": true},
    {"answer": "DOC", "correctAnswer": false},
    {"answer": "XLS", "correctAnswer": false},
    {"answer": "JAWS", "correctAnswer": false}
  ]
}];

var fridayQuestions = sundayQuestions.concat(mondayQuestions, tuesdayQuestions, wednesdayQuestions, thursdayQuestions);
/*=====  End Questions Objects  ======*/

/*=============================================
=            Select Quiz Questions            =
=============================================*/

/*----------  Switch Questions Object based on date  ----------*/
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if( dd<10 ) { dd='0'+dd } 
if( mm<10 ) { mm='0'+mm } 
var currentDate = mm+'/'+dd+'/'+yyyy;

var questionsObj;

switch (currentDate) {
  case "06/24/2016":
  case "06/25/2016":
  case "06/26/2016":
    questionsObj = sundayQuestions;
    break;
  case "06/27/2016":
    questionsObj = mondayQuestions;
    break;
  case "06/28/2016":
    questionsObj = tuesdayQuestions;
    break;
  case "06/29/2016":
    questionsObj = wednesdayQuestions;
    break;
  case "06/30/2016":
    questionsObj = thursdayQuestions;
    break;
  default:
    questionsObj = fridayQuestions;
}

/*----------  Define Questions Variables  ----------*/
var numQuestions = Object.keys(questionsObj).length;
var maxNumQuestions = 3;
var answerLetterOptions = ["a","b","c","d"];

/*----------  Randomly Order & Loop Through Questions  ----------*/
shuffleArray(questionsObj); // Shuffle Question order
var answers = new Array();
var qCounter = 1;
$.each(questionsObj,function(key,valueObj) {
  if(qCounter > 3) {
    return;
  }
  var qNumber = key + 1;
  var returnHTML = '<div class="q'+key+'">';
  returnHTML += '<span>'+qNumber+'. '+valueObj.question+'</span>';
  returnHTML += '<div class="row"><div class="col-xs-12 col-sm-6">';

  var i = 0;
  shuffleArray(valueObj.answers);
  $.each(valueObj.answers, function(index, answer) {

    // If this is the 3rd answer, create a new column
    if(i == 2) {
      returnHTML += '</div><div class="col-xs-12 col-sm-6">';
    }

    // If this is the correct answer, add it to the answers array
    if(answer.correctAnswer == true) {
      answers[key] = answerLetterOptions[i];
    }
    returnHTML += '<input type="radio" name="q'+key+'" id="q'+key+i+'" value="'+answerLetterOptions[i]+'"> <label for="q'+key+i+'">'+answerLetterOptions[i].toUpperCase()+'. '+answer.answer+'</label><br />';
    i++;
  });

  returnHTML += '</div></div></div>';
  $(".questions").append(returnHTML);
  qCounter++;
});

// Shuffle Helper Function
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}
/*=====  End of Select Quiz Questions  ======*/



// Process Quiz Answers
  var tot = answers.length - 1;
    score = 0;
    questionNumber = 0;

// Click Answer Question Button
$("button[name=quizsubmit]").click(function(){
  // Hide Results Div
  $("#quiz .result").removeClass("wrong").removeClass("right").empty();

  var question = "q"+questionNumber;
  checkAnswer(question);
});

// Check if submitted answer is correct
function checkAnswer(question) {
  var selected = $("input[name="+question+"]:checked").val();

  // If Correct Answer
  if(selected === answers[questionNumber]) {
    // Change the Question
    $(".q"+questionNumber).hide();
    $(".q"+(questionNumber + 1)).show();

    // Update quizFlag & correctAnswer
    quizFlag = false;
    correctAnswer = String(answers[questionNumber]);

    // Update the counters
    score += 1;
    numQuestionsCorrect += 1;
    questionNumber += 1;

    $("#quiz .result").removeClass("wrong").addClass("right").html('Nice job! "'+correctAnswer.toUpperCase()+'" was the correct answer. Find a matching bubble below to earn an extra life and move on, but watch out for the sharks!');

    // Start looping through draw();
    loop();
  }
  //If Wrong Answer
  else {
    // Change the Question
    $(".q"+questionNumber).hide();
    $(".q"+(questionNumber + 1)).show();

    numQuestionsIncorrect += 1;
    questionNumber += 1;

    if(questionNumber == numQuestions) {
      gameOver();
      loop();
    }

    // Incorrect answer result text
    $("#quiz .result").addClass("wrong").html("That answer is incorrect. Try again with the next question below.");
  }
}

/**
 * shareButtons: Display share buttons after completing the quiz/game
 * @param {string} text The message to be shared, also contains the score
 * @return {element} Shows and populates the html of #game-over-sharebuttons
 */
function shareButtons (text) {
  // Show & Populate the Share Buttons Text
      var messageText = text;
      var messageURL = "http://openelectiondata.net/holiday";
      var messageHashtag = "SharkWeek";
      return $("#game-over-sharebuttons").show().html("Share Your Score!<br /><a href='https://twitter.com/share?url="+messageURL+"&via=openelectdata&hashtags="+messageHashtag+"&text="+messageText+"' class='btn btn-social btn-twitter' target='_blank'><span class='fa fa-twitter'></span> Tweet</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script> <div id='shareBtn' class='btn btn-social btn-facebook'><span class='fa fa-facebook'></span> Share</div><script>document.getElementById('shareBtn').onclick = function() {FB.ui({display: 'iframe', method: 'share', href: '"+messageURL+"', hashtag: '#"+messageHashtag+"', quote: '"+messageText+"'}, function(response){});}</script> <a href='https://plus.google.com/share?url="+messageURL+"' target='_blank' class='btn btn-social btn-google'> <span class='fa fa-google'></span> Share</a>");
}