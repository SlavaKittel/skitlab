import * as THREE from "three";
import { createImageComponent, updateImageUniforms } from "./Images"; 

// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import VirtualScroll from "virtual-scroll";

// Virtual Scroll
let yScrollPosition = 0;
const scroller = new VirtualScroll();
scroller.on((e) => {
  yScrollPosition = e.y / 1000;
});

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

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

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const images = [
  "/img/test1.jpg",
  "/img/test1.jpg",
  "/img/test1.jpg",
  "/img/test1.jpg",
  "/img/test1.jpg",
  "/img/test1.jpg",
];
const textureImages = images.map((src) => textureLoader.load(src));


// Mesh Image Geometry
const imageMeshes = textureImages.map((texture) => {
  const imageMesh = createImageComponent(texture);
  scene.add(imageMesh);
  return imageMesh;
});

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
  // Update uniforms and apply transformations for each image in one loop
  imageMeshes.forEach((imageMesh, index) => {
    const yScrollForEach = yScrollPosition - index * 1.3;
    // Update the shader uniforms
    updateImageUniforms(imageMesh, yScrollForEach);

    // Update rotation and position based on scroll
    imageMesh.position.z =
      -(
        Math.PI - Math.sqrt(Math.pow(yScrollForEach, 2) + Math.pow(Math.PI, 2))
      ) * 2;
    imageMesh.rotation.z = Math.PI / 2;
    imageMesh.rotation.y = -yScrollForEach / 1.9;
  });

  // Update
  requestAnimationFrame(update);
  // Render
  renderer.render(scene, camera);
}
update();
