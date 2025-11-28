// Pomodoro length in seconds (25 minutes)
const POMODORO_DURATION = 25 * 60;

// Geometry for No. 3
const DIAL_RADIUS = 130;               // 260 / 2
const MINUTE_RADIUS = DIAL_RADIUS / 2; // 65
const SECOND_RADIUS = MINUTE_RADIUS / 2; // 32.5

// For No. 2 minute-hand length
const MINUTE_LENGTH_MODE1 = 90;
const MINUTE_LENGTH_MODE2 = 70;

// Time state
let pomodoroRemaining = POMODORO_DURATION; // for Pomodoro
let timerSeconds = 0;                      // for Timer

let isRunning = false;
let timerId = null;

// Style = 1, 2, or 3
let currentStyle = 1;

// Function = "pomodoro" | "timer" | "clock"
let currentFunction = "pomodoro";

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

const prevStyleBtn = document.getElementById("prev-style");
const nextStyleBtn = document.getElementById("next-style");

const modeUpBtn = document.getElementById("mode-up");
const modeDownBtn = document.getElementById("mode-down");

function formatMMSS(secs) {
  if (secs < 0) secs = 0;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

function formatClockLabel(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateTitle() {
  let labelPrefix;
  if (currentFunction === "pomodoro") {
    labelPrefix = "Pomodoro";
  } else if (currentFunction === "timer") {
    labelPrefix = "Timer";
  } else {
    labelPrefix = "Clock";
  }
  titleEl.textContent = `${labelPrefix} No. ${currentStyle}`;
}

function updateVisibility() {
  // Show everything by default, then hide per style
  minuteHandEl.classList.remove("hidden");
  secondHandCentralEl.classList.remove("hidden");
  secondPivotEl.classList.remove("hidden");
  minuteCircleEl.classList.remove("hidden");
  secondCircleEl.classList.remove("hidden");

  // reset minute hand length classes
  minuteHandEl.classList.remove("minute-hand-long", "minute-hand-short");

  if (currentStyle === 1) {
    // No. 1: classic minute + central second hand
    minuteHandEl.classList.add("minute-hand-long");
    secondPivotEl.classList.add("hidden");
    minuteCircleEl.classList.add("hidden");
    secondCircleEl.classList.add("hidden");
  } else if (currentStyle === 2) {
    // No. 2: minute hand + moving-pivot second hand
    minuteHandEl.classList.add("minute-hand-short");
    secondHandCentralEl.classList.add("hidden");
    minuteCircleEl.classList.add("hidden");
    secondCircleEl.classList.add("hidden");
  } else if (currentStyle === 3) {
    // No. 3: circles only
    minuteHandEl.classList.add("hidden");
    secondHandCentralEl.classList.add("hidden");
    secondPivotEl.classList.add("hidden");
  }
}

/**
 * Compute angles + label text depending on function.
 * Returns: { minuteAngle, secondAngle, labelText }
 */
function getDrawState() {
  if (currentFunction === "pomodoro") {
    const elapsed = POMODORO_DURATION - pomodoroRemaining;
    const progress =
      pomodoroRemaining <= 0
        ? 1
        : 1 - pomodoroRemaining / POMODORO_DURATION;

    const minuteAngle = progress * 360;
    const secondsWithinMinute = elapsed % 60;
    const secondAngle = (secondsWithinMinute / 60) * 360;

    return {
      minuteAngle,
      secondAngle,
      labelText: formatMMSS(pomodoroRemaining),
    };
  }

  if (currentFunction === "timer") {
    const elapsed = timerSeconds;
    const progress = (elapsed % POMODORO_DURATION) / POMODORO_DURATION;
    const minuteAngle = progress * 360;

    const secondsWithinMinute = elapsed % 60;
    const secondAngle = (secondsWithinMinute / 60) * 360;

    return {
      minuteAngle,
      secondAngle,
      labelText: formatMMSS(timerSeconds),
    };
  }

  // Clock mode
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // minute hand / circle: minutes + second fraction
  const minuteAngle =
    ((minutes + seconds / 60) / 60) * 360;
  const secondAngle = (seconds / 60) * 360;

  return {
    minuteAngle,
    secondAngle,
    labelText: formatClockLabel(now),
  };
}

function updateDial() {
  const { minuteAngle, secondAngle, labelText } = getDrawState();

  if (currentStyle === 1) {
    // No. 1: minute hand + central second hand
    minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    secondHandCentralEl.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
  } else if (currentStyle === 2) {
    // No. 2: minute hand + moving-pivot second hand
    minuteHandEl.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;

    const minuteLength = MINUTE_LENGTH_MODE2;
    secondPivotEl.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${minuteLength}px)`;

    secondHandOrbitEl.style.transform = `rotate(${secondAngle}deg)`;
  } else if (currentStyle === 3) {
    // No. 3: circles
    minuteCircleEl.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_RADIUS}px)`;

    secondCircleEl.style.transform =
      `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${SECOND_RADIUS}px)`;
  }

  // Time label
  timeLabelEl.textContent = labelText;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = "Pause";

  timerId = setInterval(() => {
    if (currentFunction === "pomodoro") {
      if (pomodoroRemaining > 0) {
        pomodoroRemaining -= 1;
        if (pomodoroRemaining < 0) pomodoroRemaining = 0;
        updateDial();
      } else {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        startPauseBtn.textContent = "Start";
      }
    } else if (currentFunction === "timer") {
      // Timer: count up indefinitely
      timerSeconds += 1;
      updateDial();
    } else if (currentFunction === "clock") {
      // Clock: just redraw current time each tick
      updateDial();
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

function resetCurrent() {
  if (currentFunction === "pomodoro") {
    pomodoroRemaining = POMODORO_DURATION;
  } else if (currentFunction === "timer") {
    timerSeconds = 0;
  } else if (currentFunction === "clock") {
    // Clock has no internal state; just redraw
  }
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
  pauseTimer();
  resetCurrent();
});

prevStyleBtn.addEventListener("click", () => {
  currentStyle = currentStyle === 1 ? 3 : currentStyle - 1;
  updateTitle();
  updateVisibility();
  updateDial();
});

nextStyleBtn.addEventListener("click", () => {
  currentStyle = currentStyle === 3 ? 1 : currentStyle + 1;
  updateTitle();
  updateVisibility();
  updateDial();
});

// Cycle functions: pomodoro → timer → clock → ...
const FUNCTIONS = ["pomodoro", "timer", "clock"];

function changeFunction(delta) {
  pauseTimer(); // stop running timer/clock but keep values
  const idx = FUNCTIONS.indexOf(currentFunction);
  const nextIdx = (idx + delta + FUNCTIONS.length) % FUNCTIONS.length;
  currentFunction = FUNCTIONS[nextIdx];
  updateTitle();
  updateDial();
}

modeUpBtn.addEventListener("click", () => {
  changeFunction(1);
});

modeDownBtn.addEventListener("click", () => {
  changeFunction(-1);
});

// Initial state
updateTitle();
updateVisibility();
updateDial();
