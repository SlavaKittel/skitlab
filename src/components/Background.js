import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import vertexShader from "./../shaders/vertexSLogo.glsl?raw";
import fragmentShader from "./../shaders/fragmentSLogo.glsl?raw";

// <<<< S-3D LOGO >>>>
const loader = new GLTFLoader();
let logoModelArray = [];
let rotationSpeeds = [];
const logoModelGroup = new THREE.Group();

const customMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    lightDirection1: { value: new THREE.Vector3(0, 0, 1).normalize() },
    lightIntensity1: { value: 8.0 },
    lightColor1: { value: new THREE.Color(0x797979) },
    lightDirection2: { value: new THREE.Vector3(0, 1, 0).normalize() },
    lightIntensity2: { value: 5.0 },
    lightColor2: { value: new THREE.Color(0x797979) },
    ambientColor: { value: new THREE.Color(0x797979) },
    ambientIntensity: { value: 0.2 },
    metalness: { value: 1.0 },
    roughness: { value: 0.4 },
  },
});

loader.load("/glb-models/main-logo3.glb", ({ scene: model }) => {
  const logoModel = model;
  // TODO delete scale
  // logoModel.scale.set(1, 1, 1);

  logoModel.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        child.material = customMaterial;
      }
    }
  });

  let count = 5;
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 8;

    const logoModelClone = logoModel.clone();
    logoModelClone.position.set(
      (0.5 - Math.random()) * 1,
      0.5 - Math.random() * 3 + 1,
      (0.5 - Math.random()) * 1
    );
    logoModelClone.position.x = radius * Math.cos(angle);
    logoModelClone.position.z = radius * Math.sin(angle);

    // Add random rotation speed
    const randomSpeed = Math.random() * 0.01 + 0.01;
    const direction = Math.random() > 0.5 ? 1 : -1;
    rotationSpeeds.push(randomSpeed * direction);

    logoModelArray.push(logoModelClone);
    logoModelGroup.add(logoModelClone);
  }
  logoModelGroup.position.z = 6;
});

// <<<< CYLINDER BACKGROUND >>>>
// Texture Cylinbder Loader
function nameBoundaryTexture(name) {
  const loader = new THREE.TextureLoader();
  return loader.load(`./texture/TilesMosaicPennyround001/${name}.png`);
}
const colorTexture = nameBoundaryTexture("TilesMosaicPennyround001_BUMP_1K");
colorTexture.encoding = THREE.LinearEncoding;
colorTexture.needsUpdate = true;
colorTexture.colorSpace = THREE.SRGBColorSpace;
const displacementTexture = nameBoundaryTexture(
  "TilesMosaicPennyround001_DISP_1K"
);
const bumpTexture = nameBoundaryTexture("TilesMosaicPennyround001_BUMP_1K");
const normalTexture = nameBoundaryTexture("TilesMosaicPennyround001_NRM_1K");
const roughnessTexture = nameBoundaryTexture(
  "TilesMosaicPennyround001_GLOSS_1K"
);
const aoTexture = nameBoundaryTexture("TilesMosaicPennyround001_AO_1K");

const repeatGorundTextures = (texture) => {
  const repeat = 1.5;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = repeat * 37;
  texture.repeat.y = repeat;
};
repeatGorundTextures(colorTexture);
repeatGorundTextures(displacementTexture);
repeatGorundTextures(normalTexture);
repeatGorundTextures(roughnessTexture);
repeatGorundTextures(aoTexture);
repeatGorundTextures(bumpTexture);

// Mesh Cylinder Geometry
const geometry = new THREE.CylinderGeometry(30, 30, 5, 100, 100);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.5,
  roughness: 0.5,
  map: colorTexture,
  displacementMap: displacementTexture,
  normalMap: normalTexture,
  roughnessMap: roughnessTexture,
  aoMap: aoTexture,
  bumpMap: bumpTexture,
  displacementScale: 0.1,
  side: THREE.DoubleSide,
});
const meshCylinder = new THREE.Mesh(geometry, material);
meshCylinder.rotation.order = "XZY";
meshCylinder.position.z = 27;

export function getBackground(scene) {
  // Cylinder background
  scene.add(meshCylinder);
  // S-3D Logo
  scene.add(logoModelGroup);
}

export function updateBackground(yScrollPosition, pointerCoords, deltaTime) {
  // Update Cylinder Bakcground
  const factorRotation = 0.01;
  meshCylinder.rotation.y = yScrollPosition * factorRotation;
  meshCylinder.position.x = -pointerCoords.x * 0.07;
  meshCylinder.position.y = -pointerCoords.y * 0.07;

  // Update S-3D Logo
  logoModelGroup.rotation.y = yScrollPosition * 0.5;
  logoModelGroup.position.x = -pointerCoords.x * 0.2;
  logoModelGroup.position.y = -pointerCoords.y * 0.2;

  logoModelArray.forEach((logoModel, index) => {
    logoModel.rotation.y += rotationSpeeds[index] * deltaTime * 10;
    logoModel.rotation.z += rotationSpeeds[index] * deltaTime * 10;
    logoModel.rotation.x += rotationSpeeds[index] * deltaTime * 10;
  });
}
