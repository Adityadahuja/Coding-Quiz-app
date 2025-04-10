const quizData = [
    {
        question: "Which language runs in a web browser?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "What does CSS stand for?",
        a: "Central Style Sheets",
        b: "Cascading Style Sheets",
        c: "Cascading Simple Sheets",
        d: "Cars SUVs Sailboats",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Hypertext Markdown Language",
        c: "Hyperloop Machine Language",
        d: "Helicopters Terminals Motorboats Lamborginis",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "none of the above",
        correct: "b",
    },
    {
        question: "Which was the first high-level programming language?",
        a: "FORTRAN",
        b: "COBOL",
        c: "LISP",
        d: "ALGOL",
        correct: "a",
    },
    {
        question: "When was Python first released?",
        a: "1991",
        b: "1995",
        c: "2000",
        d: "1989",
        correct: "a",
    },
    {
        question: "Who created the C programming language?",
        a: "Dennis Ritchie",
        b: "Bjarne Stroustrup",
        c: "Ken Thompson",
        d: "Brian Kernighan",
        correct: "a",
    },
    {
        question: "Which language was used to write the first web browser?",
        a: "C++",
        b: "Java",
        c: "C",
        d: "Pascal",
        correct: "a",
    },
    {
        question: "What was the first object-oriented programming language?",
        a: "Smalltalk",
        b: "C++",
        c: "Java",
        d: "Simula",
        correct: "d",
    },
    {
        question: "Which company developed Java?",
        a: "Microsoft",
        b: "Sun Microsystems",
        c: "IBM",
        d: "Oracle",
        correct: "b",
    },
    {
        question: "When was JavaScript created?",
        a: "1995",
        b: "1990",
        c: "2000",
        d: "1985",
        correct: "a",
    },
    {
        question: "Who is known as the father of computer science?",
        a: "Alan Turing",
        b: "Charles Babbage",
        c: "Ada Lovelace",
        d: "John von Neumann",
        correct: "a",
    },
    {
        question: "Which was the first programming language to use garbage collection?",
        a: "LISP",
        b: "Java",
        c: "Python",
        d: "C#",
        correct: "a",
    },
    {
        question: "What was the first version control system?",
        a: "Git",
        b: "SVN",
        c: "CVS",
        d: "RCS",
        correct: "d",
    },
];

const quiz = document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const submitBtn = document.getElementById('submit')
const feedbackEl = document.getElementById('feedback')

let currentQuiz = 0
let score = 0
let usedQuestions = new Set()
let currentQuestion = null
let isQuestionSubmitted = false

// Add timer functionality
let timerInterval;
let timeLeft = 30; // 30 seconds per question

function getRandomQuestion() {
    let availableQuestions = quizData.filter((_, index) => !usedQuestions.has(index))
    if (availableQuestions.length === 0) {
        usedQuestions.clear()
        availableQuestions = quizData
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const questionIndex = quizData.indexOf(availableQuestions[randomIndex])
    usedQuestions.add(questionIndex)
    return quizData[questionIndex]
}

function loadQuiz() {
    deselectAnswers()
    feedbackEl.innerHTML = ''
    feedbackEl.className = 'feedback-container'
    currentQuestion = getRandomQuestion()
    
    questionEl.innerText = currentQuestion.question
    a_text.innerText = currentQuestion.a
    b_text.innerText = currentQuestion.b
    c_text.innerText = currentQuestion.c
    d_text.innerText = currentQuestion.d
    
    // Add animation classes
    questionEl.classList.add('animate__animated', 'animate__fadeIn')
    Array.from(answerEls).forEach((el, index) => {
        el.parentElement.classList.add('animate__animated', 'animate__fadeIn')
        el.parentElement.style.animationDelay = `${index * 0.1}s`
    })
    
    // Start timer if enabled
    startTimer()
}

function deselectAnswers() {
    answerEls.forEach(answerEl => answerEl.checked = false)
}

function getSelected() {
    let answer

    answerEls.forEach(answerEl => {
        if(answerEl.checked) {
            answer = answerEl.id
        }
    })

    return answer
}

function showFeedback(isCorrect) {
    feedbackEl.innerHTML = isCorrect 
        ? '✅ Correct! Well done!'
        : '❌ Incorrect. Try again!'
    feedbackEl.className = `feedback-container ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`
    feedbackEl.classList.add('animate__animated', 'animate__fadeIn')
}

function handleSubmit() {
    const answer = getSelected();
    
    if (!answer) {
        // Show error message if no option is selected
        feedbackEl.innerHTML = '❌ Please select an option!';
        feedbackEl.className = 'feedback-container feedback-incorrect';
        feedbackEl.classList.add('animate__animated', 'animate__fadeIn');
        return;
    }
    
    stopTimer();
    const isCorrect = answer === currentQuestion.correct;
    showFeedback(isCorrect);
    
    if(isCorrect) {
        score++;
    }

    // Disable all inputs after submission
    answerEls.forEach(el => el.disabled = true);
    
    // Change button text and style
    submitBtn.textContent = 'Next Question';
    submitBtn.style.backgroundColor = isCorrect ? 'var(--correct-color)' : 'var(--incorrect-color)';
    
    isQuestionSubmitted = true;
}

function handleNextQuestion() {
    currentQuiz++
    if(currentQuiz < quizData.length) {
        loadQuiz()
        submitBtn.textContent = 'Submit'
        submitBtn.style.backgroundColor = 'var(--primary-color)'
        answerEls.forEach(el => el.disabled = false)
        isQuestionSubmitted = false
    } else {
        showFinalResults()
    }
}

submitBtn.addEventListener('click', () => {
    if (!isQuestionSubmitted) {
        handleSubmit()
    } else {
        handleNextQuestion()
    }
})

function showFinalResults() {
    const percentage = Math.round((score / quizData.length) * 100)
    let message = ''
    
    if(percentage >= 90) {
        message = '🎉 Excellent! You\'re a coding genius!'
    } else if(percentage >= 70) {
        message = '👍 Great job! You know your stuff!'
    } else if(percentage >= 50) {
        message = '😊 Good effort! Keep learning!'
    } else {
        message = '📚 Keep practicing! You\'ll get better!'
    }
    
    quiz.innerHTML = `
        <div class="quiz-header animate__animated animate__fadeIn">
            <h2>${message}</h2>
            <h3>You scored ${score}/${quizData.length} (${percentage}%)</h3>
            <button onclick="location.reload()" class="animate__animated animate__pulse animate__infinite">Try Again</button>
        </div>
    `
}

// Initialize the quiz
loadQuiz()

// Settings functionality
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const closeBtn = document.querySelector('.close-btn');
const soundToggle = document.getElementById('soundToggle');
const timerToggle = document.getElementById('timerToggle');
const resetBtn = document.getElementById('resetBtn');
const speedBtns = document.querySelectorAll('.speed-btn');

// Load saved settings
const savedSettings = JSON.parse(localStorage.getItem('quizSettings')) || {
  theme: 'light',
  sound: true,
  timer: false,
  speed: 'normal'
};

// Apply saved settings
document.documentElement.setAttribute('data-theme', savedSettings.theme);
soundToggle.checked = savedSettings.sound;
timerToggle.checked = savedSettings.timer;
document.querySelector(`.speed-btn[data-speed="${savedSettings.speed}"]`).classList.add('active');

// Settings menu toggle
settingsBtn.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  settingsMenu.classList.toggle('show');
});

closeBtn.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  settingsMenu.classList.remove('show');
});

// Close settings when clicking outside
document.addEventListener('click', function(e) {
  if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
    settingsMenu.classList.remove('show');
  }
});

// Theme switching
document.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const theme = this.dataset.theme;
    document.documentElement.setAttribute('data-theme', theme);
    savedSettings.theme = theme;
    localStorage.setItem('quizSettings', JSON.stringify(savedSettings));
    
    // Update active state
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// Sound toggle
soundToggle.addEventListener('change', function() {
  savedSettings.sound = this.checked;
  localStorage.setItem('quizSettings', JSON.stringify(savedSettings));
  
  if (savedSettings.sound) {
    playSound('correct');
  }
});

// Timer toggle
timerToggle.addEventListener('change', function() {
  savedSettings.timer = this.checked;
  localStorage.setItem('quizSettings', JSON.stringify(savedSettings));
  
  if (savedSettings.timer && !isQuestionSubmitted) {
    startTimer();
  } else {
    stopTimer();
  }
});

// Speed control
speedBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    speedBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const speed = this.dataset.speed;
    savedSettings.speed = speed;
    localStorage.setItem('quizSettings', JSON.stringify(savedSettings));
    
    const speedValue = speed === 'slow' ? '0.5s' : 
                      speed === 'fast' ? '0.2s' : '0.3s';
    document.documentElement.style.setProperty('--animation-speed', speedValue);
  });
});

// Reset button
resetBtn.addEventListener('click', function() {
  if (confirm('Are you sure you want to reset all settings and progress?')) {
    localStorage.clear();
    location.reload();
  }
});

// Add sound effects
function playSound(type) {
  if (!savedSettings.sound) return;
  
  const audio = new Audio();
  audio.src = type === 'correct' ? 'correct.mp3' : 'incorrect.mp3';
  audio.volume = 0.5; // Set volume to 50%
  audio.play().catch(e => console.log('Audio play failed:', e));
}

// Add timer functionality
function startTimer() {
  if (!savedSettings.timer) return;
  
  timeLeft = 30;
  const timerContainer = document.createElement('div');
  timerContainer.className = 'timer-container show';
  timerContainer.id = 'timer';
  document.querySelector('.quiz-container').appendChild(timerContainer);
  
  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const timer = document.getElementById('timer');
  if (!timer) return;
  
  timer.textContent = `Time: ${timeLeft}s`;
  
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    handleSubmit();
  } else {
    timeLeft--;
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  const timer = document.getElementById('timer');
  if (timer) timer.remove();
}

// Add option click handling
document.querySelectorAll('.option').forEach(option => {
  option.addEventListener('click', () => {
    if (isQuestionSubmitted) return;
    
    const radio = option.querySelector('input[type="radio"]');
    radio.checked = true;
    
    // Update selected state
    document.querySelectorAll('.option').forEach(opt => {
      opt.classList.remove('selected');
    });
    option.classList.add('selected');
  });
});