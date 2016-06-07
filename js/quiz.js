var questionsObj = {
  0: {
    "question": "1. Which of the following is an example of a machine-readable format?",
    "answers:": [
      "A. Carbonite-frozen format",
      "B. JabbaScript Object Notation",
      "C. Comma-separated file",
      "D. None of them, these aren't the formats you're looking for."
    ],
    "correctAnswer": "C. Comma-separated file",
  },
  1: {
    "question": "2. Which one is not an open election data principle?",
    "answers:": [
      "A. Complete and in bulk, there is no try",
      "B. Hyperspace compatibility",
      "C. Non-proprietary &mdash; the Rebel Alliance answers to no evil overlord",
      "D. Non-discriminatory, even for half-witted, scruffy-looking Nerf herders."
    ],
    "correctAnswer": "B. Hyperspace compatibility"
  },
  2: {
    "question": "3. When should election results be released to be considered timely?",
    "answers:": [
      "A. A long time ago in a galaxy far far away",
      "B. As quickly as necessary for it to be useful",
      "C. Never, it's a trap.",
      "D. Whenever Darth Vader says they're good and ready."
    ],
    "correctAnswer": "B. As quickly as necessary for it to be useful"
  },
}

console.log(questionsObj);


// Process Quiz Answers
var answers = ["c","b","b"], 
    tot = answers.length - 1;
    score = 0;
    questionNumber = 0;
    tries = 0;

// Click Answer Question Button
$("button[name=quizsubmit]").click(function(){
  // Hide Results Div
  $(".questions .result").removeClass("wrong").empty();

  var question = "q"+questionNumber;
  checkAnswer(question);
});

// Check if submitted answer is correct
function checkAnswer(question) {
  var selected = $("input[name="+question+"]:checked").val();

  // If Correct Answer
  if(selected === answers[questionNumber]) {
    // Change the Question
    $(".q"+questionNumber).hide().remove();
    $(".q"+(questionNumber + 1)).show();

    // Update quizFlag & correctAnswer
    quizFlag = false;
    correctAnswer = String(answers[questionNumber]);
    console.log(correctAnswer);

    // Update the counters
    score += 1;
    questionNumber += 1;
    tries = 0;

    // Start looping through draw();
    loop();

    // If We've Answered All the Questions, Celebrate
    if(questionNumber == tot) {
      console.log("You win!");
    }
  }
  //If Wrong Answer
  else {
    tries += 1;
    if(tries == 3) {
      // Select the right answer for the user
      var answer = answers[questionNumber];
      var radioID = $("input[value="+answer+"]").attr("id");
      $("input[name=q"+questionNumber+"]").not("input[value="+answer+"]").prop("disabled", true);
      $("#"+radioID).prop("checked", true);
    }
    else {
      var incorrectResponseArray = [
          "That's incorrect. Try again!",
          "Hmm, that's still not right. Give it one more try!"
      ];
      $(".questions .result").addClass("wrong").html(incorrectResponseArray[tries-1]);
    }
  }
}