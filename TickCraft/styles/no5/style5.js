// styles/no5/style5.js

function ensureCssLoaded() {
  if (document.getElementById("style-no5-css")) return;
  const link = document.createElement("link");
  link.id = "style-no5-css";
  link.rel = "stylesheet";
  link.href = "styles/no5/style5.css";
  document.head.appendChild(link);
}

export const styleDefinition = {
  id: "no5",
  label: "",

  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no5-root";

    const group = document.createElement("div");
    group.className = "style-no5-flip-group";

    group.innerHTML = `
      <div class="style-no5-card m1">0</div>
      <div class="style-no5-card m2">0</div>
      <div class="style-no5-colon">:</div>
      <div class="style-no5-card s1">0</div>
      <div class="style-no5-card s2">0</div>
    `;

    root.appendChild(group);
    clockRoot.appendChild(root);

    this._root = root;
    this._group = group;
    this._m1 = group.querySelector(".m1");
    this._m2 = group.querySelector(".m2");
    this._s1 = group.querySelector(".s1");
    this._s2 = group.querySelector(".s2");
  },

  setActive(active) {
    if (this._root) this._root.style.display = active ? "flex" : "none";
  },

  _setDigit(oldEl, newVal) {
    if (oldEl.textContent !== newVal) {
      oldEl.classList.add("flip");
      setTimeout(() => {
        oldEl.textContent = newVal;
        oldEl.classList.remove("flip");
      }, 150);
    }
  },

  update(drawState) {
    const { labelText } = drawState;
    const parts = labelText.split(":");
    const mm = parts[parts.length - 2];
    const ss = parts[parts.length - 1];

    this._setDigit(this._m1, mm[0]);
    this._setDigit(this._m2, mm[1]);
    this._setDigit(this._s1, ss[0]);
    this._setDigit(this._s2, ss[1]);
  },
};
