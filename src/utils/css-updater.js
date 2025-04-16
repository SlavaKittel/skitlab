import {
  primaryGradient,
  primaryHover,
  primaryPressed,
  bright,
  brightOpacity30,
  grayBright,
  gray,
  dark,
  darkOpacity30,
  background,
  breakpoints,
} from "./mixin.js";

import { calculateAndSetAngle } from "./helped.js";

const themeColors = {
  primaryGradient,
  primaryHover,
  primaryPressed,
  bright,
  brightOpacity30,
  grayBright,
  gray,
  dark,
  darkOpacity30,
  background,
};
Object.entries(themeColors).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--${key}`, value);
});

const welcomeBlock = document.getElementById("welcomeBlock");
const descriptionBlock = document.getElementById("descriptionBlock");
const aboutUsBtns = document.querySelectorAll(".about-us-btn");

if (welcomeBlock) calculateAndSetAngle(welcomeBlock, "--welcomeAngle");
if (descriptionBlock)
  calculateAndSetAngle(descriptionBlock, "--descriptionAngle");
aboutUsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calculateAndSetAngle(welcomeBlock, "--welcomeAngle");
    calculateAndSetAngle(descriptionBlock, "--descriptionAngle");
  });
});
window.addEventListener("resize", () => {
  if (welcomeBlock) calculateAndSetAngle(welcomeBlock, "--welcomeAngle");
  if (descriptionBlock)
    calculateAndSetAngle(descriptionBlock, "--descriptionAngle");
});

const applyResponsiveClasses = () => {
  const width = window.innerWidth;
  const body = document.body;

  // Remove all previous breakpoint classes
  body.classList.remove(
    "breakpoint-mobileSmall",
    "breakpoint-mobile",
    "breakpoint-tablet",
    "breakpoint-desktop",
    "breakpoint-desktopLarge"
  );

  // Add new class based on current viewport width
  if (width >= breakpoints.desktopLarge) {
    body.classList.add("breakpoint-desktopLarge");
  } else if (width >= breakpoints.desktop) {
    body.classList.add("breakpoint-desktop");
  } else if (width >= breakpoints.tablet) {
    body.classList.add("breakpoint-tablet");
  } else if (width >= breakpoints.mobile) {
    body.classList.add("breakpoint-mobile");
  } else {
    body.classList.add("breakpoint-mobileSmall");
  }
};

applyResponsiveClasses();
window.addEventListener("resize", applyResponsiveClasses);
