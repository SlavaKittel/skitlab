import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { easeOutCirc } from "./../utils/helped";

// Canvas
const container = document.getElementById("slogoCanvas");
if (!container) {
  console.error("Canvas container not found!");
} else {
  renderSLogoCanvas(container);
}

function renderSLogoCanvas(container) {
  // Variables
  const startPositionZ = 2;
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = startPositionZ;

  // Lights
  const directionalLight = new THREE.PointLight(0xffffff, 15);
  directionalLight.position.set(2.0, 0.9, 2);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Renderer in the DOM
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // GLTF Model Loader
  let logoModel;
  const loader = new GLTFLoader();
  loader.load(
    "/glb-models/main-logo8.glb",
    (gltf) => {
      logoModel = gltf.scene;

      logoModel.traverse((child) => {
        if (child.isMesh) {
          child.material.metalness = 0.6;
          child.material.roughness = 0.2;
          child.material.needsUpdate = true;
        }
      });

      scene.add(logoModel);
    },
    undefined,
    (error) => {
      console.error("Error loading GLB model:", error);
    }
  );

  // Gyro rotation
  // TODO check
  let rollValue = 0;
  let pitchValue = 0;
  const easeCoeff = 0.001;
  function handleOrientation(event) {
    const roll = event.gamma;
    const pitch = event.beta;
    console.log(event);
    console.log(roll);
    console.log(pitch);

    if (logoModel) {
      console.log("logoModel", logoModel);
      rollValue = roll * 0.01;
      pitchValue = pitch * 0.01;
      // rollValue = roll * 0.01 * easeOutCirc(easeCoeff);
      // pitchValue = pitch * 0.01 * easeOutCirc(easeCoeff);
    }
  }
  if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener("deviceorientation", handleOrientation);
  }

  // Animation
  let waveAngle = 0;
  const waveSpeed = 0.01;
  const waveAmplitudeX = 0.03;
  const waveAmplitudeY = 0.02;
  const tiltAmplitudeX = 0.02;
  const tiltAmplitudeY = 0.01;

  function update() {
    if (logoModel) {
      const offsetY = Math.sin(waveAngle) * waveAmplitudeY;
      const offsetX = Math.sin(waveAngle * 0.5) * waveAmplitudeX;
      const tiltAngleX = Math.sin(waveAngle * 0.7) * tiltAmplitudeX;
      const tiltAngleY = Math.sin(waveAngle * 0.7) * tiltAmplitudeY;
      logoModel.position.y = -0.35 + offsetY;
      logoModel.position.x = offsetX;
      logoModel.rotation.y = -0.2 + tiltAngleX;
      logoModel.rotation.x = tiltAngleY;
      waveAngle += waveSpeed;

      //Gyro rotation
      logoModel.rotation.y = rollValue;
      logoModel.rotation.x = pitchValue;
    }

    // Update Canvas
    requestAnimationFrame(update);
    // Render
    renderer.render(scene, camera);
  }
  update();
}
