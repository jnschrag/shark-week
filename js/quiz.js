var questionsObj = [
{
  "question": "Which of the following is an example of a machine-readable format?",
  "answers": [
    {"answer": "Carbonite-frozen format", "correctAnswer": false},
    {"answer": "JabbaScript Object Notation", "correctAnswer": false},
    {"answer": "Comma-separated file", "correctAnswer": true},
    {"answer": "None of them, these aren't the formats you're looking for.", "correctAnswer": false}
  ]
}, {
  "question": "Which one is not an open election data principle?",
  "answers": [
    {"answer": "Complete and in bulk, there is no try", "correctAnswer": false},
    {"answer": "Hyperspace compatibility", "correctAnswer": true},
    {"answer": "Non-proprietary &mdash; the Rebel Alliance answers to no evil overlord", "correctAnswer": false},
    {"answer": "Non-discriminatory, even for half-witted, scruffy-looking Nerf herders.", "correctAnswer": false}
  ]
}, {
  "question": "When should election results be released to be considered timely?",
  "answers": [
    {"answer": "A long time ago in a galaxy far far away", "correctAnswer": false},
    {"answer": "As quickly as necessary for it to be useful", "correctAnswer": true},
    {"answer": "Never, it's a trap.", "correctAnswer": false},
    {"answer": "Whenever Darth Vader says they're good and ready.", "correctAnswer": false}
  ]
}];

var numQuestions = Object.keys(questionsObj).length;

// Randomly order the questions
shuffleArray(questionsObj);

// Loop through and add them to the .questions container
var answerLetterOptions = ["a","b","c","d"];
var answers = new Array();
$.each(questionsObj,function(key,valueObj) {
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
});

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