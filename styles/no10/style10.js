// styles/no10/style10.js
// Grandfather clock style

function resolveUrl10(path) {
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    typeof chrome.runtime.getURL === "function"
  ) {
    return chrome.runtime.getURL(path);
  }
  return path;
}

let cssLoaded10 = false;
function ensureCssLoaded10() {
  if (cssLoaded10) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveUrl10("styles/no10/style10.css");
  document.head.appendChild(link);
  cssLoaded10 = true;
}

export const styleDefinition = {
  id: "no10",
  label: "No. 10",
  showLabelInsideDial: true,

  create(clockRoot) {
    ensureCssLoaded10();

    const root = document.createElement("div");
    root.className = "style-no10-root";

    const crown = document.createElement("div");
    crown.className = "style-no10-crown";

    const slot = document.createElement("div");
    slot.className = "style-no10-slot";

    const face = document.createElement("div");
    face.className = "style-no10-face";

    for (let i = 0; i < 5; i++) {
      const tick = document.createElement("div");
      tick.className = "style-no10-tick";
      const angle = i * 72;
      tick.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg) translateY(-48px)`;
      face.appendChild(tick);
    }

    const minuteHand = document.createElement("div");
    minuteHand.className = "style-no10-minute-hand";

    const secondHand = document.createElement("div");
    secondHand.className = "style-no10-second-hand";

    const centerCap = document.createElement("div");
    centerCap.className = "style-no10-center";

    face.appendChild(minuteHand);
    face.appendChild(secondHand);
    face.appendChild(centerCap);

    const pendulum = document.createElement("div");
    pendulum.className = "style-no10-pendulum";

    const rod = document.createElement("div");
    rod.className = "style-no10-rod";

    const bob = document.createElement("div");
    bob.className = "style-no10-bob";

    pendulum.appendChild(rod);
    pendulum.appendChild(bob);

    root.appendChild(crown);
    root.appendChild(slot);
    root.appendChild(face);
    root.appendChild(pendulum);
    clockRoot.appendChild(root);

    this._root = root;
    this._minuteHand = minuteHand;
    this._secondHand = secondHand;
    this._pendulum = pendulum;
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
    if (isActive) {
      this._root.classList.add("is-active");
    } else {
      this._root.classList.remove("is-active");
    }
  },

  update(drawState) {
    if (!this._root) return;
    const { minuteAngle, secondAngle } = drawState;

    this._minuteHand.style.transform =
      `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
    this._secondHand.style.transform =
      `translate(-50%, -100%) rotate(${secondAngle}deg)`;
  },
};
