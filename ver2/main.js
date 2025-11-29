// main.js
import { CONFIG } from "./config.js";
import { createTimeEngine } from "./timeEngine.js";

const timeEngine = createTimeEngine(CONFIG);

// Styles are objects from config.styles[]
// Each styleDefinition MUST implement:
// {
//   id: "no1",
//   label: "No. 1",
//   create(clockRoot): void,
//   setActive(isActive): void,
//   update(drawState): void
// }
const styles = CONFIG.styles;

let currentStyleIndex = 0; // index into styles[]
const FUNCTIONS = ["pomodoro", "timer", "clock"];
let currentFunctionIndex = 0; // index into FUNCTIONS

let isRunning = false;
let intervalId = null;

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

// --- STYLE MANAGEMENT ---

// Let each style create its own dial into clockRoot
styles.forEach((styleDef) => {
  styleDef.create(clockRoot);
});

// activate a single style at a time
function activateStyle(index) {
  styles.forEach((s, i) => s.setActive(i === index));
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

  // common label
  timeLabelEl.textContent = drawState.labelText;
}

// --- TIMER LOOP ---

function startLoop() {
  if (isRunning) return;
  isRunning = true;
  startPauseBtn.textContent = "Pause";

  const fn = getCurrentFunction();
  timeEngine.setFunction(fn);

  intervalId = setInterval(() => {
    if (timeEngine.getFunction() === "clock") {
      // no internal step; just redraw clock time
      render();
      return;
    }

    const done = timeEngine.step();
    render();

    if (done && timeEngine.getFunction() === "pomodoro") {
      // stop when pomodoro finishes
      stopLoop();
    }
  }, CONFIG.updateIntervalMs);
}

function stopLoop() {
  if (!isRunning) return;
  isRunning = false;
  startPauseBtn.textContent = "Start";
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function resetCurrent() {
  timeEngine.resetCurrent();
  render();
}

// --- EVENT HANDLERS ---

startPauseBtn.addEventListener("click", () => {
  if (isRunning) stopLoop();
  else startLoop();
});

resetBtn.addEventListener("click", () => {
  stopLoop();
  resetCurrent();
});

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
  stopLoop();
  currentFunctionIndex =
    (currentFunctionIndex + delta + FUNCTIONS.length) % FUNCTIONS.length;

  const fn = getCurrentFunction();
  timeEngine.setFunction(fn);
  updateTitle();
  render();
}

modeUpBtn.addEventListener("click", () => changeFunction(1));
modeDownBtn.addEventListener("click", () => changeFunction(-1));

// --- INITIALIZE ---

activateStyle(currentStyleIndex);
timeEngine.setFunction(getCurrentFunction());
updateTitle();
render();
