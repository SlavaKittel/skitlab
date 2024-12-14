import * as THREE from "three";
// TODO delete OrbitControls
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

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
const plateImageTexture = textureLoader.load("/img/test.jpg");
plateImageTexture.encoding = THREE.sRGBEncoding;

// Mesh Image Geometry
const planeGeometry = new THREE.PlaneGeometry(1, 1, 80, 80);
const planeMaterial = new THREE.ShaderMaterial({
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable",
  },
  uniforms: {
    uTexture: { value: plateImageTexture },
    uYScrollPosition: { value: 0 },
    uAngle: { value: 0 },
    uProgress: { value: 0 },
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
});
const imagePlane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(imagePlane);

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
function animate() {
  // Update uniforms
  planeMaterial.uniforms.uYScrollPosition.value = yScrollPosition;
  if (yScrollPosition >= 0) {
    planeMaterial.uniforms.uProgress.value = -yScrollPosition + 1.2;
    planeMaterial.uniforms.uAngle.value = 0;
  }
  if (yScrollPosition < 0) {
    planeMaterial.uniforms.uProgress.value = yScrollPosition + 1.2;
    planeMaterial.uniforms.uAngle.value = Math.PI / 2;
  }
  imagePlane.position.z =
  -(
    Math.PI - Math.sqrt(Math.pow(yScrollPosition, 2) + Math.pow(Math.PI, 2))
  ) * 2;

  imagePlane.rotation.z = Math.PI / 2;
  imagePlane.rotation.y = -yScrollPosition / 1.9;

  // Update
  requestAnimationFrame(animate);
  // Render
  renderer.render(scene, camera);
}
animate();
