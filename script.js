//create mode
//start  game 
//next button
//answer determiner 
//timing function

//DOM Elements 
const startButton = document.getElementById('start');
const questionContainer = document.querySelector('.question-container');
const questionContent = document.querySelector('.question-box');
const answerContent = document.querySelector('.answer-box');
const nextButton = document.getElementById('next')
const gameOver = document.querySelector('.game-over')
const restartButton = document.getElementById('game-over-btn');
const container = document.querySelector('.container');
const modeContainer = document.querySelector('.mode-container')
const mode = Array.from(document.querySelectorAll('.mode-selector'));
const loader = document.getElementById('loader');


//Declaration of variables
let currentQuestion = {};
let questionCounter = 0;
let availableQuestions = [];
let shuffledQuestions, questionIndex, acceptingAnswers;


//Event Listeners
startButton.addEventListener('click', selectMode);
nextButton.addEventListener('click', () => {
    setQuestion();
})
restartButton.addEventListener('click', () => {
    gameOver.classList.add('hide');
    container.classList.add('hide');
    selectMode();
})

//select Mode
function selectMode() {
    startButton.classList.add('hide');
    modeContainer.classList.remove('hide');
    mode.forEach(modal => {
        modal.addEventListener('click', startMode)
    })
}


//start Mode
function startMode(e) {
    let modeName = ''
    const button = e.target.innerHTML;
    switch (button) {
        case 'Easy':
            modeName = 'easy';
            startGame(modeName);
            break;
        case 'Medium':
            modeName = 'medium';
            startGame(modeName);
            break
        case 'Hard':
            modeName = 'hedium';
            startGame(modeName);
            break
        case 'Survival':
            modeName = '';
            startGame(modeName);
            break
        }
    }
    
    
//start Game
function startGame(m) {
    modeContainer.classList.add('hide');
    loader.classList.remove('hide');
    console.log('began')
    fetch(`https://the-trivia-api.com/api/questions?categories=general_knowledge,arts_and_literature,science,sport_and_leisure,soceity_and_culture&limit=50&fifficulty=${m}`)
    .then(response => {
        return response.json()
    })
    .then(data => {
        data.map(d => {
            let answerposition = Math.floor(Math.random() * 4);
            d.answerNumber = answerposition;
            const answers = d.incorrectAnswers;
            answers.splice(answerposition, 0, d.correctAnswer);
        })
        questionCounter = 0;
        availableQuestions = [...data];
        setQuestion();
    })
}
    
//set question
function setQuestion() {
    resetContainer();
    questionCounter++;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    showQuestion(currentQuestion);
    loader.classList.add('hide');
    container.classList.remove('hide');
    availableQuestions.splice(questionIndex, 1);
}

//reset Container
function resetContainer() {
    nextButton.classList.add('hide');
    while(answerContent.firstChild) {
        answerContent.removeChild(answerContent.firstChild);
    }
}

//show Question
function showQuestion(q) {
    let count = 0;
    questionContent.innerHTML = q.question;
    const newAnswers = q.incorrectAnswers;
    newAnswers.forEach(newAnswer => {
        const a = document.createElement('button');
        a.dataset.number = count;
        count++
        a.classList.add('answer');
        a.innerHTML = newAnswer;
        answerContent.appendChild(a);
        a.addEventListener('click', selectAnswer);
        const comparer = a.dataset.number
        const decider = currentQuestion.answerNumber;
        
        if (comparer == decider) {
            a.dataset.correct = true;
        }
    })
}

//select Answer
function selectAnswer(e) {
    const button = e.target
    const rightAns = button.dataset.correct;
    setStatus(document.body, rightAns);
    Array.from(answerContent.children).forEach(child => {
        setStatus(child, child.dataset.correct);
        child.removeEventListener('click',selectAnswer);
    })
    if (availableQuestions.length > 0) {
        nextButtonFunction()
    }
    else {
        startButton.innerHTML = 'Restart';
        startButton.classList.remove('hide');
    }
}

//set Status
function setStatus(element, status) {
    clearStatus(element)
    if(status) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

//clear Status
function clearStatus(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

//nextQuestion
function nextButtonFunction() {
    if(document.body.classList.contains('correct')) {
        nextButton.classList.remove('hide');
    }
    else {
        gameOver.classList.remove('hide');
    }
}