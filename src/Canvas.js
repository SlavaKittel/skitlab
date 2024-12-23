import * as THREE from "three";
import { getImages, updateImages } from "./Images";
import { getBackground, updateBackground } from "./Background";

// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import VirtualScroll from "virtual-scroll";

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

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

// Images 
getImages(scene);

// Background
getBackground(scene);

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

// TODO FOR TEST Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);

function update() {
  const deltaTime = clock.getDelta();

  // Update Images
  updateImages(yScrollPosition);

  // Update Background
  updateBackground(yScrollPosition, deltaTime);

  // Update Canvas
  requestAnimationFrame(update);
  // Render
  renderer.render(scene, camera);
}
update();
