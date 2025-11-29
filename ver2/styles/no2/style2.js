// styles/no2/style2.js

const MINUTE_LENGTH = 70; // must match height in CSS

function ensureCssLoaded() {
  if (document.getElementById("style-no2-css")) return;
  const link = document.createElement("link");
  link.id = "style-no2-css";
  link.rel = "stylesheet";
  link.href = "./styles/no2/style2.css";
  document.head.appendChild(link);
}

export const styleDefinition = {
  id: "no2",
  label: "No. 2",
  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no2-root";

    // ticks
    for (let i = 0; i < 12; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      const angle = i * 30;
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      root.appendChild(tick);
    }

    const minuteHand = document.createElement("div");
    minuteHand.className = "minute-hand";

    const pivot = document.createElement("div");
    pivot.className = "second-pivot";

    const secondHand = document.createElement("div");
    secondHand.className = "second-hand";

    pivot.appendChild(secondHand);
    root.appendChild(minuteHand);
    root.appendChild(pivot);

    clockRoot.appendChild(root);

    this._root = root;
    this._minuteHand = minuteHand;
    this._pivot = pivot;
    this._secondHand = secondHand;
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
  },

  update(drawState) {
    if (!this._root) return;
    const { minuteAngle, secondAngle } = drawState;

    // minute hand
    this._minuteHand.style.transform =
      `translateX(-50%) rotate(${minuteAngle}deg)`;

    // pivot at tip of minute hand
    this._pivot.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg) translate(0, -${MINUTE_LENGTH}px)`;

    // second hand around pivot
    this._secondHand.style.transform = `rotate(${secondAngle}deg)`;
  },
};
