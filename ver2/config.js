// config.js
import { styleDefinition as style1 } from "./styles/no1/style1.js";
import { styleDefinition as style2 } from "./styles/no2/style2.js";
import { styleDefinition as style3 } from "./styles/no3/style3.js";

export const CONFIG = {
  // how often the clock updates (ms)
  updateIntervalMs: 1000,

  // base Pomodoro length (seconds)
  pomodoroDurationSec: 25 * 60,

  // supported functions
  functions: ["pomodoro", "timer", "clock"],

  // list of styles to include
  styles: [style1, style2, style3],
};
