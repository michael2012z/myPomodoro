// Pomodoro length in seconds (25 minutes)
const POMODORO_DURATION = 25 * 60;

// Geometry (must match CSS)
const DIAL_RADIUS = 130;     // 260 / 2
const MINUTE_RADIUS = DIAL_RADIUS / 2;   // 65
const SECOND_RADIUS = MINUTE_RADIUS / 2; // 32.5

let remainingSeconds = POMODORO_DURATION;
let isRunning = false;
let timerId = null;

const minuteCircleEl = document.getElementById("minute-circle");
const secondCircleEl = document.getElementById("second-circle");
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

function updateDial() {
  // Minute circle angle: full 0–360 over one Pomodoro
  const progress = 1 - remainingSeconds / POMODORO_DURATION; // 0 → 1
  const minuteAngle = progress * 360;

  // Place minute circle:
  // Start at dial center (50%, 50%), then:
  // - translate(-50%, -50%) to align center
  // - rotate by minuteAngle
  // - translate(0, -MINUTE_RADIUS) to set its center at distance MINUTE_RADIUS
  minuteCircleEl.style.transform =
    `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_RADIUS}px)`;

  // Second circle: moves along the minute circle
  // Use elapsed seconds so it moves CLOCKWISE
  const secondsElapsed = POMODORO_DURATION - remainingSeconds;
  const secondsWithinMinute = secondsElapsed % 60;
  const secondAngle = (secondsWithinMinute / 60) * 360;

  // Place second circle INSIDE the minute circle:
  // Start at minute-circle center (its own 50%,50%),
  // then rotate by secondAngle and translate outward by SECOND_RADIUS.
  secondCircleEl.style.transform =
    `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${SECOND_RADIUS}px)`;

  // Digital label
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
      // Optional: sound/notification here
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
