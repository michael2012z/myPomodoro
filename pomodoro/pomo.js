// Pomodoro length in seconds (25 minutes)
const POMODORO_DURATION = 25 * 60;

// Geometry for No. 3
const DIAL_RADIUS = 130;               // 260 / 2
const MINUTE_RADIUS = DIAL_RADIUS / 2; // 65
const SECOND_RADIUS = MINUTE_RADIUS / 2; // 32.5

// For No. 2 minute-hand length
const MINUTE_LENGTH_MODE1 = 90;
const MINUTE_LENGTH_MODE2 = 70;

let remainingSeconds = POMODORO_DURATION;
let isRunning = false;
let timerId = null;

// 1, 2, or 3
let currentMode = 1;

// DOM
const titleEl = document.getElementById("title");
const minuteHandEl = document.getElementById("minute-hand");
const secondHandCentralEl = document.getElementById("second-hand-central");
const secondPivotEl = document.getElementById("second-pivot");
const secondHandOrbitEl = document.getElementById("second-hand-orbit");
const minuteCircleEl = document.getElementById("minute-circle");
const secondCircleEl = document.getElementById("second-circle");

const timeLabelEl = document.getElementById("time-label");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");
const prevModeBtn = document.getElementById("prev-mode");
const nextModeBtn = document.getElementById("next-mode");

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

function setModeLabel() {
  titleEl.textContent = `Pomodoro No. ${currentMode}`;
}

function updateVisibility() {
  // Hide all variable elements by default
  minuteHandEl.classList.remove("hidden");
  secondHandCentralEl.classList.remove("hidden");
  secondPivotEl.classList.remove("hidden");
  minuteCircleEl.classList.remove("hidden");
  secondCircleEl.classList.remove("hidden");

  // reset minute hand length class
  minuteHandEl.classList.remove("minute-hand-long", "minute-hand-short");

  if (currentMode === 1) {
    // No. 1: classic minute + central second hand
    minuteHandEl.classList.add("minute-hand-long");

    secondPivotEl.classList.add("hidden");   // no moving pivot
    minuteCircleEl.classList.add("hidden");
    secondCircleEl.classList.add("hidden");
  } else if (currentMode === 2) {
    // No. 2: minute hand + moving-pivot second hand
    minuteHandEl.classList.add("minute-hand-short");

    secondHandCentralEl.classList.add("hidden"); // hide central second

    minuteCircleEl.classList.add("hidden");
    secondCircleEl.classList.add("hidden");
  } else if (currentMode === 3) {
    // No. 3: circles only
    minuteHandEl.classList.add("hidden");
    secondHandCentralEl.classList.add("hidden");
    secondPivotEl.classList.add("hidden");
    // minuteCircle + secondCircle visible
  }
}

function updateDial() {
  const progress = 1 - remainingSeconds / POMODORO_DURATION; // 0 → 1
  const minuteAngle = progress * 360;

  const secondsElapsed = POMODORO_DURATION - remainingSeconds;
  const secondsWithinMinute = secondsElapsed % 60;
  const secondAngle = (secondsWithinMinute / 60) * 360;

  if (currentMode === 1) {
    // No. 1: minute hand + central second hand
    minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    secondHandCentralEl.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
  } else if (currentMode === 2) {
    // No. 2: minute hand + moving-pivot second hand

    // minute hand (short)
    minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

    // second pivot at tip of minute hand
    const minuteLength = MINUTE_LENGTH_MODE2;
    secondPivotEl.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${minuteLength}px)`;

    // second hand orbiting around that pivot
    secondHandOrbitEl.style.transform = `rotate(${secondAngle}deg)`;
  } else if (currentMode === 3) {
    // No. 3: circles
    // Minute circle moves inside dial
    minuteCircleEl.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_RADIUS}px)`;

    // Second circle moves inside minute circle
    secondCircleEl.style.transform =
      `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${SECOND_RADIUS}px)`;
  }

  // Digital label (shared)
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
    }
  }, 1000); // normal speed: 1s per tick
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

prevModeBtn.addEventListener("click", () => {
  currentMode = currentMode === 1 ? 3 : currentMode - 1;
  setModeLabel();
  updateVisibility();
  updateDial();
});

nextModeBtn.addEventListener("click", () => {
  currentMode = currentMode === 3 ? 1 : currentMode + 1;
  setModeLabel();
  updateVisibility();
  updateDial();
});

// Initial state
setModeLabel();
updateVisibility();
updateDial();
