import * as THREE from "three";
import { getLights, updateLights } from "./components/Lights";
import { getImages, updateImages } from "./components/Images";
import { getBackground, updateBackground } from "./components/Background";
import { easeOutCirc } from "./utils/helped";
// TODO for test
import Stats from "stats.js";

// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Stats panel
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

const pointerCoords = new THREE.Vector2();
const mouseBall = document.querySelector(".mouse-ball");
let mouseX = 0;
let mouseY = 0;
let ballX = 0;
let ballY = 0;
let speed = 0.09;
const easeCoeff = 0.001;

// Pointermove listener
window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// Scroll Y wheel and touch
let wheelScrollY = 0.708;
let currentScrollY = 0;
let lastTime = 0;
window.addEventListener("wheel", (event) => {
  const currentTime = performance.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;
  const timeFactor = deltaTime * 60;

  const delta =
    Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 1000);
  wheelScrollY += delta * 0.001 * timeFactor;
});

let toushScrollY = 0;
// TODO need to add performance.now() for all listeners;
window.addEventListener("touchstart", (event) => {
  toushScrollY = event.touches[0].clientY;
});
window.addEventListener("touchmove", (event) => {
  const touchCurrentY = event.touches[0].clientY;
  const touchDelta = touchCurrentY - toushScrollY;
  wheelScrollY -= touchDelta * 0.005;
  toushScrollY = touchCurrentY;
});

// Clock
const clock = new THREE.Clock();

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;
scene.background = new THREE.Color(0x87ceeb);

// Resize
window.addEventListener("resize", () => {
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

function update() {
  const deltaTime = clock.getDelta();

  // Stats
  stats.begin();
  stats.end();

  // Update Scroll
  currentScrollY += (wheelScrollY - currentScrollY) * easeOutCirc(easeCoeff);
  // TODO for test;
  console.log(wheelScrollY.toFixed(2));

  // Update Pointer and MouseBall
  let distX = mouseX - ballX;
  let distY = mouseY - ballY;
  ballX = ballX + distX * speed;
  ballY = ballY + distY * speed;
  pointerCoords.x = (ballX / window.innerWidth) * 2 - 1;
  pointerCoords.y = -(ballY / window.innerHeight) * 2 + 1;
  mouseBall.style.left = ballX + "px";
  mouseBall.style.top = ballY + "px";

  // Update Lights
  updateLights(currentScrollY);

  // Update Images
  updateImages(currentScrollY, pointerCoords);

  // Update Background
  updateBackground(currentScrollY, pointerCoords, deltaTime);

  // Update Canvas
  requestAnimationFrame(update);
  // Render
  renderer.render(scene, camera);
}
update();
