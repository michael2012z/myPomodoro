// timeEngine.js
export function createTimeEngine(config) {
  const POMO = config.pomodoroDurationSec;

  let pomodoroRemaining = POMO;
  let timerSeconds = 0;
  let currentFunction = "pomodoro"; // "pomodoro" | "timer" | "clock"

  function setFunction(fn) {
    currentFunction = fn;
  }

  function getFunction() {
    return currentFunction;
  }

  function resetCurrent() {
    if (currentFunction === "pomodoro") {
      pomodoroRemaining = POMO;
    } else if (currentFunction === "timer") {
      timerSeconds = 0;
    }
    // clock: nothing to reset
  }

  function resetAll() {
    pomodoroRemaining = POMO;
    timerSeconds = 0;
  }

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

  // One logical tick (called by main every updateIntervalMs)
  function step() {
    let done = false;

    if (currentFunction === "pomodoro") {
      if (pomodoroRemaining > 0) {
        pomodoroRemaining -= 1;
        if (pomodoroRemaining < 0) pomodoroRemaining = 0;
        if (pomodoroRemaining === 0) done = true;
      } else {
        done = true;
      }
    } else if (currentFunction === "timer") {
      timerSeconds += 1;
    } else {
      // clock: no internal state
    }

    return done;
  }

  // Compute angles / label based on current function & state
  function getDrawState() {
    if (currentFunction === "pomodoro") {
      const elapsed = POMO - pomodoroRemaining;
      const progress =
        pomodoroRemaining <= 0 ? 1 : 1 - pomodoroRemaining / POMO;

      const minuteAngle = progress * 360;
      const secondsWithinMinute = elapsed % 60;
      const secondAngle = (secondsWithinMinute / 60) * 360;

      return {
        function: currentFunction,
        minuteAngle,
        secondAngle,
        labelText: formatMMSS(pomodoroRemaining),
      };
    }

    if (currentFunction === "timer") {
      const elapsed = timerSeconds;
      const progress = (elapsed % POMO) / POMO;
      const minuteAngle = progress * 360;

      const secondsWithinMinute = elapsed % 60;
      const secondAngle = (secondsWithinMinute / 60) * 360;

      return {
        function: currentFunction,
        minuteAngle,
        secondAngle,
        labelText: formatMMSS(timerSeconds),
      };
    }

    // clock mode
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
    const secondAngle = (seconds / 60) * 360;

    return {
      function: currentFunction,
      minuteAngle,
      secondAngle,
      labelText: formatClockLabel(now),
    };
  }

  return {
    setFunction,
    getFunction,
    resetCurrent,
    resetAll,
    step,
    getDrawState,
  };
}
