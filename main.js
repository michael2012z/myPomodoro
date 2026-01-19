// main.js
import { CONFIG } from "./config.js";
import { createTimeEngine } from "./timeEngine.js";

const timeEngine = createTimeEngine(CONFIG);
const uiRoot = document.getElementById("ui-root");
let baseUiSize = null; // measured once for scaling

// Styles are objects from CONFIG.styles[]
// Each styleDefinition MUST implement:
// {
//   id: "no1",
//   label: "No. 1",
//   create(clockRoot): void,
//   setActive(isActive): void,
//   update(drawState): void,
//   (optional) showLabelInsideDial: boolean
// }
const styles = CONFIG.styles;

let currentStyleIndex = 0; // index into styles[]
const FUNCTIONS = ["pomodoro", "timer", "clock"];
let currentFunctionIndex = 0; // index into FUNCTIONS

// State for pomodoro/timer
let isRunning = false;       // interval is actively stepping
let isPaused = false;        // paused but not reset
let intervalId = null;       // pomodoro/timer loop

// State for clock auto-update
let clockIntervalId = null;

// DOM
const titleEl = document.getElementById("title");
const timeLabelEl = document.getElementById("time-label");
const clockRoot = document.getElementById("clock-root");

const modeUpBtn = document.getElementById("mode-up");
const modeDownBtn = document.getElementById("mode-down");
const prevStyleBtn = document.getElementById("prev-style");
const nextStyleBtn = document.getElementById("next-style");
const startPauseBtn = document.getElementById("start-pause-btn");
const resetBtn = document.getElementById("reset-btn");

// overlay label element (created after styles so it is on TOP)
let analogLabelEl = null;

analogLabelEl = document.createElement("div");
analogLabelEl.className = "analog-label-overlay";
clockRoot.appendChild(analogLabelEl);

// NEW: warning dot for pomodoro
const pomodoroDotEl = document.createElement("div");
pomodoroDotEl.className = "pomodoro-warning-dot";
clockRoot.appendChild(pomodoroDotEl);

function updateRunningClass() {
  const fn = getCurrentFunction();
  const shouldSwing = fn === "clock" || isRunning;
  clockRoot.classList.toggle("is-running", shouldSwing);
}

// --- STYLE MANAGEMENT ---

// Let each style create its own dial into clockRoot
styles.forEach((styleDef) => {
  styleDef.create(clockRoot);
});

// NOW create the overlay so it is above the dials
analogLabelEl = document.createElement("div");
analogLabelEl.className = "analog-label-overlay";
clockRoot.appendChild(analogLabelEl);

// activate a single style at a time
function activateStyle(index) {
  styles.forEach((s, i) => {
    const isActive = i === index;

    // normal path: style implements setActive
    if (typeof s.setActive === "function") {
      try {
        s.setActive(isActive);
        return;
      } catch (e) {
        console.error("Error in setActive for style", s.id, e);
      }
    }

    // fallback: if style has a root element, hide/show directly
    if (s._root && s._root.style) {
      s._root.style.display = isActive ? "block" : "none";
    }
  });
}


function getCurrentStyle() {
  return styles[currentStyleIndex];
}

// --- FUNCTION / TITLE ---

function getCurrentFunction() {
  return FUNCTIONS[currentFunctionIndex];
}

function updateTitle() {
  const func = getCurrentFunction();
  const style = getCurrentStyle();

  let prefix;
  if (func === "pomodoro") prefix = "Pomodoro";
  else if (func === "timer") prefix = "Timer";
  else prefix = "Clock";

  titleEl.textContent = `${prefix} ${style.label}`;
}

// --- DRAW ---

function render() {
  const drawState = timeEngine.getDrawState();
  const style = getCurrentStyle();

  // style-specific drawing
  style.update(drawState);
  updateRunningClass();

  const labelText = drawState.labelText;

  // For analog styles (no1/2/3): show label inside dial.
  // For digital styles (no4/5/6): remove label completely.
  if (style.showLabelInsideDial) {
    if (analogLabelEl) {
      analogLabelEl.style.display = "block";
      analogLabelEl.textContent = labelText;
    }
    timeLabelEl.style.display = "none";
  } else {
    if (analogLabelEl) {
      analogLabelEl.style.display = "none";
    }
    timeLabelEl.style.display = "none";
  }

  // --- Pomodoro warning dot (all styles) ---
  const fn = drawState.function;

  if (fn === "pomodoro") {
    // parse remaining time from labelText (MM:SS)
    let remainingSec = null;
    const parts = labelText.split(":");
    if (parts.length === 2) {
      const mm = parseInt(parts[0], 10);
      const ss = parseInt(parts[1], 10);
      if (!Number.isNaN(mm) && !Number.isNaN(ss)) {
        remainingSec = mm * 60 + ss;
      }
    }

    if (
      remainingSec !== null &&
      remainingSec > 0 &&            // hide after timeout
      remainingSec <= 3 * 60         // last 3 minutes
    ) {
      // show & flash
      pomodoroDotEl.style.display = "block";
      pomodoroDotEl.classList.add("flash");

      if (remainingSec <= 60) {
        // last 1 minute → red
        pomodoroDotEl.style.backgroundColor = "#ef4444";
        pomodoroDotEl.style.boxShadow =
          "0 0 10px rgba(239, 68, 68, 0.9)";
      } else {
        // between 3 and 1 minutes → yellow
        pomodoroDotEl.style.backgroundColor = "#facc15";
        pomodoroDotEl.style.boxShadow =
          "0 0 10px rgba(250, 204, 21, 0.9)";
      }
    } else {
      // not in last 3 minutes or already 0 → hide
      pomodoroDotEl.style.display = "none";
      pomodoroDotEl.classList.remove("flash");
    }
  } else {
    // not pomodoro → hide
    pomodoroDotEl.style.display = "none";
    pomodoroDotEl.classList.remove("flash");
  }

}

// --- POMODORO/TIMER LOOP HELPERS ---

function clearPomodoroTimerLoop() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startPomodoroTimerInterval() {
  const fn = getCurrentFunction();
  if (fn === "clock") return;

  clearPomodoroTimerLoop();

  intervalId = setInterval(() => {
    const currentFn = getCurrentFunction();
    if (currentFn === "clock") {
      // safety: if user switched while interval still around
      clearPomodoroTimerLoop();
      return;
    }

    const done = timeEngine.step();
    render();

    // When pomodoro finishes, auto-stop and reset button to "Start"
    if (done && currentFn === "pomodoro") {
      clearPomodoroTimerLoop();
      isRunning = false;
      isPaused = false;
      startPauseBtn.textContent = "Start";
    }
  }, CONFIG.updateIntervalMs);
}

// Pause without resetting time
function pausePomodoroTimer() {
  if (!isRunning) return;
  clearPomodoroTimerLoop();
  isRunning = false;
  isPaused = true;
  startPauseBtn.textContent = "Resume";
  updateRunningClass();
}

// Fully stop & reset running state (used on mode change / reset)
function stopPomodoroTimerCompletely() {
  clearPomodoroTimerLoop();
  isRunning = false;
  isPaused = false;
  startPauseBtn.textContent = "Start";
  updateRunningClass();
}

// --- CLOCK LOOP HELPERS ---

function stopClockLoop() {
  if (clockIntervalId !== null) {
    clearInterval(clockIntervalId);
    clockIntervalId = null;
  }
}

function startClockLoop() {
  if (clockIntervalId !== null) return;
  clockIntervalId = setInterval(() => {
    render(); // clock drawState uses current time
  }, CONFIG.updateIntervalMs);
}

// --- RESET CURRENT MODE STATE ---

function resetCurrent() {
  // For pomodoro/timer, this should reset to initial value
  stopPomodoroTimerCompletely();
  timeEngine.resetCurrent();
  render();
}

// --- APPLY FUNCTION CHANGE (Pomodoro / Timer / Clock) ---

function applyFunctionChange() {
  const fn = getCurrentFunction();

  // Stop both kinds of loops whenever we change mode
  stopPomodoroTimerCompletely();
  stopClockLoop();

  // Tell engine which function we're in
  timeEngine.setFunction(fn);

  updateTitle();

  if (fn === "clock") {
    // Clock mode: auto-update, controls disabled
    startPauseBtn.disabled = true;
    resetBtn.disabled = true;
    startClockLoop();
    render(); // draw immediately
  } else {
    // Pomodoro / Timer: manual start, controls enabled
    startPauseBtn.disabled = false;
    resetBtn.disabled = false;
    render(); // show initial/static state
  }
  updateRunningClass();
}

// --- EVENT HANDLERS ---

// Start / Pause / Resume (Pomodoro/Timer)
startPauseBtn.addEventListener("click", () => {
  const fn = getCurrentFunction();
  if (fn === "clock") {
    // Button is disabled in clock mode, but guard just in case
    return;
  }

  // Case 1: fresh start (not running, not paused)
  if (!isRunning && !isPaused) {
    isRunning = true;
    isPaused = false;
    startPauseBtn.textContent = "Pause";
    // Ensure engine is in correct function mode
    timeEngine.setFunction(fn);
    startPomodoroTimerInterval();
    updateRunningClass();
    return;
  }

  // Case 2: currently running → pause
  if (isRunning) {
    pausePomodoroTimer();
    return;
  }

  // Case 3: paused → resume
  if (!isRunning && isPaused) {
    isRunning = true;
    isPaused = false;
    startPauseBtn.textContent = "Pause";
    startPomodoroTimerInterval();
    updateRunningClass();
    return;
  }
});

// Reset (Pomodoro/Timer only)
resetBtn.addEventListener("click", () => {
  const fn = getCurrentFunction();
  if (fn === "clock") {
    // disabled in clock mode
    return;
  }
  resetCurrent();
});

// Styles
prevStyleBtn.addEventListener("click", () => {
  currentStyleIndex =
    (currentStyleIndex - 1 + styles.length) % styles.length;
  activateStyle(currentStyleIndex);
  updateTitle();
  render();
});

nextStyleBtn.addEventListener("click", () => {
  currentStyleIndex = (currentStyleIndex + 1) % styles.length;
  activateStyle(currentStyleIndex);
  updateTitle();
  render();
});

// up/down: cycle functions
function changeFunction(delta) {
  currentFunctionIndex =
    (currentFunctionIndex + delta + FUNCTIONS.length) % FUNCTIONS.length;
  applyFunctionChange();
}

modeUpBtn.addEventListener("click", () => changeFunction(1));
modeDownBtn.addEventListener("click", () => changeFunction(-1));

// --- SCALING ---

function updateScale() {
  if (!uiRoot) return;

  // Target size: 60% of the smaller viewport side
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const targetSize = Math.min(vw, vh) * 0.6;

  // Measure the "natural" size of the UI once (Version 2 layout)
  if (baseUiSize === null) {
    const rect = uiRoot.getBoundingClientRect();
    baseUiSize = Math.min(rect.width, rect.height) || 1;
  }

  const scale = targetSize / baseUiSize;
  uiRoot.style.transform = `scale(${scale})`;
}

// --- INITIALIZE ---

activateStyle(currentStyleIndex);
applyFunctionChange(); // sets mode, title, loops, and first render

updateScale();
window.addEventListener("resize", updateScale);
