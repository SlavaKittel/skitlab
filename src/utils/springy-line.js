import { gsap } from "gsap";
import { state } from "../store/store";

// Constants & Initial States
const heightContent = 300;
let connectedMouse = false;
let connectedTop = false;
let connectedBottom = false;
let snapDist = 140;
let startY = 250;
let burgerMenuContentWidth = window.innerWidth + 4;
let offsetX = burgerMenuContentWidth / 2;
let calcPathPositionBottom;
let calcPathPositionTop;
let isTouchEnd = false;

let p0 = { x: 0, y: startY };
let p1 = { x: offsetX, y: startY };
let p2 = { x: burgerMenuContentWidth, y: startY };

// Cached Elements
const svg = document.getElementById("svg-box-springy");
const displayedLinePath = document.getElementById("displayed-path");
const pathTrigger = document.getElementById("path-trigger");

// Window Resize Event
window.addEventListener("resize", () => {
  burgerMenuContentWidth = window.innerWidth + 4;
  p1.x = burgerMenuContentWidth / 2;
  p2.x = burgerMenuContentWidth;
});

// Mouse Move Event
svg.addEventListener("mousemove", onMove);
svg.addEventListener(
  "touchmove",
  (event) => {
    onMove(event.touches[0]);
  },
  { passive: false }
);
svg.addEventListener("touchend", () => {
  isTouchEnd = true;
  setTimeout(() => {
    isTouchEnd = false;
  }, 50);
});

function onMove(event) {
  offsetX = event.pageX;
  const targetElement = document.elementFromPoint(event.clientX, event.clientY);
  if (!connectedMouse && targetElement === pathTrigger) {
    connectedMouse = true;
    gsap.killTweensOf(p1);
  }
  if (connectedMouse) {
    p1.y = event.pageY * 2 - (p0.y + p2.y) / 2;
  }
}

export function updateSpringyLine() {
  // Update Springy Line
  displayedLinePath.setAttribute(
    "d",
    `M${p0.x} ${p0.y} Q ${offsetX} ${p1.y} ${p2.x} ${p2.y} v-300h-${burgerMenuContentWidth}z`
  );
  if (Math.abs(p1.y - startY) > snapDist || isTouchEnd) {
    connectedMouse = false;
    connectedTop = false;
    connectedBottom = false;
    gsap.to(p1, {
      duration: 2,
      y: startY,
      ease: "elastic(1, 0.2)",
    });
  }

  // Collision Detection
  const pathReactPosition = displayedLinePath.getBoundingClientRect();
  calcPathPositionBottom = 500 - (pathReactPosition.y + heightContent);
  calcPathPositionTop = -(pathReactPosition.y + heightContent + 1);

  // Top Collision Detection
  if (
    !connectedTop &&
    pathReactPosition.y < -55 &&
    pathReactPosition.y > -70 &&
    !state.isOpenMenu
  ) {
    connectedTop = true;
    gsap.killTweensOf(p1);
    offsetX = burgerMenuContentWidth / 2;
  }
  if (connectedTop) {
    p1.y = calcPathPositionBottom * 2 - (p0.y + p2.y) / 2;
  }

  // Bottom Collision Detection
  if (
    !connectedBottom &&
    pathReactPosition.y < -heightContent &&
    state.isOpenMenu
  ) {
    connectedBottom = true;
    gsap.killTweensOf(p1);
    offsetX = burgerMenuContentWidth / 2;
  }
  if (connectedBottom) {
    p1.y = calcPathPositionTop * 2 - (p0.y + p2.y) / 2;
  }
}
