// styles/no8/style8.js
// Sun–Earth–Moon orbit style (analog)

function resolveUrl8(path) {
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    typeof chrome.runtime.getURL === "function"
  ) {
    return chrome.runtime.getURL(path);
  }
  return path; // for file:// testing
}

let cssLoaded8 = false;
function ensureCssLoaded8() {
  if (cssLoaded8) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveUrl8("styles/no8/style8.css");
  document.head.appendChild(link);
  cssLoaded8 = true;
}

export const styleDefinition = {
  id: "no8",
  label: "No. 8",
  showLabelInsideDial: true,

  create(clockRoot) {
    ensureCssLoaded8();

    const root = document.createElement("div");
    root.className = "style-no8-root";

    const face = document.createElement("div");
    face.className = "style-no8-face";
    root.appendChild(face);

    // outer orbit path
    const orbit = document.createElement("div");
    orbit.className = "style-no8-orbit";
    face.appendChild(orbit);

    // earth orbit container (rotates with minute angle)
    const earthOrbit = document.createElement("div");
    earthOrbit.className = "style-no8-earth-orbit";
    face.appendChild(earthOrbit);

    // earth
    const earth = document.createElement("div");
    earth.className = "style-no8-earth";
    earthOrbit.appendChild(earth);

    // moon orbit (rotates with second angle, around earth)
    const moonOrbit = document.createElement("div");
    moonOrbit.className = "style-no8-moon-orbit";
    earth.appendChild(moonOrbit);

    // moon
    const moon = document.createElement("div");
    moon.className = "style-no8-moon";
    moonOrbit.appendChild(moon);

    // sun in center
    const sun = document.createElement("div");
    sun.className = "style-no8-sun";
    face.appendChild(sun);

    clockRoot.appendChild(root);

    this._root = root;
    this._earthOrbit = earthOrbit;
    this._moonOrbit = moonOrbit;
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
  },

  update(drawState) {
    if (!this._root) return;
    const { minuteAngle, secondAngle } = drawState;

    // rotate the earth around the sun (minute hand)
    this._earthOrbit.style.transform =
      `translate(-50%, -50%) rotate(${minuteAngle}deg)`;

    // rotate the moon around the earth (second hand)
    this._moonOrbit.style.transform =
      `translate(-50%, -50%) rotate(${secondAngle}deg)`;
  },
};
