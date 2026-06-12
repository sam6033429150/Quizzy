let currentUser = null;

// Updated and standardized web development questions
const questions = [
  {
    question: "What does the acronym HTTP stand for?",
    answers: [
      "Hyper Text Transfer Protocol",
      "High Tech Transfer Protocol",
      "Home Tool Transfer Protocol",
      "None of the above"
    ],
    correct: 0
  },
  {
    question: "HTML stands for?",
    answers: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "High Transfer Machine Language",
      "None of the above"
    ],
    correct: 0
  },
  {
    question: "Which HTML tag is used to create an interactive form for user input?",
    answers: [
  "form",
  "input",
  "button",
  "label"
    ],
    correct: 0
  },
  {
    question: "What does the DOM stand for in web development?",
    answers: [
      "Data Object Model",
      "Document Object Model",
      "Digital Output Management",
      "Direct Object Mapping"
    ],
    correct: 1
  },
  {
    question: "CSS is primarily used for?",
    answers: [
      "Styling and Layout",
      "Database Management",
      "Server Networking",
      "Hardware Configuration"
    ],
    correct: 0
  }
];

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 15;

function hideAll() {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.add("hidden");
  });
}

function showRegister() {
  hideAll();
  document.getElementById("registerPage").classList.remove("hidden");
}

function showLogin() {
  hideAll();
  document.getElementById("loginPage").classList.remove("hidden");
}

function registerUser() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.username === username)) {
    alert("User already exists");
    return;
  }

  users.push({
    username,
    password,
    score: 0
  });

  localStorage.setItem("users", JSON.stringify(users));
  alert("Registration Successful");
  showLogin();
}

function loginUser() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Invalid Login");
    return;
  }

  currentUser = user;
  showDashboard();
}

function showDashboard() {
  hideAll();
  document.getElementById("dashboardPage").classList.remove("hidden");
  document.getElementById("welcomeUser").innerText = "Welcome " + currentUser.username;
  loadScores();
}

function loadScores() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let html = "";

  users.forEach(user => {
    html += `
<tr>
<td>${user.username}</td>
<td>${user.score}</td>
</tr>
`;
  });

  document.getElementById("scoreTable").innerHTML = html;
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  hideAll();
  document.getElementById("quizPage").classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= questions.length) {
    finishQuiz();
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question").innerText = q.question;

  let html = "";
  q.answers.forEach((answer, index) => {
    html += `
<button
class="answer-btn"
onclick="checkAnswer(${index})">
${answer}
</button>
`;
  });

  document.getElementById("answers").innerHTML = html;
  startTimer();
}

function checkAnswer(selected) {
  const q = questions[currentQuestion];

  if (selected === q.correct) {
    score++;
  }

  currentQuestion++;
  loadQuestion();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById("timer").innerText = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      currentQuestion++;
      loadQuestion();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(timer);
  let users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach(user => {
    if (user.username === currentUser.username) {
      user.score = score;
    }
  });

  localStorage.setItem("users", JSON.stringify(users));
  hideAll();
  document.getElementById("resultPage").classList.remove("hidden");
  document.getElementById("finalScore").innerText = `Your Score: ${score}/${questions.length}`;
}

function showLeaderboard() {
  hideAll();
  document.getElementById("leaderboardPage").classList.remove("hidden");

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.sort((a, b) => b.score - a.score);

  let html = "";
  users.forEach((user, index) => {
    html += `
<tr>
<td>${index + 1}</td>
<td>${user.username}</td>
<td>${user.score}</td>
</tr>
`;
  });

  document.getElementById("leaderboardBody").innerHTML = html;
}

function backDashboard() {
  showDashboard();
}

function logout() {
  currentUser = null;
  showLogin();
}

function clearScores() {

    let users =
    JSON.parse(localStorage.getItem("users")) || [];

    users.forEach(user => {
        user.score = 0;
    });

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("All scores cleared");

    loadScores();
}

function deleteCurrentUser() {

    if(!confirm("Delete your account permanently?")){
        return;
    }

    let users =
    JSON.parse(localStorage.getItem("users")) || [];

    users = users.filter(
        user => user.username !== currentUser.username
    );

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    currentUser = null;

    alert("Account deleted");

    showLogin();
}
