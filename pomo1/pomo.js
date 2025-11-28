// Pomodoro length in seconds (25 minutes)
const POMODORO_DURATION = 25 * 60;

let remainingSeconds = POMODORO_DURATION;
let isRunning = false;
let timerId = null;

const minuteHandEl = document.getElementById("minute-hand");
const secondHandEl = document.getElementById("second-hand");
const timeLabelEl = document.getElementById("time-label");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

// Update the analog dial based on remaining time
function updateDial() {
  // Minute hand: full circle over the whole Pomodoro (unchanged)
  const progress = 1 - remainingSeconds / POMODORO_DURATION; // 0 → 1
  const minuteAngle = progress * 360;

  // SECOND HAND FIX:
  // Use elapsed seconds so the second hand moves CLOCKWISE
  const secondsElapsed = POMODORO_DURATION - remainingSeconds;
  const secondsWithinMinute = secondsElapsed % 60;
  const secondAngle = (secondsWithinMinute / 60) * 360;

  minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
  secondHandEl.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;

  timeLabelEl.textContent = formatTime(remainingSeconds);
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = "Pause";

  timerId = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      updateDial();
    } else {
      clearInterval(timerId);
      timerId = null;
      isRunning = false;
      startPauseBtn.textContent = "Start";
      // Optional: play a sound or show a notification here
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  startPauseBtn.textContent = "Start";
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function resetTimer() {
  pauseTimer();
  remainingSeconds = POMODORO_DURATION;
  updateDial();
}

startPauseBtn.addEventListener("click", () => {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
});

resetBtn.addEventListener("click", () => {
  resetTimer();
});

// Initialize
updateDial();
