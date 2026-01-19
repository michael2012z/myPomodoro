// styles/no9/style9.js
// Pendulum clock style

function resolveUrl9(path) {
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    typeof chrome.runtime.getURL === "function"
  ) {
    return chrome.runtime.getURL(path);
  }
  return path;
}

let cssLoaded9 = false;
function ensureCssLoaded9() {
  if (cssLoaded9) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveUrl9("styles/no9/style9.css");
  document.head.appendChild(link);
  cssLoaded9 = true;
}

export const styleDefinition = {
  id: "no9",
  label: "",
  showLabelInsideDial: true,

  create(clockRoot) {
    ensureCssLoaded9();

    const root = document.createElement("div");
    root.className = "style-no9-root";

    const face = document.createElement("div");
    face.className = "style-no9-face";

    for (let i = 0; i < 12; i++) {
      const tick = document.createElement("div");
      tick.className = "tick";
      const angle = i * 30;
      tick.style.transform = `translateX(-50%) rotate(${angle}deg)`;
      face.appendChild(tick);
    }

    const minuteHand = document.createElement("div");
    minuteHand.className = "style-no9-minute-hand";

    const centerCap = document.createElement("div");
    centerCap.className = "style-no9-center";

    face.appendChild(minuteHand);
    face.appendChild(centerCap);

    const pendulum = document.createElement("div");
    pendulum.className = "style-no9-pendulum";

    const rod = document.createElement("div");
    rod.className = "style-no9-rod";

    const bob = document.createElement("div");
    bob.className = "style-no9-bob";

    pendulum.appendChild(rod);
    pendulum.appendChild(bob);

    root.appendChild(face);
    root.appendChild(pendulum);
    clockRoot.appendChild(root);

    this._root = root;
    this._minuteHand = minuteHand;
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
    const { minuteAngle } = drawState;

    this._minuteHand.style.transform =
      `translateX(-50%) rotate(${minuteAngle}deg)`;
  },
};
