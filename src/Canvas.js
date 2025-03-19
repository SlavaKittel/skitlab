import * as THREE from "three";
import { getLights, updateLights } from "./components/Lights";
import { getImages, updateImages } from "./components/Images";
import { updateSpringyLine } from "./utils/springy-line";
import { getBackground, updateBackground } from "./components/Background";
import { easeOutCirc } from "./utils/helped";
import { state } from "./store/store";
// TODO for test
// import Stats from "stats.js";

// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Stats panel
// TODO delete Stats panel
// const stats = new Stats();
// stats.showPanel(0);
// document.body.appendChild(stats.dom);

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

const pointerCoords = new THREE.Vector2();
const pointerSmoothCoords = new THREE.Vector2();
const mouseBall = document.querySelector(".mouse-ball");
let mouseX = 0;
let mouseY = 0;
let ballX = 0;
let ballY = 0;
let ballSmoothX = 0;
let ballSmoothY = 0;
let speedMouse = 0.3;
let speedSmoothMouse = 0.04;
const easeCoeff = 0.001;

const aspectRatioMobileCoef = 0.66;
const cameraDistanceFactor = 4;
const startPositionZ = 2;

// Pointermove listener
window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Scroll Y wheel and touch
let scroll = 0.63;
let currentScroll = 0;
window.addEventListener("wheel", (event) => {
  if (state.isOpenMenu) return;
  const deltaY =
    Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 1000);
  const deltaX =
    Math.sign(event.deltaX) * Math.min(Math.abs(event.deltaX), 1000);
  scroll += deltaY * 0.001;
  scroll += deltaX * 0.001;
});

let toushScrollY = 0;
let toushScrollX = 0;
let touchDeltaY = 0;
let touchDeltaX = 0;
let isTouching = false;
let inertiaTimer;

function getApplyInertia() {
  if (isTouching) return;
  if (Math.abs(touchDeltaY) >= 0.1) {
    scroll -= touchDeltaY * 0.005;
    touchDeltaY *= 0.95;
  }
  if (Math.abs(touchDeltaX) >= 0.1) {
    scroll -= touchDeltaX * 0.005;
    touchDeltaX *= 0.95;
  }
  inertiaTimer = requestAnimationFrame(getApplyInertia);
}
window.addEventListener("touchstart", (event) => {
  if (state.isOpenMenu) return;
  isTouching = true;
  toushScrollX = event.touches[0].clientX;
  toushScrollY = event.touches[0].clientY;
  cancelAnimationFrame(inertiaTimer);
});
window.addEventListener("touchmove", (event) => {
  if (state.isOpenMenu) return;
  const touchCurrentY = event.touches[0].clientY;
  const touchCurrentX = event.touches[0].clientX;
  touchDeltaX = touchCurrentX - toushScrollX;
  touchDeltaY = touchCurrentY - toushScrollY;
  scroll -= touchDeltaY * 0.003;
  scroll -= touchDeltaX * 0.003;
  toushScrollX = touchCurrentX;
  toushScrollY = touchCurrentY;
});
window.addEventListener("touchend", () => {
  isTouching = false;
  getApplyInertia();
});

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = startPositionZ;
if (window.innerWidth / window.innerHeight < aspectRatioMobileCoef) {
  camera.position.z =
    startPositionZ -
    (window.innerWidth / window.innerHeight) * cameraDistanceFactor +
    aspectRatioMobileCoef * cameraDistanceFactor;
}
scene.background = new THREE.Color(0x87ceeb);

// Resize
window.addEventListener("resize", () => {
  if (window.innerWidth / window.innerHeight < aspectRatioMobileCoef) {
    camera.position.z =
      startPositionZ -
      (window.innerWidth / window.innerHeight) * cameraDistanceFactor +
      aspectRatioMobileCoef * cameraDistanceFactor;
  }
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Renderer in the DOM
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(width, height);
window.onload = () => {
  document.getElementById("app")?.appendChild(renderer.domElement);
};

// Lights
getLights(scene);

// Images
getImages(scene, camera, renderer, mouseBall);

// Background
getBackground(scene);

// TODO FOR TEST Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);

// Clock
const clock = new THREE.Clock();

function update() {
  // Stats
  // TODO delete Stats panel
  // stats.begin();
  // stats.end();

  // TODO why only on S logo?
  const deltaTime = clock.getDelta();

  // Update Burger Menu Springy Line
  updateSpringyLine();

  // Update Scroll
  currentScroll += (scroll - currentScroll) * easeOutCirc(easeCoeff);

  // Update Pointer and MouseBall
  let distX = mouseX - ballX;
  let distY = mouseY - ballY;
  let distSmoothX = mouseX - ballSmoothX;
  let distSmoothY = mouseY - ballSmoothY;
  ballX += distX * speedMouse;
  ballY += distY * speedMouse;
  ballSmoothX += distSmoothX * speedSmoothMouse;
  ballSmoothY += distSmoothY * speedSmoothMouse;
  pointerCoords.x = (ballX / window.innerWidth) * 2 - 1;
  pointerCoords.y = -(ballY / window.innerHeight) * 2 + 1;
  pointerSmoothCoords.x = (ballSmoothX / window.innerWidth) * 2 - 1;
  pointerSmoothCoords.y = -(ballSmoothY / window.innerHeight) * 2 + 1;
  mouseBall.style.left = ballX + "px";
  mouseBall.style.top = ballY + "px";

  // Update Lights
  updateLights(currentScroll);

  // Update Images
  updateImages(currentScroll, pointerCoords);

  // Update Background
  updateBackground(currentScroll, pointerSmoothCoords, deltaTime);

  // Update Canvas
  requestAnimationFrame(update);
  // Render
  renderer.render(scene, camera);
}
update();
