// styles/no6/style6.js

function ensureCssLoaded() {
  if (document.getElementById("style-no6-css")) return;
  const link = document.createElement("link");
  link.id = "style-no6-css";
  link.rel = "stylesheet";
  link.href = "styles/no6/style6.css";
  document.head.appendChild(link);
}

export const styleDefinition = {
  id: "no6",
  label: "No. 6",

  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no6-root";

    const digits = document.createElement("div");
    digits.className = "style-no6-digits";

    digits.innerHTML = `
        <span class="m1">0</span>
        <span class="m2">0</span>
        <span class="style-no6-colon">:</span>
        <span class="s1">0</span>
        <span class="s2">0</span>
    `;

    root.appendChild(digits);
    clockRoot.appendChild(root);

    this._root = root;
    this._digits = digits;
    this._m1 = digits.querySelector(".m1");
    this._m2 = digits.querySelector(".m2");
    this._s1 = digits.querySelector(".s1");
    this._s2 = digits.querySelector(".s2");
    this._colon = digits.querySelector(".style-no6-colon");
    this._prevLabel = null;
  },


  setActive(active) {
    if (this._root) this._root.style.display = active ? "flex" : "none";
  },

  update(drawState) {
    const { labelText } = drawState;
    const parts = labelText.split(":");
    const mm = parts[parts.length - 2] || "00";
    const ss = parts[parts.length - 1] || "00";

    const compact = `${mm}:${ss}`;

    // update digits
    this._m1.textContent = mm[0];
    this._m2.textContent = mm[1];
    this._s1.textContent = ss[0];
    this._s2.textContent = ss[1];

    // if the displayed time changed, flash the colon once
    if (this._prevLabel !== null && this._prevLabel !== compact && this._colon) {
        // restart the animation by toggling the class
        this._colon.classList.remove("flash");
        // force reflow so animation can restart
        void this._colon.offsetWidth;
        this._colon.classList.add("flash");
    }

    this._prevLabel = compact;
  },

};
