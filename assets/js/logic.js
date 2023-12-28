// Variables to keep track of quiz state
let currentQuestionIndex = 0;
let time = questions.length * 15;
let timerId;

// Variables to reference DOM elements
const questionsEl = document.getElementById('questions');
const timerEl = document.getElementById('time');
const choicesEl = document.getElementById('choices');
const submitBtn = document.getElementById('submit');
const startBtn = document.getElementById('start');
const initialsEl = document.getElementById('initials');
const feedbackEl = document.getElementById('feedback');

function startQuiz() {
  // Hide start screen
  document.getElementById('start-screen').classList.add('hide');

  // Un-hide questions section
  questionsEl.classList.remove('hide');

  // Start timer
  timerId = setInterval(clockTick, 1000);

  // Show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // Get current question object from array
  const currentQuestion = questions[currentQuestionIndex];

  // Update title with current question
  const titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  // Clear out any old question choices
  choicesEl.innerHTML = '';

  // Loop over choices
  currentQuestion.choices.forEach((choice, index) => {
    // Create new button for each choice
    const choiceNode = document.createElement('button');
    choiceNode.classList.add('choice');
    choiceNode.value = choice;
    choiceNode.textContent = `${index + 1}. ${choice}`;

    // Display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick(event) {
  const buttonEl = event.target;

  // If the clicked element is not a choice button, do nothing
  if (!buttonEl.matches('.choice')) {
    return;
  }

  // Check if the user guessed wrong
  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    // Penalize time
    time = Math.max(0, time - 15);

    // Display new time on page
    timerEl.textContent = time;

    feedbackEl.textContent = 'Wrong!';
  } else {
    feedbackEl.textContent = 'Correct!';
  }

  // Flash right/wrong feedback on page for half a second
  feedbackEl.classList.remove('hide');
  setTimeout(() => {
    feedbackEl.classList.add('hide');
  }, 1000);

  // Move to the next question
  currentQuestionIndex++;

  // Check if we've run out of questions
  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // Stop the timer
  clearInterval(timerId);

  // Show the end screen
  document.getElementById('end-screen').classList.remove('hide');

  // Show the final score
  document.getElementById('final-score').textContent = time;

  // Hide the questions section
  questionsEl.classList.add('hide');
}

function clockTick() {
  // Update time
  time--;
  timerEl.textContent = time;

  // Check if the user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // Get the value of the input box
  const initials = initialsEl.value.trim();

  // Make sure the value wasn't empty
  if (initials !== '') {
    // Get saved scores from local storage, or if none, set to an empty array
    const highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    // Format a new score object for the current user
    const newScore = {
      score: time,
      initials: initials,
    };

    // Save to local storage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // Redirect to the next page
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  // "Enter" key has code "Enter" in some browsers and "NumpadEnter" in others
  if (event.key === 'Enter' || event.code === 'NumpadEnter') {
    saveHighscore();
  }
}

// User clicks the button to submit initials
submitBtn.addEventListener('click', saveHighscore);

// User clicks the button to start the quiz
startBtn.addEventListener('click', startQuiz);

// User clicks on the element containing choices
choicesEl.addEventListener('click', questionClick);

// Event listener for keyup on the initials input
initialsEl.addEventListener('keyup', checkForEnter);
