import * as THREE from "three";
import { isMobile } from "./../utils/helped";

export default function renderSLogoCanvas(glb) {
  // Variables
  const startPositionZ = 2;
  const width = window.innerWidth;
  const height = window.innerHeight;
  let waveAngle = 0;
  const waveSpeed = 0.01;
  const waveAmplitudeX = 0.03;
  const waveAmplitudeY = 0.02;
  const tiltAmplitudeX = 0.02;
  const tiltAmplitudeY = 0.01;
  let mouseX = 0;
  let mouseY = 0;
  let ballX = 0;
  let ballY = 0;
  let speedMouse = 0.03;
  const pointerCoords = new THREE.Vector2();

  // Pointermove listener
  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // Scene and Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = startPositionZ;

  // Lights
  const pointLight = new THREE.PointLight(0xffffff, 4, 400);
  pointLight.position.set(2.9, 1.7, 0);
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Renderer in the DOM
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  const container = document.getElementById("slogoCanvas");
  container.appendChild(renderer.domElement);

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // GLB Model
  const logoModel = glb.scene;
  logoModel.traverse((child) => {
    if (child.isMesh) {
      child.material.metalness = 0.3;
      child.material.roughness = 0.5;
      child.material.needsUpdate = true;
    }
  });
  scene.add(logoModel);

  // Gyro rotation
  let rollValue = 0;
  let pitchValue = 0;
  let targetRoll = 0;
  let targetPitch = 0;
  const smoothFactor = 0.06;
  function handleOrientation(event) {
    const roll = event.gamma;
    const pitch = event.beta;

    if (logoModel) {
      targetRoll = roll * 0.01;
      targetPitch = pitch * 0.01 + 50;
    }
  }
  if (window.DeviceOrientationEvent && window.DeviceMotionEvent) {
    window.addEventListener("deviceorientation", handleOrientation);
  }

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
      rollValue += (targetRoll - rollValue) * smoothFactor;
      pitchValue += (targetPitch - pitchValue) * smoothFactor;
      logoModel.rotation.y = rollValue;
      logoModel.rotation.x = pitchValue;

      // Mouse movement
      if (!isMobile()) {
        // Update Pointer Coords
        let distX = mouseX - ballX;
        let distY = mouseY - ballY;
        ballX += distX * speedMouse;
        ballY += distY * speedMouse;
        pointerCoords.x = (ballX / window.innerWidth) * 2 - 1;
        pointerCoords.y = -(ballY / window.innerHeight) * 2 + 1;
        logoModel.rotation.x = -pointerCoords.y * 0.3;
        logoModel.rotation.y = pointerCoords.x * 0.3;
      }
    }

    // Update Canvas
    requestAnimationFrame(update);
    // Render
    renderer.render(scene, camera);
  }
  update();
}
