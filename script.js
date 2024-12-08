let shuffledQuestions, currentQuestionIndex, score, questions;

document.addEventListener('DOMContentLoaded', (event) => {
    readQuestions(startQuiz);
});

function readQuestions(callback) {
    fetch('domande.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            callback();
        })
        .catch(err => {
            console.error('Error reading file:', err);
        });
}

function capitalizeFirstLetter(text) {
    if (text.length === 0) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    shuffledQuestions = shuffleArray(questions).slice(0, 20);
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('help-button').style.display = 'inline-block';
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateQuestionStatus();
}

function updateQuestionStatus() {
    const totalQuestions = 20; // Total number of questions
    const currentQuestionNumber = currentQuestionIndex + 1;
    const statusText = `Domanda ${currentQuestionNumber} di ${totalQuestions}`;
    document.getElementById('question-status').innerText = statusText;
}

function showQuestion(question) {
    const questionContainer = document.getElementById('question-container');
    
    // Shuffle the answers
    let answersArray = Object.entries(question.answers);
    let shuffledAnswersArray = answersArray.sort(() => Math.random() - 0.5);
    
    // Map the original letters to shuffled answers
    const letters = ['A', 'B', 'C', 'D'];
    let shuffledAnswersWithLetters = shuffledAnswersArray.map(([key, answer], index) => ({
        letter: letters[index],
        key: key,
        answer: capitalizeFirstLetter(answer)
    }));

    questionContainer.innerHTML = `
        <div>
            <h3>${capitalizeFirstLetter(question.question)}</h3>
            ${shuffledAnswersWithLetters.map(({letter, key, answer}) => `
                <label>
                    <input type="radio" name="answer" value="${key}">
                    ${letter}. ${answer}
                </label><br>
            `).join('')}
        </div>
    `;
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (selectedAnswer) {
        if (selectedAnswer.value === shuffledQuestions[currentQuestionIndex].correctAnswer) {
            score += 1;
        } else {
            score -= 0.25;
        }
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
        updateQuestionStatus();
    } else {
        document.getElementById('next-button').style.display = 'none';
        document.getElementById('submit-button').style.display = 'inline-block';
        document.getElementById('help-button').style.display = 'none';
        document.getElementById('question-status').innerText = `Hai completato il quiz!`;
    }
}

function submitQuiz() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('result-container').classList.remove('hidden');
    document.getElementById('score').innerText = `Il tuo punteggio è: ${score}`;
}

function showHelp() {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    const correctAnswer = currentQuestion.correctAnswer;
    const correctAnswerText = currentQuestion.answers[correctAnswer];

    const helpText = document.createElement('p');
    helpText.innerHTML = `<strong>Correct Answer: ${capitalizeFirstLetter(correctAnswerText)}</strong>`;
    questionContainer.appendChild(helpText);
}
