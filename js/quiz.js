var questionsObj = [
{
  "question": "1. Which of the following is an example of a machine-readable format?",
  "answers:": {
    "A. Carbonite-frozen format": false,
    "B. JabbaScript Object Notation": false,
    "C. Comma-separated file": true,
    "D. None of them, these aren't the formats you're looking for.": false
  }
}, {
  "question": "2. Which one is not an open election data principle?",
  "answers:": {
    "A. Complete and in bulk, there is no try": false,
    "B. Hyperspace compatibility": true,
    "C. Non-proprietary &mdash; the Rebel Alliance answers to no evil overlord": false,
    "D. Non-discriminatory, even for half-witted, scruffy-looking Nerf herders.": false
  }
}, {
  "question": "3. When should election results be released to be considered timely?",
  "answers:": {
    "A. A long time ago in a galaxy far far away": false,
    "B. As quickly as necessary for it to be useful": true,
    "C. Never, it's a trap.": false,
    "D. Whenever Darth Vader says they're good and ready.": false
  }
}];

// Process Quiz Answers
var answers = ["c","b","b"], 
    tot = answers.length - 1;
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

    $("#quiz .result").removeClass("wrong").addClass("right").html('Nice job! "'+correctAnswer.toUpperCase()+'" was the correct answer. Find a matching bubble below to earn an extra life and move on.');

    // Start looping through draw();
    loop();

    // If We've Answered All the Questions, Celebrate
    if(questionNumber == tot) {
      console.log("You win!");
    }
  }
  //If Wrong Answer
  else {
    // Change the Question
    $(".q"+questionNumber).hide();
    $(".q"+(questionNumber + 1)).show();

    console.log("questionNumber: "+questionNumber);
    console.log("numQuestions: "+numQuestions);

    numQuestionsIncorrect += 1;
    questionNumber += 1;

    if(questionNumber == numQuestions) {
      console.log("Game over");
      gameOver();
      loop();
    }

    // Incorrect answer result text
    $("#quiz .result").addClass("wrong").html("That answer is incorrect. Try again with the next question below.");
  }
}