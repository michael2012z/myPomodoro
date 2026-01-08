// styles/no1/style1.js

function ensureCssLoaded() {
  if (document.getElementById("style-no1-css")) return;
  const link = document.createElement("link");
  link.id = "style-no1-css";
  link.rel = "stylesheet";
  link.href = "styles/no1/style1.css";   // note: no leading "./"
  document.head.appendChild(link);
}

export const styleDefinition = {
  id: "no1",
  label: "",
  showLabelInsideDial: true,

  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no1-root";

    // 12 ticks
    for (let i = 0; i < 12; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      const angle = i * 30;
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      root.appendChild(tick);
    }

    const minuteHand = document.createElement("div");
    minuteHand.className = "hand minute-hand";

    const secondHand = document.createElement("div");
    secondHand.className = "hand second-hand";

    root.appendChild(minuteHand);
    root.appendChild(secondHand);

    clockRoot.appendChild(root);

    // save references for update()
    this._root = root;
    this._minuteHand = minuteHand;
    this._secondHand = secondHand;
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

    this._minuteHand.style.transform =
        `translateX(-50%) rotate(${minuteAngle}deg)`;
    this._secondHand.style.transform =
        `translateX(-50%) rotate(${secondAngle}deg)`;
  },
};
