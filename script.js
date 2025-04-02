// Option 1: Using Date objects to track time instead of counting seconds
let sessionLength = 25;
let breakLength = 5;
let endTime; // Will store the target end time
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
    if (isRunning) {
        // Calculate time left based on current time and end time
        const currentTime = new Date().getTime();
        const secondsLeft = Math.max(0, Math.floor((endTime - currentTime) / 1000));
        
        displayElement.textContent = formatTime(secondsLeft);
        
        // Check if timer has ended
        if (secondsLeft === 0) {
            handleTimerEnd();
        }
    } else {
        // When not running, display the set time
        const timeToShow = isBreakTime ? breakLength * 60 : sessionLength * 60;
        displayElement.textContent = formatTime(timeToShow);
    }
}

function handleTimerEnd() {
    clearInterval(timerInterval);
    playAlarmSound();
    
    if (!isBreakTime) {
        // Switch to break time
        isBreakTime = true;
        startTimer(); // Start break timer automatically
    } else {
        // Reset to session time
        isBreakTime = false;
        isRunning = false;
    }
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
        
        // Set the end time based on current time plus duration
        const duration = (isBreakTime ? breakLength : sessionLength) * 60 * 1000; // in milliseconds
        endTime = new Date().getTime() + duration;
        
        // Store end time in localStorage to recover after page refresh
        localStorage.setItem('pomodoroEndTime', endTime);
        localStorage.setItem('pomodoroIsBreakTime', isBreakTime);
        localStorage.setItem('pomodoroIsRunning', true);
        
        // Update display more frequently to ensure accuracy
        timerInterval = setInterval(updateDisplay, 100);
        updateDisplay(); // Update immediately
        
        // Add visibilitychange listener to handle tab switching
        document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
        pauseTimer();
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    localStorage.setItem('pomodoroIsRunning', false);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isBreakTime = false;
    localStorage.removeItem('pomodoroEndTime');
    localStorage.removeItem('pomodoroIsBreakTime');
    localStorage.removeItem('pomodoroIsRunning');
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    updateDisplay();
}

function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        // When tab becomes visible again, recalculate and adjust display
        updateDisplay();
    }
}

// Check if there was a timer running when page was reloaded
function recoverTimerState() {
    const savedEndTime = localStorage.getItem('pomodoroEndTime');
    const savedIsBreakTime = localStorage.getItem('pomodoroIsBreakTime') === 'true';
    const savedIsRunning = localStorage.getItem('pomodoroIsRunning') === 'true';
    
    if (savedEndTime && savedIsRunning) {
        endTime = parseInt(savedEndTime);
        isBreakTime = savedIsBreakTime;
        isRunning = true;
        
        // Check if timer has already ended
        const currentTime = new Date().getTime();
        if (endTime > currentTime) {
            timerInterval = setInterval(updateDisplay, 100);
            document.addEventListener('visibilitychange', handleVisibilityChange);
        } else {
            handleTimerEnd();
        }
    }
}

// Adjust Break Length
breakMinus.addEventListener('click', () => {
    if (!isRunning && breakLength > 1) {
        breakLength--;
        breakValue.textContent = breakLength;
        if (isBreakTime) {
            updateDisplay();
        }
    }
});

breakPlus.addEventListener('click', () => {
    if (!isRunning) {
        breakLength++;
        breakValue.textContent = breakLength;
        if (isBreakTime) {
            updateDisplay();
        }
    }
});

// Adjust Session Length
sessionMinus.addEventListener('click', () => {
    if (!isRunning && sessionLength > 1) {
        sessionLength--;
        sessionValue.textContent = sessionLength;
        if (!isBreakTime) {
            updateDisplay();
        }
    }
});

sessionPlus.addEventListener('click', () => {
    if (!isRunning) {
        sessionLength++;
        sessionValue.textContent = sessionLength;
        if (!isBreakTime) {
            updateDisplay();
        }
    }
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
stopSoundBtn.addEventListener('click', stopAlarmSound);

// Initial setup
updateDisplay();
recoverTimerState(); // Recover timer state if page was reloaded

// Option 2: Using a Service Worker (add this in a separate file named 'service-worker.js')
// Note: This is not a complete implementation, just to showcase the approach
/*
// service-worker.js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  clients.claim();
});

let timers = {};

self.addEventListener('message', (event) => {
  const data = event.data;
  
  if (data.action === 'startTimer') {
    const timerId = data.id;
    const duration = data.duration;
    const endTime = Date.now() + duration;
    
    timers[timerId] = {
      endTime: endTime,
      clientId: event.source.id
    };
    
    checkTimer(timerId);
  }
  
  if (data.action === 'stopTimer') {
    delete timers[data.id];
  }
});

function checkTimer(timerId) {
  const timer = timers[timerId];
  if (!timer) return;
  
  const timeLeft = timer.endTime - Date.now();
  
  if (timeLeft <= 0) {
    // Timer finished
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          action: 'timerComplete',
          id: timerId
        });
      });
    });
    
    delete timers[timerId];
  } else {
    // Check again in 1 second
    setTimeout(() => checkTimer(timerId), 1000);
  }
}
*/