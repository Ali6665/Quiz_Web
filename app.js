var firebaseConfig = {
    apiKey: "AIzaSyAPhZ1pP3KUhrAMz5Bxbequp_doFhkReZc",
    authDomain: "quiz-7fe75.firebaseapp.com",
    databaseURL: "https://quiz-7fe75-default-rtdb.firebaseio.com",
    projectId: "quiz-7fe75",
    storageBucket: "quiz-7fe75.firebasestorage.app",
    messagingSenderId: "733806461576",
    appId: "1:733806461576:web:84e27f540e1c92758c553d",
    measurementId: "G-03ZQC07TBM"
  };
  
  // Initialize Firebase
  var app = firebase.initializeApp(firebaseConfig);

var questions = [
    { question: "Q 01. HTML Stands for ?", option1: "Hyper Text Markup Language", option2: "Hyper Tech Markup Language", option3: "Hyper Touch Markup Language", corrAnswer: "Hyper Text Markup Language" },
    { question: "Q 02. CSS Stands for", option1: "Cascoding Style Sheets", option2: "Cascading Style Sheets", option3: "Cascating Style Sheets", corrAnswer: "Cascading Style Sheets" },
    { question: "Q 03. Which tag is used for most large heading", option1: "<h6>", option2: "<h2>", option3: "<h1>", corrAnswer: "<h1>" },
    { question: "Q 04. Which is the correct CSS syntax?", option1: "{body:color=black}", option2: "{body:color;black:}", option3: "body {color:black;}", corrAnswer: "body {color:black;}" },
    { question: "Q 05. Any element assigned with id, can be get in css ", option1: "by # tag", option2: "by @ tag", option3: "by & tag", corrAnswer: "by # tag" },
    { question: "Q 06. How do you insert a comment in a CSS file ? ", option1: "// this is a comment //", option2: "// this is a comment ", option3: "/* this is a comment */", corrAnswer: "/* this is a comment */" },
    { question: "Q 07. In JS variable types are ____________ ", option1: "there are Six types", option2: "there are three types", option3: "there are eight types", corrAnswer: "there are eight types" },
    { question: "Q 08. In array we can use key name and value ", option1: "True", option2: "False", option3: "None of above", corrAnswer: "False" },
    { question: "Q 09. toFixed() is used to define length of decimal ", option1: "True", option2: "False", option3: "None of above", corrAnswer: "True" },
    { question: "Q 10. push() method is used to add element in the start of array ", option1: "True", option2: "False", option3: "None of above", corrAnswer: "False" }
  ];
  
  var quesElement = document.getElementById("ques");
  var option1    = document.getElementById("opt1");
  var option2    = document.getElementById("opt2");
  var option3    = document.getElementById("opt3");
  var index      = 0;
  var score      = 0;
  var timer      = document.getElementById("timer");
  var min        = 2;
  var sec        = 59;
  
  // User data & answers for console
  var userName, userEmail;
  var answerLog = [];
  
  // Countdown timer
  setInterval(function () {
    timer.innerHTML = `${min} : ${sec}`;
    sec--;
    if (sec < 0) {
      min--;
      sec = 59;
      if (min < 0) {
        nextQuestion();
      }
    }
  }, 1000);
  
  function nextQuestion() {
    var nextBtn = document.getElementById("btn");
    var allOptions = document.getElementsByName("options");
  
    // First time, ask name/email
    if (index === 0 && !userName) {
      userName  = prompt("Enter your name:");
      userEmail = prompt("Enter your email:");
      console.log("User Name:", userName);
      console.log("User Email:", userEmail);
      console.log("------------------------");
    }
  
    // Check previous selection (skip on first call)
    if (index > 0) {
      for (var i = 0; i < allOptions.length; i++) {
        if (allOptions[i].checked) {
          var selVal = allOptions[i].value;
          allOptions[i].checked = false;
          var selOption    = questions[index-1][`option${selVal}`];
          var correctAnswer= questions[index-1].corrAnswer;
          var isCorrect    = selOption === correctAnswer;
          if (isCorrect) score++;
          console.log(`Question ${index}: Selected = ${selOption} | ${isCorrect? "✅": "❌"} (Correct: ${correctAnswer})`);
          answerLog.push({ question: questions[index-1].question, selected: selOption, correct: correctAnswer, correctFlag: isCorrect });
          break;
        }
      }
    }
  
    // Advance or finish
    if (index >= questions.length) {
      // Final summary in console
      console.log("------------------------");
      console.log(`Final Score: ${score} / ${questions.length}`);
      console.log("------------------------");
  
      // Show on screen
      var percent = ((score / questions.length)*100).toFixed(2);
      document.body.innerHTML = `
        <div style="text-align:center; margin-top:100px; font-family:Arial,sans-serif;">
          <h1>Quiz Complete!</h1>
          <h2>${userName}, you scored ${score} out of ${questions.length}</h2>
          <h3>Percentage: ${percent}%</h3>
        </div>
      `;
  
      // Save to Firebase
      var resultObj = {
        name:       userName,
        email:      userEmail,
        score:      score,
        total:      questions.length,
        percentage: percent + "%",
        answers:    answerLog
      };
  
      try {
        firebase.database().ref("QuizResults").push(resultObj);
        console.log("✅ Result saved to Firebase:", resultObj);
      } catch(e) {
        console.error("❌ Firebase Save Error:", e);
      }
  
      return;
    }
  
    // Show next question
    quesElement.innerText = questions[index].question;
    option1.innerText      = questions[index].option1;
    option2.innerText      = questions[index].option2;
    option3.innerText      = questions[index].option3;
    index++;
    nextBtn.disabled = true;
  }
  
  function clicked() {
    document.getElementById("btn").disabled = false;
  }
  