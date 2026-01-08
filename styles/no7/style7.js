// styles/no7/style7.js
// Pixel grid style (like 25:00 mock)

/**
 * Resolve URL both in extension context and plain file:// testing.
 */
function resolveUrl(path) {
  if (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    typeof chrome.runtime.getURL === "function"
  ) {
    return chrome.runtime.getURL(path);
  }
  // When opening index.html directly, use relative path
  return path;
}

let cssLoaded7 = false;
function ensureCssLoaded7() {
  if (cssLoaded7) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = resolveUrl("styles/no7/style7.css");
  document.head.appendChild(link);
  cssLoaded7 = true;
}

// Slim 4-pixel wide font (original was 5-pixel)
const RAW_FONT = {
  "0": [
    "####",
    "#..#",
    "#..#",
    "#..#",
    "#..#",
    "#..#",
    "####",
  ],
  "1": [
    ".##.",
    "..#.",
    "..#.",
    "..#.",
    "..#.",
    "..#.",
    ".###",
  ],
  "2": [
    "####",
    "...#",
    "...#",
    "####",
    "#...",
    "#...",
    "####",
  ],
  "3": [
    "####",
    "...#",
    "...#",
    "####",
    "...#",
    "...#",
    "####",
  ],
  "4": [
    "#..#",
    "#..#",
    "#..#",
    "####",
    "...#",
    "...#",
    "...#",
  ],
  "5": [
    "####",
    "#...",
    "#...",
    "####",
    "...#",
    "...#",
    "####",
  ],
  "6": [
    "####",
    "#...",
    "#...",
    "####",
    "#..#",
    "#..#",
    "####",
  ],
  "7": [
    "####",
    "...#",
    "...#",
    "..#.",
    ".#..",
    ".#..",
    ".#..",
  ],
  "8": [
    "####",
    "#..#",
    "#..#",
    "####",
    "#..#",
    "#..#",
    "####",
  ],
  "9": [
    "####",
    "#..#",
    "#..#",
    "####",
    "...#",
    "...#",
    "####",
  ],
  ":": [
    ".",
    "#",
    ".",
    ".",
    "#",
    ".",
    ".",
  ],
};


// Precompute glyphs
const GLYPHS = {};
Object.keys(RAW_FONT).forEach((ch) => {
  const rows = RAW_FONT[ch];
  const h = rows.length;
  const w = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const points = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] === "#") {
        points.push({ x, y });
      }
    }
  });
  GLYPHS[ch] = { w, h, points };
});

export const styleDefinition = {
  id: "no7",
  label: "",
  showLabelInsideDial: false, // digital style

  create(clockRoot) {
    ensureCssLoaded7();

    const root = document.createElement("div");
    root.className = "style-no7-root";

    const pixels = document.createElement("div");
    pixels.className = "style-no7-pixels";
    root.appendChild(pixels);

    clockRoot.appendChild(root);

    this._root = root;
    this._pixels = pixels;
    this._prevText = "";
  },

  setActive(isActive) {
    if (!this._root) return;
    this._root.style.display = isActive ? "block" : "none";
  },

  update(drawState) {
    if (!this._root) return;

    let text = drawState.labelText || "";

    // For things like "16:54:37", just take first 5 chars "16:54"
    if (text.length > 5) {
      text = text.slice(0, 5);
    }

    // Keep only digits and colon
    const cleanChars = [];
    for (const ch of text) {
      if (GLYPHS[ch]) cleanChars.push(ch);
    }
    const finalText = cleanChars.join("").padStart(5, " ");

    if (finalText === this._prevText) return;
    this._prevText = finalText;

    const glyphs = [];
    const charSpacing = 1;
    let totalCols = 0;
    let rows = 7;

    for (const ch of finalText) {
      const g = GLYPHS[ch];
      if (!g) {
        totalCols += charSpacing;
        continue;
      }
      glyphs.push({ glyph: g, offset: totalCols });
      totalCols += g.w + charSpacing;
      rows = Math.max(rows, g.h);
    }

    this._pixels.innerHTML = "";

    const CELL = 10;
    // Use layout size, not transformed size (so scaling won't break centering)
    const width = this._root.offsetWidth || 260;
    const height = this._root.offsetHeight || 180;

    const contentWidth = totalCols * CELL;
    const contentHeight = rows * CELL;

    const offsetXpx = (width - contentWidth) / 2;
    const offsetYpx = (height - contentHeight) / 2;

    const DOT = 6; // must match CSS width/height


    glyphs.forEach(({ glyph, offset }) => {
      glyph.points.forEach(({ x, y }) => {
        const px = document.createElement("div");
        px.className = "style-no7-pixel-on";
        px.style.left =
          `${offsetXpx + (offset + x) * CELL + (CELL - DOT) / 2}px`;
        px.style.top =
          `${offsetYpx + y * CELL + (CELL - DOT) / 2 - CELL / 2}px`;

        this._pixels.appendChild(px);
      });
    });
  },
};
