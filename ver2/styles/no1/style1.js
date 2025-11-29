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
  label: "No. 1",

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
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
  },

  update(drawState) {
    if (!this._root) return;
    const { minuteAngle, secondAngle } = drawState;

    this._minuteHand.style.transform =
      `translateX(-50%) rotate(${minuteAngle}deg)`;
    this._secondHand.style.transform =
      `translateX(-50%) rotate(${secondAngle}deg)`;
  },
};
