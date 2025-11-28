// Pomodoro length in seconds (25 minutes)
const POMODORO_DURATION = 25 * 60;

// These MUST match your CSS:
// - clock-dial size: 260px => radius 130
// - minute-hand height: 90px
const DIAL_RADIUS = 130;
const MINUTE_LENGTH = 70;

let remainingSeconds = POMODORO_DURATION;
let isRunning = false;
let timerId = null;

const minuteHandEl = document.getElementById("minute-hand");
const secondPivotEl = document.getElementById("second-pivot");
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
  // Minute hand: full circle over the whole Pomodoro (same as No. 1)
  const progress = 1 - remainingSeconds / POMODORO_DURATION; // 0 → 1
  const minuteAngle = progress * 360;

  // 1) Rotate the minute hand (unchanged)
  minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

  // 2) Move the pivot to the tip of the minute hand
  // Start at center (50%, 50%), then:
  //   - translate(-50%, -50%) to truly center the pivot
  //   - rotate by minuteAngle
  //   - translate(0, -MINUTE_LENGTH) to move outwards along the hand
  secondPivotEl.style.transform =
    `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_LENGTH}px)`;

  // 3) Rotate the second hand around that moving pivot
  // Use elapsed seconds so the second hand moves CLOCKWISE
  const secondsElapsed = POMODORO_DURATION - remainingSeconds;
  const secondsWithinMinute = secondsElapsed % 60;
  const secondAngle = (secondsWithinMinute / 60) * 360;

  secondHandEl.style.transform = `rotate(${secondAngle}deg)`;

  // 4) Digital label
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
      // Optional: sound or visual notification
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
