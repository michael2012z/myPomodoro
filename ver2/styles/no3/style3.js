// styles/no3/style3.js

const DIAL_RADIUS = 130; // 260 / 2
const MINUTE_RADIUS = DIAL_RADIUS / 2; // 65
const SECOND_RADIUS = MINUTE_RADIUS / 2; // 32.5

function ensureCssLoaded() {
  if (document.getElementById("style-no3-css")) return;
  const link = document.createElement("link");
  link.id = "style-no3-css";
  link.rel = "stylesheet";
  link.href = "./styles/no3/style3.css";
  document.head.appendChild(link);
}

export const styleDefinition = {
  id: "no3",
  label: "",
  showLabelInsideDial: true,

  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no3-root";

    for (let i = 0; i < 12; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      const angle = i * 30;
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      root.appendChild(tick);
    }

    const minuteCircle = document.createElement("div");
    minuteCircle.className = "minute-circle";

    const secondCircle = document.createElement("div");
    secondCircle.className = "second-circle";

    minuteCircle.appendChild(secondCircle);
    root.appendChild(minuteCircle);

    clockRoot.appendChild(root);

    this._root = root;
    this._minuteCircle = minuteCircle;
    this._secondCircle = secondCircle;
    this._currentTickCount = null;
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
  },

  update(drawState) {
    if (!this._root) return;
    const { minuteAngle, secondAngle, function: fn } = drawState;

    const desiredTicks = fn === "pomodoro" ? 5 : 12;

    if (this._currentTickCount !== desiredTicks) {
        this._currentTickCount = desiredTicks;

        // remove old ticks
        const oldTicks = this._root.querySelectorAll(".tick");
        oldTicks.forEach((t) => t.remove());

        // add new ticks
        const stepAngle = 360 / desiredTicks;
        for (let i = 0; i < desiredTicks; i++) {
        const tick = document.createElement("div");
        tick.className = "tick";
        const angle = i * stepAngle;
        tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        this._root.appendChild(tick);
        }
    }

    const DIAL_RADIUS = 130;
    const MINUTE_RADIUS = DIAL_RADIUS / 2;   // 65
    const SECOND_RADIUS = MINUTE_RADIUS / 2; // 32.5

    this._minuteCircle.style.transform =
        `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_RADIUS}px)`;

    this._secondCircle.style.transform =
        `translate(-50%, -50%) rotate(${secondAngle}deg) translate(0, -${SECOND_RADIUS}px)`;
  },
};
