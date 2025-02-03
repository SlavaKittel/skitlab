import {
  bright,
  grayBright,
  gray,
  red,
  redHover,
  redPressed,
  dark,
  background,
} from "./mixin.js";

const themeColors = {
  bright,
  grayBright,
  gray,
  red,
  redHover,
  redPressed,
  dark,
  background,
};
Object.entries(themeColors).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--${key}`, value);
});