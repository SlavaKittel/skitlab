import * as THREE from "three";
import { getImages, updateImages } from "./components/Images";
import { getBackground, updateBackground } from "./components/Background";

// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import VirtualScroll from "virtual-scroll";

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

// Pointer
const pointerCoords = new THREE.Vector2();
function onPointerMove(event) {
  pointerCoords.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointerCoords.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("pointermove", (event) => {
  onPointerMove(event);
});

// Virtual Scroll
let yStartPosition = 0.563;
let yScrollPosition = yStartPosition;
const scroller = new VirtualScroll();
scroller.on((e) => {
  yScrollPosition = e.y / 1000 + yStartPosition;
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

// Lights
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);
const directLight = new THREE.DirectionalLight(0xffffff, 4);
directLight.position.set(0, -5, 5);
scene.add(directLight);
const directLight2 = new THREE.DirectionalLight(0xffffff, 1);
directLight2.position.set(0, 5, 0);
scene.add(directLight2);
const lightHelper = new THREE.PointLightHelper(directLight2, 0.5);
scene.add(lightHelper);

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

// Images 
getImages(scene, camera, renderer);

// Background
getBackground(scene);

// TODO FOR TEST Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);

function update() {
  const deltaTime = clock.getDelta();

  // Update Images
  updateImages(yScrollPosition, pointerCoords);

  // Update Background
  updateBackground(yScrollPosition, pointerCoords, deltaTime);

  // Update Canvas
  requestAnimationFrame(update);
  // Render
  renderer.render(scene, camera);
}
update();
