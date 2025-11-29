// styles/no4/style4.js

function ensureCssLoaded() {
  if (document.getElementById("style-no4-css")) return;
  const link = document.createElement("link");
  link.id = "style-no4-css";
  link.rel = "stylesheet";
  link.href = "styles/no4/style4.css";
  document.head.appendChild(link);
}

// which segments are lit for each digit
const DIGIT_SEGMENTS = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "g", "e", "d"],
  "3": ["a", "b", "g", "c", "d"],
  "4": ["f", "g", "b", "c"],
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
};

function createDigitElement(extraClass) {
  const digit = document.createElement("div");
  digit.className = `style-no4-digit ${extraClass || ""}`;

  const segments = {};
  ["a", "b", "c", "d", "e", "f", "g"].forEach((name) => {
    const seg = document.createElement("div");
    seg.className = `seg seg-${name}`;
    digit.appendChild(seg);
    segments[name] = seg;
  });

  return { digit, segments };
}

export const styleDefinition = {
  id: "no4",
  label: "No. 4",

  create(clockRoot) {
    ensureCssLoaded();

    const root = document.createElement("div");
    root.className = "style-no4-root";

    const row = document.createElement("div");
    row.className = "style-no4-digits-row";

    // 4 digits
    const dM1 = createDigitElement("m1");
    const dM2 = createDigitElement("m2");
    const dS1 = createDigitElement("s1");
    const dS2 = createDigitElement("s2");

    // colon
    const colon = document.createElement("div");
    colon.className = "style-no4-colon";
    const colonTop = document.createElement("div");
    colonTop.className = "style-no4-colon-dot top";
    const colonBottom = document.createElement("div");
    colonBottom.className = "style-no4-colon-dot bottom";
    colon.appendChild(colonTop);
    colon.appendChild(colonBottom);

    row.appendChild(dM1.digit);
    row.appendChild(dM2.digit);
    row.appendChild(colon);
    row.appendChild(dS1.digit);
    row.appendChild(dS2.digit);

    root.appendChild(row);
    clockRoot.appendChild(root);

    this._root = root;
    this._digits = {
      m1: dM1.segments,
      m2: dM2.segments,
      s1: dS1.segments,
      s2: dS2.segments,
    };
    this._colonTop = colonTop;
    this._colonBottom = colonBottom;
  },

  setActive(active) {
    if (this._root) this._root.style.display = active ? "flex" : "none";
  },

  _applyDigit(segmentsMap, valueChar) {
    const pattern = DIGIT_SEGMENTS[valueChar] || [];
    const set = new Set(pattern);
    Object.entries(segmentsMap).forEach(([name, el]) => {
      if (set.has(name)) el.classList.add("on");
      else el.classList.remove("on");
    });
  },

  update(drawState) {
    if (!this._root) return;

    const { labelText, function: fn } = drawState;
    const parts = labelText.split(":");
    const mm = parts[parts.length - 2] || "00";
    const ss = parts[parts.length - 1] || "00";

    this._applyDigit(this._digits.m1, mm[0]);
    this._applyDigit(this._digits.m2, mm[1]);
    this._applyDigit(this._digits.s1, ss[0]);
    this._applyDigit(this._digits.s2, ss[1]);

    // blink colon only in timer / pomodoro; steady in clock
    const nowOn =
      fn === "clock"
        ? true
        : (Date.now() / 1000) % 1 < 0.5; // simple blink

    [this._colonTop, this._colonBottom].forEach((dot) => {
      if (nowOn) dot.classList.add("on");
      else dot.classList.remove("on");
    });
  },
};
