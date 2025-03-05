let sessionLength = 25;
let breakLength = 5;
let timeLeft = sessionLength * 60;
let timerInterval;
let isRunning = false;
let isBreakTime = false;

const alarmSound = new Audio('Sound.mp3');
const stopSoundBtn = document.getElementById('stopSoundBtn');

const displayElement = document.querySelector('.display');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const breakMinus = document.getElementById('breakMinus');
const breakPlus = document.getElementById('breakPlus');
const sessionMinus = document.getElementById('sessionMinus');
const sessionPlus = document.getElementById('sessionPlus');
const breakValue = document.getElementById('breakValue');
const sessionValue = document.getElementById('sessionValue');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    displayElement.textContent = formatTime(timeLeft);
}

function playAlarmSound() {
    alarmSound.play();
    stopSoundBtn.style.display = 'block';
}

function stopAlarmSound() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    stopSoundBtn.style.display = 'none';
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                playAlarmSound();
                
                if (!isBreakTime) {
                    // Switch to break time automatically
                    isBreakTime = true;
                    timeLeft = breakLength * 60;
                    updateDisplay();
                    startTimer(); // Automatically start break timer
                } else {
                    // Reset to session time
                    isBreakTime = false;
                    timeLeft = sessionLength * 60;
                    updateDisplay();
                    isRunning = false;
                }
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isBreakTime = false;
    timeLeft = sessionLength * 60;
    updateDisplay();
}

// Adjust Break Length
breakMinus.addEventListener('click', () => {
    if (breakLength > 1) {
        breakLength--;
        breakValue.textContent = breakLength;
    }
});

breakPlus.addEventListener('click', () => {
    breakLength++;
    breakValue.textContent = breakLength;
});

// Adjust Session Length
sessionMinus.addEventListener('click', () => {
    if (sessionLength > 1) {
        sessionLength--;
        sessionValue.textContent = sessionLength;
        timeLeft = sessionLength * 60;
        updateDisplay();
    }
});

sessionPlus.addEventListener('click', () => {
    sessionLength++;
    sessionValue.textContent = sessionLength;
    timeLeft = sessionLength * 60;
    updateDisplay();
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopSoundBtn.addEventListener('click', stopAlarmSound);

// Initial display
updateDisplay();