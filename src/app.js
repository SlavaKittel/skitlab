import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/vertex.glsl?raw";
import fragmentShader from "./shaders/fragment.glsl?raw";

// Variables
const width = window.innerWidth;
const height = window.innerHeight;

// Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
scene.background = new THREE.Color(0x87ceeb);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const plateTexture = textureLoader.load("/img/test.jpg");
// plateTexture.encoding = THREE.sRGBEncoding;
plateTexture.colorSpace = THREE.SRGBColorSpace;

// Plane Geometry
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({ map: plateTexture });

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Shaders
const uniforms = {
  uMouseTransition: { value: 0 },
  // TODO create delta on Time
  uTime: { type: "f", value: 0 },
  uLightDirection: { value: new THREE.Vector3(0.1, 0.0, 0.0).normalize() },
  uMetalness: { value: 0.5 },
};
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
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

// Post Processing Image 
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;

// Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  // Update
  requestAnimationFrame(animate);
  // Render
  renderer.render(scene, camera);
}
animate();
